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
  matricula: string;
  nome: string;
  role: UserRole;
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

  // use the api wrapper (imported statically)

  useEffect(() => {
    // fetch initial protocolos (mocked) when app mounts
    (async () => {
      try {
        const data = await api.fetchProtocolos();
        setProtocolos(data || []);
      } catch (e) {
        // ignore for offline/demo
        console.warn('api.fetchProtocolos failed', e);
      }
    })();
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
  };

  const handleLogout = () => {
    setUser(null);
    setShowProtocoloWizard(false);
  };

  const handleNovoProtocolo = () => {
    setShowProtocoloWizard(true);
  };

  const handleCancelarProtocolo = () => {
    setShowProtocoloWizard(false);
  };

  const handleSubmitProtocolo = async (protocolo: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>) => {
    if (!user) return;

    try {
      const criado = await api.createProtocolo(protocolo, user);
      setProtocolos(prev => [...prev, criado]);
    } catch (e) {
      // fallback to local creation
      const novoProtocolo: Protocolo = {
        ...protocolo,
        id: `PROT-${Date.now()}`,
        docenteId: user.matricula,
        docenteNome: user.nome,
        estado: 'aguardando_envio_parecer',
        dataCriacao: new Date().toISOString(),
      };
      setProtocolos(prev => [...prev, novoProtocolo]);
    } finally {
      setShowProtocoloWizard(false);
    }
  };

  const handleDesignarParecerista = (protocoloId: string, pareceristaId: string, pareceristaNome: string) => {
    setProtocolos(prev => prev.map(p =>
      p.id === protocoloId
        ? { ...p, pareceristaId, pareceristaNome, estado: 'aguardando_parecer' as EstadoProtocolo }
        : p
    ));
  };

  const handleSubmitParecer = (
    protocoloId: string,
    textoParecer: string,
    decisao: 'uso_recomendado' | 'uso_nao_recomendado'
  ) => {
    setProtocolos(prev => prev.map(p =>
      p.id === protocoloId
        ? {
            ...p,
            textoParecer,
            decisaoParecer: decisao,
            estado: 'aguardando_deliberacao' as EstadoProtocolo
          }
        : p
    ));
  };

  const handleDeliberar = (
    protocoloId: string,
    justificativa: string,
    decisao: 'uso_aprovado' | 'uso_reprovado'
  ) => {
    setProtocolos(prev => prev.map(p =>
      p.id === protocoloId
        ? {
            ...p,
            justificativaDeliberacao: justificativa,
            decisaoFinal: decisao,
            estado: decisao as EstadoProtocolo
          }
        : p
    ));
  };

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
            protocolos={protocolos.filter(p => p.docenteId === user.matricula)}
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