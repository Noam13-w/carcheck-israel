import React, { useState } from 'react';
import { 
  Car, 
  BarChart3, 
  Wrench, 
  Clock, 
  Scale, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Fuel, 
  Gauge, 
  Cpu, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Printer, 
  Share2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  HelpCircle,
  Check
} from 'lucide-react';
import { VehicleReportData, ProblemSeverity } from '../types/vehicle';
import { FuelCostCalculator } from './FuelCostCalculator';
import { formatPlateDisplay } from '../services/api';

interface ReportViewProps {
  report: VehicleReportData;
  onNewSearch: () => void;
  onRefresh?: (plate: string) => void;
  isRefreshing?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({ 
  report, 
  onNewSearch, 
  onRefresh,
  isRefreshing = false 
}) => {
  const [activeTab, setActiveTab] = useState<string>('identity');
  const [expandedProblem, setExpandedProblem] = useState<string | null>(
    report.knownProblems[0]?.id || null
  );
  const [copiedShare, setCopiedShare] = useState(false);

  const isTestValid = report.history.registrationStatus === 'פעיל';
  const isElectric = report.specs.engine.displacementCc === 0 || report.identity.fuelType.includes('100% EV');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/car/${report.plateNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `דוח רכב CarInfo - ${report.identity.make} ${report.identity.commercialName}`,
        text: `דוח מפרט והיסטוריה לרכב מספר ${report.formattedPlate}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const navItems = [
    { id: 'identity', label: 'פרטי הרכב', icon: Car },
    { id: 'fuel', label: 'צריכת דלק וביצועים', icon: BarChart3 },
    { id: 'problems', label: 'תקלות וריקולים', icon: Wrench },
    { id: 'history', label: 'היסטוריית הרכב', icon: Clock },
    { id: 'market', label: 'שווי שוק ובדיקת קנייה', icon: Scale },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const renderSeverityBadge = (severity: ProblemSeverity) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return (
          <span className="bg-rose-50 text-rose-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-200">
            חשיבות גבוהה לבדיקה
          </span>
        );
      case 'medium':
        return (
          <span className="bg-amber-50 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-200">
            בלאי מוכר בדגם
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-200">
            תחזוקה שוטפת
          </span>
        );
    }
  };

  const engineLiters = report.specs.engine.displacementCc > 0 
    ? `${(report.specs.engine.displacementCc / 1000).toFixed(1)} ` 
    : '';

  return (
    <div className="bg-[#f7f8fc] min-h-screen py-6 sm:py-10 px-4 sm:px-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
          <button
            type="button"
            onClick={onNewSearch}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>בדיקת רכב נוסף</span>
          </button>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={() => onRefresh(report.plateNumber)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200/80 hover:border-brand-200 text-slate-700 shadow-sm transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-brand-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'מעדכן...' : 'רענון נתונים'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200/80 hover:border-brand-200 text-slate-700 shadow-sm transition-all"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-600" />
              <span>{copiedShare ? 'הקישור הועתק!' : 'שיתוף'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200/80 hover:border-brand-200 text-slate-700 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-brand-600" />
              <span>הדפסה / PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            MAIN VEHICLE SUMMARY CARD (Matching CarInfo Card Design)
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 mb-6">
          
          {/* Top Row: Identity & Status Pills */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-7 border-b border-slate-100">
            
            <div>
              {/* License Plate + Year Pill */}
              <div className="flex flex-wrap items-center gap-3 mb-3.5">
                <div 
                  className="inline-flex items-center bg-[#f9d616] text-slate-950 font-mono font-black text-lg sm:text-xl px-3.5 py-1 rounded-xl border-2 border-slate-900 shadow-sm"
                  dir="ltr"
                >
                  <span className="text-[11px] bg-[#0038b8] text-white px-1.5 py-0.5 rounded mr-2 font-sans font-bold">
                    IL
                  </span>
                  <span>{report.formattedPlate}</span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-brand-50 text-brand-800 text-xs sm:text-sm font-bold">
                  <span>{engineLiters}{report.identity.fuelType}</span>
                  <span>•</span>
                  <span>{report.identity.modelYear}</span>
                </div>

                {report.identity.trimLevel && (
                  <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-[#f7f8fc] px-3 py-1.5 rounded-xl border border-slate-200/60">
                    רמת גימור {report.identity.trimLevel}
                  </span>
                )}
              </div>

              {/* Vehicle Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {report.identity.make} {report.identity.commercialName}
              </h1>

              {report.identity.englishMake && (
                <p className="text-sm text-slate-400 font-bold mt-0.5" dir="ltr">
                  {report.identity.englishMake} {report.identity.englishCommercialName || ''} • {report.identity.model}
                </p>
              )}
            </div>

            {/* Right Status Indicators */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
              
              {/* Test Status Pill */}
              <div className={`flex-1 sm:flex-initial px-4 py-3 rounded-2xl border text-right whitespace-nowrap ${
                isTestValid 
                  ? 'bg-emerald-50/60 border-emerald-200/80' 
                  : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">תוקף טסט (רישוי)</div>
                <div className={`text-sm font-bold flex items-center gap-1.5 ${
                  isTestValid ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                  {isTestValid ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  <span>{isTestValid ? `עד ${report.identity.registrationValidity}` : 'פג תוקף'}</span>
                </div>
              </div>

              {/* Recall Status Pill */}
              <div className={`flex-1 sm:flex-initial px-4 py-3 rounded-2xl border text-right whitespace-nowrap ${
                report.recalls.hasActiveRecall 
                  ? 'bg-rose-50 border-rose-200' 
                  : 'bg-[#f7f8fc] border-slate-200/70'
              }`}>
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">קריאות שירות (ריקול)</div>
                <div className={`text-sm font-bold flex items-center gap-1.5 ${
                  report.recalls.hasActiveRecall ? 'text-rose-700' : 'text-slate-800'
                }`}>
                  {report.recalls.hasActiveRecall ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>קיים ריקול פתוח</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ללא ריקול פתוח</span>
                    </>
                  )}
                </div>
              </div>

              {/* Ownership Origin Pill */}
              <div className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl border border-slate-200/70 bg-[#f7f8fc] text-right whitespace-nowrap">
                <div className="text-[11px] font-semibold text-slate-500 mb-0.5">מקוריות ובעלות</div>
                <div className="text-sm font-bold text-slate-900">
                  {report.identity.ownershipDetails.originalHandOrigin}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Row: 4 Clean Key Metrics (Matching Reference Card) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100 pt-6 text-center">
            
            <div className="py-2 sm:py-0 px-3">
              <div className="flex justify-center text-brand-600 mb-1.5">
                <Cpu className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                {report.specs.engine.displacementCc > 0 
                  ? report.specs.engine.displacementCc.toLocaleString() 
                  : 'חשמלי'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {report.specs.engine.displacementCc > 0 ? 'סמ"ק' : 'הנעה חשמלית'}
              </div>
            </div>

            <div className="py-2 sm:py-0 px-3">
              <div className="flex justify-center text-brand-600 mb-1.5">
                <Gauge className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                {report.specs.engine.horsepower > 0 ? report.specs.engine.horsepower : '—'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                כוחות סוס
              </div>
            </div>

            <div className="py-2 sm:py-0 px-3">
              <div className="flex justify-center text-brand-600 mb-1.5">
                <Fuel className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                {isElectric 
                  ? `${report.fuel.officialElectricRangeKm || 420}` 
                  : (report.fuel.combinedLitersPer100Km || '—')}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {isElectric ? 'ק"מ טווח משוער' : 'ליטר ל-100 ק"מ'}
              </div>
            </div>

            <div className="py-2 sm:py-0 px-3">
              <div className="flex justify-center text-brand-600 mb-1.5">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
                {report.history.mileageAnalysis?.actualKm 
                  ? report.history.mileageAnalysis.actualKm.toLocaleString() 
                  : 'לא דווח'}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                ק"מ בטסט אחרון
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            5 PILLAR NAVIGATION BAR
           ========================================================= */}
        <div className="sticky top-18 z-30 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-card border border-slate-100 mb-8 no-print overflow-x-auto">
          <div className="flex items-center justify-between gap-1 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-950 hover:bg-[#f7f8fc]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================
            REPORT CONTENT SECTIONS
           ========================================================= */}
        <div className="space-y-8">
          
          {/* 1. פרטי הרכב ומפרט טכני (#identity) */}
          <section id="identity" className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">פרטי הרכב ומפרט טכני</h2>
                <p className="text-xs text-slate-500">נתוני רישוי רשמיים, מנוע, מידות ומערכות בטיחות</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 text-sm mb-8">
              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">יצרן ודגם</span>
                <span className="font-bold text-slate-950">{report.identity.make} {report.identity.commercialName}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">רמת גימור</span>
                <span className="font-bold text-slate-950">{report.identity.trimLevel}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">שנת ייצור ועלייה לכביש</span>
                <span className="font-bold text-slate-950">{report.identity.modelYear} ({report.identity.firstRegistrationDate})</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">ארץ ייצור</span>
                <span className="font-bold text-slate-950">{report.identity.countryOfOrigin || 'לא צוין'}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">סוג הנעה ודלק</span>
                <span className="font-bold text-slate-950">{report.identity.fuelType}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">תיבת הילוכים</span>
                <span className="font-bold text-slate-950">{report.specs.transmission.type}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">קוד מנוע ותזמון</span>
                <span className="font-bold text-slate-950" dir="ltr">
                  {report.identity.engineCode} ({report.specs.engine.timingType || 'סטנדרט'})
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">צבע הרכב</span>
                <span className="font-bold text-slate-950">{report.identity.color}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">מרכב ודלתות</span>
                <span className="font-bold text-slate-950">{report.identity.bodyStyle} ({report.identity.doorsCount} דלתות)</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">מידת צמיגים מאושרת</span>
                <span className="font-bold text-slate-950 font-mono text-xs" dir="ltr">{report.identity.frontTire}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">משקל כולל / כושר גרירה</span>
                <span className="font-bold text-slate-950">
                  {report.specs.performance.grossWeightKg ? `${report.specs.performance.grossWeightKg} ק"ג` : 'לא צוין'}
                  {report.specs.performance.towingCapacityBrakedKg ? ` (גרירה: ${report.specs.performance.towingCapacityBrakedKg} ק"ג)` : ''}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs text-slate-500 block mb-1">מספר שלדה (VIN ממוסך)</span>
                <span className="font-bold text-slate-950 font-mono text-xs" dir="ltr">{report.identity.vinMasked || 'לא צוין'}</span>
              </div>
            </div>

            {/* Safety Systems Sub-card */}
            <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="text-sm font-extrabold text-slate-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>אבזור ומערכות בטיחות מקוריות</span>
                </h3>
                <span className="text-xs font-bold bg-white text-brand-700 px-3 py-1 rounded-lg border border-slate-200/70">
                  {report.specs.safety.airbagsCount} כריות אוויר • רמת אבזור בטיחותי {report.specs.safety.safetyEquipmentLevel}/8
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 text-xs">
                {[
                  { label: 'בקרת יציבות (ESP) ו-ABS', active: report.specs.safety.hasEsp },
                  { label: 'בקרת סטייה מנתיב', active: report.specs.safety.hasLaneDepartureWarning },
                  { label: 'ניטור מרחק ובלימת חירום', active: report.specs.safety.hasAutonomousEmergencyBraking },
                  { label: 'בקרת שיוט אדפטיבית', active: report.specs.safety.hasAdaptiveCruiseControl },
                  { label: 'זיהוי הולכי רגל', active: report.specs.safety.hasPedestrianDetection },
                  { label: 'זיהוי שטח מת', active: report.specs.safety.hasBlindSpotDetection },
                  { label: 'מצלמת רוורס מקורית', active: report.specs.safety.hasReverseCamera },
                  { label: 'חיישני לחץ אוויר בצמיגים', active: report.specs.safety.hasTirePressureSensors },
                ].map((sys, idx) => (
                  <div 
                    key={idx}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border ${
                      sys.active 
                        ? 'bg-white border-slate-200/80 text-slate-900 font-semibold' 
                        : 'bg-slate-100/50 border-transparent text-slate-400'
                    }`}
                  >
                    {sys.active ? (
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span>{sys.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. צריכת דלק וביצועים (#fuel) */}
          <section id="fuel" className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">צריכת דלק, פליטות ומחשבון עלויות</h2>
                <p className="text-xs text-slate-500">נתוני אמת לפי תקן WLTP וחישוב הוצאה חודשית</p>
              </div>
            </div>

            {!isElectric && report.fuel.combinedLitersPer100Km && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-center">
                <div className="p-5 rounded-2xl bg-brand-50/70 border border-brand-100">
                  <span className="text-xs font-bold text-brand-700 block mb-1">צריכה משולבת רשמית</span>
                  <div className="text-3xl font-black text-slate-950 font-mono">
                    {report.fuel.combinedKmPerLiter} <span className="text-sm font-bold text-slate-600">ק"מ/ל׳</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    ({report.fuel.combinedLitersPer100Km} ליטר ל-100 ק"מ)
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">נסיעה עירונית</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {report.fuel.cityLitersPer100Km} <span className="text-xs font-normal text-slate-500">ל׳/100 ק"מ</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    כ-{(100 / (report.fuel.cityLitersPer100Km || 6)).toFixed(1)} ק"מ לליטר בעיר
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 block mb-1">נסיעה בין-עירונית</span>
                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {report.fuel.highwayLitersPer100Km} <span className="text-xs font-normal text-slate-500">ל׳/100 ק"מ</span>
                  </div>
                  <span className="text-xs text-slate-500 mt-1 block">
                    כ-{(100 / (report.fuel.highwayLitersPer100Km || 5)).toFixed(1)} ק"מ לליטר בכביש מהיר
                  </span>
                </div>
              </div>
            )}

            <FuelCostCalculator 
              fuelData={report.fuel} 
              engineData={report.specs.engine} 
            />
          </section>

          {/* 3. תקלות, ריקולים ושגרת טיפולים (#problems) */}
          <section id="problems" className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">תקלות נפוצות, ריקולים ושגרת טיפולים</h2>
                <p className="text-xs text-slate-500">מה חשוב לבדוק בדגם {report.identity.make} {report.identity.commercialName} לפני קנייה</p>
              </div>
            </div>

            {/* Active Recall Alert if present */}
            {report.recalls.hasActiveRecall ? (
              <div className="mb-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
                <div className="flex items-center gap-2 font-black text-base text-rose-800 mb-2">
                  <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>התראה: לרכב זה קיימת קריאת שירות (ריקול) פתוחה במאגר משרד התחבורה!</span>
                </div>
                <div className="space-y-2 text-xs sm:text-sm">
                  {report.recalls.specificVehicleUncompletedRecalls.map((rec, i) => (
                    <div key={i} className="bg-white/90 p-3.5 rounded-xl border border-rose-200">
                      <div className="font-bold text-slate-900">סוג תקלה: {rec.faultType}</div>
                      <div className="text-slate-600 mt-0.5">{rec.description} (תאריך פתיחה: {rec.openDate})</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold text-emerald-950">הרכב נקי מקריאות שירות (ריקול) פתוחות </span>
                    <span className="text-emerald-800">לפי מאגר הגבלות הרישוי של משרד התחבורה.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Known Model Issues Accordion */}
            <h3 className="text-sm font-extrabold text-slate-900 mb-3">
              נקודות תורפה ומחלות דגם מוכרות לבדיקה:
            </h3>
            <div className="space-y-3 mb-8">
              {report.knownProblems.map((prob) => {
                const isExpanded = expandedProblem === prob.id;
                return (
                  <div 
                    key={prob.id}
                    className="rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedProblem(isExpanded ? null : prob.id)}
                      className="w-full p-4 bg-[#f7f8fc] hover:bg-slate-100/80 flex items-center justify-between gap-4 text-right transition-colors"
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        {renderSeverityBadge(prob.severity)}
                        <span className="font-bold text-sm sm:text-base text-slate-950">{prob.name}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="hidden sm:inline text-xs font-bold text-slate-600 font-mono">
                          ₪{prob.estimatedCostIls.min.toLocaleString()}–₪{prob.estimatedCostIls.max.toLocaleString()}
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 sm:p-5 bg-white border-t border-slate-100 text-xs sm:text-sm space-y-3">
                        <p className="text-slate-700 leading-relaxed">{prob.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div className="p-3 rounded-xl bg-[#f7f8fc]">
                            <span className="font-bold text-slate-900 block mb-1">תסמינים בבדיקה:</span>
                            <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                              {prob.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                          </div>
                          <div className="p-3 rounded-xl bg-[#f7f8fc]">
                            <span className="font-bold text-slate-900 block mb-1">אומדן תיקון במוסך:</span>
                            <div className="font-black text-base text-brand-600 font-mono">
                              ₪{prob.estimatedCostIls.min.toLocaleString()} – ₪{prob.estimatedCostIls.max.toLocaleString()}
                            </div>
                            <span className="text-[11px] text-slate-500">מומלץ לבדוק היסטוריית החלפה מול המוכר</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Maintenance Schedule Summary */}
            <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-extrabold text-slate-950">שגרת טיפולים מומלצת ותקן שמן</h3>
                {report.maintenance.recommendedOilSpec && (
                  <span className="text-xs font-bold text-brand-700 bg-white px-3 py-1 rounded-lg border border-slate-200/70" dir="ltr">
                    Oil Spec: {report.maintenance.recommendedOilSpec}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {report.maintenance.schedule.slice(0, 6).map((m, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/60 flex flex-col justify-between">
                    <div className="font-bold text-slate-900 mb-1">{m.item}</div>
                    <div className="text-brand-600 font-semibold">
                      כל {m.intervalKm.toLocaleString()} ק"מ או {m.intervalMonths} חודשים
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. היסטוריית הרכב ובעלות (#history) */}
          <section id="history" className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">היסטוריית הרכב, קילומטראז׳ ושינויי מבנה</h2>
                <p className="text-xs text-slate-500">תיעוד ממאגרי הרישוי הממשלתיים</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Mileage Box */}
              <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">קילומטראז׳ במבחן הרישוי האחרון</span>
                <div className="text-2xl font-black text-slate-950 font-mono mb-1">
                  {report.history.mileageAnalysis?.actualKm 
                    ? `${report.history.mileageAnalysis.actualKm.toLocaleString()} ק"מ` 
                    : 'טרם דווח במאגר'}
                </div>
                <p className="text-xs text-slate-600">
                  {report.history.mileageAnalysis?.text || 'ברכבים חדשים עד 3 שנים הנתון מתעדכן בטסט הראשון.'}
                </p>
              </div>

              {/* Ownership Origin Box */}
              <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
                <span className="text-xs font-bold text-slate-500 block mb-1">מקוריות רישום ראשונה ובעלות</span>
                <div className="text-lg font-black text-slate-950 mb-1">
                  מקוריות: {report.identity.ownershipDetails.originalHandOrigin} • כיום: {report.identity.ownershipDetails.currentCategory}
                </div>
                <p className="text-xs text-slate-600">
                  {report.identity.ownershipDetails.estimatedHandText}
                </p>
              </div>

            </div>

            {/* Structural Modifications Flags */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { label: 'שינוי מבנה ברישיון', flag: report.history.hasStructuralModification },
                { label: 'מערכת גפ"מ (גז)', flag: report.history.hasLpgConversion },
                { label: 'רישום שינוי צבע', flag: report.history.hasColorChange },
                { label: 'שינוי מידת צמיגים', flag: report.history.hasTireSizeChange },
              ].map((item, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100 flex items-center justify-between">
                  <span className="font-semibold text-slate-700">{item.label}</span>
                  <span className={`font-bold px-2 py-0.5 rounded-md ${
                    item.flag ? 'bg-amber-100 text-amber-900' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {item.flag ? 'בוצע' : 'ללא'}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. שווי שוק, עלויות ובדיקות חובה לפני קנייה (#market) */}
          <section id="market" className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-100 scroll-mt-28">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">שווי שוק, עלויות רישוי ובדיקה לפני קנייה</h2>
                <p className="text-xs text-slate-500">השפעת מקוריות על המחירון, אגרת רישוי ובדיקות שעבוד ועבר ביטוחי</p>
              </div>
            </div>

            {/* Market Price Impact + Licensing Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="sm:col-span-2 p-5 rounded-2xl bg-brand-50/60 border border-brand-100">
                <span className="text-xs font-bold text-brand-700 block mb-1">השפעת מקוריות על שווי השוק והמחירון</span>
                <div className="text-sm sm:text-base font-bold text-slate-950 leading-relaxed">
                  {report.identity.ownershipDetails.resalePriceImpact}
                </div>
                <p className="text-xs text-slate-500 mt-1.5">
                  {report.identity.ownershipDetails.howToVerifyDocument[0]}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100 flex flex-col justify-center text-center">
                <span className="text-xs font-semibold text-slate-500 block mb-1">אגרת רישוי שנתית (קבוצה {report.costs.licensingGroup})</span>
                <div className="text-2xl font-black text-slate-950 font-mono">
                  ₪{report.costs.annualLicensingFeeIls.toLocaleString()}
                </div>
                <span className="text-[11px] text-slate-500 mt-1">לפי תעריף משרד התחבורה</span>
              </div>
            </div>

            {/* Official Registry Checks (Mashkonot & Slika) */}
            <h3 className="text-sm font-extrabold text-slate-950 mb-3">
              בדיקות רשמיות מומלצות לפני העברת בעלות:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 text-xs">
              {report.buyerDecision.officialRegistryChecks.map((check, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/70 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1 font-bold text-slate-950 text-sm">
                      <span>{check.title}</span>
                      <span className="text-xs text-brand-600 bg-white px-2 py-0.5 rounded-md border border-slate-200/70">{check.cost}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed mt-1">{check.description}</p>
                  </div>
                  <a
                    href={check.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-1.5 w-full py-2.5 bg-white hover:bg-brand-600 text-slate-900 hover:text-white border border-slate-200/80 hover:border-brand-600 rounded-xl font-bold text-xs transition-all shadow-sm"
                  >
                    <span>למעבר לשירות הרשמי</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            {/* Seller Questions */}
            <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-950 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-brand-600" />
                <span>שאלות מומלצות למוכר לפני שמגיעים לראות את הרכב:</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {report.buyerDecision.sellerQuestionsScript.slice(0, 4).map((q, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200/60">
                    <div className="font-bold text-slate-950 mb-1">"{q.question}"</div>
                    <div className="text-slate-500">{q.reason}</div>
                  </div>
                ))}
              </div>
            </div>

          </section>

        </div>

      </div>
    </div>
  );
};
