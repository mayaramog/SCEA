import { useState } from 'react';
import { Protocolo } from '../App';
import { FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PresidenteDashboardProps {
  protocolos: Protocolo[];
  onDeliberar: (protocoloId: string, justificativa: string, decisao: 'uso_aprovado' | 'uso_reprovado') => void;
}

export function PresidenteDashboard({ protocolos, onDeliberar }: PresidenteDashboardProps) {
  const [selectedProtocolo, setSelectedProtocolo] = useState<Protocolo | null>(null);
  const [justificativa, setJustificativa] = useState('');
  const [decisao, setDecisao] = useState<'uso_aprovado' | 'uso_reprovado' | ''>('');

  const protocolosParaDeliberar = protocolos.filter(p => p.estado === 'aguardando_deliberacao');
  const protocolosAprovados = protocolos.filter(p => p.estado === 'uso_aprovado');
  const protocolosReprovados = protocolos.filter(p => p.estado === 'uso_reprovado');

  const handleSubmit = () => {
    if (!selectedProtocolo || !justificativa.trim() || !decisao) return;

    onDeliberar(selectedProtocolo.id, justificativa, decisao);
    setSelectedProtocolo(null);
    setJustificativa('');
    setDecisao('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard do Presidente CAUAE</h2>
        <p className="text-slate-600 mt-1">Deliberação final de protocolos</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{protocolos.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-orange-200 bg-orange-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-orange-800">Aguardando</span>
            <AlertCircle className="w-5 h-5 text-orange-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-orange-900">{protocolosParaDeliberar.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Aprovados</span>
            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-green-900">{protocolosAprovados.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800">Reprovados</span>
            <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-red-900">{protocolosReprovados.length}</p>
        </div>
      </div>

      {/* Protocolos para Deliberar */}
      <section aria-labelledby="deliberar-heading">
        <h3 id="deliberar-heading" className="text-lg font-bold text-slate-900 mb-4">
          Protocolos Aguardando Deliberação
        </h3>

        {protocolosParaDeliberar.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-600">Nenhum protocolo aguardando deliberação</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Pesquisador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Parecerista
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Parecer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protocolosParaDeliberar.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{protocolo.id}</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.docenteNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.pareceristaNome}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            protocolo.decisaoParecer === 'uso_recomendado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {protocolo.decisaoParecer === 'uso_recomendado'
                            ? 'Uso Recomendado'
                            : 'Uso Não Recomendado'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedProtocolo(protocolo)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                        >
                          Deliberar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Histórico de Deliberações */}
      <section aria-labelledby="historico-heading">
        <h3 id="historico-heading" className="text-lg font-bold text-slate-900 mb-4">
          Histórico de Deliberações
        </h3>

        {protocolosAprovados.length === 0 && protocolosReprovados.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600">Nenhuma deliberação registrada</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Pesquisador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Decisão
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[...protocolosAprovados, ...protocolosReprovados].map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{protocolo.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.docenteNome}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            protocolo.estado === 'uso_aprovado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {protocolo.estado === 'uso_aprovado' ? (
                            <>
                              <CheckCircle className="w-3 h-3" aria-hidden="true" />
                              Uso Aprovado
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" aria-hidden="true" />
                              Uso Reprovado
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Modal de Deliberação */}
      {selectedProtocolo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
          role="dialog"
          aria-labelledby="deliberacao-modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
            <h3 id="deliberacao-modal-title" className="text-xl font-bold text-slate-900 mb-6">
              Deliberação Final - {selectedProtocolo.id}
            </h3>

            {/* Informações do Protocolo */}
            <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-slate-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Pesquisador</p>
                <p className="text-slate-900">{selectedProtocolo.docenteNome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Parecerista</p>
                <p className="text-slate-900">{selectedProtocolo.pareceristaNome}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-1">Justificativa</p>
                <p className="text-slate-700 text-sm">{selectedProtocolo.justificativa}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-2">Parecer Técnico</p>
                <div className="bg-white p-4 rounded border border-slate-200">
                  <div className="mb-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        selectedProtocolo.decisaoParecer === 'uso_recomendado'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedProtocolo.decisaoParecer === 'uso_recomendado'
                        ? 'Uso Recomendado'
                        : 'Uso Não Recomendado'}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm">{selectedProtocolo.textoParecer}</p>
                </div>
              </div>
            </div>

            {/* Formulário de Deliberação */}
            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="justificativa-deliberacao" className="block text-sm font-medium text-slate-700 mb-2">
                  Justificativa da Deliberação <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="justificativa-deliberacao"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Descreva a justificativa colegiada da deliberação..."
                  required
                />
              </div>

              <div>
                <p className="block text-sm font-medium text-slate-700 mb-3">
                  Decisão Final <span className="text-red-500">*</span>
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setDecisao('uso_aprovado')}
                    className={`flex-1 px-6 py-4 rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      decisao === 'uso_aprovado'
                        ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-green-400'
                    }`}
                    aria-pressed={decisao === 'uso_aprovado'}
                  >
                    <CheckCircle className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                    Uso Aprovado
                  </button>
                  <button
                    type="button"
                    onClick={() => setDecisao('uso_reprovado')}
                    className={`flex-1 px-6 py-4 rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      decisao === 'uso_reprovado'
                        ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-600'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-red-400'
                    }`}
                    aria-pressed={decisao === 'uso_reprovado'}
                  >
                    <XCircle className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                    Uso Reprovado
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setSelectedProtocolo(null);
                  setJustificativa('');
                  setDecisao('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={!justificativa.trim() || !decisao}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar Deliberação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
