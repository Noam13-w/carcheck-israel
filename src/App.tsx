import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoadingProgress } from './components/LoadingProgress';
import { ReportView } from './components/ReportView';
import { Footer } from './components/Footer';
import { AccessibilityWidget } from './components/AccessibilityWidget';
import { CookieBanner } from './components/CookieBanner';
import { 
  AccessibilityModal, 
  PrivacyModal, 
  TermsModal, 
  CookieSettingsModal 
} from './components/LegalModals';
import { fetchVehicleReport, normalizePlate } from './services/api';
import { VehicleReportData } from './types/vehicle';
import { CookieConsentType } from './types/legal';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COOKIE_CONSENT_KEY = 'autoscope_cookie_consent';

export const App: React.FC = () => {
  const [report, setReport] = useState<VehicleReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [searchedPlate, setSearchedPlate] = useState<string>('');

  // Legal Modals State
  const [isA11yModalOpen, setIsA11yModalOpen] = useState<boolean>(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);
  const [isCookieSettingsOpen, setIsCookieSettingsOpen] = useState<boolean>(false);

  // Cookie Consent State
  const [cookieConsent, setCookieConsent] = useState<CookieConsentType>(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (stored === 'all' || stored === 'essential') return stored as CookieConsentType;
    } catch (e) {
      // Storage unavailable
    }
    return null;
  });

  const handleSaveConsent = (type: CookieConsentType) => {
    setCookieConsent(type);
    try {
      if (type) {
        localStorage.setItem(COOKIE_CONSENT_KEY, type);
      }
    } catch (e) {
      // Storage error
    }
  };

  // Handle URL routing: /car/:plate OR ?plate=:plate + Popstate
  useEffect(() => {
    const parseUrlAndLoad = () => {
      let initialPlate: string | null = null;
      const params = new URLSearchParams(window.location.search);
      if (params.get('plate')) {
        initialPlate = params.get('plate');
      } else {
        const match = window.location.pathname.match(/\/car\/(\d+)/i);
        if (match && match[1]) {
          initialPlate = match[1];
        }
      }

      if (initialPlate) {
        handleSearch(initialPlate);
      } else {
        setReport(null);
        setError(null);
        setSearchedPlate('');
      }
    };

    parseUrlAndLoad();

    const handlePopState = () => {
      parseUrlAndLoad();
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update dynamic page title & meta for SEO
  useEffect(() => {
    if (report) {
      document.title = `${report.identity.make} ${report.identity.commercialName} (${report.identity.modelYear}) - מספר ${report.formattedPlate} | CarInfo`;
    } else {
      document.title = 'CarInfo | מכירים את הרכב. באמת. – בדיקת רכב לפי מספר רישוי';
    }
  }, [report]);

  const handleSearch = async (plate: string, forceRefresh: boolean = false) => {
    const clean = normalizePlate(plate);
    if (!clean) return;

    setSearchedPlate(clean);
    setError(null);
    if (forceRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
      setLoadingStep('מתחבר לשרת משרד התחבורה...');
      setLoadingPercent(10);
    }

    // Update URL without full reload (support /car/1234567 or ?plate=1234567)
    const newUrl = `/car/${clean}`;
    window.history.pushState({}, '', newUrl);

    try {
      const data = await fetchVehicleReport(clean, (step, pct) => {
        setLoadingStep(step);
        setLoadingPercent(pct);
      }, forceRefresh);
      setReport(data);
      if (!forceRefresh) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה באיתור פרטי הרכב. אנא נסה שוב בעוד מספר רגעים.');
      setReport(null);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setIsLoading(false);
    setIsRefreshing(false);
    setSearchedPlate('');
    window.history.pushState({}, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fc] font-sans selection:bg-brand-600 selection:text-white" dir="rtl">
      
      {/* Keyboard Accessibility: Skip to Main Content Link */}
      <a href="#main-content" className="skip-to-content-link">
        דלג לתוכן המרכזי (Enter)
      </a>

      {/* Global Header */}
      <Header 
        onNewSearch={handleReset}
        hasActiveReport={Boolean(report || error)}
      />

      {/* Main Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <AnimatePresence mode="wait">
          {/* Loading State */}
          {isLoading && (
            <motion.div 
              key="loading-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="py-12 px-4"
            >
              <LoadingProgress 
                plateNumber={searchedPlate}
                currentStep={loadingStep}
                progressPercent={loadingPercent}
              />
            </motion.div>
          )}

          {/* Error State */}
          {!isLoading && error && (
            <motion.div 
              key="error-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="max-w-xl mx-auto my-16 px-4"
            >
              <div className="bg-white rounded-3xl border border-rose-100 shadow-card p-6 sm:p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">לא הצלחנו לאתר את הרכב</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {error}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSearch(searchedPlate, true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-btn-primary transition-all focus:ring-2 focus:ring-brand-500"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>נסה שוב ברענון מלא</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors focus:ring-2 focus:ring-slate-400"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>חזרה לחיפוש רכב אחר</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Report View State */}
          {!isLoading && !error && report && (
            <motion.div 
              key={`report-${report.plateNumber}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <ReportView 
                report={report}
                onNewSearch={handleReset}
                onSearchPlate={(plate) => handleSearch(plate)}
                onRefresh={(plate) => handleSearch(plate, true)}
                isRefreshing={isRefreshing}
              />
            </motion.div>
          )}

          {/* Default Home Page State */}
          {!isLoading && !error && !report && (
            <motion.div 
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <HomePage 
                onSearch={(plate) => handleSearch(plate)}
                isLoading={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Global Accessible Footer */}
      <Footer 
        onOpenAccessibilityStatement={() => setIsA11yModalOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => setIsTermsModalOpen(true)}
        onOpenCookieSettings={() => setIsCookieSettingsOpen(true)}
      />

      {/* Floating Accessibility Widget (ת״י 5568 AA) */}
      <AccessibilityWidget 
        onOpenStatement={() => setIsA11yModalOpen(true)}
      />

      {/* Cookie Consent Banner (Strict Opt-In) */}
      <CookieBanner 
        isVisible={cookieConsent === null}
        onAcceptAll={() => handleSaveConsent('all')}
        onAcceptEssentialOnly={() => handleSaveConsent('essential')}
        onOpenPreferences={() => setIsCookieSettingsOpen(true)}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Legal Modals */}
      <AccessibilityModal 
        isOpen={isA11yModalOpen}
        onClose={() => setIsA11yModalOpen(false)}
      />

      <PrivacyModal 
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <TermsModal 
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <CookieSettingsModal 
        isOpen={isCookieSettingsOpen}
        onClose={() => setIsCookieSettingsOpen(false)}
        onSaveConsent={handleSaveConsent}
        currentConsent={cookieConsent}
      />

    </div>
  );
};
