import { useState, useEffect } from 'react';
import { UserPlus, Shield, Users, Save, CheckCircle, XCircle, Beaker, MapPin, Plus } from 'lucide-react';
import api, { UsuarioBackend, Especie, Bioterio } from '../utils/api';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'especies' | 'bioterios'>('users');
  
  // Data lists
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [bioterios, setBioterios] = useState<Bioterio[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateEspecie, setShowCreateEspecie] = useState(false);
  const [showCreateBioterio, setShowCreateBioterio] = useState(false);
  const [editingUser, setEditingUser] = useState<UsuarioBackend | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    nome: '', email: '', senha: '', 
    codigo: '', descricao: ''
  });

  const [tempRoles, setTempRoles] = useState<string[]>([]);

  const AVAILABLE_ROLES = [
    { code: 'ROLE_ADMINISTRADOR', label: 'Administrador' },
    { code: 'ROLE_PRESIDENTE', label: 'Presidente' },
    { code: 'ROLE_SECRETARIA', label: 'Secretaria' },
    { code: 'ROLE_DOCENTE', label: 'Docente' },
    { code: 'ROLE_PARECERISTA', label: 'Parecerista' },
    { code: 'ROLE_MEMBRO_CEUA', label: 'Membro CEUA' }
  ];

  const loadAll = async () => {
    setLoading(true);
    try {
      const [u, e, b] = await Promise.all([
        api.fetchUsuarios(),
        api.fetchEspecies(),
        api.fetchBioterios()
      ]);
      setUsuarios(u);
      setEspecies(e);
      setBioterios(b);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAll(); }, []);

  const handleCreateUser = async () => {
    try {
      await api.createUsuario({ nomeCompleto: formData.nome, email: formData.email, senha: formData.senha });
      setShowCreateUser(false);
      setFormData({ ...formData, nome: '', email: '', senha: '' });
      loadAll();
    } catch (e: any) { alert(e.message); }
  };

  const handleCreateEspecie = async () => {
    try {
      await api.createEspecie({ codigo: formData.codigo, nome: formData.nome });
      setShowCreateEspecie(false);
      setFormData({ ...formData, codigo: '', nome: '' });
      loadAll();
    } catch (e: any) { alert(e.message); }
  };

  const handleCreateBioterio = async () => {
    try {
      await api.createBioterio({ codigo: formData.codigo, nome: formData.nome, descricao: formData.descricao });
      setShowCreateBioterio(false);
      setFormData({ ...formData, codigo: '', nome: '', descricao: '' });
      loadAll();
    } catch (e: any) { alert(e.message); }
  };

  const handleOpenRoles = (u: UsuarioBackend) => {
    setEditingUser(u);
    setTempRoles(u.papeis.map(p => typeof p === 'string' ? p.toUpperCase() : (p as any).codigo?.toUpperCase()));
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    try {
      await api.updateUsuarioPapeis(editingUser.id, tempRoles);
      setEditingUser(null);
      loadAll();
    } catch (e: any) { alert(e.message); }
  };

  const formatRole = (p: any): string => {
    if (typeof p === 'string') return p.replace('ROLE_', '');
    return (p.codigo || 'UNKNOWN').replace('ROLE_', '');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Administração</h1>
          <p className="text-slate-500 font-medium">Controle central de recursos e acessos</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >USUÁRIOS</button>
            <button 
                onClick={() => setActiveTab('especies')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'especies' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >ESPÉCIES</button>
            <button 
                onClick={() => setActiveTab('bioterios')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'bioterios' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >BIOTÉRIOS</button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px]">
        {/* USERS TAB */}
        {activeTab === 'users' && (
            <>
                <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Gestão de Usuários</h2>
                    </div>
                    <button onClick={() => setShowCreateUser(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition-all">
                        <UserPlus className="w-4 h-4" /> Novo Usuário
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-tighter border-b">
                            <tr><th className="px-6 py-4 text-left">Nome</th><th className="px-6 py-4 text-left">E-mail</th><th className="px-6 py-4 text-left">Papéis</th><th className="px-6 py-4 text-right"></th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {usuarios.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{u.nomeCompleto}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {u.papeis.map((p, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black rounded border border-blue-100 uppercase">{formatRole(p)}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleOpenRoles(u)} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline flex items-center gap-1 ml-auto">
                                            <Shield className="w-3 h-3" /> Editar Acesso
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}

        {/* ESPECIES TAB */}
        {activeTab === 'especies' && (
            <>
                <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Beaker className="w-5 h-5 text-purple-600" />
                        <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Catálogo de Espécies</h2>
                    </div>
                    <button onClick={() => setShowCreateEspecie(true)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Nova Espécie
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {especies.map(e => (
                        <div key={e.id} className="p-4 border border-slate-200 rounded-2xl bg-white shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black text-purple-600 uppercase mb-1">{e.codigo}</p>
                                <p className="font-bold text-slate-900">{e.nome}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                    ))}
                </div>
            </>
        )}

        {/* BIOTERIOS TAB */}
        {activeTab === 'bioterios' && (
            <>
                <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <h2 className="font-black text-slate-800 uppercase text-sm tracking-widest">Gestão de Biotérios</h2>
                    </div>
                    <button onClick={() => setShowCreateBioterio(true)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Novo Biotério
                    </button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {bioterios.map(b => (
                        <div key={b.id} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm flex items-start gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-green-600 uppercase mb-1">{b.codigo}</p>
                                <h4 className="font-black text-slate-900">{b.nome}</h4>
                                <p className="text-xs text-slate-500 mt-1">Status: <span className="text-green-600 font-bold uppercase">Operacional</span></p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        )}
      </div>

      {/* MODAL: CREATE USER */}
      {showCreateUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-6 tracking-tight text-slate-900">Novo Usuário</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Nome Completo" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
                <input type="email" placeholder="E-mail Institucional" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
                <input type="password" placeholder="Senha Provisória" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreateUser(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-500">Cancelar</button>
              <button onClick={handleCreateUser} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg">Cadastrar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ESPECIE */}
      {showCreateEspecie && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-6 tracking-tight text-slate-900 text-purple-600">Nova Espécie</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Código (ex: RAT-01)" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
                <input type="text" placeholder="Nome Comum (ex: Ratos)" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreateEspecie(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-500">Cancelar</button>
              <button onClick={handleCreateEspecie} className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE BIOTERIO */}
      {showCreateBioterio && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-6 tracking-tight text-slate-900 text-green-600">Novo Biotério</h3>
            <div className="space-y-4">
                <input type="text" placeholder="Código (ex: BIO-A)" value={formData.codigo} onChange={e => setFormData({...formData, codigo: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
                <input type="text" placeholder="Nome (ex: Biotério Central)" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" />
                <textarea placeholder="Descrição/Localização" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full border rounded-xl p-3 bg-slate-50" rows={3} />
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowCreateBioterio(false)} className="flex-1 py-3 border rounded-xl font-bold text-slate-500">Cancelar</button>
              <button onClick={handleCreateBioterio} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ROLES */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-black mb-1 tracking-tight">Permissões</h3>
            <p className="text-slate-400 text-sm mb-8 font-medium italic">{editingUser.nomeCompleto}</p>
            <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_ROLES.map(role => (
                    <button
                        key={role.code}
                        onClick={() => {
                            const upper = role.code.toUpperCase();
                            setTempRoles(prev => prev.includes(upper) ? prev.filter(r => r !== upper) : [...prev, upper]);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                            tempRoles.includes(role.code.toUpperCase()) 
                            ? 'bg-blue-50 border-blue-600 text-blue-900' 
                            : 'border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                    >
                        <span className="font-bold text-xs uppercase tracking-wider">{role.label}</span>
                    </button>
                ))}
            </div>
            <div className="flex gap-3 mt-10">
                <button onClick={() => setEditingUser(null)} className="flex-1 py-3 border rounded-xl font-bold text-slate-400 uppercase text-xs tracking-widest">Cancelar</button>
                <button onClick={handleSaveRoles} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 uppercase text-xs tracking-widest">
                    <Save className="w-4 h-4" /> Salvar
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
