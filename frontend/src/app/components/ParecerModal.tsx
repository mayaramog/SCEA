import { useState } from 'react';
import { Protocolo } from '../App';
import { X, CheckCircle, XCircle, FileText, ShieldCheck } from 'lucide-react';

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
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in duration-300 my-8">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6 text-white flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold">Emitir Parecer Técnico/Ético</h3>
            <p className="text-orange-100 text-sm">Protocolo: {protocolo.id.substring(0,8)}...</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Resumo do Protocolo */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
             <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-500" />
                Resumo para Avaliação
             </h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                    <span className="block text-slate-500 font-bold uppercase text-[10px]">Título</span>
                    <p className="text-slate-900 font-medium">{protocolo.titulo || 'Sem título'}</p>
                </div>
                <div>
                    <span className="block text-slate-500 font-bold uppercase text-[10px]">Pesquisador</span>
                    <p className="text-slate-900 font-medium">{protocolo.docenteNome}</p>
                </div>
                <div className="md:col-span-2">
                    <span className="block text-slate-500 font-bold uppercase text-[10px]">Justificativa do Uso Animal</span>
                    <p className="text-slate-700 mt-1">{protocolo.justificativa}</p>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Coluna 1: Análise Técnica */}
              <div className="space-y-4">
                <label className="block">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        1. Análise Técnica <span className="text-red-500">*</span>
                    </span>
                    <textarea
                        value={resumoTecnico}
                        onChange={(e) => setResumoTecnico(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        placeholder="Descreva o mérito científico, metodologia e desenho experimental..."
                    />
                    <p className="text-[10px] text-slate-400 mt-1 text-right">{resumoTecnico.length}/20 min</p>
                </label>
              </div>

              {/* Coluna 2: Considerações Éticas */}
              <div className="space-y-4">
                <label className="block">
                    <span className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        2. Considerações Éticas <span className="text-red-500">*</span>
                    </span>
                    <textarea
                        value={consideracoesEticas}
                        onChange={(e) => setConsideracoesEticas(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm"
                        placeholder="Avalie o bem-estar animal, analgesia, eutanásia e os 3Rs..."
                    />
                    <p className="text-[10px] text-slate-400 mt-1 text-right">{consideracoesEticas.length}/20 min</p>
                </label>
              </div>
          </div>

          {/* Decisão Final do Parecerista */}
          <div>
            <p className="text-sm font-bold text-slate-700 mb-4 text-center">Decisão Recomendada ao Colegiado</p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                type="button"
                onClick={() => setDecisao('uso_recomendado')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  decisao === 'uso_recomendado'
                    ? 'border-green-600 bg-green-50 text-green-900 shadow-inner'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-green-200'
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
                    ? 'border-red-600 bg-red-50 text-red-900 shadow-inner'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-red-200'
                }`}
              >
                <XCircle className={`w-8 h-8 ${decisao === 'uso_nao_recomendado' ? 'text-red-600' : 'text-slate-200'}`} />
                <span className="font-bold text-xs">Não Recomendado</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 px-8 py-6 flex gap-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-slate-600 font-bold hover:text-slate-900 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transition-all disabled:opacity-30"
          >
            Enviar Parecer Final
          </button>
        </div>
      </div>
    </div>
  );
}
