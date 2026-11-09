import React, { useState } from 'react';
import { Search, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isFocused, setIsFocused] = useState(false);

  const samplePlates = [
    { plate: '42822302', label: 'טויוטה קורולה היבריד 2021' },
    { plate: '84457801', label: 'יונדאי איוניק 2020' },
    { plate: '36181801', label: 'סקודה אוקטביה 1.4 TSI' },
    { plate: '7943026', label: 'סקודה סופרב דיזל' },
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
    <div className="w-full max-w-xl mx-auto sm:mx-0">
      <form 
        onSubmit={handleSubmit} 
        role="search" 
        aria-label="חיפוש רכב לפי מספר רישוי"
        className="relative"
      >
        <label htmlFor="license-plate-input" className="sr-only">
          הזנת מספר רישוי ישראלי לבדיקה (7 או 8 ספרות)
        </label>

        {/* Outer Solid Capsule Container */}
        <div 
          className={`bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full border transition-all duration-200 flex flex-col sm:flex-row-reverse items-stretch sm:items-center gap-2 sm:gap-2.5 ${
            isFocused 
              ? 'border-blue-600 ring-4 ring-blue-100/80 shadow-md' 
              : 'border-slate-300 shadow-sm hover:border-slate-400'
          }`}
        >
          
          {/* Authentic Israeli Yellow License Plate Capsule */}
          <div 
            className="relative flex-1 flex items-center bg-[#facc15] rounded-xl sm:rounded-full border-2 border-slate-950 h-13 sm:h-15 overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-blue-500 transition-all"
            dir="ltr"
          >
            {/* Left Blue IL Flag Strip */}
            <div 
              className="h-full flex items-stretch shrink-0 select-none border-r-2 border-slate-950"
              aria-hidden="true"
            >
              <div className="w-10 sm:w-12 bg-[#0038b8] text-white flex flex-col items-center justify-center py-1 px-1">
                <span className="text-[10px] leading-none mb-0.5 font-semibold opacity-95">🇮🇱</span>
                <span className="text-xs sm:text-sm font-black tracking-wider leading-none">IL</span>
                <span className="text-[7px] leading-none mt-0.5 font-bold">ישראל</span>
              </div>
            </div>

            {/* License Plate Number Input */}
            <input
              id="license-plate-input"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              dir="ltr"
              value={value}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="12-345-67"
              disabled={isLoading}
              aria-label="מספר רישוי ישראלי"
              aria-required="true"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "plate-error-msg" : undefined}
              className="w-full h-full bg-transparent text-slate-950 font-black text-2xl sm:text-[28px] tracking-[0.12em] text-center focus:outline-none placeholder:text-slate-900/35 plate-font pr-9 pl-2"
            />

            {/* Clear Button */}
            {value && !isLoading && (
              <button
                type="button"
                onClick={() => setValue('')}
                className="absolute right-3 text-slate-700 hover:text-slate-950 p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none"
                aria-label="נקה מספר רישוי"
                title="נקה מספר"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Solid Royal Blue Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            aria-label="בדיקת רכב"
            className="h-12 sm:h-15 px-6 sm:px-8 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-full shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 shrink-0 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>בודק מאגרים...</span>
              </div>
            ) : (
              <>
                <Search className="w-5 h-5 stroke-[2.5]" />
                <span>בדיקת רכב</span>
              </>
            )}
          </button>

        </div>

        {/* Validation Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              id="plate-error-msg" 
              role="alert" 
              className="mt-2 text-right text-xs font-bold text-rose-700 bg-rose-50 inline-block px-3 py-1 rounded-lg border border-rose-200"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Sub-caption + Quick sample chips */}
      {variant === 'hero' && (
        <div className="mt-3 space-y-2">
          {/* Security & Data Source Note */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>מידע ממקורות רשמיים ומאומתים</span>
          </div>

          {/* Quick Sample Plates */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 ml-1">לדוגמה:</span>
            {samplePlates.map((s) => (
              <button
                key={s.plate}
                type="button"
                onClick={() => handleSampleClick(s.plate)}
                disabled={isLoading}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-950 border border-slate-200 transition-colors"
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