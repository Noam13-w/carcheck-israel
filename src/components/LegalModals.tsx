import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Eye, 
  Cookie, 
  CheckCircle2, 
  AlertTriangle,
  Mail,
  UserCheck,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { CookieConsentType, CookiePreferences } from '../types/legal';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 no-print"
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0">
              {icon}
            </div>
            <div>
              <h2 id="legal-modal-title" className="text-lg sm:text-xl font-bold text-white">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="סגור חלון"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm sm:text-base leading-relaxed text-slate-700">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors"
          >
            אישור וסגירה
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------
 * 1. ACCESSIBILITY STATEMENT MODAL (הצהרת נגישות לפי ת״י 5568 AA)
 * ------------------------------------------------------------- */
interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="הצהרת נגישות"
      subtitle="בהתאם לתקן ישראלי ת״י 5568 ברמת AA ו-WCAG 2.1"
      icon={<Eye className="w-6 h-6" />}
    >
      <div className="space-y-5">
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">מבוא ומחויבות לנגישות</h3>
          <p>
            אנו ב-<strong>AutoScope Israel</strong> רואים חשיבות עליונה בהנגשת שירותי המידע באינטרנט לכלל האוכלוסייה, 
            לרבות אנשים עם מוגבלויות, מתוך תפיסת עולם שוויונית ומחויבות מוסרית ומשפטית בהתאם להוראות 
            <strong> חוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998</strong> 
            ו<strong>תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">רמת הנגישות באתר</h3>
          <p>
            אתר זה עומד בדרישות תקנות הנגישות לשירות ובתקן הישראלי 
            <strong> ת״י 5568 (הנחיות לנגישות תכנים באינטרנט)</strong> 
            ברמת התאמה <strong>AA</strong>, המבוסס על הנחיות ה-Web Content Accessibility Guidelines (WCAG 2.1) 
            של ארגון ה-W3C הבינלאומי.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">התאמות הנגישות שבוצעו באתר</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 pr-2">
            <li><strong>סרגל נגישות צף:</strong> שליטה מהירה בגודל הגופן (+15%, +30%), מצבי ניגודיות (כהה, בהירה, גווני אפור), הדגשת קישורים, גופן קריא ועצירת הבהובים.</li>
            <li><strong>ניווט מקלדת מלא:</strong> תמיכה מלאה במקשי Tab, Shift+Tab, חיצים ו-Enter. כפתור ייעודי לדילוג ישיר לתוכן המרכזי (Skip to Content).</li>
            <li><strong>תמיכה בקוראי מסך:</strong> מבנה סמנטי של HTML5, כותרות בהיררכיה לוגית (H1-H4), ותגיות ARIA מותאמות לקוראי מסך מובילים (NVDA, JAWS, VoiceOver).</li>
            <li><strong>טקסט חלופי (Alt):</strong> תיאור חלופי ברור לכל האלמנטים הגרפיים, האיורים וסמלי הרכב.</li>
            <li><strong>ניגודיות צבעים:</strong> עמידה ביחסי ניגודיות מחמירים (מינימום 4.5:1 לטקסט רגיל) למניעת עומס חזותי.</li>
            <li><strong>התאמה רספונסיבית:</strong> תצוגה מותאמת לגדלי מסכים שונים, כולל זום דפדפן של עד 200% ללא פגיעה במידע.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">פרטי רכז הנגישות ודרכי פנייה</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-600" />
              <span>רכז נגישות האתר: נעם ניסן</span>
            </p>
            <p className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-brand-600" />
              <span>דוא״ל לפניות נגישות: </span>
              <a href="mailto:accessibility@autoscope-il.web.app" className="text-brand-600 font-semibold hover:underline">
                accessibility@autoscope-il.web.app
              </a>
            </p>
            <p className="text-xs text-slate-500">
              אנו ממשיכים במאמצים מתמידים לשפר את נגישות האתר. אם נתקלתם בבעיה או ליקוי נגישות, נשמח שתפנו אלינו ונפעל לתיקונו בהקדם האפשרי.
            </p>
          </div>
        </section>

        <section className="text-xs text-slate-500 flex items-center gap-1.5 pt-2 border-t border-slate-100">
          <Calendar className="w-3.5 h-3.5" />
          <span>מועד עדכון הצהרת הנגישות: נובמבר 2026</span>
        </section>
      </div>
    </ModalWrapper>
  );
};

/* -------------------------------------------------------------
 * 2. PRIVACY POLICY MODAL (מדיניות פרטיות לפי חוק הגנת הפרטיות)
 * ------------------------------------------------------------- */
interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="מדיניות פרטיות"
      subtitle="בהתאם לחוק הגנת הפרטיות, התשמ״א-1981 והנחיות הרשות להגנת הפרטיות"
      icon={<Lock className="w-6 h-6" />}
    >
      <div className="space-y-5">
        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">1. מבוא והתחייבות לפרטיות</h3>
          <p>
            ב-<strong>AutoScope Israel</strong> אנו מחויבים להגנה מלאה על פרטיות המשתמשים. 
            מדיניות זו מפרטת איזה מידע מעובד בעת השימוש באתר, כיצד אנו שומרים עליו, 
            ומבהירה כי <strong>איננו אוספים או סוחרים בפרטים אישיים מזהים</strong>.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">2. איזה מידע נאסף ואיזה אינו נאסף?</h3>
          <ul className="list-disc list-inside space-y-1.5 text-slate-700 pr-2">
            <li>
              <strong>ללא איסוף מידע אישי מזהה:</strong> השימוש באתר פתוח לציבור ללא צורך בהרשמה. 
              איננו דורשים ואיננו שומרים שמות משתמשים, מספרי תעודת זהות, כתובות מגורים, פרטי כרטיסי אשראי או כתובות דוא״ל.
            </li>
            <li>
              <strong>מספרי רישוי רכב:</strong> מספר הרישוי המוקלד בתיבת החיפוש משמש אך ורק 
              לתשאול מאגרי המידע הציבוריים של משרד התחבורה בישראל לצורך יצירת הדוח המבוקש.
            </li>
            <li>
              <strong>ללא חשיפת פרטי בעלים:</strong> בהתאם לחוק, מאגרי משרד התחבורה הפתוחים אינם מכילים 
              שמות בעלים פרטיים, ו-AutoScope אינה מחזיקה במידע כזה ואינה יכולה לספקו.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">3. עוגיות וזיכרון מקומי (Cookies & Local Storage)</h3>
          <p className="mb-2">
            בהתאם להנחיות הרשות להגנת הפרטיות:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 pr-2">
            <li>
              <strong>זיכרון מקומי חיוני בלבד:</strong> האתר משתמש בזיכרון המקומי של הדפדפן (Local Storage) לצורך שמירה זמנית של דוחות רכב שנצפו (כדי למנוע עומס על שרתי הממשלה ולאפשר צפייה חוזרת מהירה) ולשמירת העדפות הנגישות ואישור העוגיות.
            </li>
            <li>
              <strong>אין עוגיות מעקב ללא הסכמה:</strong> איננו מפעילים עוגיות שיווקיות, פיקסלים או שירותי מעקב צד-שלישי ללא הסכמתכם המפורשת.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">4. מקור הנתונים המוצגים</h3>
          <p>
            כל נתוני הרכב המוצגים באתר מקורם במאגרים ממשלתיים רשמיים ופתוחים של 
            <strong> משרד התחבורה והבטיחות בדרכים</strong> (פורטל data.gov.il), 
            המפורסמים לציבור לפי חוק חופש המידע, התשנ״ח-1998.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">5. אבטחת מידע</h3>
          <p>
            האתר מוטמע בתשתיות ענן מאובטחות ומשתמש בהצפנת <strong>HTTPS / TLS תקנית</strong> 
            להגנה על כלל התקשורת בין הדפדפן לשרת מפני יירוט או שינוי.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">6. זכויות המשתמש ופרטי קשר</h3>
          <p>
            לפי סעיפים 13 ו-14 לחוק הגנת הפרטיות, לכל אדם עומדת הזכות לעיין במידע המוחזק עליו (אם קיים) ולבקש תיקונו. 
            לפניות בנושאי פרטיות: 
            <a href="mailto:privacy@autoscope-il.web.app" className="text-brand-600 font-semibold hover:underline mr-1">
              privacy@autoscope-il.web.app
            </a>
          </p>
        </section>
      </div>
    </ModalWrapper>
  );
};

/* -------------------------------------------------------------
 * 3. TERMS OF SERVICE MODAL (תנאי שימוש והבהרה משפטית לקונים)
 * ------------------------------------------------------------- */
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="תנאי שימוש והבהרה משפטית"
      subtitle="הסכם שימוש למשתמשי AutoScope Israel"
      icon={<FileText className="w-6 h-6" />}
    >
      <div className="space-y-5">
        
        {/* Important Warning Alert Box */}
        <div className="bg-amber-50 border-r-4 border-amber-500 p-4 rounded-xl text-amber-900">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>הבהרה קריטית לקוני רכב יד שנייה</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            המידע המופיע באתר <strong>אינו מהווה תחליף לבדיקה פיזית מקיפה במכון בדיקה מורשה</strong>, 
            אינו מחליף בדיקה של שמאי או מוסך מומחה, ואינו מחליף בדיקת שעבודים ומשכונות 
            במאגר רשם המשכונות הממשלתי (משרד המשפטים) או בדיקת עבר ביטוחי ותביעות במרכז הסליקה של חברות הביטוח.
          </p>
        </div>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">1. מהות השירות</h3>
          <p>
            אתר <strong>AutoScope Israel</strong> הינו פלטפורמה טכנולוגית עצמאית המנגישה ומנתחת 
            מידע ציבורי פתוח ממאגרי משרד התחבורה והממשלה בישראל. 
            מטרת השירות היא להעניק מודיעין ראשוני ושקיפות לרוכשי ובעלי רכב.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">2. אחריות מוגבלת ואספקת מידע כמות-שהוא (AS-IS)</h3>
          <p>
            השירות והנתונים ניתנים לשימוש כמות שהם (AS-IS). 
            על אף מאמצינו לוודא את דיוק הנתונים ומהימנותם, המידע נשען על דיווחי משרד התחבורה, 
            מכוני הרישוי, היבואנים וגורמים ממשלתיים אחרים. 
            מפעילי האתר אינם אחראים לכל אי-דיוק, טעות קלדנית במאגר הממשלתי, עיכוב בעדכון, 
            או השמטה הקיימים במקורות המידע הממשלתיים.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">3. הערכות ומודלים סטטיסטיים</h3>
          <p>
            חלק מהנתונים בדוחות (כגון הערכת מספר יד, ציון סיכון לקונה, הערכת עלויות דלק ותחזוקה) 
            מבוססים על מודלים אנליטיים וסטטיסטיים. 
            נתונים אלו מוגדרים במפורש כהערכות בלבד ואין לראות בהם קביעה משפטית חלוטה או חוות דעת שמאית.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">4. איסור שימוש לרעה</h3>
          <p>
            חל איסור מוחלט לבצע שימוש זדוני באתר, לרבות הפעלת בוטים, סריקה המונית (scraping) הגורמת להעמסת יתר על המערכות, 
            או ניסיון לפגוע באבטחת המידע של האתר או המאגרים הממשלתיים.
          </p>
        </section>

        <section>
          <h3 className="text-base font-bold text-slate-900 mb-2">5. דין וסמכות שיפוט</h3>
          <p>
            על תנאי שימוש אלה יחולו אך ורק דיני מדינת ישראל. 
            סמכות השיפוט הבלעדית בכל מחלוקת הנובעת משימוש באתר נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
          </p>
        </section>

      </div>
    </ModalWrapper>
  );
};

/* -------------------------------------------------------------
 * 4. COOKIE PREFERENCES MODAL (הגדרות עוגיות מותאמות אישית)
 * ------------------------------------------------------------- */
interface CookieSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveConsent: (type: CookieConsentType) => void;
  currentConsent: CookieConsentType;
}

export const CookieSettingsModal: React.FC<CookieSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaveConsent,
  currentConsent
}) => {
  const [allowAnalytics, setAllowAnalytics] = useState<boolean>(currentConsent === 'all');

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="הגדרות עוגיות וזיכרון מקומי"
      subtitle="ניהול הסכמה לשימוש ברכיבי אחסון בדפדפן"
      icon={<Cookie className="w-6 h-6" />}
    >
      <div className="space-y-6">
        <p className="text-slate-600 text-sm">
          אנו מכבדים את פרטיותך. האתר משתמש בזיכרון מקומי (Local Storage) ועוגיות לצורך פעילותו התקינה. 
          באפשרותך לבחור אילו רכיבים תרצה לאשר.
        </p>

        {/* Essential Category */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-slate-900">רכיבי אחסון חיוניים בלבד</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              תמיד פעיל
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            הכרחיים לתפקוד הבסיסי של האתר: שמירת תוצאות הרכב שנצפו (כדי למנוע עומס על שרתי משרד התחבורה), 
            שמירת הגדרות הנגישות שנבחרו ובחירת העדפות הפרטיות שלך. רכיבים אלה אינם עוקבים אחריך באתרים אחרים.
          </p>
        </div>

        {/* Analytics Category */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-brand-600" />
              <span className="font-bold text-slate-900">עוגיות ניתוח ושיפור חוויה (Analytics)</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={allowAnalytics}
              onClick={() => setAllowAnalytics(!allowAnalytics)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                allowAnalytics ? 'bg-brand-600' : 'bg-slate-300'
              }`}
            >
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                allowAnalytics ? '-translate-x-5' : 'translate-x-0'
              }`} />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            מאפשרות לנו להבין כיצד משתמשים מנווטים באתר ולשפר את מהירות הטעינה והממשק. 
            הנתונים נאספים באופן אנונימי לחלוטין ואינם מכילים כל מידע אישי מזהה.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              onSaveConsent(allowAnalytics ? 'all' : 'essential');
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-md transition-colors text-center"
          >
            שמירת העדפות שנבחרו
          </button>
          <button
            type="button"
            onClick={() => {
              onSaveConsent('essential');
              onClose();
            }}
            className="py-3 px-4 rounded-xl font-semibold text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors text-center"
          >
            חיוניות בלבד (סרב לניתוח)
          </button>
        </div>

      </div>
    </ModalWrapper>
  );
};
