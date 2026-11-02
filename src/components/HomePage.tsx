import React, { useState } from 'react';
import { 
  ShieldCheck, Database, Wrench, Fuel, AlertTriangle, FileSpreadsheet, 
  HelpCircle, ChevronDown, ChevronUp, CheckCircle2, ArrowLeft, Zap, Sparkles,
  Users, MapPin, DollarSign, Check, Shield, Search
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

  const buyerValuePoints = [
    {
      icon: Users,
      title: 'כמה ידיים עבר הרכב ומה מקוריותו?',
      desc: 'אימות מקוריות ראשונה (פרטי, ליסינג או השכרה) והערכת מספר יד משוערת למניעת תשלום יתר על מחירון יד 2.'
    },
    {
      icon: ShieldAlert,
      title: 'האם יש ריקול פתוח המונע טסט?',
      desc: 'איתור ישיר ממאגר הגבלות משרד התחבורה: קריאת שירות שלא בוצעה חוסמת העברת בעלות וחידוש רישיון רכב!'
    },
    {
      icon: FileSpreadsheet,
      title: 'זיהוי זיופי קילומטראז בטסט',
      desc: 'הצלבת הקילומטראז האחרון שנרשם על ידי בוחן הרישוי הממשלתי מול מה שהמוכר מציג בלוח השעונים.'
    },
    {
      icon: AlertTriangle,
      title: 'מחלות דגם סמויות ועלויות תיקון',
      desc: 'חשיפת כשלים ידועים במנוע, בגיר הרובוטי (DSG/DCT) או ברצועת הטיימינג, כדי שתדעו מראש מה עומד להתקלקל.'
    },
    {
      icon: HelpCircle,
      title: 'תסריט שאלות חובה למוכר',
      desc: 'שאלות ממוקדות לדגם שחייבים לשאול את בעל הרכב בטלפון לפני ששורפים זמן וכסף על נסיעה ומכון בדיקה.'
    },
    {
      icon: Shield,
      title: 'בדיקת משכונות ושעבודים ממשלתית',
      desc: 'קישורים ישירים לרשם המשכונות (משרד המשפטים) ולמרכז הסליקה של חברות הביטוח לגילוי תאונות וטוטאל-לוס.'
    }
  ];

  const geoAreas = [
    { name: 'תל אביב וגוש דן', query: '42822302', desc: 'מרכז הסחר המוביל בישראל • דגש על בדיקת בלאי פקקים, שחיקת מצמדים עירונית וקילומטראז נמוך' },
    { name: 'ירושלים ויהודה', query: '7943026', desc: 'דגש על בדיקת מאמץ מנוע וגיר בעליות לירושלים, תקינות בלמים ומערכת קירור' },
    { name: 'חיפה והצפון', query: '84457801', desc: 'רכבי צפון והכרמל • בדיקת בלאי רפידות בלמים, התחממות במורדות וסחירות דגמים היברידיים' },
    { name: 'ראשון לציון והשפלה', query: '36181801', desc: 'מרכזי הטרייד-אין והליסינג הגדולים • בדיקת מקוריות בעלות, רישום חברה ועבר טיפולים' },
    { name: 'באר שבע והדרום', query: '71385104', desc: 'אקלים מדברי חם • בדיקת תקינות מזגן, קירור סוללה היברידית/חשמלית וצמיגים יבשים' },
    { name: 'פתח תקווה והשרון', query: '1001160', desc: 'בדיקת רכבי משפחה, היסטוריית ריקולים פתוחים ואימות קילומטראז במכוני בדיקה מורשים' }
  ];

  const faqs = [
    {
      q: 'איך האתר עוזר לי לקנות רכב יד שנייה בלי ליפול בפח?',
      a: 'AutoScope Israel פותח במיוחד עבור קוני רכב יד שנייה. לפני שאתם נוסעים לראות את הרכב או משלמים מאות שקלים למכון בדיקה, המערכת מצליבה עבורכם את מסד הנתונים הממשלתי: בודקת אם הרכב היה במקור בליסינג או השכרה, מעריכה את מספר הידיים, מאתרת קילומטראז קודם בטסט, בודקת אם יש ריקול בטיחותי שמונע העברת בעלות, ומספקת לכם תסריט שאלות מדויק לדגם שחייבים לשאול את המוכר.'
    },
    {
      q: 'איך מחשבים את מספר היד של הרכב?',
      a: 'משרד התחבורה מפרסם לציבור את סיווג הבעלות הנוכחי ואת מקוריות היד הראשונה (פרטי, ליסינג, השכרה, חברה). המערכת מחשבת הערכת מספר יד סטטיסטית מדויקת המבוססת על שנתון הרכב (לפי ממוצע החלפת בעלות של 3.5 שנים בישראל) ומסבירה כיצד לוודא את הנתון הסופי והרשמי בסעיף "בעלים קודמים" ברישיון הרכב המודפס או באזור האישי הממשלתי.'
    },
    {
      q: 'מה קורה אם בחיפוש הבא הרכב עבר טסט או החליף בעלות?',
      a: 'המערכת מיישמת מנגנון רענון חכם (Stale-While-Revalidate). כל דוח כולל חותמת תאריך ושעת עדכון וכפתור "רענן נתונים כעת". אם עברו מעל 7 ימים מהבדיקה הקודמת או אם תאריך הטסט חלף, המערכת פונה מיד למאגרי משרד התחבורה ומעדכנת את הדוח לנתונים הטריים ביותר של אותה שנייה.'
    },
    {
      q: 'האם האתר עולה כסף?',
      a: 'לא, השירות חינמי לגמרי לציבור הרחב ללא צורך בהרשמה או מסירת פרטים אישיים. אנו פועלים לקידום שקיפות ובטיחות בענף הרכב בישראל.'
    },
    {
      q: 'האם הדוח מחליף בדיקה פיזית במכון בדיקה מורשה?',
      a: 'לא. הדוח מספק מודיעין רישוי, היסטוריית ק"מ ומחלות דגם סמויות, אך אינו בודק את מצב השלדה (שאסי), תאונות פיזיות או בלאי מנוע של הרכב הספציפי. לפני קנייה חובה לגשת למכון בדיקה מורשה ולבדוק משכונות ברשם המשכונות.'
    }
  ];

  return (
    <div>
      
      {/* Hero Section with Custom Illustration Banner */}
      <section className="relative overflow-hidden pt-10 pb-16 sm:pt-14 sm:pb-24 bg-gradient-to-b from-white via-brand-50/25 to-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-brand-200 shadow-sm animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>מודיעין רכב לקוני יד 2 • נתונים מאומתים ממשרד התחבורה ומאגר ה-WLTP</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-tight sm:leading-tight mb-4">
              בדיקת רכב לפני קנייה.<br />
              <span className="text-brand-600">אל תקנו רכב בלי לדעת הכל.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
              הכניסו מספר רישוי וקבלו דוח מקיף: אימות מקוריות ויד, קילומטראז בטסט, ריקולים שחוסמים טסט, מחלות דגם סמויות ותסריט שאלות למוכר.
            </p>
          </div>

          {/* Main License Plate Input */}
          <div className="mb-10">
            <LicensePlateInput 
              onSearch={onSearch}
              isLoading={isLoading}
              size="large"
            />
          </div>

          {/* Generated Hero Automotive Banner Visual */}
          <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-2xl group">
            <img 
              src="/hero-car.jpg" 
              alt="AutoScope Israel - סריקת מודיעין רכב ממוחשבת" 
              className="w-full h-auto object-cover max-h-[380px] transform group-hover:scale-[1.01] transition-transform duration-500"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 w-full text-white text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>סריקה רב-מערכתית בזמן אמת מול שרתי משרד התחבורה data.gov.il</span>
                </div>
                <div className="hidden sm:flex items-center gap-4 text-slate-300 text-xs">
                  <span>אימות מקוריות בעלות</span>
                  <span>•</span>
                  <span>קילומטראז בטסט אחרון</span>
                  <span>•</span>
                  <span>חסימת ריקולים</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-600 mt-8 pt-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>חינם לחלוטין וללא הרשמה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>נתוני אמת ממאגרי הממשלה</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>תמיכה מלאה בכל רכב ישראלי</span>
            </div>
          </div>

        </div>
      </section>

      {/* Second Hand Buyer Core Values */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-brand-600 font-bold text-xs uppercase tracking-wider mb-2">מודיעין לפני רכישה</div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              6 דברים שחייבים לבדוק לפני שמעבירים כסף למוכר
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              בדיקת רכב מקצועית מתחילה במספר הרישוי. גלו את המידע שהמוכרים לא תמיד ששים לשתף.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {buyerValuePoints.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-brand-500 hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
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

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-brand-600 group-hover:translate-x-[-3px] transition-transform">
                    <span>מופיע בדוח הרכב המלא ←</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Local Israeli GEO Buyer Hubs (SEO & GEO) */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              <span>מודיעין רכב מקומי בישראל</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              מדריכי בדיקת רכב לפני קנייה לפי אזור וערים בארץ
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              לכל אזור בישראל יש מאפייני בלאי ייחודיים ומכוני בדיקה מורשים
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {geoAreas.map((geo, idx) => (
              <div 
                key={idx}
                className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-brand-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-600" />
                      <span>{geo.name}</span>
                    </h3>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">מדריך מקומי</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {geo.desc}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSearch(geo.query)}
                  className="w-full py-2 bg-slate-50 hover:bg-brand-50 text-brand-700 border border-slate-200 hover:border-brand-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>בדיקת רכב לדוגמה מאזור זה</span>
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              שאלות ותשובות לקוני רכב יד שנייה
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

    </div>
  );
};
