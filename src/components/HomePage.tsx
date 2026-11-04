import React, { useState, useEffect } from 'react';
import { 
  Car, 
  BarChart3, 
  Wrench, 
  Clock, 
  Scale, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Fuel, 
  Gauge, 
  Cpu,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LicensePlateInput } from './LicensePlateInput';

interface HomePageProps {
  onSearch: (plate: string) => void;
  isLoading: boolean;
}

interface RecentVehicle {
  plate: string;
  title: string;
  year: number;
  fuel: string;
}

export const HomePage: React.FC<HomePageProps> = ({ onSearch, isLoading }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [recentVehicles, setRecentVehicles] = useState<RecentVehicle[]>([]);

  useEffect(() => {
    try {
      const items: RecentVehicle[] = [];
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
      // Ignore storage errors
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
      q: 'איזה מידע מתקבל בבדיקת מספר רישוי ב-CarInfo?',
      a: 'הבדיקה מרכזת נתוני אמת רשמיים ממאגרי משרד התחבורה ומדדי ה-WLTP: מפרט טכני מלא (הספק, נפח מנוע, תיבת הילוכים, מערכות בטיחות מקוריות), תוקף רישוי (טסט), קילומטראז׳ שנרשם במבחן הרישוי האחרון, מקוריות בעלות (פרטי, ליסינג, השכרה), קריאות שירות (ריקול) פתוחות, צריכת דלק אמיתית ומחלות דגם מוכרות.'
    },
    {
      q: 'האם המידע מתעדכן בזמן אמת?',
      a: 'כן. בכל בדיקה המערכת פונה ישירות למאגרי הממשלה (data.gov.il) ומצליבה מספר מאגרים במקביל כדי לוודא שמוצגים הנתונים הרשמיים המעודכנים ביותר ליום הבדיקה.'
    },
    {
      q: 'איך מזהים אם הרכב היה במקור בליסינג או בהשכרה?',
      a: 'בדוח הרכב מוצגת "מקוריות הרישום" כפי שדווחה בעת עליית הרכב לכביש (פרטי, החכר/ליסינג, השכרה או חברה), בליווי ניתוח ההשפעה של עבר זה על שווי השוק והמחירון.'
    },
    {
      q: 'האם השירות כרוך בתשלום או ברישום?',
      a: 'הבדיקה חופשית לחלוטין לשימוש הציבור, ללא צורך בהרשמה וללא שמירת פרטים אישיים.'
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
    <div className="bg-[#f7f8fc] text-slate-900 min-h-screen overflow-x-hidden" dir="rtl">
      
      {/* =========================================================
          HERO SECTION (Matching CarInfo Desktop & Mobile Reference)
         ========================================================= */}
      <section className="relative overflow-hidden bg-[#f7f8fc]">
        
        {/* Mobile Top Hero Image (Matches iPhone screen mockup) */}
        <div className="sm:hidden relative h-56 w-full overflow-hidden">
          <img
            src="/hero-sedan.jpg"
            alt="בדיקת רכב לפי מספר רישוי"
            className="w-full h-full object-cover object-left select-none"
          />
          <div 
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/80 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Desktop Hero Canvas */}
        <div className="relative sm:min-h-[540px] lg:min-h-[580px] flex items-center">
          
          {/* Desktop Full-Bleed Background Car Photo */}
          <img
            src="/hero-sedan.jpg"
            alt="בדיקת רכב לפי מספר רישוי"
            className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center select-none"
          />

          {/* Desktop Atmospheric Right-to-Left Gradient Overlay */}
          <div 
            className="hidden sm:block absolute inset-0 bg-gradient-to-l from-white/95 via-white/70 to-transparent"
            aria-hidden="true"
          />
          <div 
            className="hidden sm:block absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#f7f8fc] via-[#f7f8fc]/60 to-transparent"
            aria-hidden="true"
          />

          {/* Hero Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 pt-2 pb-14 sm:py-16">
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl mr-0 ml-auto text-center sm:text-right"
            >
              
              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.12] mb-3.5 sm:mb-4">
                <span className="block text-slate-950">מכירים את הרכב.</span>
                <span className="block text-brand-600">באמת.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-xl text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8">
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

            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          5 FEATURE PILLAR CARDS ROW
         ========================================================= */}
      <section className="relative z-20 -mt-6 sm:-mt-12 max-w-7xl mx-auto px-4 sm:px-8">
        {/* Desktop: 5 Cards Row | Mobile: 2x2 Grid + 1 Bottom Card (Exact Mockup Match) */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {featureCards.map((card, idx) => (
            <motion.button
              key={idx}
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 350 } }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={focusPlateInput}
              className={`group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-card hover:shadow-card-hover border border-white hover:border-brand-200/80 transition-all duration-300 flex flex-col items-center text-center focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                idx === 4 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-12 sm:w-14 h-12 sm:h-14 rounded-2xl bg-[#f0f1ff] group-hover:bg-brand-600 text-brand-600 group-hover:text-white flex items-center justify-center mb-3 transition-colors duration-300 shadow-sm">
                <card.icon className="w-6 h-6 stroke-[2]" />
              </div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900 mb-0.5">
                {card.title}
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                {card.subtitle}
              </p>
            </motion.button>
          ))}
        </div>
      </section>

      {/* =========================================================
          "מה תגלו בבדיקה?" - SAMPLE REPORT PREVIEW SECTION
         ========================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 relative">
        
        {/* Soft Lavender Background Glow Orb */}
        <div 
          className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-brand-300/30 to-brand-500/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
          
          {/* Left Column: Floating Perspective Vehicle Preview Card */}
          <div className="lg:col-span-7">
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-5 sm:p-7 shadow-card border border-white/80 relative overflow-hidden"
            >
              {/* Card Top: Car Image & Title */}
              <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
                <div className="w-full sm:w-56 h-36 rounded-2xl overflow-hidden bg-slate-100 shrink-0 shadow-sm border border-slate-100">
                  <img
                    src="/corolla-card.jpg"
                    alt="Toyota Corolla 2021"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="text-center sm:text-right flex-1">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
                    Toyota Corolla
                  </h3>
                  <div className="inline-flex items-center gap-2 bg-[#f0f1ff] text-brand-700 px-3.5 py-1 rounded-xl text-xs sm:text-sm font-bold border border-brand-100">
                    <span>1.8 היברידי</span>
                    <span>•</span>
                    <span>2021</span>
                  </div>
                </div>
              </div>

              {/* Card Bottom: 3 Key Metrics Row */}
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-100 pt-6 text-center">
                
                {/* Metric 1: Displacement */}
                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1">
                    <Cpu className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                    1,798
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    סמ"ק
                  </div>
                </div>

                {/* Metric 2: Horsepower */}
                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1">
                    <Gauge className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                    122
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    כוחות סוס
                  </div>
                </div>

                {/* Metric 3: Fuel Economy */}
                <div className="px-2">
                  <div className="flex justify-center text-brand-600 mb-1">
                    <Fuel className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                    4.5
                  </div>
                  <div className="text-xs text-slate-400 font-medium">
                    ליטר ל-100 ק"מ
                  </div>
                </div>

              </div>

            </motion.div>
          </div>

          {/* Right Column: Section Headline & Explanation */}
          <div className="lg:col-span-5 text-center sm:text-right">
            
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 tracking-wide mb-2.5">
              <Sparkles className="w-4 h-4" />
              <span>מה תגלו בבדיקה?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight mb-4">
              תמונה מלאה של הרכב
            </h2>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              מפרט טכני, נתוני ביצועים, היסטוריה, ותקלות נפוצות – הכל במקום אחד, מוגש בצורה בהירה ומדויקת.
            </p>

            <motion.button
              whileHover={{ x: -4 }}
              type="button"
              onClick={() => onSearch('42822302')}
              className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-bold text-base sm:text-lg group"
            >
              <span>צפו בדוח לדוגמה: Toyota Corolla 2021</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </motion.button>

          </div>

        </div>
      </section>

      {/* =========================================================
          RECENT VEHICLES SECTION (If any stored)
         ========================================================= */}
      {recentVehicles.length > 0 && (
        <section id="recent-searches" className="py-10 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>רכבים שחיפשת לאחרונה</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentVehicles.map((v) => (
              <motion.button
                key={v.plate}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => onSearch(v.plate)}
                className="bg-white p-3.5 rounded-2xl shadow-soft-sm hover:shadow-card border border-slate-100 text-right flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{v.title}</div>
                  <div className="text-[11px] text-slate-400">{v.year} • {v.fuel}</div>
                </div>
                <div 
                  className="bg-[#f9d616] text-slate-950 font-mono font-bold text-xs px-2 py-0.5 rounded-md border border-slate-900/60"
                  dir="ltr"
                >
                  {v.plate}
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          FAQ ACCORDION SECTION
         ========================================================= */}
      <section id="faq-section" className="py-14 max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
            שאלות נפוצות
          </h2>
          <p className="text-sm text-slate-500">
            כל מה שחשוב לדעת על הפקת דוח הרכב ונתוני משרד התחבורה
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-soft-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-right font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-[#f7f8fc] transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
