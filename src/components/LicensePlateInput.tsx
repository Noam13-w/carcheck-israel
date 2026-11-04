import React, { useState } from 'react';
import { Search, X, Lock } from 'lucide-react';
import { formatPlateDisplay, normalizePlate } from '../services/api';

interface LicensePlateInputProps {
  onSearch: (plate: string) => void;
  isLoading?: boolean;
  initialValue?: string;
  size?: 'large' | 'compact';
  variant?: 'hero' | 'inline';
}

export const LicensePlateInput: React.FC<LicensePlateInputProps> = ({
  onSearch,
  isLoading = false,
  initialValue = '',
  variant = 'hero'
}) => {
  const [value, setValue] = useState(formatPlateDisplay(initialValue));
  const [error, setError] = useState<string | null>(null);

  const samplePlates = [
    { plate: '42822302', label: 'טויוטה קורולה 2021' },
    { plate: '84457801', label: 'יונדאי איוניק 2020' },
    { plate: '36181801', label: 'סקודה אוקטביה RS' },
    { plate: '7943026', label: 'סקודה סופרב דיזל' },
    { plate: '71385104', label: 'לינק אנד קו 02 חשמלי' }
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
      setError('נא להזין מספר רישוי תקין (7 או 8 ספרות)');
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
    <div className="w-full max-w-xl">
      <form 
        onSubmit={handleSubmit} 
        role="search" 
        aria-label="חיפוש רכב לפי מספר רישוי"
        className="relative"
      >
        <label htmlFor="license-plate-input" className="sr-only">
          הזנת מספר רישוי ישראלי לבדיקה (7 או 8 ספרות)
        </label>

        {/* Outer Frosted Card Container matching CarInfo Design */}
        <div className="bg-white/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl shadow-search-bar border border-white flex flex-col sm:flex-row-reverse items-stretch sm:items-center gap-2.5">
          
          {/* License Plate Input Field */}
          <div 
            className="relative flex-1 flex items-center bg-[#f9d616] rounded-xl border-2 border-slate-900/90 h-14 sm:h-15 overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-brand-500 transition-all"
            dir="ltr"
          >
            {/* Left Blue IL Flag Strip */}
            <div 
              className="h-full flex items-stretch shrink-0 select-none border-r-2 border-slate-900/80"
              aria-hidden="true"
            >
              <div className="w-9 sm:w-10 bg-[#0038b8] text-white flex flex-col items-center justify-center py-1 px-1">
                <span className="text-[9px] leading-none mb-0.5 font-semibold opacity-90">🇮🇱</span>
                <span className="text-xs font-black tracking-wider leading-none">IL</span>
                <span className="text-[7px] leading-none mt-0.5 font-bold">ישראל</span>
              </div>
            </div>

            {/* Plate Number Input */}
            <input
              id="license-plate-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              dir="ltr"
              value={value}
              onChange={handleInputChange}
              placeholder="12-345-67"
              disabled={isLoading}
              aria-label="מספר רישוי ישראלי"
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "plate-error-msg" : undefined}
              className="w-full h-full bg-transparent text-slate-950 font-black text-2xl sm:text-3xl tracking-[0.08em] text-center focus:outline-none placeholder:text-slate-900/35 font-mono pr-8 pl-2"
            />

            {/* Clear X Button */}
            {value && !isLoading && (
              <button
                type="button"
                onClick={() => setValue('')}
                className="absolute right-2.5 text-slate-700 hover:text-slate-950 p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none"
                aria-label="נקה מספר רישוי"
                title="נקה מספר"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Primary Indigo Search CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label="בדיקת רכב"
            className="h-13 sm:h-15 px-7 bg-gradient-to-l from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 active:scale-[0.99] disabled:opacity-60 text-white font-bold text-base sm:text-lg rounded-xl shadow-btn-primary flex items-center justify-center gap-2.5 transition-all shrink-0 focus:outline-none focus:ring-4 focus:ring-brand-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>בודק...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>בדיקת רכב</span>
              </>
            )}
          </button>

        </div>

        {/* Validation Error */}
        {error && (
          <p 
            id="plate-error-msg" 
            role="alert" 
            className="mt-2 text-right text-xs font-bold text-rose-600 bg-white/90 inline-block px-3 py-1 rounded-lg shadow-sm"
          >
            {error}
          </p>
        )}
      </form>

      {/* Sub-caption matching reference design + Quick sample chips */}
      {variant === 'hero' && (
        <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>מידע ממקורות רשמיים ומאומתים</span>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-1.5">
            <span className="text-[11px] font-semibold text-slate-600 ml-1">לדוגמה:</span>
            {samplePlates.slice(0, 3).map((s) => (
              <button
                key={s.plate}
                type="button"
                onClick={() => handleSampleClick(s.plate)}
                disabled={isLoading}
                className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/85 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm transition-all"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
