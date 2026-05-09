import { User } from '../App';
import { LogOut, User as UserIcon } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const getRoleName = (role: string) => {
    const roles = {
      docente: 'Docente',
      secretaria: 'Secretária CAUAE',
      presidente: 'Presidente CAUAE',
    };
    return roles[role as keyof typeof roles] || role;
  };

  const getTitulacaoName = (titulacao?: string) => {
    if (!titulacao) return '';
    const titulacoes = {
      doutor: 'Doutor',
      assistente: 'Assistente',
      'livre-docente': 'Livre-Docente',
      titular: 'Titular',
    };
    return ` - ${titulacoes[titulacao as keyof typeof titulacoes]}`;
  };

  return (
    <header
      className="bg-white border-b border-slate-200 shadow-sm"
      role="banner"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg" aria-hidden="true">
                SCEA
              </span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-slate-900">
                Sistema de Controle de Experimentação Animal
              </h1>
              <p className="text-xs text-slate-600">
                CAUAE - Comissão de Avaliação para Uso de Animais em Experimentação
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <UserIcon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-slate-900">{user.nome}</p>
                <p className="text-xs text-slate-600">
                  {getRoleName(user.role)}
                  {getTitulacaoName(user.titulacao)}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Sair do sistema"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
