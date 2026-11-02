import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Type, 
  Sun, 
  Moon, 
  RotateCcw, 
  FileText, 
  X, 
  Check, 
  Sparkles,
  Link2,
  Maximize2,
  Minimize2,
  Sliders
} from 'lucide-react';
import { AccessibilitySettings, FontSizeOption, ContrastOption } from '../types/legal';

const STORAGE_KEY = 'autoscope_accessibility_settings';

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  contrast: 'normal',
  highlightLinks: false,
  readableFont: false,
  stopAnimations: false,
};

interface AccessibilityWidgetProps {
  onOpenStatement: () => void;
}

export const AccessibilityWidget: React.FC<AccessibilityWidgetProps> = ({ onOpenStatement }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // Fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Apply settings to document.documentElement
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove('a11y-font-large', 'a11y-font-larger');
    if (settings.fontSize === 'large') root.classList.add('a11y-font-large');
    if (settings.fontSize === 'larger') root.classList.add('a11y-font-larger');

    // Contrast
    root.classList.remove('a11y-dark-contrast', 'a11y-light-contrast', 'a11y-monochrome');
    if (settings.contrast === 'dark') root.classList.add('a11y-dark-contrast');
    if (settings.contrast === 'light') root.classList.add('a11y-light-contrast');
    if (settings.contrast === 'monochrome') root.classList.add('a11y-monochrome');

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add('a11y-highlight-links');
    } else {
      root.classList.remove('a11y-highlight-links');
    }

    // Readable font
    if (settings.readableFont) {
      root.classList.add('a11y-readable-font');
    } else {
      root.classList.remove('a11y-readable-font');
    }

    // Stop animations
    if (settings.stopAnimations) {
      root.classList.add('a11y-stop-animations');
    } else {
      root.classList.remove('a11y-stop-animations');
    }

    // Persist to local storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      // Storage unavailable
    }
  }, [settings]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  const isCustomized = 
    settings.fontSize !== 'normal' ||
    settings.contrast !== 'normal' ||
    settings.highlightLinks ||
    settings.readableFont ||
    settings.stopAnimations;

  return (
    <div className="fixed bottom-5 left-5 z-50 no-print" dir="rtl">
      
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="פתח תפריט נגישות"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        className={`relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-brand-400 ${
          isCustomized 
            ? 'bg-amber-500 text-slate-950 ring-2 ring-white hover:bg-amber-400' 
            : 'bg-brand-600 text-white hover:bg-brand-700'
        }`}
        title="התאמות נגישות לפי תקן ת״י 5568"
      >
        <span className="sr-only">תפריט נגישות</span>
        <Eye className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.2]" />
        
        {/* Active customization indicator badge */}
        {isCustomized && (
          <span 
            className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"
            title="הגדרות נגישות מופעלות"
          />
        )}
      </button>

      {/* Accessibility Panel Modal */}
      {isOpen && (
        <div 
          id="accessibility-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-title"
          className="absolute bottom-16 left-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 id="a11y-title" className="font-bold text-sm">התאמות נגישות</h3>
                <p className="text-[11px] text-slate-400">תקן ישראלי ת״י 5568 ברמת AA</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="סגור תפריט נגישות"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options Body */}
          <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
            
            {/* Font Size */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Type className="w-4 h-4 text-brand-600" />
                <span>גודל גופן</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => updateSetting('fontSize', 'normal')}
                  className={`py-2 rounded-lg transition-all ${
                    settings.fontSize === 'normal' 
                      ? 'bg-white text-brand-700 shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  רגיל (100%)
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('fontSize', 'large')}
                  className={`py-2 rounded-lg transition-all ${
                    settings.fontSize === 'large' 
                      ? 'bg-white text-brand-700 shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  גדול (+15%)
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('fontSize', 'larger')}
                  className={`py-2 rounded-lg transition-all ${
                    settings.fontSize === 'larger' 
                      ? 'bg-white text-brand-700 shadow-sm font-bold' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  גדול מאוד (+30%)
                </button>
              </div>
            </div>

            {/* Contrast Mode */}
            <div>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
                <Sun className="w-4 h-4 text-brand-600" />
                <span>ניגודיות תצוגה</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => updateSetting('contrast', 'normal')}
                  className={`p-2.5 rounded-xl border text-right flex items-center justify-between transition-all ${
                    settings.contrast === 'normal'
                      ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>ברירת מחדל</span>
                  {settings.contrast === 'normal' && <Check className="w-4 h-4 text-brand-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('contrast', 'dark')}
                  className={`p-2.5 rounded-xl border text-right flex items-center justify-between transition-all ${
                    settings.contrast === 'dark'
                      ? 'border-brand-600 bg-slate-900 text-white font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>ניגודיות כהה</span>
                  {settings.contrast === 'dark' && <Check className="w-4 h-4 text-brand-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('contrast', 'light')}
                  className={`p-2.5 rounded-xl border text-right flex items-center justify-between transition-all ${
                    settings.contrast === 'light'
                      ? 'border-brand-600 bg-amber-50 text-amber-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>ניגודיות בהירה</span>
                  {settings.contrast === 'light' && <Check className="w-4 h-4 text-brand-600" />}
                </button>
                <button
                  type="button"
                  onClick={() => updateSetting('contrast', 'monochrome')}
                  className={`p-2.5 rounded-xl border text-right flex items-center justify-between transition-all ${
                    settings.contrast === 'monochrome'
                      ? 'border-brand-600 bg-slate-200 text-slate-900 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>גווני אפור</span>
                  {settings.contrast === 'monochrome' && <Check className="w-4 h-4 text-brand-600" />}
                </button>
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              
              {/* Highlight Links */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">הדגשת קישורים</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.highlightLinks}
                  onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.highlightLinks ? 'bg-brand-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.highlightLinks ? '-translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Readable Font */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">גופן קריא ורווחים מוגדלים</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.readableFont}
                  onClick={() => updateSetting('readableFont', !settings.readableFont)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.readableFont ? 'bg-brand-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.readableFont ? '-translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Stop Animations */}
              <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Minimize2 className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-semibold text-slate-800">עצירת הבהובים ואנימציות</span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.stopAnimations}
                  onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    settings.stopAnimations ? 'bg-brand-600' : 'bg-slate-300'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.stopAnimations ? '-translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

            </div>

            {/* Actions: Reset & Accessibility Statement */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={resetSettings}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>איפוס כל הגדרות הנגישות</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenStatement();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>הצהרת נגישות ופרטי רכז הנגישות</span>
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
