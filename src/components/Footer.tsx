import React from 'react';
import { Eye, Lock, FileText, Cookie, ExternalLink, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAccessibilityStatement: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
  onOpenCookieSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAccessibilityStatement,
  onOpenPrivacyPolicy,
  onOpenTermsOfService,
  onOpenCookieSettings
}) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-500 py-10 text-xs no-print" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Top Row: Brand + Legal Links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-7 border-b border-slate-100 text-center md:text-right">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xl font-black tracking-tight" dir="ltr">
              <span className="text-slate-900">Car</span>
              <span className="text-brand-600">Info</span>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p className="text-slate-500 text-xs">
              כל המידע על הרכב במקום אחד • מבוסס על מאגרי משרד התחבורה הרשמיים
            </p>
          </div>

          {/* Legal Modal Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={onOpenAccessibilityStatement}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors focus:outline-none"
            >
              <Eye className="w-3.5 h-3.5 text-brand-600" />
              <span>הצהרת נגישות</span>
            </button>

            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors focus:outline-none"
            >
              <Lock className="w-3.5 h-3.5 text-brand-600" />
              <span>מדיניות פרטיות</span>
            </button>

            <button
              type="button"
              onClick={onOpenTermsOfService}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors focus:outline-none"
            >
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              <span>תנאי שימוש</span>
            </button>

            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors focus:outline-none"
            >
              <Cookie className="w-3.5 h-3.5 text-brand-600" />
              <span>הגדרות עוגיות</span>
            </button>
          </div>

        </div>

        {/* Bottom Row: Official Links & Disclaimer */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 text-center sm:text-right">
          <p className="max-w-2xl leading-relaxed">
            המידע באתר מבוסס על מקורות ממשלתיים ציבוריים (data.gov.il) ואינו מהווה תחליף לבדיקה במכון רישוי מורשה או בדיקת שעבודים ברשם המשכונות.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-500 font-medium shrink-0">
            <a 
              href="https://ica.justice.gov.il/Request/OpenServicesList?Unit=mashkonot" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
            >
              <span>רשם המשכונות</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <a 
              href="https://slika-ins.co.il" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-brand-600 transition-colors inline-flex items-center gap-1"
            >
              <span>מרכז הסליקה</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span>© {new Date().getFullYear()} CarInfo</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
