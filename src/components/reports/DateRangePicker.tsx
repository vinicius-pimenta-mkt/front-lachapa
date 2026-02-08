import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (dates: [Date, Date]) => void;
  presets?: {
    label: string;
    value: [Date, Date];
  }[];
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  startDate, 
  endDate, 
  onChange,
  presets = []
}) => {
  const [showCalendar, setShowCalendar] = React.useState(false);
  const calendarRef = React.useRef<HTMLDivElement>(null);

  // Formatar datas para exibição
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Fechar calendário quando clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Manipular seleção de datas
  // O tipo Value do react-calendar é Date | Date[] | null
  const handleDateChange = (value: any) => {
    if (Array.isArray(value) && value.length === 2) {
      onChange([value[0], value[1]]);
      setShowCalendar(false);
    }
  };

  // Aplicar preset
  const applyPreset = (preset: [Date, Date]) => {
    onChange(preset);
    setShowCalendar(false);
  };

  return (
    <div className="date-range-picker">
      <div 
        className="date-range-display"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
        <i className="fas fa-calendar-alt"></i>
      </div>
      
      {showCalendar && (
        <div className="date-range-calendar-container" ref={calendarRef}>
          <div className="date-range-presets">
            {presets.map((preset, index) => (
              <button 
                key={index}
                className="date-range-preset-button"
                onClick={() => applyPreset(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Calendar
            selectRange={true}
            value={[startDate, endDate]}
            onChange={handleDateChange}
            className="date-range-calendar"
          />
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
