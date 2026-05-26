import { User, UserRole } from '../App';
import { LogOut, User as UserIcon, Shield } from 'lucide-react';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function Header({ user, onLogout, activeRole, onRoleChange }: HeaderProps) {
  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      docente: 'Docente',
      secretaria: 'Secretaria',
      presidente: 'Presidente',
      parecerista: 'Parecerista',
      administrador: 'Administrador'
    };
    return roles[role.replace('ROLE_', '').toLowerCase()] || role;
  };

  return (
    <header
      className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50"
      role="banner"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
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

          <div className="flex items-center gap-6">
            {/* Role switcher for users with multiple roles */}
            {user.roles && user.roles.length > 1 && (
                <div className="flex bg-slate-100 p-1 rounded-lg gap-1 border border-slate-200">
                    {user.roles.map((role: string) => {
                        const cleanRole = role.replace('ROLE_', '').toLowerCase() as UserRole;
                        const label = getRoleName(role);
                        return (
                            <button
                                key={role}
                                onClick={() => onRoleChange(cleanRole)}
                                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                                    activeRole === cleanRole 
                                        ? 'bg-white text-blue-600 shadow-sm border border-slate-100' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                Ver como {label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <UserIcon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-slate-900 leading-tight">{user.nome}</p>
                <p className="text-xs text-slate-600">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
