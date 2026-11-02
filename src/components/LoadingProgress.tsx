import React from 'react';
import { CheckCircle2, CircleDashed, Loader2, Database, ShieldAlert, Wrench, FileText } from 'lucide-react';
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
    { id: 1, label: 'אימות מספר רישוי ואיתור במאגר כלי רכב פעילים', icon: Database, minPercent: 15 },
    { id: 2, label: 'הצלבת נתוני דגם WLTP, הספקים ופליטות', icon: FileText, minPercent: 40 },
    { id: 3, label: 'בדיקת היסטוריית קילומטראז בטסט ושינויי מבנה', icon: Wrench, minPercent: 65 },
    { id: 4, label: 'סריקת ריקולים וקריאות שירות פתוחות במאגר משרד התחבורה', icon: ShieldAlert, minPercent: 80 },
    { id: 5, label: 'ניתוח תקלות נפוצות, מפרט טיפולים ומחשבון דלק', icon: CheckCircle2, minPercent: 95 }
  ];

  return (
    <div className="max-w-xl mx-auto my-12 bg-white rounded-2xl border border-slate-200 shadow-xl p-6 sm:p-8">
      
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-[#f9d616] text-slate-900 font-mono font-extrabold px-3 py-1 rounded-md border border-slate-900 text-lg mb-3 shadow-sm">
          <span>IL</span>
          <span>{formatPlateDisplay(plateNumber)}</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900">מבצע תחקיר מודיעין רכב...</h3>
        <p className="text-sm text-slate-500 mt-1">פונה בזמן אמת למאגרי המידע הרשמיים של משרד התחבורה בישראל</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
          <span>{currentStep}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className="h-full bg-brand-600 rounded-full transition-all duration-300 ease-out shadow-sm"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          ></div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3.5">
        {steps.map((step) => {
          const isDone = progressPercent >= step.minPercent;
          const isCurrent = !isDone && progressPercent >= (step.minPercent - 25);
          const Icon = step.icon;

          return (
            <div 
              key={step.id} 
              className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                isDone 
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900 font-medium' 
                  : isCurrent
                    ? 'bg-brand-50 border-brand-300 text-brand-900 font-semibold shadow-sm animate-pulse'
                    : 'bg-slate-50 border-slate-100 text-slate-400'
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
              {isDone && (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">מאומת</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">
          * שאילתות ישירות מול שרתי ממשלת ישראל (data.gov.il). הנתונים אינם מומצאים ומאומתים מול הרישומים הרשמיים.
        </p>
      </div>

    </div>
  );
};
