import { useState, useEffect } from 'react';
import { Protocolo, AlocacaoAnimal } from '../App';
import { ChevronLeft, ChevronRight, Calendar, FileText, Beaker, Check, AlertCircle, Info, Loader2 } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { validateDataRange } from '../utils/dateValidation';
import api, { Especie, Bioterio } from '../utils/api';

interface ProtocoloWizardProps {
  onSubmit: (protocolo: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>) => Promise<void>;
  onCancel: () => void;
}

export function ProtocoloWizard({ onSubmit, onCancel }: ProtocoloWizardProps) {
  const [step, setStep] = useState(1);
  const [especiesList, setEspeciesList] = useState<Especie[]>([]);
  const [bioteriosList, setBioteriosList] = useState<Bioterio[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Passo 1: Textos
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [resumoPt, setResumoPt] = useState('');
  const [resumoEn, setResumoEn] = useState('');
  const [errorsStep1, setErrorsStep1] = useState<Record<string, string>>({});

  // Passo 2: Datas
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataTermino, setDataTermino] = useState<Date | null>(null);
  const [dateError, setDateError] = useState('');

  // Passo 3: Alocações
  const [alocacoes, setAlocacoes] = useState<AlocacaoAnimal[]>([]);
  const [especieId, setEspecieId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [bioterioId, setBioterioId] = useState('');

  useEffect(() => {
    // Carregar e filtrar apenas recursos ATIVOS
    api.fetchEspecies().then(list => setEspeciesList(list.filter(e => e.ativo)));
    api.fetchBioterios().then(list => setBioteriosList(list.filter(b => b.ativo)));
  }, []);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (titulo.trim().length < 5) newErrors.titulo = 'O título deve ter pelo menos 5 caracteres';
    if (objetivo.trim().length < 10) newErrors.objetivo = 'O objetivo deve ter pelo menos 10 caracteres';
    if (justificativa.trim().length < 10) newErrors.justificativa = 'A justificativa deve ter pelo menos 10 caracteres';
    if (resumoPt.trim().length < 10) newErrors.resumoPt = 'O resumo em português é obrigatório';
    
    setErrorsStep1(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (!dataInicio || !dataTermino) {
      setDateError('Selecione as datas de início e término');
      return false;
    }
    const validation = validateDataRange(dataInicio, dataTermino);
    if (!validation.isValid) {
      setDateError(validation.error || 'Datas inválidas');
      return false;
    }
    setDateError('');
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
        if (validateStep1()) setStep(2);
    } else if (step === 2) {
        if (validateStep2()) setStep(3);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddAlocacao = () => {
    if (!especieId || !quantidade || !bioterioId) return;
    
    const esp = especiesList.find(e => e.id === especieId);
    const bio = bioteriosList.find(b => b.id === bioterioId);

    const novaAlocacao: AlocacaoAnimal = {
      id: `aloc-${Date.now()}`,
      especie: esp?.nome || especieId,
      especieId: especieId,
      quantidade: parseInt(quantidade, 10),
      bioterio: bio?.nome || bioterioId,
      bioterioId: bioterioId
    };

    setAlocacoes([...alocacoes, novaAlocacao]);
    setEspecieId('');
    setQuantidade('');
    setBioterioId('');
  };

  const handleRemoveAlocacao = (id: string) => {
    setAlocacoes(alocacoes.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    if (alocacoes.length === 0) {
        alert('Adicione pelo menos uma alocação de animais.');
        return;
    }
    if (!dataInicio || !dataTermino) return;

    setIsSubmitting(true);
    try {
        await onSubmit({
            titulo,
            objetivo,
            justificativa,
            resumoPt,
            resumoEn,
            dataInicio: dataInicio.toISOString(),
            dataTermino: dataTermino.toISOString(),
            alocacoes,
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Textos', icon: FileText, description: 'Justificativa e resumos' },
    { number: 2, title: 'Cronograma', icon: Calendar, description: 'Período do experimento' },
    { number: 3, title: 'Alocação', icon: Beaker, description: 'Animais e biotérios' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 animate-in fade-in duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-8 text-white rounded-t-3xl">
          <h2 className="text-3xl font-black mb-2 tracking-tight">Novo Protocolo</h2>
          <p className="text-blue-100 text-sm flex items-center gap-2">
            <Info className="w-4 h-4" /> 
            Preencha todos os campos obrigatórios para submeter à CEUA.
          </p>
        </div>

        {/* Stepper Progress */}
        <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              return (
                <div key={s.number} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-100' : isActive ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-white border-slate-200 text-slate-400'
                      }`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>{s.title}</span>
                  </div>
                  {index < steps.length - 1 && <div className={`h-1 flex-1 mx-4 -mt-4 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-10">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Título do Projeto <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={titulo} 
                    onChange={(e) => setTitulo(e.target.value)} 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errorsStep1.titulo ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100'}`}
                    placeholder="Ex: Estudo da eficácia de novo composto..." 
                />
                {errorsStep1.titulo && <p className="text-red-500 text-xs mt-1 font-medium">{errorsStep1.titulo}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Objetivo <span className="text-red-500">*</span></label>
                    <textarea 
                        value={objetivo} 
                        onChange={(e) => setObjetivo(e.target.value)} 
                        rows={4} 
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errorsStep1.objetivo ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100'}`}
                        placeholder="Quais os resultados esperados?" 
                    />
                    {errorsStep1.objetivo && <p className="text-red-500 text-xs mt-1 font-medium">{errorsStep1.objetivo}</p>}
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Justificativa Científica <span className="text-red-500">*</span></label>
                    <textarea 
                        value={justificativa} 
                        onChange={(e) => setJustificativa(e.target.value)} 
                        rows={4} 
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errorsStep1.justificativa ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100'}`}
                        placeholder="Por que este experimento é necessário?" 
                    />
                    {errorsStep1.justificativa && <p className="text-red-500 text-xs mt-1 font-medium">{errorsStep1.justificativa}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumo (PT) <span className="text-red-500">*</span></label>
                  <textarea 
                    value={resumoPt} 
                    onChange={(e) => setResumoPt(e.target.value)} 
                    rows={4} 
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 transition-all ${errorsStep1.resumoPt ? 'border-red-300 bg-red-50 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-100'}`}
                  />
                  {errorsStep1.resumoPt && <p className="text-red-500 text-xs mt-1 font-medium">{errorsStep1.resumoPt}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Resumo (EN)</label>
                  <textarea 
                    value={resumoEn} 
                    onChange={(e) => setResumoEn(e.target.value)} 
                    rows={4} 
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100" 
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 py-4">
              {dateError && (
                <div className="bg-red-50 border border-red-200 p-4 text-red-700 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-bold">{dateError}</p>
                </div>
              )}
              
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mb-6">
                 <p className="text-blue-800 text-sm font-medium leading-relaxed">
                    <strong>Regra CEUA:</strong> Experimentos não podem iniciar ou terminar em finais de semana ou feriados nacionais. O sistema validará automaticamente as datas selecionadas.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Data de Início Estimada
                  </label>
                  <div className="relative">
                    <DatePicker 
                        id="data-inicio" 
                        selected={dataInicio} 
                        onChange={setDataInicio} 
                        placeholderText="Clique para selecionar..." 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-600" />
                    Data de Término Estimada
                  </label>
                  <div className="relative">
                    <DatePicker 
                        id="data-termino" 
                        selected={dataTermino} 
                        onChange={setDataTermino} 
                        placeholderText="Clique para selecionar..." 
                        minDate={dataInicio || undefined} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner">
                <h4 className="font-bold text-slate-800 mb-6 uppercase text-xs tracking-widest">Adicionar Grupo de Animais</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Espécie</label>
                    <select value={especieId} onChange={(e) => setEspecieId(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-100">
                      <option value="">Selecione...</option>
                      {especiesList.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Quantidade</label>
                    <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Biotério</label>
                    <select value={bioterioId} onChange={(e) => setBioterioId(e.target.value)} className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-100">
                      <option value="">Selecione...</option>
                      {bioteriosList.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                    </select>
                  </div>
                </div>
                <button 
                    onClick={handleAddAlocacao} 
                    disabled={!especieId || !quantidade || !bioterioId || isSubmitting}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 transition-all disabled:opacity-50"
                >
                    + Adicionar à Lista de Alocação
                </button>
              </div>

              {alocacoes.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-8">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-[10px] uppercase text-slate-500 font-black tracking-widest border-b">
                      <tr><th className="px-6 py-4 text-left">Espécie</th><th className="px-6 py-4 text-left">Quantidade</th><th className="px-6 py-4 text-left">Biotério</th><th className="px-6 py-4"></th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {alocacoes.map(a => (
                        <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{a.especie}</td>
                            <td className="px-6 py-4 font-black text-blue-600">{a.quantidade}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{a.bioterio}</td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleRemoveAlocacao(a.id)} 
                                    disabled={isSubmitting}
                                    className="text-red-500 hover:text-red-700 font-bold text-xs uppercase underline disabled:opacity-30"
                                >Remover</button>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button 
            onClick={onCancel} 
            disabled={isSubmitting}
            className="px-6 py-2 text-slate-500 font-bold hover:text-slate-800 transition-colors disabled:opacity-30"
          >Cancelar</button>
          <div className="flex gap-4">
            {step > 1 && (
                <button 
                    onClick={handlePreviousStep} 
                    disabled={isSubmitting}
                    className="px-8 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-2 disabled:opacity-30"
                >
                    <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
            )}
            {step < 3 ? (
                <button 
                    onClick={handleNextStep} 
                    disabled={isSubmitting}
                    className="px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    Próximo <ChevronRight className="w-4 h-4" />
                </button>
            ) : (
                <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="px-12 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-xl shadow-green-100 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Submetendo...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" /> 
                            Finalizar e Submeter
                        </>
                    )}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
