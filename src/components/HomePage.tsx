import React, { useState } from 'react';
import { 
  ShieldCheck, Database, Wrench, Fuel, AlertTriangle, FileSpreadsheet, 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft, Zap, Sparkles 
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

  const featureCards = [
    {
      icon: Database,
      title: 'זיהוי רכב ורישוי ממשלתי',
      desc: 'אימות פרטי הרכב, שנת עלייה לכביש, תוקף טסט, צבע, מידות צמיגים מאושרות וסיווג בעלות ממאגר משרד התחבורה.'
    },
    {
      icon: Wrench,
      title: 'מפרט טכני ובטיחות WLTP',
      desc: 'הספק כ"ס, נפח מנוע, מנגנון תזמון (טיימינג), מערכות בטיחות אקטיביות, בלימה אוטונומית וכריות אוויר.'
    },
    {
      icon: Fuel,
      title: 'צריכת דלק ומחשבון עלויות',
      desc: 'צריכת דלק רשמית ואמיתית (ק"מ לליטר), מדד זיהום, ומחשבון אינטראקטיבי לחישוב הוצאות דלק חודשיות ושנתיות.'
    },
    {
      icon: AlertTriangle,
      title: 'מחלות דגם ותקלות נפוצות',
      desc: 'תחקיר מקיף על כשלים אופייניים במנוע, בגיר ובאלקטרוניקה, תסמינים, דרגות חומרה ואומדן עלויות תיקון בישראל.'
    },
    {
      icon: ShieldCheck,
      title: 'סריקת ריקולים פתוחים',
      desc: 'איתור קריאות שירות פתוחות ספציפיות לרכב המונעות העברת טסט, לצד קריאות שירות כלליות של היבואן.'
    },
    {
      icon: FileSpreadsheet,
      title: 'היסטוריית טסטים וק"מ',
      desc: "הצלבת קילומטראז' מתועד בטסט האחרון, שינויי מבנה, שינויי צבע והסבות גז לגילוי פערי מידע לפני קנייה."
    }
  ];

  const faqs = [
    {
      q: 'מהיכן נלקחים נתוני הרכב באתר?',
      a: 'כל נתוני הרישוי, המפרט הבטיחותי, נתוני ה-WLTP וקריאות השירות נמשכים ישירות ובזמן אמת ממאגרי המידע הממשלתיים הפתוחים של משרד התחבורה (data.gov.il). תחקיר התקלות הנפוצות ועלויות הטיפולים מבוסס על מאגרי מידע טכניים, חוזרי יבואנים ומחירוני מוסכים בישראל.'
    },
    {
      q: 'האם השירות כרוך בתשלום או בהרשמה?',
      a: 'לא! השירות חינמי לחלוטין ואינו דורש הרשמה, הזנת כרטיס אשראי או השארת פרטים אישיים כלשהם. מטרתנו להנגיש מידע שקוף ואמין לציבור הנהגים בישראל.'
    },
    {
      q: 'האם הדוח מחליף בדיקה פיזית במכון בדיקה לפני קנייה?',
      a: 'בשום אופן לא. הדוח מספק מודיעין מעמיק על הדגם, נתוני הרישוי והקילומטראז בטסט, אך אינו בודק את מצב הרכב הפיזי בשטח. לפני קנייה חובה לבצע בדיקת שלדה (שאסי) ומנוע במכון מורשה ולבדוק עיקולים ומשכונות ברשם המשכונות.'
    },
    {
      q: 'מה עושים אם מופיע ריקול פתוח בדוח הרכב?',
      a: 'על פי חוק, יבואן הרכב מחויב לבצע תיקון ריקול בטיחותי ללא כל תשלום. אם מופיע ריקול פתוח, יש לפנות לאחד ממוסכי היבואן הרשמי ולתאם ביצוע של קריאת השירות. ללא ביצוע ריקול פתוח, לא ניתן לעבור טסט שנתי או להעביר בעלות.'
    },
    {
      q: 'האם נחשפים פרטים אישיים של בעל הרכב?',
      a: 'לא. בהתאם לחוק הגנת הפרטיות, המאגר הממשלתי והאתר אינם כוללים ואינם מציגים שמות, מספרי תעודת זהות, כתובות או מספרי טלפון של בעלי הרכבים.'
    }
  ];

  return (
    <div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-white via-brand-50/30 to-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-brand-200 shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>מודיעין רכב מתקדם • נתונים רשמיים ממשרד התחבורה ומאגר WLTP</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight mb-4">
            כל מה שצריך לדעת על הרכב שלך.<br className="hidden sm:inline" />
            <span className="text-brand-600">במספר אחד.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            הכניסו מספר רישוי וקבלו דוח רכב מקיף: מפרט טכני, צריכת דלק, היסטוריה, תקלות נפוצות, טיפולים ועוד.
          </p>

          {/* Main License Plate Input */}
          <div className="mb-8">
            <LicensePlateInput 
              onSearch={onSearch}
              isLoading={isLoading}
              size="large"
            />
          </div>

          {/* Trust Signals Under Search */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500 pt-4 border-t border-slate-200/60 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>ללא צורך בהרשמה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>נתונים מאומתים 100%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>שירות חופשי וחינמי</span>
            </div>
          </div>

        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              מה כולל דוח מודיעין הרכב של AutoScope?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              לא עוד בדיקה שטחית. הצלבה מרובת מקורות המספקת תמונת מצב אובייקטיבית ושלמה.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-400 hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12">
            איך זה עובד? ב-3 שלבים פשוטים
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                1
              </div>
              <h3 className="font-bold text-slate-900 mb-2">הזנת מספר רישוי</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                מזינים מספר רכב ישראלי בן 7 או 8 ספרות ללא רווחים ומקפים.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                2
              </div>
              <h3 className="font-bold text-slate-900 mb-2">תחקיר והצלבת מאגרים</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                המערכת פונה במקביל למאגרי משרד התחבורה, ה-WLTP וקריאות השירות.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-full bg-brand-600 text-white font-extrabold flex items-center justify-center mx-auto mb-4 text-base">
                3
              </div>
              <h3 className="font-bold text-slate-900 mb-2">קבלת דוח מודיעין מלא</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                דוח רכב מקיף עם מפרט, מחשבון דלק, מחלות דגם וצ'ק ליסט לקונה.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              שאלות ותשובות נפוצות
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              כל מה שחשוב לדעת על הפקת דוח רכב ובדיקת מספר רישוי
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 sm:p-5 text-right flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-brand-600 transition-colors"
                  >
                    <span className="text-sm sm:text-base">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />}
                  </button>

                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 text-center md:text-right">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                <span className="font-extrabold text-base text-white">AutoScope Israel</span>
              </div>
              <p className="text-slate-400 max-w-md">
                פלטפורמת מודיעין רכב מתקדמת המבוססת על נתוני משרד התחבורה הפתוחים בישראל.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <a href="https://data.gov.il" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                מאגר data.gov.il
              </a>
              <span>•</span>
              <a href="https://www.gov.il/he/departments/ministry_of_transport_and_road_safety" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                משרד התחבורה
              </a>
              <span>•</span>
              <a href="https://www.gov.il/he/service/pledge_registrar_inspection" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                רשם המשכונות
              </a>
            </div>
          </div>

          <div className="pt-8 text-center text-slate-500 space-y-2">
            <p>
              המידע באתר מבוסס על מאגרי מידע ומקורות ציבוריים ממשלתיים בישראל. השימוש במידע באחריות המשתמש בלבד ואינו מהווה תחליף לבדיקה מקצועית לפני רכישה.
            </p>
            <p>© {new Date().getFullYear()} AutoScope Israel. כל הזכויות שמורות.</p>
          </div>

        </div>
      </footer>

    </div>
  );
};
