import mockApi from './mockApi';
import type { Protocolo, User } from '../App';

const metaEnv = (import.meta as any).env || {};
const isOffline = Boolean(metaEnv.VITE_OFFLINE) || metaEnv.MODE === 'development';

const realApi = {
  async fetchProtocolos(): Promise<Protocolo[]> {
    throw new Error('realApi.fetchProtocolos not implemented. Set VITE_OFFLINE=true for offline development.');
  },
  async createProtocolo(_: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>, __: User): Promise<Protocolo> {
    throw new Error('realApi.createProtocolo not implemented.');
  }
};

const api = isOffline ? mockApi : realApi;

export type Api = typeof api;
export default api;
