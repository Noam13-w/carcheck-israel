import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Clock, 
  AlertTriangle, 
  Gauge, 
  Users, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp,
  Car,
  BarChart3,
  Wrench,
  Scale,
  Fuel,
  Cpu,
  Zap,
  ArrowLeft,
  ExternalLink
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
        if (key && key.startsWith('autoscope_report_')) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.identity && parsed?.plateNumber) {
              items.push({
                plate: parsed.plateNumber,
                title: `${parsed.identity.make} ${parsed.identity.commercialName}`,
                year: parsed.identity.modelYear,
                fuel: parsed.identity.fuelType,
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

  // 5 Quick Navigation Pills matching the reference mockup
  const quickFeatureCards = [
    {
      icon: Car,
      title: 'פרטי הרכב',
      subtitle: 'נתונים מלאים'
    },
    {
      icon: BarChart3,
      title: 'צריכת דלק וביצועים',
      subtitle: 'נתונים מדויקים'
    },
    {
      icon: Wrench,
      title: 'תקלות ובעיות נפוצות',
      subtitle: 'מה חשוב לדעת'
    },
    {
      icon: Clock,
      title: 'היסטוריית הרכב',
      subtitle: 'עבר, תאונות וטיפולים'
    },
    {
      icon: Scale,
      title: 'שווי שוק',
      subtitle: 'הערך המעודכן'
    }
  ];

  const faqs = [
    {
      q: 'מהיכן נלקחים נתוני הרכב באתר CarInfo?',
      a: 'כל המידע באתר נשלף ישירות בזמן אמת ממאגרי המידע הממשלתיים הפתוחים של משרד התחבורה (data.gov.il), לרבות מאגר כלי רכב פעילים, מאגר דגמי רכב ומדדי WLTP, מאגר היסטוריית בעלויות מ-2017 ומאגר קריאות שירות פתוחות.'
    },
    {
      q: 'איך מחושב מספר היד המדויק (ללא הערכות)?',
      a: 'מספר היד נקבע לפי תיעוד העברות הבעלות הרשמי במשרד התחבורה. על פי תקנות התעבורה בישראל, העברת בעלות לסוחר רכב מורשה (הפקדת סוחר / תו סחר) אינה נספרת כיד נוספת במחירון. המערכת מחשבת את מספר הידיים בפועל ומציגה את הנתון בדיוק כפי שרשום ברישיון הרכב המודפס (מספר הבעלים הקודמים).'
    },
    {
      q: 'האם המאגר הממשלתי כולל היסטוריית תאונות?',
      a: 'לא. משרד התחבורה אינו מפרסם היסטוריית תאונות או תביעות ביטוח. לצורך בדיקת עבר ביטוחי ותאונות חובה להפיק דוח ממרכז הסליקה של חברות הביטוח (מרכז הסליקה הישראלי), ולבצע בדיקה במכון בדיקה מורשה וניטרלי.'
    },
    {
      q: 'איך מוודאים שהרכב אינו ממושכן או מעוקל?',
      a: 'בדיקת משכונות מתבצעת באופן בלעדי ברשם המשכונות של משרד המשפטים (שירות מקוון רשמי בעלות אגרה ממשלתית של 10 ₪). מומלץ לבצע בדיקה זו לפני העברת תשלום או חתימה על זכרון דברים.'
    }
  ];

  return (
    <div className="bg-[#f7f8fc] text-slate-900 min-h-screen" dir="rtl">
      
      {/* =========================================================
          HERO SECTION - Faithful Reproduction of CarInfo Reference
         ========================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f9fe] via-[#f1f3fa] to-[#f7f8fc] pt-6 sm:pt-12 pb-14 sm:pb-20 border-b border-slate-200/60">
        
        {/* Soft Ambient Glows */}
        <div className="absolute top-10 right-1/4 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
          
          {/* Mobile Car Visual Preview (Shown on small screens) */}
          <div className="lg:hidden mb-6 rounded-2xl overflow-hidden shadow-lg border-2 border-white relative">
            <img 
              src="/hero-sedan.jpg" 
              alt="רכב בבדיקה עם לוחית רישוי ישראלית" 
              className="w-full h-44 object-cover object-center" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
            <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              <span>נתונים רשמיים משרד התחבורה</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            
            {/* Right Side: Headline, Subtitle, License Plate Search (RTL Start) */}
            <div className="lg:col-span-7 text-right">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-brand-700 px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-brand-200/80 shadow-soft-sm">
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                <span>מאגרי משרד התחבורה הפתוחים (data.gov.il)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-3">
                מכירים את הרכב.<br />
                <span className="text-brand-600">באמת.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8 max-w-lg">
                כל המידע על הרכב במקום אחד.<br className="hidden sm:inline" />
                מפרטים, היסטוריה, צריכת דלק, תקלות ועוד.
              </p>

              {/* Search Bar Capsule Component */}
              <div className="max-w-xl">
                <LicensePlateInput 
                  onSearch={onSearch}
                  isLoading={isLoading}
                  variant="hero"
                />
              </div>

            </div>

            {/* Left Side: Desktop Car Visual (RTL End) */}
            <div className="hidden lg:block lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group"
              >
                <img 
                  src="/hero-sedan.jpg" 
                  alt="בדיקת רכב לפי מספר רישוי - CarInfo" 
                  className="w-full h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 shadow-card flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>בדיקה רשמית לפי מספר רישוי בלבד</span>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          5 QUICK FEATURE CARDS (Directly Under Hero)
         ========================================================= */}
      <section className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {quickFeatureCards.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-card hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center justify-center gap-2 group cursor-default"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#f0f1ff] text-brand-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300">
                <item.icon className="w-5 h-5 stroke-[2]" />
              </div>
              <h3 className="font-black text-xs sm:text-sm text-slate-900 mt-1">
                {item.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          SHOWCASE: "מה תגלו בבדיקה? תמונה מלאה של הרכב"
         ========================================================= */}
      <section className="py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Right Column: Explanatory Content (RTL Start) */}
          <div className="lg:col-span-6 text-right">
            <div className="w-10 h-1 bg-brand-600 rounded-full mb-3" />
            <span className="text-xs sm:text-sm font-bold text-brand-600 uppercase tracking-wide">
              מה תגלו בבדיקה?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 mt-1 mb-4">
              תמונה מלאה של הרכב
            </h2>
            <p className="text-base text-slate-600 leading-relaxed mb-6">
              מפרט טכני, נתוני ביצועים, היסטוריה, ותקלות נפוצות – הכל במקום אחד
            </p>

            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">אימות מספר יד רשמי מ-2017</strong>
                  <span className="text-xs text-slate-500">ללא הערכות או ניחושים. סוחר רכב מורשה (תו סחר) אינו נספר כיד.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">קילומטראז׳ רשמי במבחן הרישוי האחרון</strong>
                  <span className="text-xs text-slate-500">חשיפת נתון מד האוץ שנרשם במכון הטסטים להצלבה ומניעת זיופים.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">קריאות שירות (ריקול) פתוחות</strong>
                  <span className="text-xs text-slate-500">איתור תקלות בטיחות יצרן שלא בוצעו ועלולות למנוע העברת בעלות.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 text-sm block">בדיקת רכב ציבורי והורדה מהכביש</strong>
                  <span className="text-xs text-slate-500">זיהוי מוניות לשעבר והצלבה מול מאגר רכבים שירדו מהכביש (טוטאל לוס).</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSearch('42822302')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-btn-primary hover:shadow-btn-hover transition-all"
            >
              <span>בדוק את טויוטה קורולה לדוגמה</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Left Column: Sample Toyota Corolla Preview Card (RTL End) */}
          <div className="lg:col-span-6">
            <motion.div 
              whileHover={{ y: -4 }}
              onClick={() => onSearch('42822302')}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
            >
              {/* Header with car photo & identity */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-100">
                <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <img 
                    src="/corolla-card.jpg" 
                    alt="Toyota Corolla 2021 Hybrid" 
                    className="w-full h-full object-cover object-center" 
                  />
                </div>
                
                <div className="text-right flex-1 w-full">
                  <div className="inline-block bg-[#f0f1ff] text-brand-700 font-bold text-xs px-3 py-1 rounded-xl mb-2">
                    1.8 היברידי • 2021
                  </div>
                  <h3 className="text-2xl font-black text-slate-950">
                    Toyota Corolla
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    טויוטה קורולה סדאן • דגם E180
                  </p>
                </div>
              </div>

              {/* 3 Metric Pills matching reference design */}
              <div className="grid grid-cols-3 gap-3 pt-6 text-center">
                
                <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                  <Cpu className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-black text-slate-950 font-mono">
                    1,798
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    סמ״ק
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                  <Zap className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-black text-slate-950 font-mono">
                    122
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    כוחות סוס
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                  <Fuel className="w-4 h-4 text-brand-600 mx-auto mb-1" />
                  <div className="text-lg sm:text-xl font-black text-slate-950 font-mono">
                    4.5
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    ליטר ל-100 ק״מ
                  </div>
                </div>

              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600">
                <span>לחץ לצפייה בדוח הרכב המלא של קורולה זו</span>
                <span className="font-mono bg-[#f9d616] text-slate-950 px-2.5 py-0.5 rounded-md border border-slate-900/60" dir="ltr">
                  42-822-30
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* =========================================================
          WHAT IS NOT IN THE PUBLIC REGISTRY (Trust & Transparency)
         ========================================================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-amber-50/80 rounded-3xl p-6 sm:p-8 border border-amber-200/80">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 mb-1.5">
                חשוב לדעת: מה אינו מופיע במאגרי משרד התחבורה הפתוחים?
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-4">
                המאגר הממשלתי אינו כולל נתוני תאונות, תביעות ביטוח או שעבודים. לפני העברת תשלום על רכב יד שנייה חובה לבצע:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200">
                  <span className="font-bold text-slate-950 block mb-0.5">1. בדיקת משכון ועיקול</span>
                  <span className="text-slate-600">הפקת דוח רשמי מרשם המשכונות (משרד המשפטים) – 10 ₪.</span>
                </div>
                <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200">
                  <span className="font-bold text-slate-950 block mb-0.5">2. היסטוריית תביעות ביטוח</span>
                  <span className="text-slate-600">הפקת דוח ממרכז הסליקה של חברות הביטוח לגילוי תאונות בעבר – 10 ₪.</span>
                </div>
                <div className="bg-white/90 p-3.5 rounded-2xl border border-amber-200">
                  <span className="font-bold text-slate-950 block mb-0.5">3. בדיקה פיזית במכון</span>
                  <span className="text-slate-600">בדיקת שלדה (שאסי), מנוע ומכלולים מכניים במכון מורשה וניטרלי.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          RECENT VEHICLES SECTION (If any stored)
         ========================================================= */}
      {recentVehicles.length > 0 && (
        <section id="recent-searches" className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span>רכבים שבדקת לאחרונה</span>
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
                className="bg-white p-3.5 rounded-2xl shadow-soft-sm hover:shadow-card border border-slate-200/70 text-right flex items-center justify-between transition-all"
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
      <section id="faq-section" className="py-12 max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 mb-2">
            שאלות ותשובות נפוצות
          </h2>
          <p className="text-sm text-slate-500">
            הסברים מקצועיים על מאגרי הרישוי, בדיקת ידיים וקניית רכב יד שנייה
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/70 overflow-hidden shadow-soft-sm transition-all"
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
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
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