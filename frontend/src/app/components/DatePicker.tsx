import { Calendar as CalendarIcon } from 'lucide-react';
import { isFeriado, isWeekend } from '../utils/dateValidation';

interface DatePickerProps {
  id?: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  placeholderText?: string;
  minDate?: Date;
}

export function DatePicker({ id, selected, onChange, minDate }: DatePickerProps) {
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      onChange(null);
      return;
    }

    const date = new Date(value + 'T12:00:00'); // Use noon to avoid timezone shifts
    
    // Although the browser UI might allow selecting it, we validate here
    if (isWeekend(date) || isFeriado(date)) {
        // We let the component above handle the error message via validation
        // but we still update the state
    }
    
    onChange(date);
  };

  const formattedValue = selected ? selected.toISOString().split('T')[0] : '';
  const minDateStr = minDate ? minDate.toISOString().split('T')[0] : '';

  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <CalendarIcon className="w-5 h-5 text-blue-500" />
      </div>
      <input
        id={id}
        type="date"
        value={formattedValue}
        min={minDateStr}
        onChange={handleDateChange}
        className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 font-bold shadow-sm"
      />
    </div>
  );
}
