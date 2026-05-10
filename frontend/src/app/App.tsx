import { useEffect, useState } from 'react';
import api from './utils/api';
import { LoginScreen } from './components/LoginScreen';
import { DocenteDashboard } from './components/DocenteDashboard';
import { SecretariaDashboard } from './components/SecretariaDashboard';
import { PresidenteDashboard } from './components/PresidenteDashboard';
import { ProtocoloWizard } from './components/ProtocoloWizard';
import { Header } from './components/Header';

export type UserRole = 'docente' | 'secretaria' | 'presidente';
export type Titulacao = 'doutor' | 'assistente' | 'livre-docente' | 'titular';

export interface User {
  matricula: string; // UUID in backend
  nome: string;
  role: UserRole;
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
  pareceristaId?: string;
  pareceristaNome?: string;
  textoParecer?: string;
  decisaoParecer?: 'uso_recomendado' | 'uso_nao_recomendado';
  justificativaDeliberacao?: string;
  decisaoFinal?: 'uso_aprovado' | 'uso_reprovado';
  dataCriacao: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showProtocoloWizard, setShowProtocoloWizard] = useState(false);
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('scea_token');
    if (token) {
      api.getMe()
        .then(u => setUser(u))
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
    // Note: Implementation for designation/parecer would go here calling real API
    // For now we refresh the list
    await api.fetchProtocolos().then(setProtocolos);
  };

  const handleSubmitParecer = async (protocoloId: string, texto: string, decisao: any) => {
    await api.fetchProtocolos().then(setProtocolos);
  };

  const handleDeliberar = async (protocoloId: string, justificativa: string, decisao: any) => {
    await api.fetchProtocolos().then(setProtocolos);
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
        <Header user={user} onLogout={handleLogout} />
        <ProtocoloWizard
          onSubmit={handleSubmitProtocolo}
          onCancel={handleCancelarProtocolo}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {user.role === 'docente' && (
          <DocenteDashboard
            user={user}
            protocolos={protocolos}
            onNovoProtocolo={handleNovoProtocolo}
            onSubmitParecer={handleSubmitParecer}
          />
        )}

        {user.role === 'secretaria' && (
          <SecretariaDashboard
            protocolos={protocolos}
            onDesignarParecerista={handleDesignarParecerista}
          />
        )}

        {user.role === 'presidente' && (
          <PresidenteDashboard
            protocolos={protocolos}
            onDeliberar={handleDeliberar}
          />
        )}
      </main>
    </div>
  );
}
