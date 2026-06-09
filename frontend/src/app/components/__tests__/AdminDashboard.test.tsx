import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AdminDashboard } from '../AdminDashboard';
import api from '../../utils/api';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../utils/api', () => ({
  __esModule: true,
  default: {
    fetchUsuarios: vi.fn(),
    fetchEspecies: vi.fn(),
    fetchBioterios: vi.fn(),
    updateUsuarioPapeis: vi.fn(),
  }
}));

describe('AdminDashboard', () => {
  it('should display roles correctly without ROLE_ prefix and in uppercase', async () => {
    (api.fetchUsuarios as any).mockResolvedValue([
      {
        id: '1',
        nomeCompleto: 'Test User',
        email: 'test@example.com',
        papeis: ['ROLE_ADMINISTRADOR', 'parecerista'],
        estaAtivo: true,
      }
    ]);
    (api.fetchEspecies as any).mockResolvedValue([]);
    (api.fetchBioterios as any).mockResolvedValue([]);

    render(<AdminDashboard />);

    await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

    expect(screen.getByText('ADMINISTRADOR')).toBeInTheDocument();
    expect(screen.getByText('PARECERISTA')).toBeInTheDocument();
  });
});
