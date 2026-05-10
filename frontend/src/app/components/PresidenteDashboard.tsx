import { useState, useEffect } from 'react';
import { Protocolo, Reuniao } from '../App';
import { FileText, CheckCircle, Clock, Calendar, Plus, ChevronRight, Play, CheckSquare } from 'lucide-react';
import api from '../utils/api';
import { ParecerModal } from './ParecerModal';

interface PresidenteDashboardProps {
  protocolos: Protocolo[];
  onDeliberar: (protocoloId: string, justificativa: string, decisao: any, reuniaoId: string) => void;
}

export function PresidenteDashboard({ protocolos, onDeliberar }: PresidenteDashboardProps) {
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [selectedReuniao, setSelectedReuniao] = useState<Reuniao | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProtocolo, setSelectedProtocolo] = useState<Protocolo | null>(null);
  
  // New Meeting Fields
  const [newCodigo, setNewCodigo] = useState('');
  const [newData, setNewData] = useState('');
  const [newLocal, setNewLocal] = useState('');

  const loadReunioes = () => {
    api.fetchReunioes().then(setReunioes);
  };

  useEffect(() => {
    loadReunioes();
  }, []);

  const handleCreateReuniao = async () => {
    if (!newCodigo || !newData) return;
    try {
      await api.createReuniao({
        codigoReuniao: newCodigo,
        agendadaPara: newData,
        descricaoLocal: newLocal
      });
      setShowCreateModal(false);
      loadReunioes();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleStartMeeting = async (id: string) => {
    await api.updateReuniaoEstado(id, 'em_andamento');
    loadReunioes();
    if (selectedReuniao?.id === id) {
        setSelectedReuniao({ ...selectedReuniao, estado: 'em_andamento' });
    }
  };

  const handleFinishMeeting = async (id: string) => {
    await api.updateReuniaoEstado(id, 'concluida');
    loadReunioes();
    setSelectedReuniao(null);
  };

  const handleAddToAgenda = async (protocoloId: string) => {
    if (!selectedReuniao) return;
    try {
      await api.adicionarProtocoloNaPauta(selectedReuniao.id, protocoloId);
      const updated = await api.fetchReunioes().then(list => list.find(r => r.id === selectedReuniao.id));
      if (updated) setSelectedReuniao(updated);
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Filtrar protocolos que podem ir para a pauta (em análise ou pendência)
  const protocolosDisponiveis = protocolos.filter(p => 
    (p.estado === 'aguardando_parecer' || p.estado === 'aguardando_deliberacao') &&
    !selectedReuniao?.pauta.some(item => item.protocoloId === p.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Portal do Presidente</h1>
          <p className="text-slate-500 mt-1">Gestão de Reuniões e Deliberações do CEUA</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nova Reunião
        </button>
      </div>

      {!selectedReuniao ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reunioes.map(r => (
            <div key={r.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${
                r.estado === 'em_andamento' ? 'bg-green-100 text-green-700' : 
                r.estado === 'concluida' ? 'bg-slate-100 text-slate-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {r.estado.replace('_', ' ')}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{r.codigoReuniao}</h3>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(r.agendadaPara).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {r.pauta.length} protocolos na pauta
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedReuniao(r)}
                  className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
                >
                  Acessar Reunião
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
            <div>
              <button onClick={() => setSelectedReuniao(null)} className="text-slate-400 hover:text-white text-sm mb-2">← Voltar para lista</button>
              <h2 className="text-2xl font-bold">{selectedReuniao.codigoReuniao}</h2>
            </div>
            <div className="flex gap-4">
              {selectedReuniao.estado === 'agendada' && (
                <button onClick={() => handleStartMeeting(selectedReuniao.id)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Play className="w-4 h-4" /> Iniciar Reunião
                </button>
              )}
              {selectedReuniao.estado === 'em_andamento' && (
                <button onClick={() => handleFinishMeeting(selectedReuniao.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2">
                  <CheckSquare className="w-4 h-4" /> Finalizar Reunião
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 divide-x divide-slate-200 min-h-[500px]">
            {/* Pauta Atual */}
            <div className="lg:col-span-2 p-8">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Protocolos em Pauta
              </h3>
              <div className="space-y-4">
                {selectedReuniao.pauta.length === 0 && <p className="text-slate-400 italic">Nenhum protocolo na pauta ainda.</p>}
                {selectedReuniao.pauta.map(item => {
                  const p = protocolos.find(prot => prot.id === item.protocoloId);
                  if (!p) return null;
                  return (
                    <div key={item.id} className="p-4 border rounded-xl flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div>
                        <p className="font-bold text-slate-900">{p.titulo}</p>
                        <p className="text-xs text-slate-500">{p.docenteNome} | {p.estado.replace('_', ' ')}</p>
                      </div>
                      {selectedReuniao.estado === 'em_andamento' && p.estado !== 'uso_aprovado' && p.estado !== 'uso_reprovado' && (
                        <button 
                          onClick={() => setSelectedProtocolo(p)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm"
                        >
                          Deliberar
                        </button>
                      )}
                      {(p.estado === 'uso_aprovado' || p.estado === 'uso_reprovado') && (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-sm">
                          <CheckCircle className="w-4 h-4" /> Deliberado
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Adicionar à Pauta */}
            <div className="p-8 bg-slate-50/50">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Aguardando Pauta</h3>
              <div className="space-y-3">
                {protocolosDisponiveis.map(p => (
                  <div key={p.id} className="p-3 bg-white border rounded-lg shadow-sm">
                    <p className="text-sm font-bold text-slate-800 truncate">{p.titulo}</p>
                    <button 
                      onClick={() => handleAddToAgenda(p.id)}
                      className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                    >
                      + Adicionar à Reunião
                    </button>
                  </div>
                ))}
                {protocolosDisponiveis.length === 0 && <p className="text-slate-400 text-sm">Não há protocolos prontos para pauta.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Reunião */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
             <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Agendar Reunião do CEUA</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Código da Reunião</label>
                    <input type="text" value={newCodigo} onChange={e => setNewCodigo(e.target.value)} className="w-full border rounded-lg p-2" placeholder="RC-2026-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Data e Hora</label>
                    <input type="datetime-local" value={newData} onChange={e => setNewData(e.target.value)} className="w-full border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Local</label>
                    <input type="text" value={newLocal} onChange={e => setNewLocal(e.target.value)} className="w-full border rounded-lg p-2" placeholder="Sala A ou Link Teams" />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg">Cancelar</button>
                  <button onClick={handleCreateReuniao} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Criar Reunião</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Modal de Deliberação */}
      {selectedProtocolo && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-4">Deliberação: {selectedProtocolo.titulo}</h3>
              <p className="text-slate-600 mb-6">Registro da decisão final em ata para a {selectedReuniao?.codigoReuniao}.</p>
              
              <div className="space-y-4">
                <textarea 
                  id="justificativa-deliberacao"
                  className="w-full border rounded-xl p-4 h-32" 
                  placeholder="Fundamentação da decisão..."
                ></textarea>
                <div className="flex gap-4">
                   <button 
                    onClick={() => {
                      const msg = (document.getElementById('justificativa-deliberacao') as HTMLTextAreaElement).value;
                      onDeliberar(selectedProtocolo.id, msg, 'APROVADO', selectedReuniao!.id);
                      setSelectedProtocolo(null);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold"
                   >Aprovar</button>
                   <button 
                    onClick={() => {
                      const msg = (document.getElementById('justificativa-deliberacao') as HTMLTextAreaElement).value;
                      onDeliberar(selectedProtocolo.id, msg, 'REPROVADO', selectedReuniao!.id);
                      setSelectedProtocolo(null);
                    }}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold"
                   >Reprovar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
