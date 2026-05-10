import { useState } from 'react';
import { User, Protocolo } from '../App';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface DocenteDashboardProps {
  user: User;
  protocolos: Protocolo[];
  onNovoProtocolo: () => void;
}

export function DocenteDashboard({ user, protocolos, onNovoProtocolo }: DocenteDashboardProps) {
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

  // Filtrar apenas protocolos onde este usuário é o submetedor
  const meusProtocolos = protocolos.filter(p => p.docenteId === user.matricula);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Dashboard do Pesquisador</h2>
          <p className="text-slate-600 mt-1">Gerencie suas submissões de protocolos</p>
        </div>

        <button
          onClick={onNovoProtocolo}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" aria-hidden="true" />
          <span>Novo Protocolo</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-600 uppercase">Total Submetidos</span>
            <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-4xl font-black text-slate-900">{meusProtocolos.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-yellow-200 bg-yellow-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-yellow-800 uppercase">Em Análise</span>
            <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />
          </div>
          <p className="text-4xl font-black text-yellow-900">
            {meusProtocolos.filter(p => ['aguardando_envio_parecer', 'aguardando_parecer', 'aguardando_deliberacao'].includes(p.estado)).length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-green-200 bg-green-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-green-800 uppercase">Aprovados</span>
            <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
          </div>
          <p className="text-4xl font-black text-green-900">
            {meusProtocolos.filter(p => p.estado === 'uso_aprovado').length}
          </p>
        </div>
      </div>

      {/* Meus Protocolos */}
      <section aria-labelledby="meus-protocolos-heading">
        <h3 id="meus-protocolos-heading" className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
           <FileText className="w-5 h-5 text-blue-600" />
           Minhas Submissões
        </h3>

        {meusProtocolos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-600 mb-4 font-medium">Você ainda não submeteu nenhum protocolo</p>
            <button
              onClick={onNovoProtocolo}
              className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl px-6 py-2 transition-all border border-blue-200"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>Submeter Primeiro Protocolo</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Protocolo</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Submissão</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Período</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Animais</th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {meusProtocolos.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{protocolo.id.substring(0,8)}...</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataInicio).toLocaleDateString('pt-BR')} - {new Date(protocolo.dataTermino).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">
                          {protocolo.alocacoes.map((a) => (
                            <div key={a.id} className="bg-slate-100 px-2 py-0.5 rounded mt-1 w-fit">
                              {a.quantidade} {a.especie}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getEstadoIcon(protocolo.estado)}
                          <span className="text-xs font-bold text-slate-700">
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
    </div>
  );
}
