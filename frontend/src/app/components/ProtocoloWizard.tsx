import { useState } from 'react';
import { Protocolo, AlocacaoAnimal } from '../App';
import { ChevronLeft, ChevronRight, Calendar, FileText, Beaker, Check, AlertCircle } from 'lucide-react';
import { DatePicker } from './DatePicker';
import { isFeriado, isWeekend, validateDataRange } from '../utils/dateValidation';

interface ProtocoloWizardProps {
  onSubmit: (protocolo: Omit<Protocolo, 'id' | 'docenteId' | 'docenteNome' | 'estado' | 'dataCriacao'>) => void;
  onCancel: () => void;
}

const ESPECIES = ['Ratos', 'Camundongos', 'Coelhos', 'Macacos', 'Ovelhas', 'Cobras'];
const BIOTERIOS = ['Biotério da Medicina', 'Biotério da Farmácia', 'Biotério da Química'];

export function ProtocoloWizard({ onSubmit, onCancel }: ProtocoloWizardProps) {
  const [step, setStep] = useState(1);

  // Passo 1: Textos
  const [justificativa, setJustificativa] = useState('');
  const [resumoPt, setResumoPt] = useState('');
  const [resumoEn, setResumoEn] = useState('');

  // Passo 2: Datas
  const [dataInicio, setDataInicio] = useState<Date | null>(null);
  const [dataTermino, setDataTermino] = useState<Date | null>(null);
  const [dateError, setDateError] = useState('');

  // Passo 3: Alocações
  const [alocacoes, setAlocacoes] = useState<AlocacaoAnimal[]>([]);
  const [especie, setEspecie] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [bioterio, setBioterio] = useState('');

  const validateStep1 = () => {
    return justificativa.trim().length >= 50 &&
           resumoPt.trim().length >= 50 &&
           resumoEn.trim().length >= 50;
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

  const validateStep3 = () => {
    return alocacoes.length > 0;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleAddAlocacao = () => {
    if (!especie || !quantidade || !bioterio) return;

    const novaAlocacao: AlocacaoAnimal = {
      id: `aloc-${Date.now()}`,
      especie,
      quantidade: parseInt(quantidade, 10),
      bioterio,
    };

    setAlocacoes([...alocacoes, novaAlocacao]);
    setEspecie('');
    setQuantidade('');
    setBioterio('');
  };

  const handleRemoveAlocacao = (id: string) => {
    setAlocacoes(alocacoes.filter(a => a.id !== id));
  };

  const handleSubmit = () => {
    if (!validateStep3() || !dataInicio || !dataTermino) return;

    onSubmit({
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
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Novo Protocolo de Experimentação</h2>
          <p className="text-blue-100 text-sm">Preencha as informações do protocolo seguindo as etapas abaixo</p>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => {
              const Icon = s.icon;
              const isActive = step === s.number;
              const isCompleted = step > s.number;

              return (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? 'bg-green-600 border-green-600 text-white'
                          : isActive
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-slate-300 text-slate-400'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" aria-hidden="true" />
                      ) : (
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      )}
                    </div>
                    <div className="mt-2 text-center">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-slate-600'}`}>
                        {s.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-300 mx-4 mb-8" aria-hidden="true" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 py-8">
          {step === 1 && (
            <div className="space-y-6" role="group" aria-labelledby="step1-title">
              <div>
                <h3 id="step1-title" className="text-lg font-bold text-slate-900 mb-4">
                  Passo 1: Textos do Protocolo
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Forneça as informações textuais do protocolo. Todos os campos são obrigatórios e devem ter no mínimo 50 caracteres.
                </p>
              </div>

              <div>
                <label htmlFor="justificativa" className="block text-sm font-medium text-slate-700 mb-2">
                  Justificativa Científica <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="justificativa"
                  value={justificativa}
                  onChange={(e) => setJustificativa(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva a justificativa científica do uso de animais neste experimento..."
                  required
                  aria-describedby="justificativa-help"
                />
                <p id="justificativa-help" className="text-xs text-slate-500 mt-1">
                  {justificativa.length}/50 caracteres mínimos
                </p>
              </div>

              <div>
                <label htmlFor="resumo-pt" className="block text-sm font-medium text-slate-700 mb-2">
                  Resumo do Projeto (Português) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="resumo-pt"
                  value={resumoPt}
                  onChange={(e) => setResumoPt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Resumo do projeto em português..."
                  required
                  aria-describedby="resumo-pt-help"
                />
                <p id="resumo-pt-help" className="text-xs text-slate-500 mt-1">
                  {resumoPt.length}/50 caracteres mínimos
                </p>
              </div>

              <div>
                <label htmlFor="resumo-en" className="block text-sm font-medium text-slate-700 mb-2">
                  Abstract (English) <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="resumo-en"
                  value={resumoEn}
                  onChange={(e) => setResumoEn(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Project abstract in English..."
                  required
                  aria-describedby="resumo-en-help"
                />
                <p id="resumo-en-help" className="text-xs text-slate-500 mt-1">
                  {resumoEn.length}/50 minimum characters
                </p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6" role="group" aria-labelledby="step2-title">
              <div>
                <h3 id="step2-title" className="text-lg font-bold text-slate-900 mb-4">
                  Passo 2: Cronograma do Experimento
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Selecione as datas de início e término do experimento. As datas não podem cair em finais de semana ou feriados nacionais.
                </p>
              </div>

              {dateError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3" role="alert">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Erro nas datas</p>
                    <p className="text-sm text-red-700 mt-1">{dateError}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="data-inicio" className="block text-sm font-medium text-slate-700 mb-2">
                    Data de Início <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="data-inicio"
                    selected={dataInicio}
                    onChange={(date) => {
                      setDataInicio(date);
                      setDateError('');
                    }}
                    placeholderText="Selecione a data"
                  />
                </div>

                <div>
                  <label htmlFor="data-termino" className="block text-sm font-medium text-slate-700 mb-2">
                    Data de Término <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="data-termino"
                    selected={dataTermino}
                    onChange={(date) => {
                      setDataTermino(date);
                      setDateError('');
                    }}
                    placeholderText="Selecione a data"
                    minDate={dataInicio || undefined}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-medium mb-2">Restrições de Data:</p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>As datas não podem cair em sábados ou domingos</li>
                  <li>As datas não podem coincidir com feriados nacionais</li>
                  <li>A data de início deve ser anterior à data de término</li>
                  <li>Experimentos requerem suporte veterinário integral</li>
                </ul>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6" role="group" aria-labelledby="step3-title">
              <div>
                <h3 id="step3-title" className="text-lg font-bold text-slate-900 mb-4">
                  Passo 3: Alocação de Animais
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Especifique os animais necessários para o experimento. Você pode adicionar múltiplas espécies de diferentes biotérios.
                </p>
              </div>

              {/* Formulário de Adição */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h4 className="text-sm font-medium text-slate-900 mb-4">Adicionar Animais</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="especie" className="block text-sm font-medium text-slate-700 mb-2">
                      Espécie
                    </label>
                    <select
                      id="especie"
                      value={especie}
                      onChange={(e) => setEspecie(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      {ESPECIES.map((e) => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantidade" className="block text-sm font-medium text-slate-700 mb-2">
                      Quantidade
                    </label>
                    <input
                      type="number"
                      id="quantidade"
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label htmlFor="bioterio" className="block text-sm font-medium text-slate-700 mb-2">
                      Biotério
                    </label>
                    <select
                      id="bioterio"
                      value={bioterio}
                      onChange={(e) => setBioterio(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      {BIOTERIOS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddAlocacao}
                  disabled={!especie || !quantidade || !bioterio}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar à Lista
                </button>
              </div>

              {/* Lista de Alocações */}
              {alocacoes.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Animais Alocados</h4>
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Espécie
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Quantidade
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Biotério
                          </th>
                          <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {alocacoes.map((aloc) => (
                          <tr key={aloc.id}>
                            <td className="px-4 py-3 text-sm text-slate-900">{aloc.especie}</td>
                            <td className="px-4 py-3 text-sm text-slate-900">{aloc.quantidade}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{aloc.bioterio}</td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => handleRemoveAlocacao(aloc.id)}
                                className="text-sm text-red-600 hover:text-red-700 font-medium focus:outline-none focus:underline"
                              >
                                Remover
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    Adicione pelo menos uma alocação de animais para continuar.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={handlePreviousStep}
                className="flex items-center gap-2 px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Anterior</span>
              </button>
            )}

            {step < 3 ? (
              <button
                onClick={handleNextStep}
                disabled={step === 1 && !validateStep1()}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep3()}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Submeter Protocolo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
