import { useState, useEffect } from 'react';
import { User, Protocolo } from '../App';
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle, Archive, Download, Edit2, RefreshCw } from 'lucide-react';
import api from '../utils/api';

interface DocenteDashboardProps {
  user: User;
  protocolos: Protocolo[];
  onNovoProtocolo: () => void;
  onEdit: (p: Protocolo) => void;
  onRefresh: () => void;
}

export function DocenteDashboard({ user, protocolos, onNovoProtocolo, onEdit, onRefresh }: DocenteDashboardProps) {
  const [relatoriosMap, setRelatoriosMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Carregar relatórios para protocolos deliberados
    protocolos
      .filter(p => (p.estado === 'uso_aprovado' || p.estado === 'uso_reprovado') && p.docenteId === user.matricula)
      .forEach(async (p) => {
        if (!relatoriosMap[p.id]) {
            const list = await api.fetchRelatoriosPorProtocolo(p.id);
            setRelatoriosMap(prev => ({ ...prev, [p.id]: list }));
        }
      });
  }, [protocolos, user.matricula]);

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'aguardando_envio_parecer': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'aguardando_parecer': return <Clock className="w-5 h-5 text-orange-500" />;
      case 'aguardando_deliberacao': return <AlertCircle className="w-5 h-5 text-purple-500" />;
      case 'uso_aprovado': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uso_reprovado': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const meusProtocolosAtivos = protocolos.filter(p => p.docenteId === user.matricula && p.ativo !== false);
  const meusArquivados = protocolos.filter(p => p.docenteId === user.matricula && p.ativo === false);

  const handleArquivar = async (id: string) => {
    if (!confirm('Deseja realmente arquivar este protocolo? Ele será movido para o histórico de arquivados.')) return;
    try {
        await api.arquivarProtocolo(id);
        onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleDesarquivar = async (id: string) => {
    if (!confirm('Deseja desarquivar este protocolo? Ele voltará para a fase de Aguardando Designação.')) return;
    try {
        await api.desarquivarProtocolo(id);
        onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const handleEmenda = async (id: string) => {
    if (!confirm('Deseja criar uma emenda para este protocolo? O original será mantido como histórico e uma nova versão será gerada para edição.')) return;
    try {
        await api.criarEmenda(id);
        alert('Emenda criada com sucesso! Verifique sua lista de submissões.');
        onRefresh();
    } catch (e: any) { alert(e.message); }
  };

  const ProtocolTable = ({ list, isArchived = false }: { list: Protocolo[], isArchived?: boolean }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden ${isArchived ? 'opacity-70 grayscale-[0.3]' : ''}`}>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Código / Título</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.length === 0 && (
            <tr>
              <td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">
                Nenhum protocolo encontrado.
              </td>
            </tr>
          )}
          {list.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-blue-600 font-bold">{p.id.substring(0, 8).toUpperCase()}</span>
                  <span className="font-bold text-slate-900">{p.titulo}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {getEstadoIcon(p.estado)}
                  <span className="text-sm font-medium text-slate-600 capitalize">
                    {p.estado.replace(/_/g, ' ')}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-3">
                  {/* EDITAR: apenas se não deliberado e não arquivado */}
                  {!isArchived && p.estado === 'aguardando_envio_parecer' && (
                    <button onClick={() => onEdit(p)} className="text-slate-600 hover:text-blue-600" title="Editar">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* DOCUMENTOS: lista todos os disponíveis */}
                  {(p.estado === 'uso_aprovado' || p.estado === 'uso_reprovado' || (relatoriosMap[p.id] && relatoriosMap[p.id].length > 0)) && (
                    <div className="flex gap-1">
                      {relatoriosMap[p.id]?.map((r: any) => (
                        <button
                          key={r.id}
                          onClick={() => api.downloadRelatorio(r.id, r.nomeArquivoOriginal)}
                          className={`p-1 rounded hover:bg-slate-100 transition-colors ${
                            r.tipoDocumento === 'certificado_aprovacao' ? 'text-green-600' :
                            r.tipoDocumento === 'parecer_reprovacao' ? 'text-red-600' :
                            r.tipoDocumento === 'anexo_parecer' ? 'text-orange-500' : 'text-blue-500'
                          }`}
                          title={r.nomeArquivoOriginal}
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* EMENDA: apenas aprovados e não arquivados */}
                  {!isArchived && p.estado === 'uso_aprovado' && (
                    <button onClick={() => handleEmenda(p.id)} className="text-orange-600 hover:text-orange-800" title="Criar Emenda">
                      <Plus className="w-5 h-5 border border-orange-600 rounded-sm" />
                    </button>
                  )}
                  
                  {/* ARQUIVAR: apenas se não aprovado/reprovado e não arquivado */}
                  {!isArchived && p.estado !== 'uso_aprovado' && p.estado !== 'uso_reprovado' && (
                    <button onClick={() => handleArquivar(p.id)} className="text-slate-400 hover:text-red-500" title="Arquivar">
                      <Archive className="w-5 h-5" />
                    </button>
                  )}

                  {/* DESARQUIVAR: apenas se arquivado */}
                  {isArchived && (
                    <button onClick={() => handleDesarquivar(p.id)} className="text-blue-500 hover:text-blue-700" title="Desarquivar">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <section>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Protocolos Ativos</h2>
            <p className="text-slate-500">Submissões em andamento ou aprovadas para uso.</p>
          </div>
          <button onClick={onNovoProtocolo} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg">
            <Plus className="w-5 h-5" /> Nova Submissão
          </button>
        </div>
        <ProtocolTable list={meusProtocolosAtivos} />
      </section>

      {meusArquivados.length > 0 && (
        <section className="pt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-500 flex items-center gap-2">
                <Archive className="w-5 h-5" /> Protocolos Arquivados
            </h2>
            <p className="text-slate-400 text-sm">Histórico de protocolos antigos ou removidos.</p>
          </div>
          <ProtocolTable list={meusArquivados} isArchived={true} />
        </section>
      )}
    </div>
  );
}
