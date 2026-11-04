import React, { useState, useEffect } from 'react';
import { 
  Car, 
  BarChart3, 
  Wrench, 
  Clock, 
  Scale, 
  Fuel, 
  Gauge, 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  History
} from 'lucide-react';
import { LicensePlateInput } from './LicensePlateInput';
import { formatPlateDisplay } from '../services/api';

interface HomePageProps {
  onSearch: (plate: string) => void;
  isLoading?: boolean;
}

interface RecentVehicleItem {
  plate: string;
  title: string;
  year: number;
  fuel: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, isLoading }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<RecentVehicleItem[]>([]);

  useEffect(() => {
    try {
      const items: RecentVehicleItem[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('autoscope_report_v3_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.data?.identity) {
              items.push({
                plate: parsed.data.plateNumber,
                title: `${parsed.data.identity.make} ${parsed.data.identity.commercialName}`,
                year: parsed.data.identity.modelYear,
                fuel: parsed.data.identity.fuelType,
              });
            }
          }
        }
      }
      setRecentVehicles(items.slice(0, 4));
    } catch (e) {
      // Ignore storage read errors
    }
  }, []);

  const featureCards = [
    {
      icon: Car,
      title: 'פרטי הרכב',
      subtitle: 'נתונים מלאים',
    },
    {
      icon: BarChart3,
      title: 'צריכת דלק וביצועים',
      subtitle: 'נתונים מדויקים',
    },
    {
      icon: Wrench,
      title: 'תקלות ובעיות נפוצות',
      subtitle: 'מה חשוב לדעת',
    },
    {
      icon: Clock,
      title: 'היסטוריית הרכב',
      subtitle: 'עבר, תאונות וטיפולים',
    },
    {
      icon: Scale,
      title: 'שווי שוק',
      subtitle: 'הערך המעודכן',
    },
  ];

  const faqs = [
    {
      q: 'איזה מידע מתקבל בבדיקת מספר רישוי?',
      a: 'הבדיקה מרכזת את כל המידע הרשמי ממאגרי משרד התחבורה וה-WLTP: מפרט טכני מלא (נפח מנוע, הספק, תיבת הילוכים, אבזור בטיחות), תוקף טסט, קילומטראז׳ שנרשם במבחן הרישוי האחרון, מקוריות בעלות (פרטי, ליסינג או השכרה), קריאות שירות (ריקול) פתוחות, צריכת דלק אמיתית ונקודות תורפה מוכרות של הדגם.'
    },
    {
      q: 'האם המידע מתעדכן בזמן אמת?',
      a: 'כן. בכל חיפוש המערכת פונה ישירות למאגרי הנתונים הממשלתיים הרשמיים (data.gov.il) ומצליבה מספר מאגרים במקביל כדי להציג את הנתונים העדכניים ביותר ליום הבדיקה.'
    },
    {
      q: 'איך בודקים אם הרכב היה בליסינג או בהשכרה?',
      a: 'בכרטיס היסטוריית הרכב בדוח מוצגת "מקוריות הרישום" כפי שדווחה למשרד התחבורה בעת עליית הרכב לכביש (פרטי, החכר/ליסינג, השכרה או חברה), יחד עם שקלול ההשפעה על שווי השוק והמחירון.'
    },
    {
      q: 'האם השירות חינמי?',
      a: 'כן, הפקת דוח הרכב באתר חופשית לחלוטין וללא צורך בהרשמה או השארת פרטים אישיים.'
    }
  ];

  const focusPlateInput = () => {
    const el = document.getElementById('license-plate-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => el.focus(), 300);
    }
  };

  return (
    <div className="bg-[#f7f8fc] text-slate-900 min-h-screen" dir="rtl">
      
      {/* =========================================================
          HERO SECTION (Matching CarInfo Desktop & Mobile Reference)
         ========================================================= */}
      <section className="relative overflow-hidden bg-[#f7f8fc]">
        
        {/* Mobile Top Hero Image (Matches the iPhone frame in the mockup) */}
        <div className="sm:hidden relative h-52 w-full overflow-hidden">
          <img
            src="/hero-sedan.jpg"
            alt="בדיקת רכב לפי מספר רישוי"
            className="w-full h-full object-cover object-left select-none"
          />
          <div 
            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/80 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Desktop & Mobile Hero Container */}
        <div className="relative sm:min-h-[520px] lg:min-h-[560px] flex items-center">
          
          {/* Desktop Full-Bleed Background Car Photograph */}
          <img
            src="/hero-sedan.jpg"
            alt="בדיקת רכב לפי מספר רישוי"
            className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Desktop Atmospheric Gradient Overlay so right-side Hebrew text is crisp */}
          <div 
            className="hidden sm:block absolute inset-0 bg-gradient-to-l from-white/95 via-white/65 to-transparent"
            aria-hidden="true"
          />
          <div 
            className="hidden sm:block absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/60 to-transparent"
            aria-hidden="true"
          />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-2 pb-12 sm:py-16">
            <div className="max-w-xl mr-0 ml-auto text-center sm:text-right">
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] mb-3.5 sm:mb-4">
                <span className="block text-slate-950">מכירים את הרכב.</span>
                <span className="block text-brand-600">באמת.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-700 font-medium leading-relaxed mb-6 sm:mb-8">
                כל המידע על הרכב במקום אחד
                <br />
                מפרטים, היסטוריה, צריכת דלק, תקלות ועוד.
              </p>

              {/* License Plate Search Bar */}
              <LicensePlateInput 
                onSearch={onSearch}
                isLoading={isLoading}
                variant="hero"
              />

            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          5 FEATURE PILLAR CARDS ROW
         ========================================================= */}
      <section className="relative z-20 -mt-8 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
          {featureCards.map((card, idx) => (
            <button
              key={idx}
              type="button"
              onClick={focusPlateInput}
              className={`group bg-white rounded-2xl p-5 sm:p-6 shadow-card hover:shadow-card-hover border border-slate-100 hover:border-brand-200 transition-all duration-300 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50/80 group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center mb-3.5 transition-colors duration-300">
                <card.icon className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 mb-1">
                {card.title}
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                {card.subtitle}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================
          "מה תגלו בבדיקה?" - SAMPLE REPORT PREVIEW SECTION
         ========================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Right Column: Editorial Text */}
          <div className="lg:col-span-5 text-center lg:text-right">
            <div className="inline-flex items-center gap-3 text-brand-600 font-bold text-sm sm:text-base mb-3">
              <span className="w-8 h-0.5 bg-brand-500 rounded-full" />
              <span>מה תגלו בבדיקה?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-950 tracking-tight leading-tight mb-4">
              תמונה מלאה של הרכב
            </h2>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              מפרט טכני, נתוני ביצועים, היסטוריה, ותקלות נפוצות – הכל במקום אחד, מוגש בצורה בהירה ומדויקת.
            </p>

            <button
              type="button"
              onClick={() => onSearch('42822302')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-brand-50 text-brand-700 font-bold text-sm border border-brand-200 shadow-sm hover:shadow transition-all"
            >
              <span>צפו בדוח לדוגמה: Toyota Corolla 2021</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Left Column: Floating Vehicle Preview Card (Matching Reference Image) */}
          <div className="lg:col-span-7 relative">
            {/* Decorative soft lavender glow behind card */}
            <div 
              className="absolute -inset-4 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-transparent rounded-[36px] blur-2xl -z-10"
              aria-hidden="true"
            />

            <div 
              onClick={() => onSearch('42822302')}
              className="cursor-pointer bg-white rounded-3xl p-5 sm:p-7 shadow-card hover:shadow-card-hover border border-slate-100 transition-all duration-300 lg:-rotate-1 hover:rotate-0"
            >
              {/* Top Row: Car Photo + Title & Badge */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-5 pb-6 border-b border-slate-100">
                
                {/* Vehicle Name & Sub-pill */}
                <div className="text-center sm:text-right">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight" dir="ltr">
                    Toyota Corolla
                  </h3>
                  <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1 rounded-lg bg-brand-50 text-brand-800 text-xs sm:text-sm font-bold">
                    <span>1.8 היברידי</span>
                    <span>•</span>
                    <span>2021</span>
                  </div>
                </div>

                {/* Car Photograph */}
                <div className="w-full sm:w-64 h-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-inner">
                  <img
                    src="/corolla-card.jpg"
                    alt="Toyota Corolla 2021"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/hero-sedan.jpg';
                    }}
                  />
                </div>

              </div>

              {/* Bottom Row: 3 Clean Spec Metrics */}
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 pt-5 text-center">
                
                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1.5">
                    <Cpu className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-slate-950 font-mono">
                    1,798
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    סמ"ק
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1.5">
                    <Gauge className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-slate-950 font-mono">
                    122
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    כוחות סוס
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1.5">
                    <Fuel className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-slate-950 font-mono">
                    4.5
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    ליטר ל-100 ק"מ
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          RECENT SEARCHES SECTION (#recent-searches)
         ========================================================= */}
      <section id="recent-searches" className="py-12 max-w-7xl mx-auto px-4 sm:px-8 scroll-mt-20">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-950">
                  בדיקות פופולריות ואחרונות
                </h2>
                <p className="text-xs text-slate-500">
                  לחצו על רכב לצפייה מיידית בדוח המלא
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {(recentVehicles.length > 0 ? recentVehicles : [
              { plate: '42822302', title: 'טויוטה קורולה היבריד', year: 2021, fuel: 'היברידי (בנזין + חשמל)' },
              { plate: '84457801', title: 'יונדאי איוניק היבריד', year: 2020, fuel: 'היברידי (בנזין + חשמל)' },
              { plate: '36181801', title: 'סקודה אוקטביה RS', year: 2017, fuel: 'בנזין' },
              { plate: '7943026', title: 'סקודה סופרב Ambition', year: 2021, fuel: 'טורבו-דיזל (סולר)' }
            ]).map((item) => (
              <button
                key={item.plate}
                type="button"
                onClick={() => onSearch(item.plate)}
                className="group p-4 rounded-2xl bg-[#f7f8fc] hover:bg-brand-50/60 border border-slate-200/70 hover:border-brand-200 text-right transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="inline-flex items-center bg-[#f9d616] text-slate-950 font-mono font-extrabold text-xs px-2 py-0.5 rounded border border-slate-900/40" dir="ltr">
                    {formatPlateDisplay(item.plate)}
                  </span>
                  <span className="text-[11px] font-bold text-brand-600 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                    {item.year}
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900 group-hover:text-brand-700 transition-colors">
                  {item.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {item.fuel}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FAQ SECTION (#faq-section)
         ========================================================= */}
      <section id="faq-section" className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-8 scroll-mt-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
            שאלות נפוצות
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            כל מה שחשוב לדעת על בדיקת הרכב ומקורות המידע
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full py-4 px-5 text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 hover:text-brand-600 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-brand-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
