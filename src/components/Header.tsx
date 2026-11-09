import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Search, Clock, HelpCircle, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNewSearch?: () => void;
  hasActiveReport?: boolean;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onNewSearch, 
  hasActiveReport,
  onNavigateSection 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (action: 'new' | 'history' | 'models' | 'faq') => {
    setMobileMenuOpen(false);
    if (action === 'new') {
      onNewSearch?.();
    } else if (action === 'history') {
      if (hasActiveReport) {
        onNewSearch?.();
        setTimeout(() => {
          document.getElementById('recent-searches')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('recent-searches')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'models') {
      if (hasActiveReport) {
        onNewSearch?.();
        setTimeout(() => {
          document.getElementById('popular-models-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('popular-models-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'faq') {
      if (hasActiveReport) {
        onNewSearch?.();
        setTimeout(() => {
          document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onNavigateSection?.(action);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Right Side: Brand Logo + Navigation Links */}
        <div className="flex items-center gap-8 lg:gap-10">
          {/* CarInfo Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('new')}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="CarInfo - דף הבית"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-black text-sm border border-slate-800 shadow-sm">
              <span className="font-mono tracking-tighter">IL</span>
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-slate-900" dir="ltr">
              <span>Car</span>
              <span className="text-blue-700">Info</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => handleNavClick('new')}
              className="py-1 text-blue-700 hover:text-blue-800 transition-colors border-b-2 border-blue-700 font-bold"
            >
              בדיקה חדשה
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className="py-1 hover:text-slate-900 transition-colors"
            >
              היסטוריית בדיקות
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="py-1 hover:text-slate-900 transition-colors"
            >
              שאלות נפוצות
            </button>
          </nav>
        </div>

        {/* Left Side: Live Data Source Badge & Mobile Menu */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>מידע אמין ומעודכן</span>
          </div>

          {hasActiveReport && (
            <button
              type="button"
              onClick={() => handleNavClick('new')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Search className="w-3.5 h-3.5" />
              <span>בדיקה חדשה</span>
            </button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="תפריט ניווט"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1.5 shadow-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => handleNavClick('new')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-800 font-bold text-sm text-right"
            >
              <Search className="w-4 h-4 text-blue-700" />
              <span>בדיקת רכב חדשה</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('models')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm text-right"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>דגמים ומדריכים</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm text-right"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>היסטוריית בדיקות</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 font-medium text-sm text-right"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>שאלות נפוצות</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};