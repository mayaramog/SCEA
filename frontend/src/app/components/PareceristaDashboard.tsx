import { useState } from 'react';
import { Protocolo, User } from '../App';
import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { ParecerModal } from './ParecerModal';

interface PareceristaDashboardProps {
  user: User;
  protocolos: Protocolo[];
  onSubmitParecer: (protocoloId: string, resumoTecnico: string, consideracoesEticas: string, decisao: 'uso_recomendado' | 'uso_nao_recomendado') => void;
}

export function PareceristaDashboard({ user, protocolos, onSubmitParecer }: PareceristaDashboardProps) {
  const [selectedProtocolo, setSelectedProtocolo] = useState<Protocolo | null>(null);

  // Filtrar protocolos onde este usuário é o parecerista designado e ainda não avaliou
  const protocolosPendentes = protocolos.filter(p => 
    p.designacoesParecer.some(d => d.usuarioPareceristaId === user.matricula && d.estadoDesignacao !== 'concluido')
  );

  const protocolosConcluidos = protocolos.filter(p => 
    p.designacoesParecer.some(d => d.usuarioPareceristaId === user.matricula && d.estadoDesignacao === 'concluido')
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Portal do Parecerista</h2>
        <p className="text-slate-600 mt-1">Avaliação técnica e ética de protocolos de pesquisa</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-orange-200 bg-orange-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-orange-800 uppercase tracking-wider">Pendentes de Avaliação</span>
            <AlertCircle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-4xl font-black text-orange-900">{protocolosPendentes.length}</p>
        </div>

        <div className="bg-white rounded-2xl border border-green-200 bg-green-50/30 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-green-800 uppercase tracking-wider">Pareceres Concluídos</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-4xl font-black text-green-900">{protocolosConcluidos.length}</p>
        </div>
      </div>

      {/* Lista de Pendentes */}
      <section>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Protocolos Aguardando seu Parecer
        </h3>

        {protocolosPendentes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <p className="text-slate-600 font-medium">Você está em dia! Nenhum protocolo pendente de avaliação.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {protocolosPendentes.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Protocolo {p.id.substring(0,8)}</span>
                    <h4 className="font-bold text-slate-900">{p.titulo || 'Sem Título'}</h4>
                  </div>
                  <p className="text-sm text-slate-600">Pesquisador: {p.docenteNome}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1 italic">"{p.justificativa}"</p>
                </div>
                <button
                  onClick={() => setSelectedProtocolo(p)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg transition-all"
                >
                  Emitir Parecer
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Histórico de Pareceres */}
      {protocolosConcluidos.length > 0 && (
        <section>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Seu Histórico de Avaliações</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Protocolo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Título</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Pesquisador</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Estado Atual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {protocolosConcluidos.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{p.id.substring(0,8)}...</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.titulo || 'Sem Título'}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{p.docenteNome}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        Avaliado
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {selectedProtocolo && (
        <ParecerModal
          protocolo={selectedProtocolo}
          onClose={() => setSelectedProtocolo(null)}
          onSubmit={(resumo, etica, decisao) => {
            onSubmitParecer(selectedProtocolo.id, resumo, etica, decisao);
            setSelectedProtocolo(null);
          }}
        />
      )}
    </div>
  );
}
