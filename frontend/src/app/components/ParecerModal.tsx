import { useState } from 'react';
import { Protocolo } from '../App';
import { X, CheckCircle, XCircle } from 'lucide-react';

interface ParecerModalProps {
  protocolo: Protocolo;
  onClose: () => void;
  onSubmit: (texto: string, decisao: 'uso_recomendado' | 'uso_nao_recomendado') => void;
}

export function ParecerModal({ protocolo, onClose, onSubmit }: ParecerModalProps) {
  const [texto, setTexto] = useState('');
  const [decisao, setDecisao] = useState<'uso_recomendado' | 'uso_nao_recomendado' | ''>('');

  const handleSubmit = () => {
    if (!texto.trim() || !decisao) return;
    onSubmit(texto, decisao);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      role="dialog"
      aria-labelledby="parecer-modal-title"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 id="parecer-modal-title" className="text-xl font-bold text-slate-900">
            Emitir Parecer Técnico
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1"
            aria-label="Fechar"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>

        {/* Informações do Protocolo */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Protocolo</p>
              <p className="text-slate-900">{protocolo.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pesquisador</p>
              <p className="text-slate-900">{protocolo.docenteNome}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium text-slate-500 mb-1">Justificativa</p>
            <p className="text-sm text-slate-700 line-clamp-3">{protocolo.justificativa}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Resumo (PT)</p>
              <p className="text-sm text-slate-700 line-clamp-2">{protocolo.resumoPt}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Abstract (EN)</p>
              <p className="text-sm text-slate-700 line-clamp-2">{protocolo.resumoEn}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 mb-2">Animais Alocados</p>
            <div className="space-y-1">
              {protocolo.alocacoes.map((a) => (
                <p key={a.id} className="text-sm text-slate-700">
                  • {a.quantidade} {a.especie} - {a.bioterio}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Formulário de Parecer */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="texto-parecer" className="block text-sm font-medium text-slate-700 mb-2">
              Parecer Técnico <span className="text-red-500">*</span>
            </label>
            <textarea
              id="texto-parecer"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Descreva sua análise técnica e ética do protocolo..."
              required
              aria-describedby="parecer-help"
            />
            <p id="parecer-help" className="text-xs text-slate-500 mt-1">
              Mínimo 50 caracteres - {texto.length}/50
            </p>
          </div>

          <div>
            <p className="block text-sm font-medium text-slate-700 mb-3">
              Decisão do Parecer <span className="text-red-500">*</span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDecisao('uso_recomendado')}
                className={`px-6 py-4 rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  decisao === 'uso_recomendado'
                    ? 'border-green-600 bg-green-50 text-green-900 ring-2 ring-green-600'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-green-400'
                }`}
                aria-pressed={decisao === 'uso_recomendado'}
              >
                <CheckCircle className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                <span className="block text-center">Uso Recomendado</span>
              </button>

              <button
                type="button"
                onClick={() => setDecisao('uso_nao_recomendado')}
                className={`px-6 py-4 rounded-lg border-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  decisao === 'uso_nao_recomendado'
                    ? 'border-red-600 bg-red-50 text-red-900 ring-2 ring-red-600'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-red-400'
                }`}
                aria-pressed={decisao === 'uso_nao_recomendado'}
              >
                <XCircle className="w-6 h-6 mx-auto mb-2" aria-hidden="true" />
                <span className="block text-center">Uso Não Recomendado</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!texto.trim() || texto.length < 50 || !decisao}
            className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submeter Parecer
          </button>
        </div>
      </div>
    </div>
  );
}
