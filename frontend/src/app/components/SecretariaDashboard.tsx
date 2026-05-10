import { useState, useEffect } from 'react';
import { Protocolo } from '../App';
import { UserPlus, FileText, Clock, CheckCircle } from 'lucide-react';
import api, { UsuarioBackend } from '../utils/api';

interface SecretariaDashboardProps {
  protocolos: Protocolo[];
  onDesignarParecerista: (protocoloId: string, pareceristaId: string, pareceristaNome: string) => void;
}

export function SecretariaDashboard({ protocolos, onDesignarParecerista }: SecretariaDashboardProps) {
  const [selectedProtocolo, setSelectedProtocolo] = useState<string | null>(null);
  const [selectedParecerista, setSelectedParecerista] = useState('');
  const [pareceristasDisponiveis, setPareceristasDisponiveis] = useState<UsuarioBackend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.fetchUsuarios()
      .then(users => {
        // Filtrar apenas usuários que possuem o papel de parecerista
        const filtered = users.filter(u => 
          u.papeis.some(p => {
             const code = typeof p === 'string' ? p : (p as any).codigo;
             return code.toUpperCase().includes('PARECERISTA');
          })
        );
        setPareceristasDisponiveis(filtered);
      })
      .finally(() => setLoading(false));
  }, []);

  const protocolosPendentes = protocolos.filter(p => p.estado === 'aguardando_envio_parecer');
  const protocolosAguardandoParecer = protocolos.filter(p => p.estado === 'aguardando_parecer');
  const protocolosFinalizados = protocolos.filter(p => ['uso_aprovado', 'uso_reprovado'].includes(p.estado));

  const handleDesignar = () => {
    if (!selectedProtocolo || !selectedParecerista) return;

    const parecerista = pareceristasDisponiveis.find(d => d.id === selectedParecerista);
    if (parecerista) {
      onDesignarParecerista(selectedProtocolo, parecerista.id, parecerista.nomeCompleto);
      setSelectedProtocolo(null);
      setSelectedParecerista('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Dashboard da Secretária CAUAE</h2>
        <p className="text-slate-600 mt-1">Gestão de protocolos e designação de pareceristas</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">Total</span>
            <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-slate-900">{protocolos.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-yellow-200 bg-yellow-50/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-800">Pendentes</span>
            <Clock className="w-5 h-5 text-yellow-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-yellow-900">{protocolosPendentes.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">Em Parecer</span>
            <UserPlus className="w-5 h-5 text-blue-600" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-blue-900">{protocolosAguardandoParecer.length}</p>
        </div>

        <div className="bg-white rounded-xl border border-green-200 bg-green-50/50 p-6 shadow-sm">
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
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <CheckCircle className="w-16 h-16 text-green-200 mx-auto mb-4" aria-hidden="true" />
            <p className="text-slate-600">Nenhum protocolo pendente de designação</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pesquisador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Data Submissão
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protocolosPendentes.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{protocolo.id.substring(0,8)}...</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.docenteNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => setSelectedProtocolo(protocolo.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all"
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
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
            <p className="text-slate-600">Nenhum protocolo aguardando parecer no momento</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Protocolo
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Pesquisador
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Parecerista
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {protocolosAguardandoParecer.map((protocolo) => (
                    <tr key={protocolo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{protocolo.id.substring(0,8)}...</div>
                        <div className="text-sm text-slate-500 line-clamp-1">{protocolo.justificativa}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.docenteNome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {protocolo.pareceristaNome || 'Aguardando...'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
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
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          role="dialog"
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Designar Parecerista
            </h3>
            <p className="text-slate-500 text-sm mb-6">Selecione um docente qualificado para avaliar este protocolo.</p>

            <div className="mb-8">
              <label htmlFor="parecerista-select" className="block text-sm font-medium text-slate-700 mb-2">
                Pareceristas Disponíveis
              </label>
              <select
                id="parecerista-select"
                value={selectedParecerista}
                onChange={(e) => setSelectedParecerista(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              >
                <option value="">Selecione um parecerista...</option>
                {pareceristasDisponiveis.map((docente) => (
                  <option key={docente.id} value={docente.id}>
                    {docente.nomeCompleto}
                  </option>
                ))}
              </select>
              {pareceristasDisponiveis.length === 0 && !loading && (
                  <p className="text-red-500 text-xs mt-2 font-medium">Nenhum usuário com papel de PARECERISTA encontrado.</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setSelectedProtocolo(null);
                  setSelectedParecerista('');
                }}
                className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 font-bold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDesignar}
                disabled={!selectedParecerista}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
