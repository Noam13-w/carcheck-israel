import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { LoadingProgress } from './components/LoadingProgress';
import { ReportView } from './components/ReportView';
import { fetchVehicleReport, normalizePlate } from './services/api';
import { VehicleReportData } from './types/vehicle';
import { AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

export const App: React.FC = () => {
  const [report, setReport] = useState<VehicleReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [loadingPercent, setLoadingPercent] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [searchedPlate, setSearchedPlate] = useState<string>('');

  // Handle URL query param (e.g. ?plate=7943026) for deep linking & sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plateParam = params.get('plate');
    if (plateParam) {
      handleSearch(plateParam);
    }
  }, []);

  const handleSearch = async (plate: string) => {
    const clean = normalizePlate(plate);
    if (!clean) return;

    setSearchedPlate(clean);
    setError(null);
    setIsLoading(true);
    setLoadingStep('מתחבר לשרת משרד התחבורה...');
    setLoadingPercent(10);

    // Update URL query without full reload
    const url = new URL(window.location.href);
    url.searchParams.set('plate', clean);
    window.history.pushState({}, '', url.toString());

    try {
      const data = await fetchVehicleReport(clean, (step, pct) => {
        setLoadingStep(step);
        setLoadingPercent(pct);
      });
      setReport(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err?.message || 'אירעה שגיאה באיתור פרטי הרכב. אנא נסה שוב בעוד מספר רגעים.');
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
    setIsLoading(false);
    setSearchedPlate('');
    const url = new URL(window.location.href);
    url.searchParams.delete('plate');
    window.history.pushState({}, '', url.toString());
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
                  onClick={() => handleSearch(searchedPlate)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>נסה שוב</span>
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
          />
        )}

        {/* Default Home Page State */}
        {!isLoading && !error && !report && (
          <HomePage 
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}

      </main>

    </div>
  );
};
