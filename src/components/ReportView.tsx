import React, { useState } from 'react';
import { 
  Car, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Share2, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw,
  Users,
  Gauge,
  Calendar,
  FileText,
  Fuel,
  Cpu,
  Check,
  Zap,
  HelpCircle,
  AlertCircle,
  Info,
  Compass,
  BookOpen,
  Wrench,
  HelpCircle as QuestionIcon,
  Shield,
  Layers,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleReportData } from '../types/vehicle';

interface ReportViewProps {
  report: VehicleReportData;
  onNewSearch: () => void;
  onSearchPlate?: (plate: string) => void;
  onRefresh?: (plate: string) => void;
  isRefreshing?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({ 
  report, 
  onNewSearch, 
  onSearchPlate,
  onRefresh,
  isRefreshing = false 
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'problems' | 'specs' | 'questions' | 'legal'>('summary');

  const isTestValid = report.history.registrationStatus === 'פעיל' || report.history.registrationStatus === 'בתוקף';
  const isElectric = report.specs.engine.displacementCc === 0 || report.identity.fuelType.includes('100% EV');

  // Robust Hand Fallbacks
  const displayHandText = report.history?.actualHandText 
    || (report.history?.actualHandNumber ? `יד ${report.history.actualHandNumber}` : null)
    || report.identity?.ownershipDetails?.estimatedHandText 
    || 'יד 1';

  const displayPrevOwners = report.history?.previousOwnersCount !== undefined 
    ? report.history.previousOwnersCount 
    : (report.history?.actualHandNumber ? Math.max(0, report.history.actualHandNumber - 1) : 0);

  const displayRegistrationNote = report.history?.licenseRegistrationNote 
    || `ברישיון הרכב רשום: 0${displayPrevOwners} בעלים קודמים`;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/car/${report.plateNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `דוח רכב CarInfo - ${report.identity.make} ${report.identity.commercialName} (${report.formattedPlate})`,
        text: `דוח היסטוריה ומפרט מלא לרכב מספר ${report.formattedPlate}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleRelatedClick = (plate: string) => {
    if (onSearchPlate) {
      onSearchPlate(plate);
    } else {
      window.location.href = `/car/${plate}`;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10 px-4 sm:px-8 text-slate-900" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* =========================================================
            TOP ACTION BAR (Breadcrumb + Actions)
           ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onNewSearch}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>חזרה לחיפוש רכב אחר</span>
          </button>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={() => onRefresh(report.plateNumber)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold shadow-sm transition-all"
                title="רענון נתונים ישירות ממאגרי הממשלה"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-700' : ''}`} />
                <span>{isRefreshing ? 'מרענן...' : 'רענון נתונים'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold shadow-sm transition-all relative"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>שיתוף</span>
              <AnimatePresence>
                {copiedShare && (
                  <motion.span 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute -top-9 right-1/2 translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-50 pointer-events-none"
                  >
                    הקישור הועתק!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>הדפסה / PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            CRITICAL SAFETY ALERTS (If Triggered)
           ========================================================= */}
        {report.history?.isCancelledOrTotalLoss && (
          <div className="bg-rose-50 border-2 border-rose-500 p-5 rounded-xl text-rose-950 flex items-start gap-3.5 shadow-sm">
            <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-base text-rose-900">
                אזהרה קריטית: רכב זה רשום במאגר הרכבים שירדו מהכביש בביטול סופי!
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                רכב זה הוגדר כטוטאל לוס או ירד מהכביש לצמיתות (תאריך ביטול: {report.history.cancellationDate || 'לא צוין'}). חל איסור מוחלט על נסיעה או רכישה!
              </p>
            </div>
          </div>
        )}

        {report.history?.isPublicVehicleOrTaxi && (
          <div className="bg-amber-50 border-2 border-amber-500 p-5 rounded-xl text-amber-950 flex items-start gap-3.5 shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-base text-amber-900">
                התראה: רכב זה רשום במאגר כלי הרכב הציבוריים ({report.history.publicVehicleType || 'מונית / רכב סיור'})!
              </h3>
              <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
                לרכבים ציבוריים לשעבר קיים בלאי גבוה מאוד ומשמעות כבדה על שווי השוק והמחירון (הפחתה של עד עשרות אחוזים).
              </p>
            </div>
          </div>
        )}

        {report.recalls?.hasActiveRecall && (
          <div className="bg-rose-50 border-2 border-rose-400 p-5 rounded-xl text-rose-950 flex items-start gap-3.5 shadow-sm">
            <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-base text-rose-900">
                התראה: קיימת קריאת שירות (ריקול) פתוחה במשרד התחבורה!
              </h3>
              <p className="text-xs sm:text-sm text-rose-800 mt-1 leading-relaxed">
                לרכב זה רשומה תקלת יצרן בטיחותית שלא בוצעה. על פי החוק בישראל, לא ניתן לחדש רישיון רכב או להעביר בעלות אם הריקול פתוח מעל 6 חודשים. התיקון מבוצע במוסכי היבואן ללא תשלום!
              </p>
            </div>
          </div>
        )}

        {/* =========================================================
            EXECUTIVE AUDIT MASTHEAD & PLATE
           ========================================================= */}
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  {report.identity.fuelType} • שנת {report.identity.modelYear}
                </span>
                {report.identity.trimLevel && report.identity.trimLevel !== 'סטנדרט' && (
                  <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    רמת גימור: {report.identity.trimLevel}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>מאומת משרד התחבורה</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {report.identity.make} {report.identity.commercialName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 font-mono mt-0.5" dir="ltr">
                {report.identity.englishMake} {report.identity.englishCommercialName}
                {report.identity.model ? ` (${report.identity.model})` : ''}
              </p>
            </div>

            {/* Authentic Israeli Yellow License Plate */}
            <div 
              className="inline-flex items-center bg-[#facc15] text-slate-950 font-black px-4 py-2 rounded-xl border-2 border-slate-950 shadow-sm text-xl sm:text-2xl shrink-0 self-start sm:self-auto"
              dir="ltr"
            >
              <div className="text-[11px] bg-[#0038b8] text-white px-2 py-0.5 rounded mr-2.5 font-bold font-sans">
                IL
              </div>
              <span className="plate-font tracking-widest">{report.formattedPlate}</span>
            </div>
          </div>

          {/* =========================================================
              THE 4 CORE BUYER VERDICTS (Large, Clear, Definitive)
             ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            
            {/* 1. Actual Hand (Prominent & Explicit!) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">איזה יד הרכב בפועל?</span>
                <div className="text-3xl sm:text-4xl font-black text-slate-950">
                  {displayHandText}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200">
                <span className="text-xs text-blue-900 font-bold block bg-blue-50 px-2 py-1 rounded border border-blue-200 mb-1">
                  {displayRegistrationNote}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  סוחר רכב מורשה (תו סחר) אינו נספר כיד
                </span>
              </div>
            </div>

            {/* 2. Ownership & Origin */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">בעלות נוכחית ומקוריות</span>
                <div className="text-lg sm:text-xl font-black text-slate-950 truncate">
                  כיום {report.history?.currentOwnership || 'פרטי'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-700 block">
                  מקוריות: <strong className="text-slate-950">{report.history?.originalOwnership || 'פרטי'}</strong>
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  מועד עלייה: {report.identity.firstRegistrationDate}
                </span>
              </div>
            </div>

            {/* 3. Official Test Mileage */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">קילומטראז׳ בטסט אחרון</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  {report.history?.lastInspectionMileageKm 
                    ? report.history.lastInspectionMileageKm.toLocaleString() 
                    : 'לא דווח'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200">
                <span className="text-xs text-slate-600 block">
                  {report.history?.lastInspectionMileageKm ? `נרשם בטסט ב-${report.identity.lastInspectionDate}` : 'רכב חדש – עד 3 שנים'}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  מד אוץ רשמי ממכון הרישוי
                </span>
              </div>
            </div>

            {/* 4. Test Registration Status */}
            <div className={`p-4 rounded-xl border text-right flex flex-col justify-between ${
              isTestValid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">תוקף רישוי (טסט)</span>
                <div className={`text-lg sm:text-xl font-black flex items-center gap-1.5 ${
                  isTestValid ? 'text-emerald-950' : 'text-rose-950'
                }`}>
                  {isTestValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <span>{isTestValid ? 'טסט בתוקף' : 'פג תוקף'}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200">
                <span className="text-xs text-slate-800 block font-semibold">
                  עד {report.identity.registrationValidity}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  אגרת רישוי: קבוצה {report.costs.licensingGroup}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* =========================================================
            STRUCTURED REPORT NAVIGATION TABS
           ========================================================= */}
        <div className="flex border-b border-slate-300 bg-white rounded-t-xl px-2 pt-2 gap-1 overflow-x-auto no-print">
          <button
            type="button"
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'summary' 
                ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>היסטוריה ובעלויות</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('problems')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'problems' 
                ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>תקלות נפוצות ואמינות ({report.knownProblems?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'specs' 
                ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>מפרט טכני וטיפולים</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'questions' 
                ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <QuestionIcon className="w-4 h-4" />
            <span>שאלות חובה למוכר</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('legal')}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'legal' 
                ? 'border-blue-700 text-blue-800 bg-blue-50/50 rounded-t-lg' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>בדיקות משפטיות חובה</span>
          </button>
        </div>

        {/* =========================================================
            TAB 1: OWNERSHIP TIMELINE & EXECUTIVE SUMMARY
           ========================================================= */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            
            {/* Pre-purchase Action Checklist */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">סיכום תמציתי לפני קנייה</h2>
                  <p className="text-xs text-slate-500">תמונת מצב מרוכזת של הנתונים החשובים לקונה</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm leading-relaxed">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-slate-950">מספר יד ומקוריות: </strong>
                    <span className="text-slate-700">
                      הרכב רשום כ-{displayHandText} (ברישיון כתוב: 0{displayPrevOwners} בעלים קודמים). 
                      {report.history?.originalOwnership?.includes('החכר') || report.history?.originalOwnership?.includes('ליסינג') 
                        ? ' עלה לכביש בליסינג/החכר – לפי מחירון לוי יצחק נדרשת הפחתה של כ-8%–14% ממחיר המחירון המשוקלל.'
                        : report.history?.originalOwnership?.includes('השכרה')
                          ? ' עלה לכביש בהשכרה – לפי מחירון לוי יצחק נדרשת הפחתה משמעותית של כ-15%–22% ממחיר המחירון.'
                          : ' הרכב במקוריות פרטית מלאה מיום העלייה לכביש.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-slate-950">טסט וקילומטראז': </strong>
                    <span className="text-slate-700">
                      טסט בתוקף עד {report.identity.registrationValidity}. 
                      {report.history?.lastInspectionMileageKm ? (
                        <>
                          {' '}בטסט האחרון ב-{report.identity.lastInspectionDate} נרשמו <strong className="font-mono text-slate-950">{report.history.lastInspectionMileageKm.toLocaleString()} ק"מ</strong>. 
                          השוו למד האוץ ברכב: מד האוץ בלוח השעונים חייב להיות גבוה מנתון זה באופן הגיוני.
                        </>
                      ) : (
                        ' ברכבים חדשים עד 3 שנים טרם נרשם קילומטראז׳ במאגר משרד התחבורה ויש לאמת באמצעות ספר טיפולים ממוסך מורשה.'
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-slate-950">קריאות שירות (ריקול): </strong>
                    <span className="text-slate-700">
                      {report.recalls?.hasActiveRecall 
                        ? '⚠️ לרכב זה קיימת קריאת שירות פתוחה במשרד התחבורה! חובה לדרוש מבעל הרכב לבצע את התיקון במוסך היבואן לפני חתימה או העברת בעלות.'
                        : '✅ הרכב נקי מקריאות שירות (ריקול) פתוחות במאגר משרד התחבורה.'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <strong className="text-slate-950">מה חובה לבדוק בנפרד (אינו במאגר משרד התחבורה): </strong>
                    <span className="text-slate-700">
                      המאגר הממשלתי אינו כולל נתוני שעבודים או תאונות. מומלץ לבצע בדיקת משכון ברשם המשכונות (10 ₪) ובדיקת תביעות במרכז הסליקה של חברות הביטוח (10 ₪).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Ownership Timeline */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-950">היסטוריית בעלויות מלאה</h2>
                    <p className="text-xs text-slate-500">תיעוד העברות הבעלות שנרשמו במשרד התחבורה מ-2017</p>
                  </div>
                </div>

                <span className="text-xs font-bold bg-blue-50 text-blue-900 px-3 py-1 rounded border border-blue-200">
                  סה״כ {displayHandText}
                </span>
              </div>

              {/* Timeline Table */}
              <div className="overflow-x-auto mb-5 border border-slate-200 rounded-lg">
                <table className="w-full text-right text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3 font-bold">תאריך העברה</th>
                      <th className="py-2.5 px-3 font-bold">סוג בעלות</th>
                      <th className="py-2.5 px-3 font-bold">ספירה כיד במחירון</th>
                      <th className="py-2.5 px-3 font-bold">סטטוס והערות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {report.history?.ownershipTimeline?.map((item, idx) => (
                      <tr key={idx} className={item.isCurrent ? 'bg-blue-50/50 font-bold' : ''}>
                        <td className="py-3 px-3 font-mono text-slate-800">{item.dateStr}</td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {item.ownership}
                          {item.isDealer && (
                            <span className="text-[11px] text-slate-500 font-normal mr-2">
                              (סוחר רכב מורשה – תו סחר)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.isDealer ? (
                            <span className="text-slate-400 font-normal">לא נספר (הפקדת סוחר)</span>
                          ) : (
                            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              יד {item.handIndex || idx + 1}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {item.isCurrent ? (
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                              בעלות נוכחית
                            </span>
                          ) : idx === 0 ? (
                            <span className="text-slate-500 text-xs">רישום ראשון</span>
                          ) : (
                            <span className="text-slate-400 text-xs">הועבר</span>
                          )}
                          {item.note && (
                            <span className="text-[11px] text-slate-500 block font-normal mt-0.5">
                              {item.note}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Physical License Verification Rule */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block mb-0.5">איך לאמת את הנתון ברישיון הרכב המודפס של המוכר?</span>
                  <span>
                    ברישיון הרכב של המוכר, הביטו בשדה <strong>"בעלים קודמים"</strong>: 
                    מופיע בו המספר <strong>0{displayPrevOwners}</strong>. 
                    מספר היד הוא תמיד סך הבעלים הקודמים ועוד 1 (כלומר: 0{displayPrevOwners} = {displayHandText}).
                  </span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 2: MECHANICAL PROBLEMS, RELIABILITY & RECALLS
           ========================================================= */}
        {activeTab === 'problems' && (
          <div className="space-y-6">
            
            {/* Reliability Ratings Breakdown */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">מדד אמינות מכלולים (מומחי רכב)</h2>
                  <p className="text-xs text-slate-500">הערכת שרידות מכנית לפי ניסיון מוסכים בישראל</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 text-right">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">אמינות מנוע</span>
                  <strong className="text-lg font-black text-slate-900">{report.reliability?.engineRating || 4.2} / 5</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">אמינות גיר</span>
                  <strong className="text-lg font-black text-slate-900">{report.reliability?.transmissionRating || 4.1} / 5</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">חשמל ואלקטרוניקה</span>
                  <strong className="text-lg font-black text-slate-900">{report.reliability?.electricalRating || 4.3} / 5</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block mb-1">זמינות חלפים</span>
                  <strong className="text-lg font-black text-slate-900">{report.reliability?.partsAvailabilityInIsrael || 'גבוהה'}</strong>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {report.reliability?.summaryHebrew || 'רכב נפוץ המציג שרידות כללית טובה כפוף לתחזוקה שוטפת בזמן לפי מפרט היצרן.'}
              </p>
            </div>

            {/* Known Weaknesses & Mechanical Problems List */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-950">
                  תקלות סדרתיות ונקודות תורפה מוכרות ({report.knownProblems?.length || 0})
                </h2>
                <span className="text-xs text-slate-500">מה לבדוק לפני קנייה</span>
              </div>

              {report.knownProblems && report.knownProblems.length > 0 ? (
                <div className="space-y-4">
                  {report.knownProblems.map((prob) => (
                    <div key={prob.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-right">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-950 text-sm sm:text-base">
                          {prob.name}
                        </h3>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          prob.severity === 'high' || prob.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          חומרת תקלה: {prob.severity === 'high' ? 'גבוהה' : prob.severity === 'critical' ? 'קריטית' : 'בינונית'}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">
                        {prob.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-white p-3 rounded-lg border border-slate-200 mb-2">
                        <div>
                          <strong className="text-slate-900 block mb-0.5">תסמינים בנסיעת מבחן:</strong>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                            {prob.symptoms.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <strong className="text-slate-900 block mb-0.5">עלות תיקון משוערת בישראל:</strong>
                          <span className="font-bold text-slate-900 font-mono text-sm block">
                            ₪{prob.estimatedCostIls.min.toLocaleString()} – ₪{prob.estimatedCostIls.max.toLocaleString()}
                          </span>
                          {prob.estimatedCostIls.description && (
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {prob.estimatedCostIls.description}
                            </span>
                          )}
                        </div>
                      </div>

                      {prob.hasRecallOrTsb && (
                        <div className="text-[11px] font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                          {prob.recallCode || 'קיימת הנחיית שירות טכנית של היצרן (TSB)'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 text-xs text-slate-600 border border-slate-200">
                  לא דווחו תקלות סדרתיות חריגות עבור דגם זה. מומלץ לבצע בדיקה מכנית שגרתית במכון מורשה.
                </div>
              )}
            </div>

            {/* Recalls Detail */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-lg font-black text-slate-950 mb-3 pb-3 border-b border-slate-100">
                קריאות שירות רשמיות (ריקול)
              </h2>

              {report.recalls?.specificVehicleUncompletedRecalls?.length > 0 ? (
                <div className="space-y-3">
                  {report.recalls.specificVehicleUncompletedRecalls.map((rec, i) => (
                    <div key={i} className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-950">
                      <strong className="block font-bold">{rec.faultType}</strong>
                      <p className="text-xs mt-1">{rec.description}</p>
                      <span className="text-[11px] text-rose-700 block mt-1">נפתח בתאריך: {rec.openDate}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>רכב זה נקי מקריאות שירות (ריקול) פתוחות במאגר משרד התחבורה.</span>
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================
            TAB 3: COMPLETE SPECS & MAINTENANCE
           ========================================================= */}
        {activeTab === 'specs' && (
          <div className="space-y-6">
            
            {/* Technical Specs */}
            <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">מפרט טכני מלא ונתוני רישוי</h2>
                  <p className="text-xs text-slate-500">נתונים רשמיים ממאגר משרד התחבורה ומדדי WLTP</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs sm:text-sm mb-6">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">מועד עלייה לכביש</span>
                  <span className="font-bold text-slate-950">{report.identity.firstRegistrationDate}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">מנוע והספק</span>
                  <span className="font-bold text-slate-950">
                    {report.specs.engine.displacementCc > 0 ? `${report.specs.engine.displacementCc.toLocaleString()} סמ"ק` : 'חשמלי'}
                    {report.specs.engine.horsepower > 0 ? ` (${report.specs.engine.horsepower} כ"ס)` : ''}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">תיבת הילוכים</span>
                  <span className="font-bold text-slate-950">{report.specs.transmission.type}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">קוד מנוע</span>
                  <span className="font-bold text-slate-950 font-mono" dir="ltr">{report.identity.engineCode}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">צבע הרכב</span>
                  <span className="font-bold text-slate-950">{report.identity.color}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">מרכב ומספר דלתות</span>
                  <span className="font-bold text-slate-950">{report.identity.bodyStyle} ({report.identity.doorsCount || 5} דלתות)</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">מידת צמיג קדמי</span>
                  <span className="font-bold text-slate-950 font-mono" dir="ltr">{report.identity.frontTire}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">מידת צמיג אחורי</span>
                  <span className="font-bold text-slate-950 font-mono" dir="ltr">{report.identity.rearTire}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">משקל כולל</span>
                  <span className="font-bold text-slate-950">{report.specs.performance.grossWeightKg ? `${report.specs.performance.grossWeightKg.toLocaleString()} ק"ג` : 'לא צוין'}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">כושר גרירה (עם בלמים)</span>
                  <span className="font-bold text-slate-950">{report.specs.performance.towingCapacityBrakedKg ? `${report.specs.performance.towingCapacityBrakedKg} ק"ג` : 'לא מאושר'}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">אגרת רישוי שנתית</span>
                  <span className="font-bold text-slate-950">קבוצה {report.costs.licensingGroup} (כ-₪{report.costs.annualLicensingFeeIls})</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block mb-0.5 text-xs">צריכת דלק משולבת (WLTP)</span>
                  <span className="font-bold text-slate-950">{report.fuel.combinedLitersPer100Km ? `${report.fuel.combinedLitersPer100Km} ל'/100 ק"מ` : 'לא נמדד'}</span>
                </div>
              </div>

              {/* Maintenance Specs */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                <h3 className="font-bold text-slate-900 text-sm mb-3">הנחיות טיפול ושמנים מומלצות</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">תקן שמן מנוע מומלץ:</span>
                    <strong className="text-slate-950">{report.maintenance?.recommendedOilSpec || '5W-30 סינטטי מלא בתקן יצרן'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">סוג תזמון מנוע (טיימינג):</span>
                    <strong className="text-slate-950">{report.specs.engine.timingType || 'שרשרת תזמון'}</strong>
                  </div>
                  <div className="bg-white p-3 rounded border border-slate-200">
                    <span className="text-slate-500 block mb-0.5">מרווח טיפולים שגרתי:</span>
                    <strong className="text-slate-950">כל 15,000 ק"מ או שנה</strong>
                  </div>
                </div>
              </div>

              {/* Safety Systems Checklist */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-950 text-xs sm:text-sm">מערכות בטיחות מקוריות</span>
                  <span className="text-xs font-bold bg-white text-blue-900 px-2.5 py-1 rounded border border-slate-200">
                    רמת אבזור {report.specs.safety.safetyEquipmentLevel}/8 • {report.specs.safety.airbagsCount} כריות אוויר
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { label: 'בקרת יציבות (ESP) ו-ABS', active: report.specs.safety.hasEsp },
                    { label: 'בקרת סטייה מנתיב', active: report.specs.safety.hasLaneDepartureWarning },
                    { label: 'בלימת חירום אוטונומית', active: report.specs.safety.hasAutonomousEmergencyBraking },
                    { label: 'בקרת שיוט אדפטיבית', active: report.specs.safety.hasAdaptiveCruiseControl },
                    { label: 'זיהוי הולכי רגל', active: report.specs.safety.hasPedestrianDetection },
                    { label: 'זיהוי שטח מת', active: report.specs.safety.hasBlindSpotDetection },
                    { label: 'מצלמת רוורס מקורית', active: report.specs.safety.hasReverseCamera },
                    { label: 'חיישני לחץ אוויר בצמיגים', active: report.specs.safety.hasTirePressureSensors }
                  ].map((sys, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center gap-1.5 p-2 rounded-lg border ${
                        sys.active ? 'bg-white border-slate-200 text-slate-900 font-semibold' : 'bg-slate-100 border-transparent text-slate-400'
                      }`}
                    >
                      {sys.active ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" />
                      ) : (
                        <span className="w-3 h-3 rounded-full border border-slate-300 shrink-0" />
                      )}
                      <span className="truncate">{sys.label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================
            TAB 4: CRITICAL SELLER QUESTIONS
           ========================================================= */}
        {activeTab === 'questions' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm text-right space-y-4">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-950">
                שאלות חובה שצריך להציג למוכר לפני חתימה או בדיקה במכון
              </h2>
              <p className="text-xs text-slate-500">מותאם למנוע ולתיבת ההילוכים של דגם זה</p>
            </div>

            <div className="space-y-3.5">
              {[
                {
                  q: 'האם יש היסטוריית טיפולים מתועדת עם קבלות ומספרי קילומטראז\' רציפים?',
                  reason: 'לוודא שהקילומטראז\' תואם את הרישום בטסט ושבוצעו טיפולים תקופתיים בזמן.',
                  warning: 'התחמקות מהצגת קבלות או טענה ש"טיפלתי אצל חבר" היא נורת אזהרה קלאסית.'
                },
                {
                  q: 'האם הרכב היה אי פעם בליסינג, השכרה או רשום על חברה בעברו?',
                  reason: 'משפיע מיידית על מחיר המחירון המשוקלל ב-8% עד 22%!',
                  warning: 'בדקו את שדה "מקוריות" וטבלת ההעברות בדוח שלנו.'
                },
                {
                  q: 'האם בוצעה לאחרונה החלפת מצמדים / שיפוץ גיר / החלפת רצועת תזמון?',
                  reason: 'אלו טיפולים יקרים (₪3,500 - ₪7,000) שלפי הגיל והקילומטראז\' ייתכן שיפלו עליך.',
                  warning: 'בדקו האם קיימת חשבונית מוסך מורשה על התיקון.'
                },
                {
                  q: 'האם קיימות פגיעות שלדה (שאסי), החלפת כנפיים, דלתות או תביעות ביטוח?',
                  reason: 'פגיעות שלדה מורידות את שווי הרכב ב-15%–40% ופוגעות בבטיחות.',
                  warning: 'חובה להפיק דוח ממרכז הסליקה של חברות הביטוח (10 ₪) ולא להסתפק במילה של המוכר.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 mb-1.5 font-bold text-slate-950">
                    <span className="w-5 h-5 rounded-full bg-blue-700 text-white text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item.q}</span>
                  </div>
                  <p className="text-slate-600 mb-1.5 pr-7">
                    <strong>למה זה קריטי: </strong>{item.reason}
                  </p>
                  <p className="text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 pr-3">
                    <strong>נורת אזהרה: </strong>{item.warning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            TAB 5: MANDATORY EXTERNAL REGISTRY CHECKS
           ========================================================= */}
        {activeTab === 'legal' && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-950">בדיקות רשמיות חובה לפני העברת תשלום</h2>
              <p className="text-xs text-slate-500">שירותים ממשלתיים וציבוריים שחובה לבדוק ישירות (אינם במאגר משרד התחבורה הפתוח)</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Check 1: Rasham HaMashkonot */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-right">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-950 text-sm">רשם המשכונות (משרד המשפטים)</h3>
                    <span className="text-xs font-bold bg-white text-blue-900 px-2 py-0.5 rounded border border-slate-200">
                      אגרה: 10 ₪
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    בדיקה רשמית לוודא שהרכב אינו משועבד לבנק, לחברת מימון או להוצאה לפועל. רכב ממושכן עלול להילקח מהקונה גם לאחר העברת בעלות בדואר!
                  </p>
                </div>

                <a
                  href="https://pledges.justice.gov.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-lg font-bold text-xs transition-all shadow-sm"
                >
                  <span>מעבר לבדיקת משכון מקוונת (משרד המשפטים)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Check 2: Insurance Clearing House */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-right">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-slate-950 text-sm">מרכז הסליקה של חברות הביטוח</h3>
                    <span className="text-xs font-bold bg-white text-blue-900 px-2 py-0.5 rounded border border-slate-200">
                      עלות: 10 ₪
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    הפקת דוח עבר ביטוחי מלא ב-7 השנים האחרונות: האם שולמו תביעות תאונה, נזקים, ירידת ערך או אובדן להלכה (טוטאל לוס שהוחזר לכביש).
                  </p>
                </div>

                <a
                  href="https://slika-ins.co.il/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 rounded-lg font-bold text-xs transition-all shadow-sm"
                >
                  <span>מעבר למרכז הסליקה (היסטוריית תביעות)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            PSEO CROSS-REFERRALS: 4-5 DIRECT INTERNAL VEHICLE LINKS
           ========================================================= */}
        {report.seoInterlinking?.relatedVehicles && (
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">רכבים דומים שנבדקו במערכת</h2>
                  <p className="text-xs text-slate-500">הפניות פנימיות לדוחות רכב נוספים ממאגר משרד התחבורה</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {report.seoInterlinking.relatedVehicles.map((rel) => (
                <button
                  key={rel.plate}
                  type="button"
                  onClick={() => handleRelatedClick(rel.plate)}
                  className="bg-slate-50 hover:bg-slate-100 p-3.5 rounded-lg border border-slate-200 text-right flex flex-col justify-between transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div 
                        className="bg-[#facc15] text-slate-950 font-mono font-bold text-[11px] px-2 py-0.5 rounded border border-slate-950"
                        dir="ltr"
                      >
                        {rel.plate}
                      </div>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {rel.year}
                      </span>
                    </div>
                    <strong className="text-xs text-slate-950 block group-hover:text-blue-700 transition-colors">
                      {rel.title}
                    </strong>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {rel.fuel}
                    </span>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-blue-700 font-bold">
                    <span>{rel.badge}</span>
                    <span>בדוק ←</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Regional Buyer Guides Hub Links */}
            {report.seoInterlinking.geoGuides && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2 mb-2 font-bold text-slate-900">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span>מדריכי קנייה אזוריים לפי אזור בארץ:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {report.seoInterlinking.geoGuides.map((geo) => (
                    <div key={geo.slug} className="p-2 bg-white rounded border border-slate-200 text-right">
                      <strong className="text-slate-950 block">{geo.name}</strong>
                      <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                        {geo.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};