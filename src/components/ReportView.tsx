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
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VehicleReportData } from '../types/vehicle';

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
  const [copiedShare, setCopiedShare] = useState(false);

  const isTestValid = report.history.registrationStatus === 'פעיל' || report.history.registrationStatus === 'בתוקף';
  const isElectric = report.specs.engine.displacementCc === 0 || report.identity.fuelType.includes('100% EV');

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

  return (
    <div className="bg-[#f7f8fc] min-h-screen py-6 sm:py-10 px-4 sm:px-8 text-slate-900" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* =========================================================
            TOP ACTION BAR (Breadcrumb + Actions)
           ========================================================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <button
            type="button"
            onClick={onNewSearch}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-brand-600 transition-colors"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-soft-sm transition-all"
                title="רענון נתונים ישירות ממאגרי הממשלה"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-brand-600' : ''}`} />
                <span>{isRefreshing ? 'מרענן...' : 'רענון נתונים'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-soft-sm transition-all relative"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>שיתוף</span>
              <AnimatePresence>
                {copiedShare && (
                  <motion.span 
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    className="absolute -top-9 right-1/2 translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none"
                  >
                    הקישור הועתק!
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-soft-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>הדפסה / PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            CRITICAL SAFETY ALERTS (If Triggered)
           ========================================================= */}
        {report.history.isCancelledOrTotalLoss && (
          <div className="bg-rose-50 border-2 border-rose-400 p-5 rounded-3xl text-rose-950 flex items-start gap-3.5 shadow-sm">
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

        {report.history.isPublicVehicleOrTaxi && (
          <div className="bg-amber-50 border-2 border-amber-400 p-5 rounded-3xl text-amber-950 flex items-start gap-3.5 shadow-sm">
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

        {report.recalls.hasActiveRecall && (
          <div className="bg-rose-50 border-2 border-rose-300 p-5 rounded-3xl text-rose-950 flex items-start gap-3.5 shadow-sm">
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
            MAIN VEHICLE IDENTITY CARD
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          
          {/* Top Row: Vehicle Title & Authentic Israeli Yellow Plate */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-bold text-brand-700 bg-[#f0f1ff] px-3 py-1 rounded-xl">
                  {report.identity.fuelType} • {report.identity.modelYear}
                </span>
                {report.identity.trimLevel && report.identity.trimLevel !== 'סטנדרט' && (
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                    גימור {report.identity.trimLevel}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>מאומת במשרד התחבורה</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {report.identity.make} {report.identity.commercialName}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5" dir="ltr">
                {report.identity.englishMake} {report.identity.englishCommercialName}
                {report.identity.model ? ` (${report.identity.model})` : ''}
              </p>
            </div>

            {/* Authentic Israeli Yellow License Plate */}
            <div 
              className="inline-flex items-center bg-[#f9d616] text-slate-950 font-black px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-plate text-xl sm:text-2xl shrink-0 self-start sm:self-auto"
              dir="ltr"
            >
              <div className="text-[11px] bg-[#0038b8] text-white px-2 py-0.5 rounded mr-2.5 font-bold font-sans">
                IL
              </div>
              <span className="plate-font tracking-widest">{report.formattedPlate}</span>
            </div>
          </div>

          {/* =========================================================
              THE 4 CORE BUYER QUESTIONS (Exact, Verified, Non-AI)
             ========================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            
            {/* 1. Actual Hand (No Estimates!) */}
            <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/70 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">איזה יד הרכב?</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950">
                  {report.history.actualHandText}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/50">
                <span className="text-xs text-brand-700 font-bold block">
                  {report.history.licenseRegistrationNote}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  סוחר רכב מורשה אינו נספר כיד
                </span>
              </div>
            </div>

            {/* 2. Ownership & Origin */}
            <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/70 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">בעלות ומקוריות</span>
                <div className="text-lg sm:text-xl font-black text-slate-950 truncate">
                  כיום {report.history.currentOwnership}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/50">
                <span className="text-xs text-slate-600 block">
                  מקוריות: <strong className="text-slate-900">{report.history.originalOwnership}</strong>
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  מועד עלייה: {report.identity.firstRegistrationDate}
                </span>
              </div>
            </div>

            {/* 3. Official Test Mileage */}
            <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/70 text-right flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">קילומטראז׳ בטסט אחרון</span>
                <div className="text-2xl sm:text-3xl font-black text-slate-950 font-mono">
                  {report.history.lastInspectionMileageKm 
                    ? report.history.lastInspectionMileageKm.toLocaleString() 
                    : 'לא דווח'}
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/50">
                <span className="text-xs text-slate-500 block">
                  {report.history.lastInspectionMileageKm ? `נרשם בטסט ב-${report.identity.lastInspectionDate}` : 'רכב חדש – עד 3 שנים'}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  מד אוץ רשמי ממכון הרישוי
                </span>
              </div>
            </div>

            {/* 4. Test Registration Status */}
            <div className={`p-4 rounded-2xl border text-right flex flex-col justify-between ${
              isTestValid ? 'bg-emerald-50/70 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">תוקף רישוי (טסט)</span>
                <div className={`text-lg sm:text-xl font-black flex items-center gap-1.5 ${
                  isTestValid ? 'text-emerald-900' : 'text-rose-900'
                }`}>
                  {isTestValid ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  <span>{isTestValid ? 'בתוקף' : 'פג תוקף'}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-emerald-200/50">
                <span className="text-xs text-slate-700 block font-semibold">
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
            PRE-PURCHASE SUMMARY & BUYER RECOMMENDATIONS
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-[#f0f1ff] text-brand-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">סיכום תמציתי לפני קנייה</h2>
              <p className="text-xs text-slate-500">תמונת מצב מרוכזת של הנתונים החשובים לקונה</p>
            </div>
          </div>

          <div className="space-y-3.5 text-sm leading-relaxed">
            
            {/* Item 1: Ownership */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                1
              </span>
              <div>
                <strong className="text-slate-950">מספר יד ומקוריות: </strong>
                <span className="text-slate-700">
                  הרכב רשום כ-{report.history.actualHandText} (ברישיון כתוב: 0{report.history.previousOwnersCount} בעלים קודמים). 
                  {report.history.originalOwnership.includes('החכר') || report.history.originalOwnership.includes('ליסינג') 
                    ? ' עלה לכביש בליסינג/החכר – לפי מחירון לוי יצחק נדרשת הפחתה של כ-8%–14% ממחיר המחירון המשוקלל.'
                    : report.history.originalOwnership.includes('השכרה')
                      ? ' עלה לכביש בהשכרה – לפי מחירון לוי יצחק נדרשת הפחתה משמעותית של כ-15%–22% ממחיר המחירון.'
                      : ' הרכב במקוריות פרטית מלאה מיום העלייה לכביש.'}
                </span>
              </div>
            </div>

            {/* Item 2: Test & Mileage */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                2
              </span>
              <div>
                <strong className="text-slate-950">טסט וקילומטראז': </strong>
                <span className="text-slate-700">
                  טסט בתוקף עד {report.identity.registrationValidity}. 
                  {report.history.lastInspectionMileageKm ? (
                    <>
                      {' '}בטסט האחרון ב-{report.identity.lastInspectionDate} נרשמו <strong className="font-mono text-slate-950">{report.history.lastInspectionMileageKm.toLocaleString()} ק"מ</strong>. 
                      יש לוודא שמד האוץ הנוכחי ברכב גבוה מנתון זה באופן הגיוני.
                    </>
                  ) : (
                    ' ברכבים חדשים עד 3 שנים טרם נרשם קילומטראז׳ במאגר משרד התחבורה ויש לאמת באמצעות ספר טיפולים ממוסך מורשה.'
                  )}
                </span>
              </div>
            </div>

            {/* Item 3: Recalls */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
                3
              </span>
              <div>
                <strong className="text-slate-950">קריאות שירות (ריקול): </strong>
                <span className="text-slate-700">
                  {report.recalls.hasActiveRecall 
                    ? '⚠️ לרכב זה קיימת קריאת שירות פתוחה במשרד התחבורה! חובה לדרוש מבעל הרכב לבצע את התיקון במוסך היבואן לפני חתימה או העברת בעלות.'
                    : '✅ הרכב נקי מקריאות שירות (ריקול) פתוחות במאגר משרד התחבורה.'}
                </span>
              </div>
            </div>

            {/* Item 4: External Checks */}
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 border border-brand-200">
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

        {/* =========================================================
            OWNERSHIP TIMELINE (Exact Chronological History from 2017)
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f0f1ff] text-brand-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-950">היסטוריית בעלויות מלאה</h2>
                <p className="text-xs text-slate-500">תיעוד העברות הבעלות שנרשמו במשרד התחבורה מ-2017</p>
              </div>
            </div>

            <span className="text-xs font-bold bg-[#f0f1ff] text-brand-700 px-3 py-1.5 rounded-xl">
              סה״כ {report.history.actualHandText}
            </span>
          </div>

          {/* Timeline Table */}
          {report.history.ownershipTimeline && report.history.ownershipTimeline.length > 0 ? (
            <div className="overflow-x-auto mb-5">
              <table className="w-full text-right text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2.5 font-bold">תאריך העברה</th>
                    <th className="py-2.5 font-bold">סוג בעלות</th>
                    <th className="py-2.5 font-bold">ספירה כיד במחירון</th>
                    <th className="py-2.5 font-bold">סטטוס</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.history.ownershipTimeline.map((item, idx) => (
                    <tr key={idx} className={item.isCurrent ? 'bg-brand-50/40 font-bold' : ''}>
                      <td className="py-3 font-mono text-slate-800">{item.dateStr}</td>
                      <td className="py-3 font-semibold text-slate-900">
                        {item.ownership}
                        {item.isDealer && (
                          <span className="text-[11px] text-slate-500 font-normal mr-2">
                            (סוחר רכב מורשה – תו סחר)
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {item.isDealer ? (
                          <span className="text-slate-400 font-normal">לא נספר (הפקדת סוחר)</span>
                        ) : (
                          <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                            יד {item.handIndex}
                          </span>
                        )}
                      </td>
                      <td className="py-3">
                        {item.isCurrent ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-md">
                            בעלות נוכחית
                          </span>
                        ) : idx === 0 ? (
                          <span className="text-slate-500 text-xs">רישום ראשון</span>
                        ) : (
                          <span className="text-slate-400 text-xs">הועבר</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#f7f8fc] text-xs text-slate-600 mb-5">
              לרכב זה לא נרשמו העברות בעלות נוספות במאגר משרד התחבורה (הרכב נותר בידי הבעלים המקורי – {report.history.originalOwnership}).
            </div>
          )}

          {/* Legal Note on How to Verify in the Physical License */}
          <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/60 text-xs text-slate-600 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block mb-0.5">איך לאמת את הנתון ברישיון הרכב המודפס?</span>
              <span>
                ברישיון הרכב של המוכר, הביטו בשדה <strong>"בעלים קודמים"</strong>: 
                מופיע בו המספר <strong>0{report.history.previousOwnersCount}</strong>. 
                מספר היד הוא תמיד סך הבעלים הקודמים ועוד 1 (כלומר: 0{report.history.previousOwnersCount} = {report.history.actualHandText}).
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            TECHNICAL SPECIFICATIONS & EQUIPMENT
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-[#f0f1ff] text-brand-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">נתוני רישוי ומפרט טכני</h2>
              <p className="text-xs text-slate-500">נתונים רשמיים ממאגר משרד התחבורה ומדדי WLTP</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 text-xs sm:text-sm mb-6">
            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">מועד עלייה לכביש</span>
              <span className="font-bold text-slate-950">{report.identity.firstRegistrationDate}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">מנוע והספק</span>
              <span className="font-bold text-slate-950">
                {report.specs.engine.displacementCc > 0 ? `${report.specs.engine.displacementCc.toLocaleString()} סמ"ק` : 'חשמלי'}
                {report.specs.engine.horsepower > 0 ? ` (${report.specs.engine.horsepower} כ"ס)` : ''}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">תיבת הילוכים</span>
              <span className="font-bold text-slate-950">{report.specs.transmission.type}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">קוד מנוע</span>
              <span className="font-bold text-slate-950 font-mono" dir="ltr">{report.identity.engineCode}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">צבע הרכב</span>
              <span className="font-bold text-slate-950">{report.identity.color}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">מרכב ומספר דלתות</span>
              <span className="font-bold text-slate-950">{report.identity.bodyStyle} ({report.identity.doorsCount} דלתות)</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">מידת צמיגים מאושרת</span>
              <span className="font-bold text-slate-950 font-mono" dir="ltr">{report.identity.frontTire}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f7f8fc] border border-slate-100">
              <span className="text-slate-400 block mb-1">אגרת רישוי שנתית (טסט)</span>
              <span className="font-bold text-slate-950">קבוצה {report.costs.licensingGroup} (כ-₪{report.costs.annualLicensingFeeIls})</span>
            </div>
          </div>

          {/* Safety Systems Checklist */}
          <div className="p-4 rounded-2xl bg-[#f7f8fc] border border-slate-200/60">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-slate-950 text-xs sm:text-sm">מערכות בטיחות מקוריות</span>
              <span className="text-xs font-bold bg-white text-brand-700 px-3 py-1 rounded-xl border border-slate-200/80">
                רמת אבזור בטיחותי {report.specs.safety.safetyEquipmentLevel}/8 • {report.specs.safety.airbagsCount} כריות אוויר
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
                  className={`flex items-center gap-1.5 p-2 rounded-xl border ${
                    sys.active ? 'bg-white border-slate-200 text-slate-900 font-semibold' : 'bg-slate-100/60 border-transparent text-slate-400'
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

        {/* =========================================================
            MANDATORY EXTERNAL REGISTRY CHECKS
           ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-sm">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-[#f0f1ff] text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950">בדיקות רשמיות חובה לפני העברת תשלום</h2>
              <p className="text-xs text-slate-500">שירותים ממשלתיים וציבוריים שחובה לבדוק ישירות</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Check 1: Rasham HaMashkonot */}
            <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-slate-950 text-sm">רשם המשכונות (משרד המשפטים)</h3>
                  <span className="text-xs font-bold bg-white text-brand-700 px-2 py-0.5 rounded-md border border-slate-200">
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
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-brand-600 text-slate-900 hover:text-white border border-slate-300 hover:border-brand-600 rounded-xl font-bold text-xs transition-all shadow-sm"
              >
                <span>מעבר לבדיקת משכון מקוונת (משרד המשפטים)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Check 2: Insurance Clearing House */}
            <div className="p-5 rounded-2xl bg-[#f7f8fc] border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-black text-slate-950 text-sm">מרכז הסליקה של חברות הביטוח</h3>
                  <span className="text-xs font-bold bg-white text-brand-700 px-2 py-0.5 rounded-md border border-slate-200">
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
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white hover:bg-brand-600 text-slate-900 hover:text-white border border-slate-300 hover:border-brand-600 rounded-xl font-bold text-xs transition-all shadow-sm"
              >
                <span>מעבר למרכז הסליקה (היסטוריית תביעות)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};