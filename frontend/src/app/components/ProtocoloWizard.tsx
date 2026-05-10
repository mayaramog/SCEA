import { useState, useEffect } from 'react';
import { Protocolo, AlocacaoAnimal } from '../App';
import { ChevronLeft, ChevronRight, Calendar, FileText, Beaker, Check, AlertCircle } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { validateDataRange } from '../utils/dateValidation';
import api, { Especie, Bioterio } from '../utils/api';

interface ProtocoloWizardProps {
  onSubmit: (protocolo: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>) => void;
  onCancel: () => void;
}

export function ProtocoloWizard({ onSubmit, onCancel }: ProtocoloWizardProps) {
  const [step, setStep] = useState(1);
  const [especiesList, setEspeciesList] = useState<Especie[]>([]);
  const [bioteriosList, setBioteriosList] = useState<Bioterio[]>([]);

  // Passo 1: Textos
  const [titulo, setTitulo] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [justificativa, setJustificativa] = useState('');
  const [resumoPt, setResumoPt] = useState('');
  const [resumoEn, setResumoEn] = useState('');

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
    api.fetchEspecies().then(setEspeciesList);
    api.fetchBioterios().then(setBioteriosList);
  }, []);

  const validateStep1 = () => {
    return titulo.trim().length >= 5 &&
           justificativa.trim().length >= 10 &&
           resumoPt.trim().length >= 10;
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
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep(step + 1);
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleAddAlocacao = () => {
    if (!especieId || !quantidade || !bioterioId) return;
    
    const esp = especiesList.find(e => e.id === especieId);
    const bio = bioteriosList.find(b => b.id === bioterioId);

    const novaAlocacao: AlocacaoAnimal & { especieId: string, bioterioId: string } = {
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

  const handleSubmit = () => {
    if (alocacoes.length === 0 || !dataInicio || !dataTermino) return;

    onSubmit({
      titulo,
      objetivo,
      justificativa,
      resumoPt,
      resumoEn,
      dataInicio: dataInicio.toISOString(),
      dataTermino: dataTermino.toISOString(),
      alocacoes,
    });
  };

  const steps = [
    { number: 1, title: 'Textos', icon: FileText, description: 'Justificativa e resumos' },
    { number: 2, title: 'Cronograma', icon: Calendar, description: 'Período do experimento' },
    { number: 3, title: 'Alocação', icon: Beaker, description: 'Animais e biotérios' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Novo Protocolo de Experimentação</h2>
          <p className="text-blue-100 text-sm">Preencha as informações do protocolo seguindo as etapas abaixo</p>
        </div>

        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;
              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted ? 'bg-green-600 border-green-600 text-white' : isActive ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                      }`}>
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>{s.title}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-slate-300 mx-4 mb-8" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Título do Projeto</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="Título completo..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Objetivo</label>
                <textarea value={objetivo} onChange={(e) => setObjetivo(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="Objetivo do experimento..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Justificativa Científica</label>
                <textarea value={justificativa} onChange={(e) => setJustificativa(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="Por que usar animais?..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resumo (PT)</label>
                  <textarea value={resumoPt} onChange={(e) => setResumoPt(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="Resumo em português..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resumo (EN)</label>
                  <textarea value={resumoEn} onChange={(e) => setResumoEn(e.target.value)} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-lg" placeholder="Abstract in english..." />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {dateError && <div className="bg-red-50 border border-red-200 p-4 text-red-700 rounded-lg">{dateError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data de Início</label>
                  <DatePicker id="data-inicio" selected={dataInicio} onChange={setDataInicio} placeholderText="Selecione..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data de Término</label>
                  <DatePicker id="data-termino" selected={dataTermino} onChange={setDataTermino} placeholderText="Selecione..." minDate={dataInicio || undefined} />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Espécie</label>
                    <select value={especieId} onChange={(e) => setEspecieId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                      <option value="">Selecione...</option>
                      {especiesList.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Quantidade</label>
                    <input type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Biotério</label>
                    <select value={bioterioId} onChange={(e) => setBioterioId(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                      <option value="">Selecione...</option>
                      {bioteriosList.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={handleAddAlocacao} className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium">Adicionar</button>
              </div>

              {alocacoes.length > 0 && (
                <div className="bg-white border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr><th className="px-4 py-2 text-left">Espécie</th><th className="px-4 py-2 text-left">Quantidade</th><th className="px-4 py-2 text-left">Biotério</th><th className="px-4 py-2"></th></tr>
                    </thead>
                    <tbody className="divide-y">
                      {alocacoes.map(a => (
                        <tr key={a.id}><td className="px-4 py-3">{a.especie}</td><td className="px-4 py-3">{a.quantidade}</td><td className="px-4 py-3">{a.bioterio}</td><td className="px-4 py-3"><button onClick={() => handleRemoveAlocacao(a.id)} className="text-red-600">Remover</button></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t flex justify-between">
          <button onClick={onCancel} className="px-6 py-2 border rounded-lg">Cancelar</button>
          <div className="flex gap-3">
            {step > 1 && <button onClick={handlePreviousStep} className="px-6 py-2 border rounded-lg">Anterior</button>}
            {step < 3 ? <button onClick={handleNextStep} className="px-6 py-2 bg-blue-600 text-white rounded-lg">Próximo</button> : <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded-lg">Submeter</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
