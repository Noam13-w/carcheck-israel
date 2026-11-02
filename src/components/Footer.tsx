import React from 'react';
import { ShieldCheck, Eye, Lock, FileText, Cookie, ExternalLink, Mail } from 'lucide-react';

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
    <footer className="bg-slate-950 text-slate-400 py-12 text-xs no-print" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section: Brand + Links */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800 text-center lg:text-right">
          
          <div>
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-brand-400" />
              <span className="font-extrabold text-base text-white">AutoScope Israel</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-950 text-brand-400 border border-brand-800">
                מאגר משרד התחבורה
              </span>
            </div>
            <p className="text-slate-400 max-w-lg leading-relaxed">
              פלטפורמת מודיעין רכב מתקדמת לקוני רכב יד שנייה בישראל, מבוססת נתוני משרד התחבורה ומאגר data.gov.il הפתוח.
            </p>
          </div>

          {/* Legal and Compliance Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium">
            <button
              type="button"
              onClick={onOpenAccessibilityStatement}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-brand-400"
            >
              <Eye className="w-3.5 h-3.5 text-brand-400" />
              <span>הצהרת נגישות (ת״י 5568)</span>
            </button>

            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-brand-400"
            >
              <Lock className="w-3.5 h-3.5 text-brand-400" />
              <span>מדיניות פרטיות</span>
            </button>

            <button
              type="button"
              onClick={onOpenTermsOfService}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-brand-400"
            >
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              <span>תנאי שימוש והבהרה משפטית</span>
            </button>

            <button
              type="button"
              onClick={onOpenCookieSettings}
              className="flex items-center gap-1.5 hover:text-white transition-colors focus:outline-none focus:text-brand-400"
            >
              <Cookie className="w-3.5 h-3.5 text-amber-400" />
              <span>הגדרות עוגיות</span>
            </button>
          </div>

        </div>

        {/* Middle Section: Official Government Sources */}
        <div className="py-6 border-b border-slate-900 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 text-[11px]">
          <span className="text-slate-500 font-semibold">מאגרי מידע רשמיים בישראל:</span>
          
          <a 
            href="https://data.gov.il" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>פורטל data.gov.il</span>
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>

          <span>•</span>

          <a 
            href="https://www.gov.il/he/departments/ministry_of_transport_and_road_safety" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>משרד התחבורה והבטיחות בדרכים</span>
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>

          <span>•</span>

          <a 
            href="https://ica.justice.gov.il/Request/OpenServicesList?Unit=mashkonot" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>רשם המשכונות (בדיקת שעבוד ועיקול ₪10)</span>
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>

          <span>•</span>

          <a 
            href="https://slika-ins.co.il" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>מרכז הסליקה של חברות הביטוח (עבר ביטוחי ₪10)</span>
            <ExternalLink className="w-3 h-3 text-slate-600" />
          </a>
        </div>

        {/* Bottom Section: Legal Disclaimer */}
        <div className="pt-6 text-center text-slate-500 space-y-2">
          <p className="max-w-4xl mx-auto leading-relaxed">
            <strong>הבהרה משפטית:</strong> המידע באתר מבוסס על מאגרי מידע ומקורות ציבוריים ממשלתיים בישראל ומוגש כשירות לציבור. 
            השימוש במידע הינו באחריות המשתמש בלבד ואינו מהווה חוות דעת מקצועית, שמאית או תחליף לבדיקה פיזית מקיפה 
            במכון בדיקת רכב מורשה, בדיקת מוסך מומחה או בדיקת שעבודים רשמית במשרד המשפטים.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 text-[11px] pt-2">
            <span>© {new Date().getFullYear()} AutoScope Israel. כל הזכויות שמורות.</span>
            <span>•</span>
            <span>רכז נגישות: נעם ניסן (accessibility@autoscope-il.web.app)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
