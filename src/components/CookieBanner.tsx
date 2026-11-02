import React from 'react';
import { Cookie, ShieldCheck, Sliders, Check, X } from 'lucide-react';
import { CookieConsentType } from '../types/legal';

interface CookieBannerProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onAcceptEssentialOnly: () => void;
  onOpenPreferences: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  isVisible,
  onAcceptAll,
  onAcceptEssentialOnly,
  onOpenPreferences,
  onOpenPrivacyPolicy
}) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-5 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-in slide-in-from-bottom duration-300 no-print"
      dir="rtl"
      role="region"
      aria-label="הודעת הסכמה לעוגיות ופרטיות"
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Text description */}
        <div className="flex items-start sm:items-center gap-3.5 text-right w-full lg:w-auto">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>פרטיות ועוגיות כחוק</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ללא איסוף מידע אישי
              </span>
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              אנו פועלים לפי חוק הגנת הפרטיות. האתר משתמש בזיכרון מקומי חיוני (Local Storage) בלבד 
              לשמירת תוצאות החיפוש והעדפות הנגישות שלך. איננו מפעילים עוגיות מעקב או שיווק ללא הסכמתך.
              {' '}
              <button 
                type="button"
                onClick={onOpenPrivacyPolicy}
                className="text-brand-600 hover:text-brand-700 underline font-semibold focus:outline-none"
              >
                למדיניות הפרטיות המלאה
              </button>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
          
          <button
            type="button"
            onClick={onOpenPreferences}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>התאמה אישית</span>
          </button>

          <button
            type="button"
            onClick={onAcceptEssentialOnly}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <ShieldCheck className="w-4 h-4 text-slate-600" />
            <span>חיוניות בלבד</span>
          </button>

          <button
            type="button"
            onClick={onAcceptAll}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <Check className="w-4 h-4" />
            <span>אישור הכל</span>
          </button>

        </div>

      </div>
    </div>
  );
};
