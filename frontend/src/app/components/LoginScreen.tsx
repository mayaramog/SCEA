import { useState } from 'react';
import { User, UserRole, Titulacao } from '../App';
import { Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [matricula, setMatricula] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Usuários simulados para demonstração
  const usuarios: User[] = [
    { matricula: '1001', nome: 'Dr. João Silva', role: 'docente', titulacao: 'doutor' },
    { matricula: '1002', nome: 'Profa. Maria Santos', role: 'docente', titulacao: 'titular' },
    { matricula: '1003', nome: 'Dr. Pedro Almeida', role: 'docente', titulacao: 'doutor' },
    { matricula: '2001', nome: 'Ana Costa', role: 'secretaria' },
    { matricula: '3001', nome: 'Prof. Carlos Oliveira', role: 'presidente', titulacao: 'livre-docente' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usuario = usuarios.find(u => u.matricula === matricula);

    if (!usuario) {
      setError('Matrícula ou senha inválida');
      return;
    }

    // Simula verificação de senha (senha = matrícula para demo)
    if (senha !== matricula) {
      setError('Matrícula ou senha inválida');
      return;
    }

    onLogin(usuario);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-white">SCEA</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Sistema CAUAE
            </h1>
            <p className="text-blue-100 text-sm">
              Controle de Experimentação Animal
            </p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="matricula"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Matrícula
                </label>
                <div className="relative">
                  <UserIcon
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="matricula"
                    type="text"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Digite sua matrícula"
                    required
                    aria-describedby={error ? 'login-error' : undefined}
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="senha"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full pl-11 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Digite sua senha"
                    required
                    aria-describedby={error ? 'login-error' : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  id="login-error"
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
                  role="alert"
                >
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                Entrar no Sistema
              </button>
            </form>

            {/* Demo users info */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3 font-medium">
                Usuários de demonstração (senha = matrícula):
              </p>
              <div className="space-y-2">
                {usuarios.map((u) => (
                  <button
                    key={u.matricula}
                    onClick={() => {
                      setMatricula(u.matricula);
                      setSenha(u.matricula);
                    }}
                    className="w-full text-left text-xs px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <span className="font-medium text-slate-700">{u.matricula}</span> - {u.nome} ({u.role})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Universidade Federal de Mato Grosso do Sul
        </p>
      </div>
    </div>
  );
}
