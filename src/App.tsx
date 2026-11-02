import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoadingProgress } from './components/LoadingProgress';
import { ReportView } from './components/ReportView';
import { fetchVehicleReport, normalizePlate, formatPlateDisplay } from './services/api';
import { VehicleReportData } from './types/vehicle';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [report, setReport] = useState<VehicleReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [searchedPlate, setSearchedPlate] = useState<string>('');

  // Handle URL routing: /car/:plate OR ?plate=:plate
  useEffect(() => {
    let initialPlate: string | null = null;

    // Check query params
    const params = new URLSearchParams(window.location.search);
    if (params.get('plate')) {
      initialPlate = params.get('plate');
    } else {
      // Check path /car/:plate
      const match = window.location.pathname.match(/\/car\/(\d+)/i);
      if (match && match[1]) {
        initialPlate = match[1];
      }
    }

    if (initialPlate) {
      handleSearch(initialPlate);
    }
  }, []);

  // Update dynamic page title & meta for SEO
  useEffect(() => {
    if (report) {
      document.title = `${report.identity.make} ${report.identity.commercialName} (${report.identity.modelYear}) - מספר ${report.formattedPlate} | דוח רכב AutoScope`;
    } else {
      document.title = 'AutoScope Israel | בדיקת רכב לפני קנייה לפי מספר רישוי';
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
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-brand-500 selection:text-white" dir="rtl">
      
      {/* Global Header */}
      <Header 
        onNewSearch={handleReset}
        hasActiveReport={Boolean(report || error)}
      />

      {/* Main Container */}
      <main className="flex-1">
        
        {/* Loading State */}
        {isLoading && (
          <div className="py-12 px-4">
            <LoadingProgress 
              plateNumber={searchedPlate}
              currentStep={loadingStep}
              progressPercent={loadingPercent}
            />
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="max-w-xl mx-auto my-16 px-4">
            <div className="bg-white rounded-2xl border border-rose-200 shadow-xl p-6 sm:p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">לא הצלחנו לאתר את הרכב</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {error}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => handleSearch(searchedPlate, true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>נסה שוב ברענון מלא</span>
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>חזרה לחיפוש רכב אחר</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report View State */}
        {!isLoading && !error && report && (
          <ReportView 
            report={report}
            onNewSearch={handleReset}
            onRefresh={(plate) => handleSearch(plate, true)}
            isRefreshing={isRefreshing}
          />
        )}

        {/* Default Home Page State */}
        {!isLoading && !error && !report && (
          <HomePage 
            onSearch={(plate) => handleSearch(plate)}
            isLoading={isLoading}
          />
        )}

      </main>

    </div>
  );
};
