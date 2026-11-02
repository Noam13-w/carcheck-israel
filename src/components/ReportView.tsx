import React, { useState } from 'react';
import { 
  Car, Wrench, ShieldCheck, ShieldAlert, AlertTriangle, Fuel, Gauge, 
  Calendar, Info, CheckCircle, XCircle, Printer, Share2, ArrowRight,
  ExternalLink, ChevronDown, ChevronUp, Layers, Activity, FileSpreadsheet,
  Clock, DollarSign, Check, HelpCircle, Users, RefreshCw, Sparkles, FileText,
  MapPin, Shield
} from 'lucide-react';
import { VehicleReportData, ProblemSeverity } from '../types/vehicle';
import { FuelCostCalculator } from './FuelCostCalculator';

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
  const [activeTab, setActiveTab] = useState<string>('buyer-decision');
  const [expandedProblems, setExpandedProblems] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const toggleProblem = (id: string) => {
    setExpandedProblems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?plate=${report.plateNumber}`;
    if (navigator.share) {
      navigator.share({
        title: `דוח רכב מקיף: ${report.identity.make} ${report.identity.commercialName} ${report.identity.modelYear}`,
        text: `דוח מודיעין רכב מלא עבור מספר רישוי ${report.formattedPlate}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const getSeverityBadge = (severity: ProblemSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full border border-rose-300">קריטי</span>;
      case 'high':
        return <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-300">גבוהה</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2.5 py-1 rounded-full border border-yellow-300">בינונית</span>;
      default:
        return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-300">קלה / שחיקה</span>;
    }
  };

  const navItems = [
    { id: 'buyer-decision', label: 'מדד כדאיות קנייה יד 2' },
    { id: 'identity', label: 'זהות, יד ומקוריות בעלות' },
    { id: 'specs', label: 'מפרט טכני ובטיחות' },
    { id: 'fuel', label: 'צריכת דלק ומחשבון' },
    { id: 'problems', label: 'מחלות דגם ותקלות' },
    { id: 'reliability', label: 'מדד אמינות' },
    { id: 'maintenance', label: 'שגרת טיפולים' },
    { id: 'history', label: 'היסטוריית משרד התחבורה' },
    { id: 'recalls', label: 'ריקולים וקריאות שירות' },
    { id: 'questions', label: 'שאלות חובה למוכר' },
    { id: 'costs', label: 'עלויות אחזקה ורישוי' },
    { id: 'verdict', label: 'סיכום המומחה' },
    { id: 'interlinks', label: 'רכבים ומדריכים דומים' },
    { id: 'sources', label: 'שקיפות מקורות' },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const isTestValid = report.history.registrationStatus === 'פעיל';
  const buyerScore = report.buyerDecision.purchaseScore;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Controls Banner & Cache Freshness */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 no-print">
        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>חיפוש מספר רישוי אחר</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          {onRefresh && (
            <button
              onClick={() => onRefresh(report.plateNumber)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors disabled:opacity-50"
              title="רענון נתונים בזמן אמת מול משרד התחבורה"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-brand-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'מרענן משרתי ממשלה...' : 'רענן נתונים כעת'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedShare ? 'הקישור הועתק!' : 'שיתוף דוח'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>הדפסה / שמירה כ-PDF</span>
          </button>
        </div>
      </div>

      {/* Freshness Bar */}
      {report.cacheMetadata && (
        <div className="bg-slate-100/80 px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between mb-6 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              נתונים עדכניים ממאגרי משרד התחבורה
              {report.cacheMetadata.cacheAgeDays > 0 
                ? ` (אומתו לפני ${report.cacheMetadata.cacheAgeDays} ימים)` 
                : ' (אומתו היום בזמן אמת)'}
            </span>
          </div>
          {onRefresh && (
            <button
              onClick={() => onRefresh(report.plateNumber)}
              className="text-brand-600 hover:underline font-bold text-[11px]"
            >
              הפעל בדיקה מחודשת
            </button>
          )}
        </div>
      )}

      {/* Hero Vehicle Summary Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex-1">
            {/* Plate & Hand Badges */}
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <div className="inline-flex items-center bg-[#f9d616] text-slate-950 font-mono font-black text-xl px-3.5 py-1 rounded-lg border-2 border-slate-900 shadow-sm">
                <span className="text-xs bg-[#0038b8] text-white px-1 py-0.5 rounded mr-1.5 font-sans font-bold">IL</span>
                <span>{report.formattedPlate}</span>
              </div>

              {/* Hand Estimate Badge */}
              <span className="text-sm font-extrabold bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                <Users className="w-4 h-4 text-amber-700" />
                <span>{report.identity.ownershipDetails.estimatedHandText}</span>
              </span>

              <span className="text-sm font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                שנת {report.identity.modelYear}
              </span>
              <span className="text-sm font-medium bg-brand-50 text-brand-700 px-3 py-1 rounded-lg">
                {report.identity.fuelType}
              </span>
              <span className="text-sm font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                מקוריות: {report.identity.ownershipDetails.originalHandOrigin}
              </span>
            </div>

            {/* Main Vehicle Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {report.identity.make} {report.identity.commercialName}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 font-medium mt-1">
              גרסת {report.identity.trimLevel} • קוד דגם {report.identity.model} • מנוע {report.identity.engineCode}
            </p>
          </div>

          {/* Quick Health Signals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
            
            {/* Buyer Score Gauge */}
            <div className="p-3 rounded-xl border border-brand-200 bg-brand-50/80 text-center col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-brand-800 mb-0.5">מדד כדאיות קנייה</div>
              <div className="text-2xl font-black text-brand-700 font-mono">
                {buyerScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <div className="text-[10px] font-bold text-brand-800 mt-0.5">
                סיכון {report.buyerDecision.riskLevel} לקונה
              </div>
            </div>

            {/* Test Validity */}
            <div className={`p-3 rounded-xl border text-center ${
              isTestValid ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">מבחן רישוי (טסט)</div>
              <div className={`text-sm font-bold flex items-center justify-center gap-1 ${
                isTestValid ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {isTestValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{isTestValid ? 'בתוקף' : 'פג תוקף'}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                עד {report.identity.registrationValidity}
              </div>
            </div>

            {/* Recalls Status */}
            <div className={`p-3 rounded-xl border text-center ${
              report.recalls.hasActiveRecall ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50/80 border-emerald-200'
            }`}>
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">קריאות שירות (ריקול)</div>
              <div className={`text-sm font-bold flex items-center justify-center gap-1 ${
                report.recalls.hasActiveRecall ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {report.recalls.hasActiveRecall ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{report.recalls.hasActiveRecall ? 'ריקול פתוח!' : 'נקי מקריאות'}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {report.recalls.hasActiveRecall ? 'חובה לבצע במוסך' : 'לפי מאגר התחבורה'}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Sticky Table of Contents Navigation */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur border-y border-slate-200 -mx-4 px-4 sm:mx-0 sm:px-0 sm:rounded-xl shadow-sm mb-8 no-print overflow-x-auto">
        <div className="flex items-center gap-1 p-2 min-w-max">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors ${
                activeTab === item.id 
                  ? 'bg-brand-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content Sections */}
      <div className="space-y-10">

        {/* SECTION: Buyer Decision Suite (PRE-PURCHASE HIGHLIGHT) */}
        <section id="buyer-decision" className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-900/60 scroll-mt-28">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-indigo-800/60 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg shadow-amber-400/20">
                {buyerScore}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black">מרכז קבלת החלטות לקונה רכב יד שנייה</h2>
                  <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold px-2.5 py-0.5 rounded-full">
                    ציון כדאיות: {buyerScore}/100
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  שקלול סיכונים מבוסס נתוני רישוי, קילומטראז' בטסט, ריקולים פתוחים ומחלות דגם ידועות
                </p>
              </div>
            </div>

            <div className="bg-indigo-900/70 px-4 py-2 rounded-xl border border-indigo-700/60 text-xs">
              <span className="text-slate-300">הערכת סיכון רכישה: </span>
              <span className={`font-black ${buyerScore >= 80 ? 'text-emerald-400' : buyerScore >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                סיכון {report.buyerDecision.riskLevel}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 text-sm text-slate-200 leading-relaxed font-medium">
            💡 <strong>השורה התחתונה לקונה:</strong> {report.buyerDecision.verdictHebrew}
          </div>

          {/* Decision Factors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {report.buyerDecision.scoreFactors.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3 text-xs">
                {f.status === 'good' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : f.status === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white text-xs">{f.label}</span>
                    <span className="text-[10px] text-slate-400">{f.weight}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Official Mandatory Registry Checks Banner */}
          <div className="mt-6 pt-6 border-t border-indigo-800/60">
            <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>3 בדיקות חובה ממשלתיות שכל קונה חייב לבצע טרם תשלום:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {report.buyerDecision.officialRegistryChecks.map((check, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-1.5 font-bold text-white">
                      <span>{check.title}</span>
                      <span className="text-amber-400 text-[11px]">{check.cost}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium mb-2">{check.serviceName}</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{check.description}</p>
                  </div>

                  <a
                    href={check.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-xs transition-colors"
                  >
                    <span>ביצוע בדיקה רשמית</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION A: Vehicle Identity, Ownership & Hand Intelligence */}
        <section id="identity" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק א': זהות הרכב, מקוריות בעלות ומספר יד</h2>
              <p className="text-xs text-slate-500">נתונים רשמיים ממאגר משרד התחבורה והערכת מספר בעלים קודמים</p>
            </div>
          </div>

          {/* Hand & Ownership Highlight Card */}
          <div className="mb-6 p-5 rounded-xl bg-amber-50/80 border border-amber-200 text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <span>מספר יד משוערת: {report.identity.ownershipDetails.estimatedHandText}</span>
                    <span className="text-[11px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">שנתון {report.identity.modelYear}</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {report.identity.ownershipDetails.estimatedHandExplanation}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-amber-200 text-xs shrink-0 sm:text-left">
                <span className="text-slate-500 block">מקוריות יד ראשונה:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {report.identity.ownershipDetails.originalHandOrigin}
                </span>
              </div>
            </div>

            <div className="p-3 bg-white/80 rounded-lg border border-amber-200/70 text-xs text-slate-700 leading-relaxed mb-3">
              💰 <strong>השפעה על מחיר המחירון:</strong> {report.identity.ownershipDetails.resalePriceImpact}
            </div>

            <div>
              <span className="text-xs font-bold text-slate-900 block mb-1">כיצד לאמת את מספר היד הרשמי לפני הרכישה:</span>
              <ul className="space-y-1 text-xs text-slate-600">
                {report.identity.ownershipDetails.howToVerifyDocument.map((step, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
            
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">יצרן</span>
              <span className="font-bold text-slate-900">{report.identity.make}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">כינוי מסחרי ודגם</span>
              <span className="font-bold text-slate-900">{report.identity.commercialName} ({report.identity.model})</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">רמת גימור</span>
              <span className="font-bold text-slate-900">{report.identity.trimLevel}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">שנת ייצור</span>
              <span className="font-bold text-slate-900">{report.identity.modelYear}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">מועד עליה לכביש</span>
              <span className="font-bold text-slate-900">{report.identity.firstRegistrationDate}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">תוקף רישיון רכב</span>
              <span className={`font-bold ${isTestValid ? 'text-emerald-700' : 'text-rose-700'}`}>
                {report.identity.registrationValidity}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">מבחן רישוי אחרון</span>
              <span className="font-bold text-slate-900">{report.identity.lastInspectionDate}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">סוג בעלות נוכחי</span>
              <span className="font-bold text-slate-900">{report.identity.ownershipCategory}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">צבע הרכב</span>
              <span className="font-bold text-slate-900">{report.identity.color}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">מידת צמיג קדמי</span>
              <span className="font-bold text-slate-900 font-mono text-xs">{report.identity.frontTire}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">מידת צמיג אחורי</span>
              <span className="font-bold text-slate-900 font-mono text-xs">{report.identity.rearTire}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">ארץ ייצור</span>
              <span className="font-bold text-slate-900">{report.identity.countryOfOrigin || 'לא צוין במאגר'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">קוד מנוע</span>
              <span className="font-bold text-slate-900 font-mono">{report.identity.engineCode}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">סוג דלק והנעה</span>
              <span className="font-bold text-slate-900">{report.identity.fuelType}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">מספר שלדה (מוסתר להגנת פרטיות)</span>
              <span className="font-bold text-slate-900 font-mono">{report.identity.vinMasked || 'לא צוין'}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 block mb-1">הוראת רישום משרד התחבורה</span>
              <span className="font-bold text-slate-900 font-mono">{report.identity.horaatRishum || 'לא צוין'}</span>
            </div>

          </div>
        </section>

        {/* SECTION B: Full Technical Specifications & Safety */}
        <section id="specs" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק ב': מפרט טכני מלא ומערכות בטיחות</h2>
              <p className="text-xs text-slate-500">נתוני מנוע, תיבת הילוכים, מידות ואבזור בטיחות אקטיבי</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Engine & Transmission */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-brand-600" />
                <span>מנוע, תיבת הילוכים וביצועים</span>
              </h3>

              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">נפח מנוע</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {report.specs.engine.displacementCc ? `${report.specs.engine.displacementCc.toLocaleString()} סמ"ק` : 'מנוע חשמלי'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">הספק מרבי</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {report.specs.engine.horsepower ? `${report.specs.engine.horsepower} כ"ס` : 'לא צוין'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">תיבת הילוכים</span>
                  <span className="font-bold text-slate-900">{report.specs.transmission.type}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">טכנולוגיית הנעה</span>
                  <span className="font-bold text-slate-900">{report.specs.engine.driveTechnology}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">מנגנון תזמון</span>
                  <span className="font-bold text-slate-900">{report.specs.engine.timingType || 'לא צוין'}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">משקל כולל מותר</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {report.specs.performance.grossWeightKg ? `${report.specs.performance.grossWeightKg.toLocaleString()} ק"ג` : 'לא צוין'}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">כושר גרירה (עם בלמים)</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {report.specs.performance.towingCapacityBrakedKg ? `${report.specs.performance.towingCapacityBrakedKg.toLocaleString()} ק"ג` : 'לא צוין'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-slate-500">כושר גרירה (ללא בלמים)</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {report.specs.performance.towingCapacityUnbrakedKg ? `${report.specs.performance.towingCapacityUnbrakedKg.toLocaleString()} ק"ג` : 'לא צוין'}
                  </span>
                </div>
              </div>
            </div>

            {/* Safety Equipment */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>בטיחות ואבזור אקטיבי</span>
                </h3>
                <div className="text-xs bg-brand-50 text-brand-700 font-bold px-2.5 py-1 rounded-md">
                  רמת אבזור: {report.specs.safety.safetyEquipmentLevel} מתוך 8
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                
                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasAutonomousEmergencyBraking ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasAutonomousEmergencyBraking ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>בלימת חירום אוטונומית</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasLaneDepartureWarning ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasLaneDepartureWarning ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>בקרת סטייה מנתיב</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasAdaptiveCruiseControl ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasAdaptiveCruiseControl ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>בקרת שיוט אדפטיבית</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasBlindSpotDetection ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasBlindSpotDetection ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>זיהוי שטח מת במראות</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasReverseCamera ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasReverseCamera ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>מצלמת רוורס</span>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                  report.specs.safety.hasPedestrianDetection ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {report.specs.safety.hasPedestrianDetection ? <Check className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-slate-400" />}
                  <span>זיהוי הולכי רגל</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-between col-span-2">
                  <span>כריות אוויר</span>
                  <span className="font-bold">{report.specs.safety.airbagsCount} כריות</span>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-between col-span-2">
                  <span>קבוצת זיהום ומדד ירוק</span>
                  <span className="font-bold">קבוצה {report.specs.safety.pollutionGroup} מתוך 15 {report.specs.safety.greenIndex ? `(מדד: ${report.specs.safety.greenIndex})` : ''}</span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* SECTION C: Fuel Consumption & Energy Efficiency + Interactive Calculator */}
        <section id="fuel" className="scroll-mt-28">
          <FuelCostCalculator 
            fuelData={report.fuel} 
            engineData={report.specs.engine} 
          />
        </section>

        {/* SECTION D: Known Problems & Common Mechanical Issues */}
        <section id="problems" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">חלק ד': תקלות נפוצות, נקודות תורפה ומחלות דגם</h2>
                <p className="text-xs text-slate-500">תחקיר מודיעין מכני מעמיק המבוסס על שילוב המנוע, הגיר ושנת הייצור</p>
              </div>
            </div>

            <span className="text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
              {report.knownProblems.length} נקודות תורפה אותרו
            </span>
          </div>

          <div className="space-y-4">
            {report.knownProblems.map((prob) => {
              const isExpanded = expandedProblems[prob.id] ?? true;

              return (
                <div 
                  key={prob.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all hover:border-slate-300 shadow-sm"
                >
                  <div 
                    onClick={() => toggleProblem(prob.id)}
                    className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none bg-white hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="mt-0.5 sm:mt-0">
                        {getSeverityBadge(prob.severity)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{prob.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          רלוונטי לשנים: {prob.affectedYears} {prob.affectedEngines ? `• מנועי: ${prob.affectedEngines}` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-left hidden sm:block">
                        <span className="text-xs text-slate-500 block">אומדן עלות תיקון</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          ₪{prob.estimatedCostIls.min.toLocaleString()} – ₪{prob.estimatedCostIls.max.toLocaleString()}
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-slate-200/80 bg-slate-50/70 space-y-4 text-sm">
                      <p className="text-slate-700 leading-relaxed">
                        {prob.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        
                        {/* Symptoms */}
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200/80">
                          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-rose-500" />
                            <span>תסמינים אופייניים</span>
                          </h4>
                          <ul className="space-y-1 text-xs text-slate-600">
                            {prob.symptoms.map((s, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Causes & Cost */}
                        <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                              <Wrench className="w-3.5 h-3.5 text-brand-600" />
                              <span>גורמים עיקריים</span>
                            </h4>
                            <ul className="space-y-1 text-xs text-slate-600">
                              {prob.possibleCauses.map((c, idx) => (
                                <li key={idx} className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                                  <span>{c}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-500">תקלה חוזרת:</span>
                            <span className="font-bold text-slate-800">{prob.isRecurring ? 'שכיחה בדגם' : 'דיווחים בודדים / מקרים פרטניים'}</span>
                          </div>
                        </div>

                      </div>

                      {/* Recall Info & Sources */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500">
                        {prob.hasRecallOrTsb && prob.recallCode && (
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                            קיים רקע של קריאת שירות / חוזר טכני: {prob.recallCode}
                          </span>
                        )}

                        <div className="flex items-center gap-2 mr-auto">
                          <span>מקור המידע:</span>
                          {prob.sources.map((src, i) => (
                            <span key={i} className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {src.name} {src.date ? `(${src.date})` : ''}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION E: Reliability and Maintenance Profile */}
        <section id="reliability" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק ה': מדד אמינות ואחזקה בישראל</h2>
              <p className="text-xs text-slate-500">הערכה מחקרית רב-מערכתית לאורך זמן</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Rating Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>אמינות מנוע</span>
                  <span className="text-brand-600 font-mono">{report.reliability.engineRating} / 5</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(report.reliability.engineRating / 5) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>אמינות תיבת הילוכים ומצמדים</span>
                  <span className="text-brand-600 font-mono">{report.reliability.transmissionRating} / 5</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(report.reliability.transmissionRating / 5) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>מערכות חשמל ואלקטרוניקה</span>
                  <span className="text-brand-600 font-mono">{report.reliability.electricalRating} / 5</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(report.reliability.electricalRating / 5) * 100}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span>עמידות מכלולי מתלים ושלדה</span>
                  <span className="text-brand-600 font-mono">{report.reliability.suspensionRating} / 5</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full" style={{ width: `${(report.reliability.suspensionRating / 5) * 100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Profile Info Box */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 font-semibold">זמינות חלקי חילוף בארץ:</span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {report.reliability.partsAvailabilityInIsrael}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 font-semibold">מורכבות תחזוקה שוטפת:</span>
                  <span className="text-xs font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {report.reliability.maintenanceComplexity}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {report.reliability.summaryHebrew}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-400">
                * הציון משקלל היסטוריית תקלות מדווחות, עלויות חלפים בישראל וקריאות שירות עולמיות.
              </div>
            </div>

          </div>
        </section>

        {/* SECTION F: Recommended Maintenance Schedule */}
        <section id="maintenance" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">חלק ו': שגרת טיפולים מומלצת ומפרט נוזלים</h2>
                <p className="text-xs text-slate-500">הנחיות תחזוקה מונעת לשמירה על תקינות הרכב לאורך שנים</p>
              </div>
            </div>

            {report.maintenance.recommendedOilSpec && (
              <div className="text-left hidden sm:block">
                <span className="text-[11px] text-slate-500 block">שמן מנוע מומלץ</span>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded border border-brand-200">
                  {report.maintenance.recommendedOilSpec}
                </span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 text-xs font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">פעולת תחזוקה</th>
                  <th className="py-3 px-4">מרווח קילומטרים</th>
                  <th className="py-3 px-4">מרווח חודשים</th>
                  <th className="py-3 px-4">חשיבות</th>
                  <th className="py-3 px-4">הערות טכניות</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.maintenance.schedule.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{item.item}</td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">{item.intervalKm.toLocaleString()} ק"מ</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.intervalMonths} חודשים</td>
                    <td className="py-3 px-4">
                      {item.importance === 'critical' ? (
                        <span className="bg-rose-100 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded">קריטי</span>
                      ) : (
                        <span className="bg-slate-100 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded">מומלץ</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-500">{item.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {report.maintenance.timingNotes && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 font-medium">
              💡 {report.maintenance.timingNotes}
            </div>
          )}
        </section>

        {/* SECTION G: Ministry of Transport History */}
        <section id="history" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק ז': היסטוריית רכב ממאגרי משרד התחבורה</h2>
              <p className="text-xs text-slate-500">נתוני בדיקות רישוי, קילומטראז' ושינויים מבניים מתועדים</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">קילומטראז בטסט אחרון</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                {report.history.lastInspectionMileageKm 
                  ? `${report.history.lastInspectionMileageKm.toLocaleString()} ק"מ` 
                  : 'לא קיים דיווח'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                {report.history.mileageAnalysis?.text || 'נרשם על ידי מכון הרישוי הממשלתי'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">שינוי מבנה מתועד</span>
              <span className={`text-base font-bold ${report.history.hasStructuralModification ? 'text-amber-700' : 'text-slate-800'}`}>
                {report.history.hasStructuralModification ? 'רשום שינוי מבנה' : 'ללא שינוי מבנה'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">וו גרירה, התקני נכים, ארגז וכו'</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">שינוי צבע מקורי</span>
              <span className="text-base font-bold text-slate-800">
                {report.history.hasColorChange ? 'בוצע שינוי צבע' : 'צבע מקורי ללא שינוי'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">צבע נוכחי: {report.identity.color}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">שינוי מידת צמיגים</span>
              <span className="text-base font-bold text-slate-800">
                {report.history.hasTireSizeChange ? 'אושר שינוי מידת צמיג' : 'מידת צמיג מקורית'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">קדמי: {report.identity.frontTire}</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">הסבה לגז (גפ"מ)</span>
              <span className="text-base font-bold text-slate-800">
                {report.history.hasLpgConversion ? 'מותקנת מערכת גפ"מ ברישיון' : 'ללא מערכת גז'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">מערכת גז פחמימני מעובה</p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500 block mb-1">מקוריות בעלות ראשונה</span>
              <span className="text-base font-bold text-slate-800">
                {report.history.originalOwnership || 'פרטי'}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">סיווג הבעלות ברישום הראשון</p>
            </div>

          </div>
        </section>

        {/* SECTION H: Recall and Safety Investigation */}
        <section id="recalls" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">חלק ח': חקירת ריקולים וקריאות שירות רשמיות</h2>
                <p className="text-xs text-slate-500">הצלבה מול מאגר הגבלות הריקול ומאגר קריאות השירות הכללי</p>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              report.recalls.hasActiveRecall 
                ? 'bg-rose-100 text-rose-800 border-rose-300' 
                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
            }`}>
              {report.recalls.hasActiveRecall ? '⚠️ קיים ריקול פתוח!' : '✓ אין ריקול פתוח לרכב זה'}
            </span>
          </div>

          {/* Specific Vehicle Uncompleted Recalls */}
          {report.recalls.specificVehicleUncompletedRecalls.length > 0 ? (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-950">
              <h3 className="text-sm font-extrabold flex items-center gap-2 mb-2 text-rose-900">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>לתשומת לבך: רכב זה רשום במאגר בעלי קריאות שירות שלא בוצעו!</span>
              </h3>
              <p className="text-xs leading-relaxed mb-3">
                לפי תקנות התעבורה בישראל, אי-ביצוע קריאת שירות בטיחותית בתוך 6 חודשים ממועד פתיחתה מונע את חידוש רישיון הרכב (העברת טסט) והעברת בעלות.
              </p>

              <div className="space-y-2">
                {report.recalls.specificVehicleUncompletedRecalls.map((rec, i) => (
                  <div key={i} className="p-3 bg-white rounded-lg border border-rose-200 text-xs">
                    <div className="flex justify-between font-bold text-slate-900 mb-1">
                      <span>מספר ריקול: {rec.recallId} • {rec.faultType}</span>
                      <span className="text-slate-500">נפתח ב: {rec.openDate}</span>
                    </div>
                    <p className="text-slate-700">{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-900 text-sm">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold">רכב זה אינו מופיע במאגר הרכבים בעלי קריאות שירות פתוחות.</span>
                <p className="text-xs text-emerald-700 mt-0.5">כל הריקולים הקודמים (אם היו) בוצעו כחוק במוסכי היבואן.</p>
              </div>
            </div>
          )}

          {/* Model Level Recalls */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">קריאות שירות כלליות שפורסמו עבור דגם זה בישראל:</h3>
            
            {report.recalls.modelRecalls.length > 0 ? (
              <div className="space-y-3">
                {report.recalls.modelRecalls.map((mr, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-900 mb-1.5">
                      <span>קריאה מס' {mr.recallId} • {mr.faultType} ({mr.recallYear})</span>
                      <span className="text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        יבואן: {mr.importerName}
                      </span>
                    </div>
                    <p className="text-slate-700 mb-2 leading-relaxed">{mr.description}</p>
                    <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                      <span>אופן התיקון: {mr.repairAction}</span>
                      {mr.importerPhone && <span>מוקד שירות יבואן: {mr.importerPhone}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">לא אותרו קריאות שירות כלליות חריגות במאגר עבור דגם זה.</p>
            )}
          </div>
        </section>

        {/* SECTION: Specific Seller Questions Script */}
        <section id="questions" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק ט': שאלות חובה שחייבים לשאול את המוכר</h2>
              <p className="text-xs text-slate-500">תסריט שאלות מדויק לשיחת הטלפון הראשונה ולפני תשלום על מכון בדיקה</p>
            </div>
          </div>

          <div className="space-y-3.5">
            {report.buyerDecision.sellerQuestionsScript.map((q, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black shrink-0">
                    {idx + 1}
                  </span>
                  <span>"{q.question}"</span>
                </div>
                <div className="pr-7 space-y-1 text-xs">
                  <p className="text-slate-600"><strong>למה לשאול:</strong> {q.reason}</p>
                  <p className="text-rose-700 font-semibold"><strong>נורת אזהרה לתשובה חשודה:</strong> {q.watchOutFor}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Physical inspection tips */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-2">דגשים לבדיקה פיזית עצמאית בעת המפגש עם הרכב:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {report.buyerDecision.physicalTestTips.map((tip, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-start gap-2">
                  <span className="text-brand-600 font-bold shrink-0">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION J: Operating & Ownership Costs */}
        <section id="costs" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">חלק י': עלויות אחזקה שוטפות ורישוי בישראל</h2>
              <p className="text-xs text-slate-500">אומדן הוצאות שנתיות ועלויות חלקי בלאי נפוצים</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-6">
            
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">אגרת רישוי שנתית</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₪{report.costs.annualLicensingFeeIls.toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">קבוצת רישוי {report.costs.licensingGroup}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">תקציב טיפולים שנתי משוער</span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₪{report.costs.estimatedAnnualMaintenanceIls.toLocaleString()}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">טיפול שנתי שגרתי</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">סט צמיגים (רביעייה)</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                ₪{report.costs.tireSetReplacementIls.min}–₪{report.costs.tireSetReplacementIls.max}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">לפי מידת הגלגל הרשומה</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block mb-1">החלפת מצבר / בלמים</span>
              <span className="text-lg font-bold text-slate-900 font-mono">
                ₪{report.costs.batteryReplacementIls.min}–₪{report.costs.batteryReplacementIls.max}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">ממוצע בשוק הישראלי</p>
            </div>

          </div>

          <p className="text-xs text-slate-400">
            * {report.costs.annualCostNotes} המחירים עשויים להשתנות בהתאם למוסך הנבחר, חלקים מקוריים לעומת תואמים וסגנון הנהיגה.
          </p>
        </section>

        {/* SECTION K: Overall Vehicle Assessment Verdict */}
        <section id="verdict" className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">חלק י"א: סיכום מודיעין הרכב – השורה התחתונה</h2>
              <p className="text-xs text-slate-400">חוות דעת מסכמת ו-5 התובנות החשובות ביותר לקונה</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            
            {/* Pros & Cons */}
            <div className="space-y-4">
              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>יתרונות מרכזיים של הדגם</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {report.verdict.pros.map((p, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-850 p-4 rounded-xl border border-slate-800">
                <h3 className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>חסרונות ונקודות לבדיקה קפדנית</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {report.verdict.cons.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Top 5 Takeaways */}
            <div className="bg-slate-850 p-5 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <span>5 דברים שחייבים לדעת לפני שקונים:</span>
                </h3>
                <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                  {report.verdict.top5Considerations.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-1 font-semibold">השורה התחתונה של המומחה:</div>
                <p className="text-sm font-medium text-white leading-relaxed italic">
                  "{report.verdict.bottomLine}"
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION: Programmatic SEO & Interlinking (4-5 direct referrals) */}
        <section id="interlinks" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">רכבים דומים ומדריכי בדיקה קשורים</h2>
              <p className="text-xs text-slate-500">הפניות פנימיות לדוחות רכב ומדריכי קנייה מקומיים בישראל</p>
            </div>
          </div>

          {/* Related Vehicles (4-5 direct links) */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              כלי רכב דומים שנבדקו במערכת (השוואת מפרט ונתונים):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {report.seoInterlinking.relatedVehicles.map((rel) => (
                <a
                  key={rel.plate}
                  href={`/?plate=${rel.plate}`}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-brand-500 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="bg-[#f9d616] text-slate-900 font-mono font-black text-xs px-2 py-0.5 rounded border border-slate-800/40">
                        {rel.plate.replace(/(\d{2,3})(\d{2,3})(\d{2,3})/, '$1-$2-$3')}
                      </span>
                      <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {rel.badge}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                      {rel.title}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                    <span>שנת {rel.year} • {rel.fuel}</span>
                    <span className="text-brand-600 font-bold group-hover:translate-x-[-2px] transition-transform">בדוק ←</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Local Israeli GEO Guides */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-600" />
              <span>מדריכי בדיקת רכב לפני קנייה לפי אזור וערים בישראל:</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {report.seoInterlinking.geoGuides.map((geo) => (
                <div
                  key={geo.slug}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-brand-50/40 transition-colors"
                >
                  <div className="font-bold text-xs text-slate-900 mb-0.5">{geo.name}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{geo.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: Transparency & Data Source Registry */}
        <section id="sources" className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 scroll-mt-28">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-white text-slate-800 flex items-center justify-center font-bold border border-slate-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">שקיפות מקורות מידע ורישום ממשלתי</h2>
              <p className="text-xs text-slate-500">כל עובדה בדוח זה מגובה במקור רשמי ומאומת</p>
            </div>
          </div>

          <div className="space-y-3">
            {report.sources.map((src) => (
              <div key={src.id} className="p-3.5 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900">{src.name}</span>
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {src.confidence}
                    </span>
                  </div>
                  <span className="text-slate-500 block">
                    שדות מסופקים: {src.fieldsSupplied.join(', ')}
                  </span>
                </div>

                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-800 font-medium shrink-0"
                >
                  <span>קישור למאגר data.gov.il</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-8 p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-500 leading-relaxed">
            <h4 className="font-bold text-slate-800 mb-1">הבהרה משפטית ושקיפות:</h4>
            המידע באתר מבוסס על מאגרי מידע ומקורות חיצוניים הזמינים לציבור במדינת ישראל (לרבות אתר data.gov.il). ייתכנו פערים, חוסרים או עיכובים בעדכון המידע. נתוני הדגם אינם בהכרח מעידים על מצבו המכני של הרכב הספציפי. אין לראות בדוח תחליף לבדיקה מקצועית במכון בדיקה מורשה לפני רכישה.
          </div>
        </section>

      </div>

    </div>
  );
};
