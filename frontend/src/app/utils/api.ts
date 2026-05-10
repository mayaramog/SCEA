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
    
    let role: UserRole = 'docente';
    if (data.papeis.includes('administrador') || data.papeis.includes('presidente')) {
      role = 'presidente';
    } else if (data.papeis.includes('secretaria')) {
      role = 'secretaria';
    } else if (data.papeis.includes('parecerista')) {
      // No frontend existing roles, parecerista might fall under docente for now or a new one
      role = 'docente'; 
    }

    return {
      matricula: data.id,
      nome: data.nomeCompleto,
      role: role,
      email: data.email
    };
  },

  async fetchProtocolos(): Promise<Protocolo[]> {
    const response = await fetch(`${API_BASE_URL}/protocolos`, {
      headers: getHeaders(),
    });

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
      alocacoes: p.alocacoes.map((a: any) => ({
        id: a.id,
        especie: a.especieId, 
        quantidade: a.quantidadePlanejada,
        bioterio: a.bioterioId
      })),
      dataCriacao: p.criadoEm
    }));
  },

  async createProtocolo(p: any): Promise<Protocolo> {
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
