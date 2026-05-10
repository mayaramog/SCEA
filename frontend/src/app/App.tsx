import { useEffect, useState } from 'react';
import api from './utils/api';
import { LoginScreen } from './components/LoginScreen';
import { DocenteDashboard } from './components/DocenteDashboard';
import { SecretariaDashboard } from './components/SecretariaDashboard';
import { PresidenteDashboard } from './components/PresidenteDashboard';
import { PareceristaDashboard } from './components/PareceristaDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ProtocoloWizard } from './components/ProtocoloWizard';
import { Header } from './components/Header';

export type UserRole = 'docente' | 'secretaria' | 'presidente' | 'administrador' | 'parecerista';
export type Titulacao = 'doutor' | 'assistente' | 'livre-docente' | 'titular';

export interface User {
  matricula: string;
  nome: string;
  role: UserRole; // Default role
  roles: string[]; // All roles from backend
  email: string;
  titulacao?: Titulacao;
}

export type EstadoProtocolo =
  | 'aguardando_envio_parecer'
  | 'aguardando_parecer'
  | 'aguardando_deliberacao'
  | 'uso_aprovado'
  | 'uso_reprovado';

export interface AlocacaoAnimal {
  id: string;
  especie: string;
  quantidade: number;
  bioterio: string;
}

export interface Protocolo {
  id: string;
  docenteId: string;
  docenteNome: string;
  justificativa: string;
  resumoPt: string;
  resumoEn: string;
  dataInicio: string;
  dataTermino: string;
  estado: EstadoProtocolo;
  alocacoes: AlocacaoAnimal[];
  designacoesParecer: any[];
  dataCriacao: string;
}

export interface Reuniao {
  id: string;
  codigoReuniao: string;
  agendadaPara: string;
  descricaoLocal: string;
  estado: 'agendada' | 'em_andamento' | 'concluida' | 'cancelada';
  observacoes: string;
  pauta: any[];
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('docente');
  const [showProtocoloWizard, setShowProtocoloWizard] = useState(false);
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('scea_token');
    if (token) {
      api.getMe()
        .then(u => {
            setUser(u);
            setActiveRole(u.role);
        })
        .catch(() => localStorage.removeItem('scea_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      api.fetchProtocolos().then(setProtocolos);
    }
  }, [user]);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    setActiveRole(loggedUser.role);
  };

  const handleLogout = () => {
    api.logout();
    setUser(null);
    setShowProtocoloWizard(false);
    setProtocolos([]);
  };

  const handleNovoProtocolo = () => {
    setShowProtocoloWizard(true);
  };

  const handleCancelarProtocolo = () => {
    setShowProtocoloWizard(false);
  };

  const handleSubmitProtocolo = async (protocolo: any) => {
    try {
      const criado = await api.createProtocolo(protocolo);
      setProtocolos(prev => [...prev, criado]);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setShowProtocoloWizard(false);
    }
  };

  const handleDesignarParecerista = async (protocoloId: string, pareceristaId: string) => {
    try {
        await api.designarParecerista(protocoloId, pareceristaId);
        await api.fetchProtocolos().then(setProtocolos);
    } catch (e: any) {
        alert(e.message);
    }
  };

  const handleSubmitParecer = async (protocoloId: string, resumoTecnico: string, consideracoesEticas: string, decisao: any) => {
    try {
        await api.registrarParecer(protocoloId, {
            resumoTecnico,
            consideracoesEticas,
            recomendacao: decisao // Keeping lowercase as expected by @JsonValue
        });
        await api.fetchProtocolos().then(setProtocolos);
    } catch (e: any) {
        alert(e.message);
    }
  };

  const handleDeliberar = async (protocoloId: string, justificativa: string, decisao: any, reuniaoId: string) => {
    try {
      await api.deliberar(protocoloId, {
        reuniaoId,
        novoEstado: decisao === 'APROVADO' ? 'aprovado' : 'reprovado',
        fundamentacao: justificativa,
        quantidadeAnimaisAprovada: 0,
        validoAte: new Date(new Date().getFullYear() + 1, 11, 31).toISOString()
      });
      await api.fetchProtocolos().then(setProtocolos);
    } catch (e: any) {
      alert(e.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (showProtocoloWizard) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header 
            user={user} 
            onLogout={handleLogout} 
            activeRole={activeRole} 
            onRoleChange={setActiveRole} 
        />
        <ProtocoloWizard
          onSubmit={handleSubmitProtocolo}
          onCancel={handleCancelarProtocolo}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        activeRole={activeRole} 
        onRoleChange={setActiveRole} 
      />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Role Selector Tabs for multi-role users */}
        {user.roles.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-1 rounded-xl shadow-sm border border-slate-200 w-fit">
                {user.roles.map(r => {
                    const rCode = r.replace('ROLE_', '').toLowerCase() as UserRole;
                    // Filter allowed switchable dashboard roles
                    if (!['docente', 'secretaria', 'presidente', 'administrador', 'parecerista'].includes(rCode)) return null;

                    return (
                        <button
                            key={r}
                            onClick={() => setActiveRole(rCode)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeRole === rCode ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Ver como {rCode.charAt(0).toUpperCase() + rCode.slice(1)}
                        </button>
                    );
                })}
            </div>
        )}

        {activeRole === 'docente' && (
          <DocenteDashboard
            user={user}
            protocolos={protocolos}
            onNovoProtocolo={handleNovoProtocolo}
          />
        )}

        {activeRole === 'parecerista' && (
          <PareceristaDashboard
            user={user}
            protocolos={protocolos}
            onSubmitParecer={handleSubmitParecer}
          />
        )}

        {activeRole === 'secretaria' && (
          <SecretariaDashboard
            protocolos={protocolos}
            onDesignarParecerista={handleDesignarParecerista}
          />
        )}

        {activeRole === 'presidente' && (
          <PresidenteDashboard
            protocolos={protocolos}
            onDeliberar={handleDeliberar}
          />
        )}

        {activeRole === 'administrador' && (
            <AdminDashboard />
        )}
      </main>
    </div>
  );
}
