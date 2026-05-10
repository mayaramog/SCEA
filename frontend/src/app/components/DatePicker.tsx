import { Calendar as CalendarIcon } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { isFeriado, isWeekend } from '../utils/dateValidation';

interface DatePickerProps {
  id?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
}

export function DatePicker({ id, selected, onChange, placeholderText = 'Selecione uma data', minDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    return isWeekend(date) || isFeriado(date);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-left shadow-sm"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <CalendarIcon className="w-5 h-5 text-blue-500" aria-hidden="true" />
        <span className={selected ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}>
          {selected ? format(selected, 'dd/MM/yyyy', { locale: ptBR }) : placeholderText}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 min-w-[320px] left-0 md:left-auto md:right-0 lg:left-0 animate-in fade-in zoom-in duration-200">
          <DayPicker
            mode="single"
            selected={selected || undefined}
            onSelect={(date) => {
              onChange(date || null);
              setIsOpen(false);
            }}
            disabled={isDateDisabled}
            locale={ptBR}
            className="rdp-custom mx-auto"
            modifiers={{
              disabled: isDateDisabled,
            }}
            modifiersClassNames={{
              selected: 'bg-blue-600 text-white hover:bg-blue-700',
              disabled: 'opacity-40 cursor-not-allowed line-through',
              today: 'font-bold text-blue-600 underline',
            }}
          />
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-500 leading-tight">
              <span className="font-bold text-red-500 uppercase">Atenção:</span> Finais de semana e feriados estão bloqueados para seleção conforme normas da instituição.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
