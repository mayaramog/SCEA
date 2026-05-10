import { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Save, CheckCircle, XCircle } from 'lucide-react';
import api, { UsuarioBackend } from '../utils/api';

export function AdminDashboard() {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create User Form
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Role Edit State
  const [editingUser, setSelectedUser] = useState<UsuarioBackend | null>(null);
  const [tempRoles, setTempRoles] = useState<string[]>([]);

  const AVAILABLE_ROLES = [
    { code: 'ROLE_ADMINISTRADOR', label: 'Administrador' },
    { code: 'ROLE_PRESIDENTE', label: 'Presidente' },
    { code: 'ROLE_SECRETARIA', label: 'Secretaria' },
    { code: 'ROLE_DOCENTE', label: 'Docente' },
    { code: 'ROLE_PARECERISTA', label: 'Parecerista' },
    { code: 'ROLE_MEMBRO_CEUA', label: 'Membro CEUA' }
  ];

  const loadUsuarios = async () => {
    try {
      const data = await api.fetchUsuarios();
      setUsuarios(data);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  const handleCreateUser = async () => {
    if (!nome || !email || !senha) return;
    try {
      await api.createUsuario({ nomeCompleto: nome, email, senha: senha });
      setShowCreateModal(false);
      setNome(''); setEmail(''); setSenha('');
      loadUsuarios();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const handleOpenRoles = (u: UsuarioBackend) => {
    setSelectedUser(u);
    // Ensure we are working with strings and upper case
    setTempRoles(u.papeis.map(p => typeof p === 'string' ? p.toUpperCase() : (p as any).codigo?.toUpperCase()));
  };

  const toggleRole = (role: string) => {
    const roleUpper = role.toUpperCase();
    if (tempRoles.includes(roleUpper)) {
      setTempRoles(tempRoles.filter(r => r !== roleUpper));
    } else {
      setTempRoles([...tempRoles, roleUpper]);
    }
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    try {
      await api.updateUsuarioPapeis(editingUser.id, tempRoles);
      setSelectedUser(null);
      loadUsuarios();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const formatRole = (p: any): string => {
    if (typeof p === 'string') {
        return p.replace('ROLE_', '');
    }
    return (p.codigo || 'UNKNOWN').replace('ROLE_', '');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestão do Sistema</h1>
          <p className="text-slate-500 mt-1">Administração de usuários, acessos e permissões</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg"
        >
          <UserPlus className="w-5 h-5" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b bg-slate-50 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            <h2 className="font-bold text-slate-700">Usuários Cadastrados</h2>
        </div>
        
        {loading ? (
            <div className="p-12 text-center text-slate-400">Carregando usuários...</div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4 text-left">Nome</th>
                            <th className="px-6 py-4 text-left">E-mail</th>
                            <th className="px-6 py-4 text-left">Papéis Atuais</th>
                            <th className="px-6 py-4 text-left">Status</th>
                            <th className="px-6 py-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {usuarios.map(u => (
                            <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-slate-900">{u.nomeCompleto}</td>
                                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {u.papeis.map((p, idx) => (
                                            <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100">
                                                {formatRole(p)}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {u.estaAtivo ? (
                                        <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                            <CheckCircle className="w-3 h-3" /> Ativo
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
                                            <XCircle className="w-3 h-3" /> Inativo
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button 
                                        onClick={() => handleOpenRoles(u)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1 ml-auto"
                                    >
                                        <Shield className="w-4 h-4" /> Alterar Papéis
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>

      {/* Modal Criar Usuário */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-6">Cadastrar Novo Usuário</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome Completo</label>
                    <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full border rounded-lg p-3" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">E-mail</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded-lg p-3" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Senha Provisória</label>
                    <input type="password" value={senha} onChange={e => setSenha(e.target.value)} className="w-full border rounded-lg p-3" />
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded-lg font-bold">Cancelar</button>
              <button onClick={handleCreateUser} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold">Criar Conta</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Papéis */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8">
                <h3 className="text-xl font-bold mb-2">Permissões de Acesso</h3>
                <p className="text-slate-500 mb-6 italic">{editingUser.nomeCompleto}</p>
                
                <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_ROLES.map(role => (
                        <button
                            key={role.code}
                            onClick={() => toggleRole(role.code)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${
                                tempRoles.includes(role.code.toUpperCase()) 
                                ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm' 
                                : 'border-slate-100 hover:border-slate-200 text-slate-600'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-sm">{role.label}</span>
                                {tempRoles.includes(role.code.toUpperCase()) && <CheckCircle className="w-4 h-4 text-blue-600" />}
                            </div>
                            <p className="text-[10px] mt-1 opacity-70">{role.code}</p>
                        </button>
                    ))}
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
                    <button onClick={() => setSelectedUser(null)} className="px-4 py-2 font-bold text-slate-500">Cancelar</button>
                    <button 
                        onClick={handleSaveRoles}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" /> Salvar Alterações
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
