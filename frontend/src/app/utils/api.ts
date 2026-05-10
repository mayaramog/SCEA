import type { Protocolo, User, UserRole, AlocacaoAnimal } from '../App';

const API_BASE_URL = 'http://localhost:8080';

const getHeaders = () => {
  const token = localStorage.getItem('scea_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export interface Especie {
  id: string;
  codigo: string;
  nome: string;
}

export interface Bioterio {
  id: string;
  codigo: string;
  nome: string;
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

export interface UsuarioBackend {
  id: string;
  nomeCompleto: string;
  email: string;
  papeis: string[];
  estaAtivo: boolean;
}

export const api = {
  async login(email: string, senha: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'E-mail ou senha inválidos');
    }

    const data = await response.json();
    localStorage.setItem('scea_token', data.token);

    const profile = await this.getMe();
    return { token: data.token, user: profile };
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      this.logout();
      throw new Error('Sessão expirada');
    }

    const data = await response.json();
    
    // Default role priority: admin > presidente > secretaria > parecerista > docente
    let role: UserRole = 'docente';
    if (data.papeis.includes('administrador')) {
      role = 'administrador';
    } else if (data.papeis.includes('presidente')) {
      role = 'presidente';
    } else if (data.papeis.includes('secretaria')) {
      role = 'secretaria';
    } else if (data.papeis.includes('parecerista')) {
      role = 'parecerista';
    }

    return {
      matricula: data.id,
      nome: data.nomeCompleto,
      role: role,
      roles: data.papeis,
      email: data.email
    };
  },

  async fetchProtocolos(): Promise<Protocolo[]> {
    // Busca protocolos, espécies e biotérios em paralelo para "traduzir" os IDs em nomes
    const [response, especies, bioterios] = await Promise.all([
      fetch(`${API_BASE_URL}/protocolos`, { headers: getHeaders() }),
      this.fetchEspecies(),
      this.fetchBioterios()
    ]);

    if (!response.ok) return [];

    const data = await response.json();
    
    return data.map((p: any) => ({
      id: p.id,
      docenteId: p.idUsuarioSubmetedor,
      docenteNome: p.nomePesquisadorResponsavel,
      justificativa: p.justificativa,
      resumoPt: p.resumo,
      resumoEn: p.resumo,
      dataInicio: p.dataInicioPlanejada,
      dataTermino: p.dataTerminoPlanejada,
      estado: this.mapEstado(p.estado),
      alocacoes: p.alocacoes.map((a: any) => {
        const esp = especies.find(e => e.id === a.especieId);
        const bio = bioterios.find(b => b.id === a.bioterioId);
        return {
          id: a.id,
          especie: esp ? esp.nome : `Espécie (${a.especieId.substring(0,4)})`,
          especieId: a.especieId,
          quantidade: a.quantidadePlanejada,
          bioterio: bio ? bio.nome : `Biotério (${a.bioterioId.substring(0,4)})`,
          bioterioId: a.bioterioId
        };
      }),
      dataCriacao: p.criadoEm,
      designacoesParecer: p.designacoesParecer || []
    }));
  },

  async createProtocolo(p: any): Promise<Protocolo> {
    console.log('DEBUG: Submitting Protocol:', p);
    const response = await fetch(`${API_BASE_URL}/protocolos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        titulo: p.titulo,
        objetivo: p.objetivo,
        justificativa: p.justificativa,
        resumoPortugues: p.resumoPt,
        resumoIngles: p.resumoEn,
        dataInicioPlanejada: p.dataInicio.split('T')[0],
        dataTerminoPlanejada: p.dataTermino.split('T')[0],
        alocacoes: p.alocacoes.map((a: any) => ({
          especieId: a.especieId,
          bioterioId: a.bioterioId,
          nomeLinhagem: a.nomeLinhagem || 'Wistar',
          quantidadePlanejada: a.quantidade,
          justificativa: 'Necessário para experimento',
          sexo: a.sexo || 'macho'
        }))
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Falha ao criar protocolo');
    }

    const id = await response.json();
    const all = await this.fetchProtocolos();
    return all.find(item => item.id === id)!;
  },

  async fetchEspecies(): Promise<Especie[]> {
    const resp = await fetch(`${API_BASE_URL}/recursos/especies`, { headers: getHeaders() });
    return resp.ok ? resp.json() : [];
  },

  async fetchBioterios(): Promise<Bioterio[]> {
    const resp = await fetch(`${API_BASE_URL}/recursos/bioterios`, { headers: getHeaders() });
    return resp.ok ? resp.json() : [];
  },

  // MEETING (COMITE) METHODS
  async fetchReunioes(): Promise<Reuniao[]> {
    const resp = await fetch(`${API_BASE_URL}/comite/reunioes`, { headers: getHeaders() });
    return resp.ok ? resp.json() : [];
  },

  async createReuniao(r: Partial<Reuniao>): Promise<Reuniao> {
    const resp = await fetch(`${API_BASE_URL}/comite/reunioes`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(r),
    });
    if (!resp.ok) throw new Error('Falha ao criar reunião');
    return resp.json();
  },

  async updateReuniaoEstado(id: string, novoEstado: string): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/comite/reunioes/${id}/estado?novoEstado=${novoEstado}`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!resp.ok) throw new Error('Falha ao atualizar estado da reunião');
  },

  async adicionarProtocoloNaPauta(reuniaoId: string, protocoloId: string): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/comite/reunioes/${reuniaoId}/protocolos/${protocoloId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!resp.ok) throw new Error('Falha ao adicionar protocolo na pauta');
  },

  async deliberar(protocoloId: string, payload: any): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/protocolos/${protocoloId}/deliberar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      throw new Error(data.detail || 'Falha na deliberação');
    }
  },

  // ADMIN METHODS
  async fetchUsuarios(): Promise<UsuarioBackend[]> {
    const resp = await fetch(`${API_BASE_URL}/auth/usuarios`, { headers: getHeaders() });
    if (!resp.ok) throw new Error('Falha ao listar usuários');
    return resp.json();
  },

  async createUsuario(u: any): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/auth/usuarios`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(u),
    });
    if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Falha ao criar usuário');
    }
  },

  async updateUsuarioPapeis(userId: string, papeis: string[]): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/auth/usuarios/${userId}/papeis`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ codigosPapeis: papeis }),
    });
    if (!resp.ok) throw new Error('Falha ao atualizar papéis');
  },

  async designarParecerista(protocoloId: string, pareceristaId: string): Promise<void> {
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + 30); // Prazo padrão de 30 dias

    const resp = await fetch(`${API_BASE_URL}/protocolos/${protocoloId}/designar`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ 
        usuarioPareceristaId: pareceristaId,
        prazoEm: prazo.toISOString()
      }),
    });
    if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || 'Falha ao designar parecerista');
    }
  },

  async registrarParecer(protocoloId: string, payload: any): Promise<void> {
    const resp = await fetch(`${API_BASE_URL}/protocolos/${protocoloId}/parecer`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || 'Falha ao registrar parecer');
    }
  },

  mapEstado(backendEstado: string): any {
    const mapping: Record<string, string> = {
      'rascunho': 'aguardando_envio_parecer',
      'submetido': 'aguardando_envio_parecer',
      'em_analise_ceua': 'aguardando_parecer',
      'pendencia_solicitada': 'aguardando_deliberacao',
      'aprovado': 'uso_aprovado',
      'reprovado': 'uso_reprovado'
    };
    return mapping[backendEstado] || 'aguardando_envio_parecer';
  },

  logout() {
    localStorage.removeItem('scea_token');
  }
};

export default api;
