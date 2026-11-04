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
    { plate: '42822302', label: 'טויוטה קורולה 2021' },
    { plate: '84457801', label: 'יונדאי איוניק 2020' },
    { plate: '36181801', label: 'סקודה אוקטביה RS' },
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

        {/* Outer Floating Pill Container - Matching CarInfo Mockup */}
        <motion.div 
          animate={{
            boxShadow: isFocused 
              ? '0 20px 50px -10px rgba(75, 69, 230, 0.3), 0 0 0 2px rgba(75, 69, 230, 0.4)' 
              : '0 20px 50px -10px rgba(75, 69, 230, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.95), 0 10px 20px -5px rgba(0, 0, 0, 0.04)'
          }}
          transition={{ duration: 0.25 }}
          className="bg-white/95 backdrop-blur-xl p-2 sm:p-2.5 rounded-3xl sm:rounded-full border border-white flex flex-col sm:flex-row-reverse items-stretch sm:items-center gap-2 sm:gap-2.5"
        >
          
          {/* Authentic Israeli License Plate Capsule */}
          <div 
            className="relative flex-1 flex items-center bg-[#f9d616] rounded-2xl sm:rounded-full border-2 border-slate-900/95 h-14 sm:h-16 overflow-hidden shadow-plate focus-within:ring-2 focus-within:ring-brand-500 transition-all"
            dir="ltr"
          >
            {/* Left Blue IL Flag Strip */}
            <div 
              className="h-full flex items-stretch shrink-0 select-none border-r-2 border-slate-900/90"
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
              className="w-full h-full bg-transparent text-slate-950 font-black text-2xl sm:text-[30px] tracking-[0.1em] text-center focus:outline-none placeholder:text-slate-900/30 plate-font pr-9 pl-2"
            />

            {/* Clear Button */}
            {value && !isLoading && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                type="button"
                onClick={() => setValue('')}
                className="absolute right-3 text-slate-700 hover:text-slate-950 p-1 rounded-full hover:bg-black/10 transition-colors focus:outline-none"
                aria-label="נקה מספר רישוי"
                title="נקה מספר"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </motion.button>
            )}
          </div>

          {/* Primary CTA Search Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            aria-label="בדיקת רכב"
            className="h-13 sm:h-16 px-6 sm:px-8 bg-gradient-to-l from-brand-600 to-[#5e5ce6] hover:from-brand-700 hover:to-brand-600 text-white font-bold text-base sm:text-lg rounded-2xl sm:rounded-full shadow-btn-primary hover:shadow-btn-hover flex items-center justify-center gap-2.5 transition-all shrink-0 focus:outline-none focus:ring-4 focus:ring-brand-300"
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
          </motion.button>

        </motion.div>

        {/* Validation Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              id="plate-error-msg" 
              role="alert" 
              className="mt-2 text-right text-xs font-bold text-rose-600 bg-white/90 inline-block px-3 py-1 rounded-xl shadow-soft-sm border border-rose-100"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {/* Sub-caption matching reference design + Quick sample chips */}
      {variant === 'hero' && (
        <div className="mt-3.5 space-y-2">
          {/* Lock Badge - Centered right under the search bar */}
          <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>מידע ממקורות רשמיים ומאומתים</span>
          </div>

          {/* Quick Sample Plates */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            <span className="text-[11px] font-semibold text-slate-500 ml-1">לדוגמה:</span>
            {samplePlates.map((s) => (
              <motion.button
                key={s.plate}
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => handleSampleClick(s.plate)}
                disabled={isLoading}
                className="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-brand-700 border border-slate-200/80 shadow-soft-sm transition-all"
              >
                {s.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
