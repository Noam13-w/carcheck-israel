import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Search, Clock, HelpCircle } from 'lucide-react';
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

  const handleNavClick = (action: 'new' | 'history' | 'faq') => {
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 py-3.5 flex items-center justify-between">
        
        {/* Right Side: Brand Logo + Navigation */}
        <div className="flex items-center gap-10">
          {/* CarInfo Logo with Stylized Car Silhouette */}
          <button
            type="button"
            onClick={() => handleNavClick('new')}
            className="flex flex-col items-center group focus:outline-none"
            aria-label="CarInfo - דף הבית"
          >
            <svg 
              viewBox="0 0 120 26" 
              className="w-24 sm:w-28 h-5 -mb-1 text-brand-600 transition-transform duration-300 group-hover:scale-105"
              fill="none"
            >
              <path 
                d="M12 20C22 18 32 7 54 6C74 5 88 13 108 17C96 15 82 10 56 10C35 10 24 18 12 20Z" 
                fill="currentColor" 
              />
              <path 
                d="M28 19C42 15 68 14 96 19" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                opacity="0.45"
              />
            </svg>
            <div className="text-2xl sm:text-[26px] font-black tracking-tight leading-none" dir="ltr">
              <span className="text-slate-900">Car</span>
              <span className="text-brand-600">Info</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              type="button"
              onClick={() => handleNavClick('new')}
              className="relative py-1 text-brand-600 font-bold transition-colors"
            >
              <span>בדיקה חדשה</span>
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-600 rounded-full shadow-[0_2px_8px_rgba(75,69,230,0.6)]" />
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className="py-1 text-slate-600 hover:text-slate-950 transition-colors"
            >
              היסטוריית בדיקות
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="py-1 text-slate-600 hover:text-slate-950 transition-colors"
            >
              שאלות נפוצות
            </button>
          </nav>
        </div>

        {/* Left Side: Official Reliability Badge & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-100/90 px-3.5 py-1.5 rounded-full border border-slate-200/80">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>מידע אמין ומעודכן</span>
          </div>

          {hasActiveReport && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => handleNavClick('new')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#f0f1ff] text-brand-700 hover:bg-brand-100 transition-colors shadow-soft-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>בדיקה חדשה</span>
            </motion.button>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            aria-label="תפריט ניווט"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Dropdown Menu with Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 pt-2 pb-4 space-y-2 shadow-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => handleNavClick('new')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-[#f0f1ff] text-brand-700 font-bold text-sm text-right"
            >
              <Search className="w-4 h-4" />
              <span>בדיקה חדשה</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('history')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 font-medium text-sm text-right"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>היסטוריית בדיקות</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-slate-700 hover:bg-slate-50 font-medium text-sm text-right"
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
