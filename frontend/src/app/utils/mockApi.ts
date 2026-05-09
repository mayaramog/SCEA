// Mock API implementation for offline development
import type { Protocolo, User } from '../App';

let protocolos: Protocolo[] = [];

export const mockApi = {
  async fetchProtocolos(): Promise<Protocolo[]> {
    // return a copy
    return JSON.parse(JSON.stringify(protocolos));
  },

  async createProtocolo(p: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>, user: User): Promise<Protocolo> {
    const novo: Protocolo = {
      ...p,
      id: `PROT-${Date.now()}`,
      docenteId: user.matricula,
      docenteNome: user.nome,
      estado: 'aguardando_envio_parecer',
      dataCriacao: new Date().toISOString(),
    };
    protocolos.push(novo);
    return JSON.parse(JSON.stringify(novo));
  },

  // Reset mock data (useful for tests)
  reset() {
    protocolos = [];
  }
};

export default mockApi;
