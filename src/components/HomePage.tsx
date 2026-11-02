import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Wrench, 
  Fuel, 
  AlertTriangle, 
  FileSpreadsheet, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  ArrowLeft, 
  Users, 
  MapPin, 
  DollarSign, 
  Check, 
  Shield, 
  Search, 
  ShieldAlert,
  Gauge,
  FileText,
  ExternalLink
} from 'lucide-react';
import { LicensePlateInput } from './LicensePlateInput';

interface HomePageProps {
  onSearch: (plate: string) => void;
  isLoading?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, isLoading }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const corePillars = [
    {
      icon: Users,
      title: 'מקוריות בעלות והשפעה על מחירון',
      desc: 'אימות מקוריות ראשונה: פרטי, ליסינג (החכר) או השכרה. בדיקת ירידת ערך של 8% עד 22% לפי מחירון לוי יצחק.'
    },
    {
      icon: Gauge,
      title: 'הצלבת קילומטראז\' רשמי בטסט',
      desc: 'חשיפת מד האוץ הממשלתי שנרשם במבחן הרישוי השנתי האחרון למניעת זיופי קילומטראז\' ותרמיות שעונים.'
    },
    {
      icon: ShieldAlert,
      title: 'קריאות שירות (ריקול) שחוסמות טסט',
      desc: 'איתור ישיר ממאגר ההגבלות של משרד התחבורה: ריקול בטיחותי שלא בוצע חוסם העברת בעלות וחידוש רישיון!'
    },
    {
      icon: FileText,
      title: 'מפרט טכני מלא וצריכת דלק WLTP',
      desc: 'נפח מנוע, כוחות סוס, סוג גיר, רמת אבזור בטיחות מקורית, צריכת דלק אמיתית ומחשבון הוצאות חודשיות.'
    }
  ];

  const faqs = [
    {
      q: 'מה המידע המוצג בדוח הרכב של AutoScope?',
      a: 'הדוח מרכז נתוני אמת ממאגרי משרד התחבורה וה-WLTP: תוקף טסט, קילומטראז\' אחרון שנרשם במבחן הרישוי, סיווג בעלות נוכחי, מקוריות ראשונה (פרטי/ליסינג/השכרה), קריאות שירות (ריקול) פתוחות, מפרט טכני מלא וצריכת דלק.'
    },
    {
      q: 'מדוע חשוב לבדוק מקוריות רכב לפני קנייה?',
      a: 'רכבים שעלו לכביש ברישום ראשון של ליסינג או השכרה זכאים להפחתה משמעותית במחיר המחירון (8%–22% לפי מחירון לוי יצחק). מוכרים רבים אינם מציינים זאת במודעה, והדוח חושף את המקוריות הרשמית.'
    },
    {
      q: 'האם משרד התחבורה מפרסם את מספר היד המדויק?',
      a: 'לפי חוק הגנת הפרטיות, מאגר המידע הממשלתי הפתוח מפרסם את מקוריות הרכב והבעלות הנוכחית, אך לא את מספר הידיים המלא. האתר מספק הערכה סטטיסטית אמינה לפי גיל הרכב ומקוריותו, ומסביר כיצד לאמת את היד המדויקת ברישיון הרכב המודפס (סעיף "בעלים קודמים").'
    },
    {
      q: 'האם השירות כרוך בתשלום או בהרשמה?',
      a: 'לא. השירות פתוח לציבור ללא תשלום, ללא צורך בהרשמה וללא איסוף פרטים אישיים, במטרה לקדם שקיפות והגינות בשוק הרכב המשומש בישראל.'
    },
    {
      q: 'האם הדוח מחליף בדיקה פיזית במכון בדיקה מורשה?',
      a: 'לא. הדוח מעניק מודיעין רישוי, היסטוריה ומפרט טכני. לפני רכישת רכב יד שנייה חובה לבצע בדיקה פיזית של שלדה (שאסי) ומכלולים מכניים במכון מורשה, ולבדוק משכונות ברשם המשכונות.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900" dir="rtl">
      
      {/* Clean, Modern Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/80 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Official Connection Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>מחובר ישירות למאגרי משרד התחבורה • data.gov.il</span>
          </div>

          {/* Clean Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight mb-4">
            בדיקת רכב לפי מספר רישוי
          </h1>
          
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            הכניסו מספר רכב וקבלו תיק רכב רשמי: אימות מקוריות ויד, קילומטראז' בטסט האחרון, ריקולים פתוחים ומפרט טכני מלא.
          </p>

          {/* Israeli License Plate Search Box */}
          <div className="max-w-xl mx-auto mb-8">
            <LicensePlateInput 
              onSearch={onSearch}
              isLoading={isLoading}
              size="large"
            />
          </div>

          {/* Quick Trust Checks */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>נתוני אמת ממשלתיים (ללא ניחושים)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>חינם לחלוטין וללא הרשמה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>סריקת ריקולים מעכבי רישיון</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Professional Feature Pillars */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              כל מה שחשוב לדעת לפני שקונים רכב
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              המידע הקריטי שיעזור לכם לקבל החלטה מושכלת ולא ליפול בפח
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {corePillars.map((pillar, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700 shrink-0">
                  <pillar.icon className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Mandatory Official Registries Links */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-amber-400 text-xs font-bold mb-2">
                <Shield className="w-3.5 h-3.5" />
                <span>המלצת חובה לרוכשי יד שנייה</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black">
                שתי הבדיקות המשפטיות שחייבים לבצע לפני העברת כספים
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                רכב עלול להיות משועבד לבנק או לעבור תאונת "טוטאל-לוס" שאינה מופיעה ברישיון הרכב. בצעו בדיקה רשמית במאגרים הממשלתיים:
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a 
                href="https://ica.justice.gov.il/Request/OpenServicesList?Unit=mashkonot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shadow-md transition-colors"
              >
                <span>רשם המשכונות (₪10)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <a 
                href="https://slika-ins.co.il"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
              >
                <span>מרכז הסליקה (₪10)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              שאלות נפוצות על בדיקת רכב
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              מידע שימושי על מאגרי הרישוי, בדיקות לפני קנייה והסדרי בעלות
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full py-4 px-5 text-right flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-brand-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {openFaq === index && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
