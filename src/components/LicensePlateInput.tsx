import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowLeft } from 'lucide-react';
import { formatPlateDisplay, normalizePlate } from '../services/api';

interface LicensePlateInputProps {
  onSearch: (plate: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  size?: 'large' | 'compact';
}

export const LicensePlateInput: React.FC<LicensePlateInputProps> = ({
  onSearch,
  isLoading = false,
  initialValue = '',
  size = 'large'
}) => {
  const [value, setValue] = useState(formatPlateDisplay(initialValue));
  const [error, setError] = useState<string | null>(null);

  const samplePlates = [
    { plate: '42822302', label: 'טויוטה קורולה היברידית 2021' },
    { plate: '84457801', label: 'יונדאי איוניק היבריד 2020' },
    { plate: '7943026', label: 'סקודה סופרב 2021 (דיזל FL)' },
    { plate: '71385104', label: 'רכב חשמלי 2026 (EV)' },
    { plate: '1001160', label: 'רכב עם ריקול כריות אוויר פתוח' },
    { plate: '36181801', label: 'סקודה אוקטביה (114,529 ק"מ בטסט)' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const clean = normalizePlate(raw);
    if (clean.length <= 8) {
      setValue(formatPlateDisplay(clean));
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizePlate(value);
    if (clean.length < 6 || clean.length > 8) {
      setError('נא להזין מספר רישוי חוקי (7 או 8 ספרות)');
      return;
    }
    setError(null);
    onSearch(clean);
  };

  const handleSampleClick = (plate: string) => {
    setValue(formatPlateDisplay(plate));
    setError(null);
    onSearch(plate);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        
        {/* Israeli Plate Container */}
        <div className={`relative flex items-center bg-[#f9d616] rounded-xl border-4 border-slate-900 shadow-xl overflow-hidden transition-all focus-within:ring-4 focus-within:ring-brand-500/30 ${size === 'large' ? 'h-20 sm:h-24' : 'h-16'}`}>
          
          {/* Blue IL Flag Strip */}
          <div className="h-full w-14 sm:w-16 bg-[#0038b8] text-white flex flex-col items-center justify-between py-2 sm:py-2.5 px-1 select-none shrink-0 border-l-2 border-slate-900/20">
            <div className="text-[10px] sm:text-xs font-bold leading-none tracking-widest text-center">
              <div>ישראל</div>
              <div className="text-[9px] opacity-80">إسرائيل</div>
            </div>
            
            {/* Blue and white emblem representation */}
            <div className="w-5 h-4 sm:w-6 sm:h-4.5 bg-white/20 rounded flex items-center justify-center font-bold text-[9px]">
              IL
            </div>

            <span className="text-[10px] sm:text-xs font-black tracking-widest">IL</span>
          </div>

          {/* Plate Number Input */}
          <div className="relative flex-1 flex items-center px-4">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              dir="ltr"
              value={value}
              onChange={handleInputChange}
              placeholder="12-345-67"
              disabled={isLoading}
              className={`w-full bg-transparent text-slate-950 font-black tracking-widest text-center focus:outline-none placeholder:text-slate-800/40 select-all font-mono ${
                size === 'large' ? 'text-3xl sm:text-5xl' : 'text-2xl sm:text-3xl'
              }`}
            />

            {value && !isLoading && (
              <button
                type="button"
                onClick={() => setValue('')}
                className="absolute left-3 text-slate-700 hover:text-slate-900 p-1.5 rounded-full hover:bg-black/10 transition-colors"
                title="נקה מספר"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>

        {/* Submit Button */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isLoading || !value}
            className="flex-1 h-14 bg-brand-600 hover:bg-brand-700 active:bg-brand-800 disabled:bg-slate-300 text-white font-bold text-lg rounded-xl shadow-lg shadow-brand-600/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>בודק רכב במאגרי הממשלה...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>בדיקת רכב והפקת דוח מקיף</span>
                <ArrowLeft className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="mt-2 text-center text-sm font-semibold text-rose-600 animate-shake">
            {error}
          </p>
        )}

      </form>

      {/* Quick Sample Plates */}
      <div className="mt-5">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500 font-medium mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>או נסו בדיקה מהירה בלחיצה על רכב לדוגמה:</span>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-2">
          {samplePlates.map((sample) => (
            <button
              key={sample.plate}
              type="button"
              onClick={() => handleSampleClick(sample.plate)}
              disabled={isLoading}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-800 shadow-sm transition-all"
            >
              <span className="bg-[#f9d616] text-slate-900 font-mono font-bold px-1.5 py-0.5 rounded text-[11px] border border-slate-800/30">
                {formatPlateDisplay(sample.plate)}
              </span>
              <span className="text-slate-600 group-hover:text-brand-900">{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
