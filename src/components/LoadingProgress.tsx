import React from 'react';
import { CheckCircle2, CircleDashed, Loader2, Car, BarChart3, Clock, Wrench } from 'lucide-react';
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
    { id: 1, label: 'איתור פרטי הרכב במאגר הרשמי של משרד התחבורה', icon: Car, minPercent: 20 },
    { id: 2, label: 'ניתוח מפרט טכני, הספק מנוע ונתוני צריכת דלק', icon: BarChart3, minPercent: 45 },
    { id: 3, label: 'בדיקת היסטוריית רישוי, קילומטראז׳ ומקוריות בעלות', icon: Clock, minPercent: 75 },
    { id: 4, label: 'סריקת ריקולים פתוחים ונקודות תורפה של הדגם', icon: Wrench, minPercent: 95 }
  ];

  return (
    <div className="max-w-lg mx-auto my-12 bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8" dir="rtl">
      
      {/* Header */}
      <div className="text-center mb-7">
        <div 
          className="inline-flex items-center bg-[#f9d616] text-slate-950 font-mono font-black px-3.5 py-1 rounded-xl border-2 border-slate-900 text-lg mb-4 shadow-sm"
          dir="ltr"
        >
          <span className="text-[11px] bg-[#0038b8] text-white px-1.5 py-0.5 rounded mr-2 font-sans font-bold">IL</span>
          <span>{formatPlateDisplay(plateNumber)}</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-950">מכין את דוח הרכב...</h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">מאמת נתונים ממקורות רשמיים</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-7">
        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
          <span>{currentStep}</span>
          <span className="text-brand-600">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-l from-brand-600 to-brand-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.max(8, progressPercent)}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5">
        {steps.map((step) => {
          const isDone = progressPercent >= step.minPercent;
          const isCurrent = !isDone && progressPercent >= (step.minPercent - 30);

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs sm:text-sm transition-all ${
                isDone 
                  ? 'bg-emerald-50/50 border-emerald-100 text-slate-800 font-semibold' 
                  : isCurrent
                    ? 'bg-brand-50/70 border-brand-200 text-brand-950 font-bold'
                    : 'bg-[#f7f8fc] border-slate-100 text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-brand-600 animate-spin shrink-0" />
              ) : (
                <CircleDashed className="w-5 h-5 text-slate-300 shrink-0" />
              )}
              <span className="flex-1">{step.label}</span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
