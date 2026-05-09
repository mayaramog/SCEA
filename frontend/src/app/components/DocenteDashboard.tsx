import { useState } from 'react';
import { User, Protocolo } from '../App';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ParecerModal } from './ParecerModal';

interface DocenteDashboardProps {
  user: User;
  protocolos: Protocolo[];
  onNovoProtocolo: () => void;
  onSubmitParecer: (protocoloId: string, texto: string, decisao: 'uso_recomendado' | 'uso_nao_recomendado') => void;
}

export function DocenteDashboard({ user, protocolos, onNovoProtocolo, onSubmitParecer }: DocenteDashboardProps) {
  const [selectedProtocolo, setSelectedProtocolo] = useState<Protocolo | null>(null);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aguardando_envio_parecer':
        return <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />;
      case 'aguardando_parecer':
        return <Clock className="w-5 h-5 text-blue-600" aria-hidden="true" />;
      case 'aguardando_deliberacao':
        return <AlertCircle className="w-5 h-5 text-orange-600" aria-hidden="true" />;
      case 'uso_aprovado':
        return <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />;
      case 'uso_reprovado':
        return <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getEstadoText = (estado: string) => {
    const estados = {
      aguardando_envio_parecer: 'Aguardando envio para parecer',
      aguardando_parecer: 'Aguardando parecer',
      aguardando_deliberacao: 'Aguardando deliberação',
      uso_aprovado: 'Uso aprovado',
      uso_reprovado: 'Uso reprovado',
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  const meusProtocolos = protocolos;
  const protocolosParaParecer = protocolos.filter(p =>
    p.pareceristaId === user.matricula && p.estado === 'aguardando_parecer'
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard do Docente</h2>
          <p className="text-slate-600 mt-1">Bem-vindo(a), {user.nome}</p>
        </div>

        <button
          onClick={onNovoProtocolo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Novo Protocolo</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{meusProtocolos.length}</p>
        </div>

        <div className="bg-white rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-800">Em Análise</span>
            <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-yellow-900">
            {meusProtocolos.filter(p => ['aguardando_envio_parecer', 'aguardando_parecer', 'aguardando_deliberacao'].includes(p.estado)).length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-green-200 bg-green-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800">Aprovados</span>
            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-green-900">
            {meusProtocolos.filter(p => p.estado === 'uso_aprovado').length}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-800">Pareceres Pendentes</span>
            <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-red-900">{protocolosParaParecer.length}</p>
        </div>
      </div>

      {/* Pareceres Pendentes */}
      {protocolosParaParecer.length > 0 && (
        <section aria-labelledby="pareceres-heading">
          <h3 id="pareceres-heading" className="text-lg font-bold text-slate-900 mb-4">
            Pareceres Pendentes
          </h3>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
            {protocolosParaParecer.map((protocolo) => (
              <div
                key={protocolo.id}
                className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 mb-1">
                      Protocolo {protocolo.id}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Pesquisador: {protocolo.docenteNome}
                    </p>
                    <p className="text-sm text-slate-700 line-clamp-2">
                      {protocolo.justificativa}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedProtocolo(protocolo)}
                    className="ml-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  >
                    Emitir Parecer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Meus Protocolos */}
      <section aria-labelledby="meus-protocolos-heading">
        <h3 id="meus-protocolos-heading" className="text-lg font-bold text-slate-900 mb-4">
          Meus Protocolos
        </h3>

        {meusProtocolos.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-600 mb-4">Você ainda não submeteu nenhum protocolo</p>
            <button
              onClick={onNovoProtocolo}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-4 py-2"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>Submeter Primeiro Protocolo</span>
            </button>
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
                      Data Submissão
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Período Experimento
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Animais
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {meusProtocolos.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{protocolo.id}</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                        {new Date(protocolo.dataTermino).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">
                          {protocolo.alocacoes.map((a, i) => (
                            <div key={a.id}>
                              {a.quantidade} {a.especie} ({a.bioterio})
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getEstadoIcon(protocolo.estado)}
                          <span className="text-sm text-slate-700">
                            {getEstadoText(protocolo.estado)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {selectedProtocolo && (
        <ParecerModal
          protocolo={selectedProtocolo}
          onClose={() => setSelectedProtocolo(null)}
          onSubmit={(texto, decisao) => {
            onSubmitParecer(selectedProtocolo.id, texto, decisao);
            setSelectedProtocolo(null);
          }}
        />
      )}
    </div>
  );
}
