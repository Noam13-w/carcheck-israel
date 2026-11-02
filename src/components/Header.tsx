import React from 'react';
import { ShieldCheck, Search, Car, Info, Sparkles } from 'lucide-react';

interface HeaderProps {
  onNewSearch?: () => void;
  hasActiveReport?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNewSearch, hasActiveReport }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onNewSearch}
          className="flex items-center gap-3 cursor-pointer group transition-transform active:scale-95"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:bg-brand-700 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">AutoScope</span>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">ישראל</span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 -mt-0.5">מודיעין רכב מתקדם ומאגר משרד התחבורה</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {hasActiveReport && (
            <button
              onClick={onNewSearch}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>חיפוש רכב חדש</span>
            </button>
          )}

          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>מחובר למאגר data.gov.il</span>
          </div>
        </div>

      </div>
    </header>
  );
};
