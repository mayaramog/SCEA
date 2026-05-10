import { useState } from 'react';
import { Protocolo } from '../App';
import { X, CheckCircle, XCircle, FileText, ShieldCheck, Calendar, Beaker, Users } from 'lucide-react';

interface ParecerModalProps {
  protocolo: Protocolo;
  onClose: () => void;
  onSubmit: (resumoTecnico: string, consideracoesEticas: string, decisao: 'uso_recomendado' | 'uso_nao_recomendado') => void;
}

export function ParecerModal({ protocolo, onClose, onSubmit }: ParecerModalProps) {
  const [resumoTecnico, setResumoTecnico] = useState('');
  const [consideracoesEticas, setConsideracoesEticas] = useState('');
  const [decisao, setDecisao] = useState<'uso_recomendado' | 'uso_nao_recomendado' | ''>('');

  const handleSubmit = () => {
    if (!resumoTecnico.trim() || !consideracoesEticas.trim() || !decisao) return;
    onSubmit(resumoTecnico, consideracoesEticas, decisao);
  };

  const isFormValid = resumoTecnico.length >= 20 && consideracoesEticas.length >= 20 && decisao !== '';

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full overflow-hidden animate-in zoom-in duration-300 my-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Avaliação Técnica e Ética</h3>
            <p className="text-orange-100 text-sm">Protocolo: {protocolo.id.substring(0,8)}... | Pesquisador: {protocolo.docenteNome}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
          
          {/* COLUNA DA ESQUERDA: DADOS DO PROTOCOLO (LEITURA) */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-orange-500" />
                    Detalhes do Projeto
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-slate-400 font-bold uppercase text-[10px]">Título do Projeto</span>
                        <p className="text-slate-900 font-bold text-sm leading-tight">{protocolo.titulo || 'Sem título'}</p>
                    </div>
                    <div>
                        <span className="block text-slate-400 font-bold uppercase text-[10px]">Data de Submissão</span>
                        <p className="text-slate-900 font-medium text-sm">{new Date(protocolo.dataCriacao).toLocaleDateString('pt-BR')}</p>
                    </div>
                </div>

                <div>
                    <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Objetivo Geral</span>
                    <p className="text-slate-700 text-xs bg-white p-3 rounded-lg border border-slate-100">{protocolo.resumoPt}</p>
                </div>

                <div>
                    <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Justificativa Científica</span>
                    <p className="text-slate-700 text-xs italic">"{protocolo.justificativa}"</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                            <span className="block text-slate-400 font-bold uppercase text-[10px]">Início</span>
                            <p className="text-slate-900 font-bold text-xs">{new Date(protocolo.dataInicio).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                    <div className="flex-1 bg-white p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-500" />
                        <div>
                            <span className="block text-slate-400 font-bold uppercase text-[10px]">Término</span>
                            <p className="text-slate-900 font-bold text-xs">{new Date(protocolo.dataTermino).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                    <Beaker className="w-5 h-5 text-purple-500" />
                    Animais e Alocação
                </h4>
                <div className="space-y-3">
                    {protocolo.alocacoes.map(aloc => (
                        <div key={aloc.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{aloc.especie}</p>
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{aloc.bioterio}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-purple-700">{aloc.quantidade}</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase">Unidades</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA: FORMULÁRIO DO PARECERISTA (ESCRITA) */}
          <div className="space-y-6">
              <div className="space-y-4">
                <label className="block">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        1. Análise Técnica e Desenho Experimental <span className="text-red-500">*</span>
                    </span>
                    <textarea
                        value={resumoTecnico}
                        onChange={(e) => setResumoTecnico(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        placeholder="Avalie o mérito científico, metodologia e o desenho experimental proposto..."
                    />
                </label>

                <label className="block">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        2. Considerações Éticas (Bem-estar e 3Rs) <span className="text-red-500">*</span>
                    </span>
                    <textarea
                        value={consideracoesEticas}
                        onChange={(e) => setConsideracoesEticas(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        placeholder="Avalie o sofrimento animal, analgesia, eutanásia e aplicação dos 3Rs..."
                    />
                </label>
              </div>

              <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
                <p className="text-sm font-bold text-orange-800 mb-4 text-center">Decisão Recomendada</p>
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                    <button
                        type="button"
                        onClick={() => setDecisao('uso_recomendado')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        decisao === 'uso_recomendado'
                            ? 'border-green-600 bg-green-50 text-green-900 shadow-md ring-2 ring-green-600'
                            : 'border-white bg-white text-slate-400 hover:border-green-200'
                        }`}
                    >
                        <CheckCircle className={`w-8 h-8 ${decisao === 'uso_recomendado' ? 'text-green-600' : 'text-slate-200'}`} />
                        <span className="font-bold text-xs">Uso Recomendado</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setDecisao('uso_nao_recomendado')}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        decisao === 'uso_nao_recomendado'
                            ? 'border-red-600 bg-red-50 text-red-900 shadow-md ring-2 ring-red-600'
                            : 'border-white bg-white text-slate-400 hover:border-red-200'
                        }`}
                    >
                        <XCircle className={`w-8 h-8 ${decisao === 'uso_nao_recomendado' ? 'text-red-600' : 'text-slate-200'}`} />
                        <span className="font-bold text-xs">Não Recomendado</span>
                    </button>
                </div>
              </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-6 flex gap-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
          >
            Voltar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-[2] bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-30 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            Enviar Avaliação Final
          </button>
        </div>
      </div>
    </div>
  );
}
