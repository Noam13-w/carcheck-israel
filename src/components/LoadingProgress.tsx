import React from 'react';
import { CheckCircle2, CircleDashed, Loader2, Car, BarChart3, Clock, Wrench, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPlateDisplay } from '../services/api';

interface LoadingProgressProps {
  plateNumber: string;
  currentStep: string;
  progressPercent: number;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  plateNumber,
  currentStep,
  progressPercent
}) => {
  const steps = [
    { id: 1, label: 'אימות לוחית רישוי ואיתור פרטי הרכב במאגר הממשלתי', icon: Car, minPercent: 20 },
    { id: 2, label: 'הצלבת נתוני WLTP, מפרט טכני וצריכת דלק', icon: BarChart3, minPercent: 45 },
    { id: 3, label: 'בדיקת קילומטראז׳ במבחן רישוי אחרון והיסטוריית בעלות', icon: Clock, minPercent: 70 },
    { id: 4, label: 'סריקת קריאות שירות (ריקול) פתוחות ומחלות דגם', icon: Wrench, minPercent: 90 }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-xl mx-auto my-12 bg-white/95 backdrop-blur-xl rounded-3xl border border-white/80 shadow-search-pill p-6 sm:p-9 relative overflow-hidden" 
      dir="rtl"
    >
      {/* Top subtle decorative ambient glow */}
      <div 
        className="absolute -top-24 right-1/2 translate-x-1/2 w-72 h-48 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Plate Badge & Heading */}
      <div className="text-center mb-8 relative z-10">
        <motion.div 
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center bg-[#f9d616] text-slate-950 font-black px-4 py-1.5 rounded-2xl border-2 border-slate-900 shadow-plate text-xl mb-4"
          dir="ltr"
        >
          <span className="text-xs bg-[#0038b8] text-white px-2 py-0.5 rounded mr-2.5 font-bold">IL</span>
          <span className="plate-font tracking-widest">{formatPlateDisplay(plateNumber)}</span>
        </motion.div>

        <h3 className="text-2xl font-black text-slate-950 tracking-tight">
          מרכיב את דוח המודיעין לרכב...
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-brand-600" />
          <span>מתחבר למאגרי משרד התחבורה ומדדי WLTP</span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2.5">
          <span className="text-slate-800">{currentStep}</span>
          <span className="text-brand-600 font-mono text-sm">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
          <motion.div 
            className="h-full bg-gradient-to-l from-[#5e5ce6] via-brand-600 to-brand-500 rounded-full shadow-[0_0_12px_rgba(75,69,230,0.5)]"
            initial={{ width: '8%' }}
            animate={{ width: `${Math.max(10, progressPercent)}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Verification Steps List */}
      <div className="space-y-3 relative z-10">
        {steps.map((step, idx) => {
          const isDone = progressPercent >= step.minPercent;
          const isCurrent = !isDone && progressPercent >= (step.minPercent - 30);

          return (
            <motion.div 
              key={step.id} 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * idx }}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border text-xs sm:text-sm transition-all duration-300 ${
                isDone 
                  ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950 font-bold shadow-soft-sm' 
                  : isCurrent
                    ? 'bg-[#f0f1ff] border-brand-200 text-brand-950 font-bold shadow-soft-sm'
                    : 'bg-[#f7f8fc]/60 border-slate-100 text-slate-400'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                ) : (
                  <CircleDashed className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <span className="flex-1">{step.label}</span>
            </motion.div>
          );
        })}
      </div>

    </motion.div>
  );
};
