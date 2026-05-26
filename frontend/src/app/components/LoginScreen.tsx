import { useState } from 'react';
import { User } from '../App';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { user } = await api.login(email, senha);
      onLogin(user);
    } catch (err: any) {
      // Map common network/fetch errors to a clearer message for the user
      const msg: string = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || err instanceof TypeError) {
        setError('Não foi possível comunicar-se com o API Gateway. Verifique sua conexão e tente novamente.');
      } else {
        setError(msg || 'Falha na autenticação. Verifique suas credenciais.');
      }
    } finally {
      setLoading(false);
    }
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
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  E-mail
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                    placeholder="Digite seu e-mail"
                    required
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
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" role="alert">
                  <p className="font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar no Sistema'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Universidade Federal de Mato Grosso do Sul
        </p>
      </div>
    </div>
  );
}
