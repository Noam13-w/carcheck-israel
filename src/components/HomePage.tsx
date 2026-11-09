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
  ExternalLink,
  Check,
  FileCheck
} from 'lucide-react';
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

  // 5 Pillars of Vehicle Intelligence - Exactly matching CarInfo design language
  const corePillars = [
    {
      icon: Car,
      title: 'פרטי הרכב',
      subtitle: 'נתונים מלאים',
      description: 'יצרן, דגם, שנת ייצור, קוד מנוע, נפח והספק, משקלים, צמיגים מאושרים ורמת גימור.'
    },
    {
      icon: BarChart3,
      title: 'צריכת דלק וביצועים',
      subtitle: 'נתונים מדויקים',
      description: 'צריכת דלק עירונית ובינעירונית, מדדי פליטת CO2 בתקן WLTP ודירוג זיהום אוויר.'
    },
    {
      icon: Wrench,
      title: 'תקלות ובעיות נפוצות',
      subtitle: 'מה חשוב לדעת',
      description: 'נקודות תורפה סדרתיות של הדגם בישראל, סימפטומים בנסיעת מבחן ועלויות תיקון מוערכות בשקלים.'
    },
    {
      icon: Clock,
      title: 'היסטוריית הרכב',
      subtitle: 'עבר, תאונות וטיפולים',
      description: 'אימות מספר יד אמיתי מ-2017, תיעוד העברות בעלות, סוחרים, קילומטראז׳ בטסט ובדיקת ריקול.'
    },
    {
      icon: Scale,
      title: 'שווי שוק',
      subtitle: 'הערך המעודכן',
      description: 'שקלול מקוריות העלייה לכביש (ליסינג/השכרה/פרטי) וההפחתה הנדרשת במחירון לוי יצחק.'
    }
  ];

  // Popular Models for programmatic discovery & quick search
  const popularVehicles = [
    {
      plate: '42822302',
      name: 'טויוטה קורולה היברידית',
      englishName: 'Toyota Corolla Hybrid',
      year: 2021,
      engine: '1,798 סמ"ק • 122 כ"ס',
      fuel: 'בנזין-היברידי',
      status: 'טסט בתוקף',
      hand: 'יד 3 (לשעבר ליסינג)'
    },
    {
      plate: '84457801',
      name: 'יונדאי איוניק היבריד',
      englishName: 'Hyundai Ioniq Hybrid',
      year: 2020,
      engine: '1,580 סמ"ק • 141 כ"ס',
      fuel: 'בנזין-היברידי',
      status: 'טסט בתוקף',
      hand: 'יד 2 (01 בעלים קודמים)'
    },
    {
      plate: '7943026',
      name: 'סקודה סופרב דיזל',
      englishName: 'Skoda Superb TDI',
      year: 2021,
      engine: '1,968 סמ"ק • 150 כ"ס',
      fuel: 'טורבו-דיזל',
      status: 'טסט בתוקף',
      hand: 'רכב מנהלים מרווח'
    },
    {
      plate: '36181801',
      name: 'סקודה אוקטביה 1.4 TSI',
      englishName: 'Skoda Octavia 1.4',
      year: 2017,
      engine: '1,395 סמ"ק • 150 כ"ס',
      fuel: 'טורבו-בנזין',
      status: 'טסט בתוקף',
      hand: 'משפחתית פופולרית'
    },
    {
      plate: '71385104',
      name: 'לינק אנד קו 02 חשמלי',
      englishName: 'Lynk & Co 02 EV',
      year: 2026,
      engine: 'חשמלי מלא • 272 כ"ס',
      fuel: '100% חשמלי',
      status: 'חדש ברישוי',
      hand: 'קרוסאובר חשמלי מתקדם'
    },
    {
      plate: '1001160',
      name: 'טויוטה קורולה RunX',
      englishName: 'Toyota Corolla RunX',
      year: 2006,
      engine: '1,598 סמ"ק • 110 כ"ס',
      fuel: 'בנזין',
      status: 'בדיקת ריקול',
      hand: 'רכב ותיק'
    }
  ];

  const faqs = [
    {
      q: 'מהיכן נלקחים נתוני הרכב באתר CarInfo?',
      a: 'כל המידע באתר נשלף בזמן אמת ישירות ממאגרי המידע הממשלתיים הפתוחים של משרד התחבורה (data.gov.il), לרבות מאגר כלי רכב פעילים, מאגר דגמי רכב ומדדי WLTP, מאגר היסטוריית בעלויות מ-2017 ומאגר קריאות שירות (ריקול) פתוחות.'
    },
    {
      q: 'איך מחושב מספר היד המדויק (ללא הערכות)?',
      a: 'מספר היד נקבע לפי תיעוד העברות הבעלות הרשמי במשרד התחבורה. על פי תקנות התעבורה בישראל, העברת בעלות לסוחר רכב מורשה (הפקדת סוחר / תו סחר) אינה נספרת כיד נוספת במחירון. המערכת מחשבת את מספר הידיים בפועל ומציגה את הנתון בדיוק כפי שרשום ברישיון הרכב המודפס (מספר הבעלים הקודמים ועוד 1).'
    },
    {
      q: 'האם המאגר הממשלתי כולל היסטוריית תאונות?',
      a: 'לא. משרד התחבורה אינו מפרסם היסטוריית תאונות או תביעות ביטוח. לצורך בדיקת עבר ביטוחי ותאונות חובה להפיק דוח ממרכז הסליקה של חברות הביטוח (מרכז הסליקה הישראלי בעלות של 10 ₪), ולבצע בדיקה פיזית במכון בדיקה מורשה וניטרלי.'
    },
    {
      q: 'איך מוודאים שהרכב אינו ממושכן או מעוקל?',
      a: 'בדיקת משכונות מתבצעת באופן בלעדי ברשם המשכונות של משרד המשפטים (שירות מקוון רשמי בעלות אגרה ממשלתית של 10 ₪). מומלץ לבצע בדיקה זו לפני העברת תשלום או חתימה על זכרון דברים.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen" dir="rtl">
      
      {/* =========================================================
          HERO SECTION - High Authority, Crisp Human Design
         ========================================================= */}
      <section className="bg-white border-b border-slate-200 pt-8 sm:pt-14 pb-12 sm:pb-18 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column: Copy & Search (RTL Start) */}
            <div className="lg:col-span-7 text-right">
              
              {/* Official Source Indicator */}
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold mb-4 border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>מאגרי משרד התחבורה הפתוחים (data.gov.il)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.12] mb-4">
                מכירים את הרכב.<br />
                <span className="text-blue-700">באמת.</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed mb-6 sm:mb-8 max-w-xl">
                דוח רכב מקיף לפני קנייה: מספר ידיים מאומת (ללא הערכות), היסטוריית בעלויות, קילומטראז׳ בטסט, תוקף רישוי וקריאות שירות פתוחות.
              </p>

              {/* License Plate Search Bar */}
              <div className="max-w-xl">
                <LicensePlateInput 
                  onSearch={onSearch}
                  isLoading={isLoading}
                  variant="hero"
                />
              </div>

            </div>

            {/* Left Column: Authentic Photographic Vehicle Frame (RTL End) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-900 group">
                <img 
                  src="/hero-sedan.jpg" 
                  alt="בדיקת רכב לפי מספר רישוי - CarInfo" 
                  className="w-full h-[320px] sm:h-[380px] object-cover object-center group-hover:scale-102 transition-transform duration-500 ease-out" 
                />
                
                {/* Real-Data Inspection Badge Overlays */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-white">
                    <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                      ✓ אימות מספר יד מ-2017
                    </span>
                    <span className="bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-700">
                      ✓ קילומטראז' רשמי מטסט
                    </span>
                    <span className="bg-emerald-950/80 text-emerald-300 px-2.5 py-1 rounded-md border border-emerald-700">
                      ✓ בדיקת ריקול פתוח
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          5 FUNCTIONAL PILLARS OF VEHICLE INTELLIGENCE
         ========================================================= */}
      <section className="py-10 sm:py-14 max-w-7xl mx-auto px-4 sm:px-8">
        
        <div className="text-right mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-950">
            מה בודקים במאגרי משרד התחבורה לפני שקונים רכב?
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            הנתונים הרשמיים שנחשפים בבדיקת מספר הרישוי
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {corePillars.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:border-blue-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between group ${
                idx === 4 ? 'col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="flex flex-col items-center w-full">
                <div className="w-11 h-11 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-700 group-hover:text-blue-700 flex items-center justify-center mb-3 transition-colors">
                  <item.icon className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-0.5">
                  {item.title}
                </h3>
                <span className="text-xs text-slate-500 font-normal block mb-2">
                  {item.subtitle}
                </span>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 w-full flex items-center justify-center gap-1 text-[10px] font-semibold text-emerald-700">
                <Check className="w-3 h-3 stroke-[2.5]" />
                <span>נתון רשמי ומאומת</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* =========================================================
          SHOWCASE: "מה תגלו בבדיקה? תמונה מלאה של הרכב"
         ========================================================= */}
      <section className="py-10 sm:py-14 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column: Explanatory Content (RTL Start) */}
            <div className="lg:col-span-6 text-right">
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                מה תגלו בבדיקה?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 mt-1 mb-4">
                תמונה מלאה של הרכב לפני קנייה
              </h2>
              <p className="text-base text-slate-600 leading-relaxed mb-6">
                מפרט טכני, נתוני ביצועים, היסטוריית בעלויות מלאה ותקלות נפוצות – הכל במקום אחד.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">אימות מספר יד רשמי מ-2017</strong>
                    <span className="text-xs text-slate-500">ללא הערכות או ניחושים. סוחר רכב מורשה (תו סחר) אינו נספר כיד נוספת במחירון.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">קילומטראז׳ רשמי במבחן הרישוי האחרון</strong>
                    <span className="text-xs text-slate-500">חשיפת נתון מד האוץ שנרשם במכון הטסטים להצלבה מול מוכר הרכב ומניעת זיופים.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">קריאות שירות (ריקול) פתוחות</strong>
                    <span className="text-xs text-slate-500">איתור תקלות בטיחות יצרן שלא בוצעו ועלולות למנוע העברת בעלות בדואר.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 text-sm block">בדיקת רכב ציבורי והורדה מהכביש</strong>
                    <span className="text-xs text-slate-500">זיהוי מוניות לשעבר והצלבה מול מאגר רכבים שירדו מהכביש (טוטאל לוס / פירוק).</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSearch('42822302')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-sm hover:shadow transition-all"
              >
                <span>צפה בדוח המלא של טויוטה קורולה לדוגמה</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Left Column: Sample Toyota Corolla Preview Card (RTL End) */}
            <div className="lg:col-span-6">
              <div 
                onClick={() => onSearch('42822302')}
                className="bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                {/* Header with car photo & identity */}
                <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-200">
                  <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300">
                    <img 
                      src="/corolla-card.jpg" 
                      alt="Toyota Corolla 2021 Hybrid" 
                      className="w-full h-full object-cover object-center" 
                    />
                  </div>
                  
                  <div className="text-right flex-1 w-full">
                    <div className="inline-block bg-blue-50 text-blue-800 font-bold text-xs px-2.5 py-0.5 rounded-md border border-blue-200 mb-1.5">
                      1.8 היברידי • 2021
                    </div>
                    <h3 className="text-2xl font-black text-slate-950">
                      Toyota Corolla
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      טויוטה קורולה סדאן • דגם E180
                    </p>
                  </div>
                </div>

                {/* 4 Verdict Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-slate-200 text-right">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">מספר יד:</span>
                    <strong className="text-sm font-black text-slate-950">יד 3</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">ברישיון המוכר:</span>
                    <strong className="text-sm font-black text-slate-950">02 בעלים</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">קילומטראז' בטסט:</span>
                    <strong className="text-sm font-black text-slate-950 font-mono">118,651</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">תוקף טסט:</span>
                    <strong className="text-sm font-black text-emerald-700">בתוקף</strong>
                  </div>
                </div>

                {/* 3 Metric Pills */}
                <div className="grid grid-cols-3 gap-2.5 pt-4 text-center">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-base sm:text-lg font-black text-slate-950 font-mono">
                      1,798
                    </div>
                    <div className="text-[11px] text-slate-500">
                      סמ״ק
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-base sm:text-lg font-black text-slate-950 font-mono">
                      122
                    </div>
                    <div className="text-[11px] text-slate-500">
                      כוחות סוס
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <div className="text-base sm:text-lg font-black text-slate-950 font-mono">
                      4.5
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ליטר / 100 ק״מ
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-blue-700">
                  <span>לחץ לצפייה בדוח הרכב המלא</span>
                  <span className="font-mono bg-[#facc15] text-slate-950 px-2 py-0.5 rounded border border-slate-950 text-xs" dir="ltr">
                    42-822-30
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================================================
          PSEO DISCOVERY: POPULAR VEHICLE PAGES & HUBS
         ========================================================= */}
      <section id="popular-models-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div className="text-right">
            <h2 className="text-xl sm:text-2xl font-black text-slate-950">
              דגמים ורכבים מובילים לבדיקה מיידית
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              בדיקות רכב נפוצות שבוצעו במערכת מתוך מאגרי משרד התחבורה
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularVehicles.map((car) => (
            <div
              key={car.plate}
              onClick={() => onSearch(car.plate)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div 
                    className="bg-[#facc15] text-slate-950 font-mono font-bold text-xs px-2.5 py-1 rounded border border-slate-950"
                    dir="ltr"
                  >
                    {car.plate.length === 8 
                      ? `${car.plate.slice(0, 3)}-${car.plate.slice(3, 5)}-${car.plate.slice(5, 8)}`
                      : `${car.plate.slice(0, 2)}-${car.plate.slice(2, 5)}-${car.plate.slice(5, 7)}`}
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {car.year}
                  </span>
                </div>

                <h3 className="font-bold text-slate-950 text-sm mb-0.5">
                  {car.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono block mb-2" dir="ltr">
                  {car.englishName}
                </span>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>מנוע: <span className="font-semibold text-slate-800">{car.engine}</span></div>
                  <div>הנעה: <span className="font-semibold text-slate-800">{car.fuel}</span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                <span>{car.hand}</span>
                <span>צפה בדוח ←</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          WHAT IS NOT IN THE PUBLIC REGISTRY (Trust & Transparency)
         ========================================================= */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-amber-50 rounded-2xl p-6 sm:p-8 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-amber-950 mb-1">
                חשוב לדעת: מה אינו מופיע במאגרי משרד התחבורה הפתוחים?
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed mb-4">
                המאגר הממשלתי אינו כולל נתוני תאונות, תביעות ביטוח או שעבודים. לפני העברת תשלום על רכב יד שנייה חובה לבצע:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                  <span className="font-bold text-slate-950 block mb-0.5">1. בדיקת משכון ועיקול</span>
                  <span className="text-slate-600">הפקת דוח רשמי מרשם המשכונות (משרד המשפטים) בעלות אגרה של 10 ₪.</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                  <span className="font-bold text-slate-950 block mb-0.5">2. היסטוריית תביעות ביטוח</span>
                  <span className="text-slate-600">הפקת דוח ממרכז הסליקה של חברות הביטוח לגילוי תאונות בעבר בעלות של 10 ₪.</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
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
              <Clock className="w-4 h-4 text-blue-700" />
              <span>רכבים שבדקת לאחרונה</span>
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {recentVehicles.map((v) => (
              <button
                key={v.plate}
                type="button"
                onClick={() => onSearch(v.plate)}
                className="bg-white p-3.5 rounded-xl shadow-sm hover:border-blue-400 border border-slate-200 text-right flex items-center justify-between transition-all"
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">{v.title}</div>
                  <div className="text-[11px] text-slate-400">{v.year} • {v.fuel}</div>
                </div>
                <div 
                  className="bg-[#facc15] text-slate-950 font-mono font-bold text-xs px-2 py-0.5 rounded border border-slate-950"
                  dir="ltr"
                >
                  {v.plate}
                </div>
              </button>
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
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-right font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-blue-700 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};