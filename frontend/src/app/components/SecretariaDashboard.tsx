import { useState } from 'react';
import { Protocolo } from '../App';
import { UserPlus, FileText, Clock, CheckCircle } from 'lucide-react';

interface SecretariaDashboardProps {
  protocolos: Protocolo[];
  onDesignarParecerista: (protocoloId: string, pareceristaId: string, pareceristaNome: string) => void;
}

// Docentes disponíveis para parecer (simulados)
const DOCENTES_DISPONIVEIS = [
  { id: '1001', nome: 'Dr. João Silva', titulacao: 'Doutor' },
  { id: '1002', nome: 'Profa. Maria Santos', titulacao: 'Titular' },
  { id: '3001', nome: 'Prof. Carlos Oliveira', titulacao: 'Livre-Docente' },
  { id: '1003', nome: 'Dr. Pedro Almeida', titulacao: 'Doutor' },
  { id: '1004', nome: 'Profa. Ana Rodrigues', titulacao: 'Assistente' },
];

export function SecretariaDashboard({ protocolos, onDesignarParecerista }: SecretariaDashboardProps) {
  const [selectedProtocolo, setSelectedProtocolo] = useState<string | null>(null);
  const [selectedParecerista, setSelectedParecerista] = useState('');

  const protocolosPendentes = protocolos.filter(p => p.estado === 'aguardando_envio_parecer');
  const protocolosAguardandoParecer = protocolos.filter(p => p.estado === 'aguardando_parecer');
  const protocolosFinalizados = protocolos.filter(p => ['uso_aprovado', 'uso_reprovado'].includes(p.estado));

  const handleDesignar = () => {
    if (!selectedProtocolo || !selectedParecerista) return;

    const parecerista = DOCENTES_DISPONIVEIS.find(d => d.id === selectedParecerista);
    if (parecerista) {
      onDesignarParecerista(selectedProtocolo, parecerista.id, parecerista.nome);
      setSelectedProtocolo(null);
      setSelectedParecerista('');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard da Secretária CAUAE</h2>
        <p className="text-slate-600 mt-1">Gestão de protocolos e designação de pareceristas</p>
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

        <div className="bg-white rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-800">Pendentes</span>
            <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-yellow-900">{protocolosPendentes.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Em Parecer</span>
            <UserPlus className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{protocolosAguardandoParecer.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Finalizados</span>
            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-green-900">{protocolosFinalizados.length}</p>
        </div>
      </div>

      {/* Protocolos Pendentes de Designação */}
      <section aria-labelledby="pendentes-heading">
        <h3 id="pendentes-heading" className="text-lg font-bold text-slate-900 mb-4">
          Protocolos Aguardando Designação de Parecerista
        </h3>

        {protocolosPendentes.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-600">Nenhum protocolo pendente de designação</p>
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
                      Data Submissão
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protocolosPendentes.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{protocolo.id}</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.docenteNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedProtocolo(protocolo.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Designar Parecerista
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

      {/* Protocolos Em Parecer */}
      <section aria-labelledby="em-parecer-heading">
        <h3 id="em-parecer-heading" className="text-lg font-bold text-slate-900 mb-4">
          Protocolos em Parecer
        </h3>

        {protocolosAguardandoParecer.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600">Nenhum protocolo aguardando parecer no momento</p>
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
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protocolosAguardandoParecer.map((protocolo) => (
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Aguardando parecer
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Modal de Designação */}
      {selectedProtocolo && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-labelledby="designar-modal-title"
          aria-modal="true"
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 id="designar-modal-title" className="text-lg font-bold text-slate-900 mb-4">
              Designar Parecerista
            </h3>

            <div className="mb-6">
              <label htmlFor="parecerista-select" className="block text-sm font-medium text-slate-700 mb-2">
                Selecione o Docente Parecerista
              </label>
              <select
                id="parecerista-select"
                value={selectedParecerista}
                onChange={(e) => setSelectedParecerista(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione...</option>
                {DOCENTES_DISPONIVEIS.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nome} - {docente.titulacao}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedProtocolo(null);
                  setSelectedParecerista('');
                }}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <button
                onClick={handleDesignar}
                disabled={!selectedParecerista}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
