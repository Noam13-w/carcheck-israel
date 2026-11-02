import { KnownProblem, MaintenanceItem, VehicleReportData } from '../types/vehicle';

interface ModelProfile {
  makeMatch: RegExp;
  modelMatch?: RegExp;
  engineMatch?: RegExp;
  fuelMatch?: RegExp;
  modelSlug: string;
  modelHubTitle: string;
  problems: KnownProblem[];
  maintenance: {
    recommendedOilSpec: string;
    oilCapacityLiters: number;
    timingType: 'רצועת תזמון (טיימינג)' | 'שרשרת תזמון' | 'לא ידוע';
    schedule: MaintenanceItem[];
    timingNotes?: string;
  };
  reliability: {
    engineRating: number;
    transmissionRating: number;
    electricalRating: number;
    suspensionRating: number;
    overallScore: number;
    partsAvailabilityInIsrael: 'גבוהה מאוד' | 'גבוהה' | 'בינונית' | 'נמוכה';
    maintenanceComplexity: 'פשוטה' | 'בינונית' | 'מורכבת';
    summaryHebrew: string;
  };
  verdict: {
    pros: string[];
    cons: string[];
    top5Considerations: string[];
    bottomLine: string;
  };
  specificSellerQuestions?: {
    question: string;
    reason: string;
    watchOutFor: string;
  }[];
}

export const MODEL_KNOWLEDGE_BASE: ModelProfile[] = [
  // 1. VAG Group (Skoda / VW / Seat / Audi) with EA211 or EA888 or TDI and DSG
  {
    makeMatch: /סקודה|פולקסווגן|סיאט|אאודי|אודי|skoda|volkswagen|seat|audi/i,
    modelMatch: /אוקטביה|סופרב|קודיאק|קארוק|גולף|פולו|טיגואן|פאסאט|איביזה|לאון|ארונה|אטקה|octavia|superb|kodiaq|golf|ibiza|leon/i,
    modelSlug: 'skoda-vw-seat-dsg',
    modelHubTitle: 'מדריך קנייה לקבוצת פולקסווגן, סקודה וסיאט (TSI / DSG)',
    problems: [
      {
        id: 'vag-dsg-dq200',
        name: 'שחיקת מצמדים ומוח גיר (מכטרוניק) בגיר DSG 7 יבש (DQ200)',
        category: 'transmission',
        description: 'תיבת ההילוכים הרובוטית כפולת המצמדים מסוג DQ200 (מצמדים יבשים) סובלת מבלאי מואץ של המצמדים ומתקלות במוח הגיר (מכטרוניק), בעיקר בנהיגה עירונית מרובת פקקים ואקלים חם.',
        affectedYears: '2009–2022',
        affectedEngines: 'מנועי 1.0, 1.2, 1.4, 1.5 TSI',
        symptoms: ['רעידות ביציאה מהמקום', 'השהיה בשילוב הילוכים 1-2', 'הודעת "Gearbox error" בלוח המחוונים', 'אובדן הילוכים זוגיים/אי-זוגיים'],
        possibleCauses: ['התחממות יתר של המצמדים בעמידה בפקקים', 'דליפת לחץ הידראולי במוח הגיר', 'שחיקה מכנית רגילה'],
        severity: 'high',
        estimatedCostIls: { min: 3800, max: 7500, description: 'החלפת מצמדים: ~₪4,200; שיפוץ מכטרוניק: ~₪5,500' },
        isRecurring: true,
        hasRecallOrTsb: true,
        recallCode: 'ריקול שמן גיר סינטטי/מינרלי עולמי 34F7',
        sources: [
          { name: 'איגוד המוסכים בישראל', url: 'https://iga.org.il', date: '2023' },
          { name: 'VAG Specialist Israel', date: '2024' }
        ]
      },
      {
        id: 'vag-water-pump',
        name: 'דליפת נוזל קירור מבית משאבת המים והתרמוסטט',
        category: 'cooling',
        description: 'מכלול משאבת המים והתרמוסטט עשוי מפלסטיק מרוכב אשר נוטה להתעוות ולהיסדק עקב מחזורי חום, מה שגורם לדליפת נוזל קירור איטית.',
        affectedYears: '2013–2022',
        affectedEngines: '1.4 TSI EA211, 1.8 TSI, 2.0 TSI EA888',
        symptoms: ['ירידה הדרגתית במפלס נוזל הקירור', 'ריח מתוק של נוזל קירור G13 לאחר נסיעה', 'נורית חום מנוע'],
        possibleCauses: ['התיישנות אטמי גומי ופלסטיק התרמוסטט', 'התעוותות בית המשאבה מחום'],
        severity: 'medium',
        estimatedCostIls: { min: 1800, max: 3400, description: 'החלפת מכלול משאבת מים + תרמוסטט מקורי' },
        isRecurring: true,
        hasRecallOrTsb: false,
        sources: [{ name: 'VAG Technical Service Bulletin', date: '2022' }]
      },
      {
        id: 'vag-pcv-oil',
        name: 'צריכת שמן ושסתומי נשם מנוע (PCV)',
        category: 'engine',
        description: 'שסתום ויסות לחץ גזי גל ארכובה (PCV) עלול להיקרע ולגרום לצריכת שמן מוגברת, חוסר יציבות בסרק ועשן קל.',
        affectedYears: '2012–2020',
        affectedEngines: '1.8 TSI, 2.0 TSI',
        symptoms: ['נורית בדוק מנוע', 'שריקה מאזור מכסה השסתומים', 'צריכת שמן של מעל 0.5 ליטר ל-1,000 ק"מ'],
        possibleCauses: ['קריעת דיאפרגמת גומי בשסתום הנשם'],
        severity: 'medium',
        estimatedCostIls: { min: 650, max: 1400 },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'Euro Car Magazine UK', date: '2023' }]
      }
    ],
    specificSellerQuestions: [
      {
        question: 'האם המצמדים או מוח הגיר (מכטרוניק) הוחלפו או שופצו בעבר, ובאיזה קילומטראז?',
        reason: 'תיבת DSG DQ200 דורשת החלפת מצמדים כל 80,000–120,000 ק"מ. החלפה קודמת חוסכת לקונה כ-₪4,500.',
        watchOutFor: 'אם המוכר טוען שהגיר "מקורי ולא נגעו בו" ברכב עם 130k ק"מ, צפו להחלפה קרובה.'
      },
      {
        question: 'האם הרכב צורך נוזל קירור בין טיפולים או האם הוחלפה משאבת מים ותרמוסטט?',
        reason: 'בית משאבת המים והתרמוסטט עשוי מפלסטיק ונוטה להיסדק. מחירו כ-₪2,500.',
        watchOutFor: 'סימני אבקה ורודה/לבנה מתחת לבית התרמוסטט או מפלס נוזל קירור נמוך במיכל העיבוי.'
      }
    ],
    maintenance: {
      recommendedOilSpec: '5W-30 או 0W-20 בתקן רשמי VW 504.00 / 507.00 / 508.00',
      oilCapacityLiters: 4.3,
      timingType: 'רצועת תזמון (טיימינג)',
      timingNotes: 'במנועי EA211 רצועת הטיימינג מיועדת לעד 120,000 ק"מ או 5 שנים בישראל. במנועי EA888 שרשרת תזמון.',
      schedule: [
        { item: 'החלפת שמן מנוע ומסנן שמן מקורי בתקן VW', intervalKm: 15000, intervalMonths: 12, importance: 'critical', notes: 'רגישות גבוהה לאיכות השמן עקב המגדש והמרימים ההידראוליים' },
        { item: 'החלפת מסנן אוויר ומסנן מזגן פחם', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' },
        { item: 'החלפת מצתים (פלאגים) אירידיום', intervalKm: 60000, intervalMonths: 48, importance: 'critical', notes: 'קריטי במנועי TSI למניעת מיספייר ועומס על סלילי ההצתה' },
        { item: 'החלפת שמן גיר DSG (בתיבות רטובות DQ250/DQ381 בלבד)', intervalKm: 60000, intervalMonths: 48, importance: 'critical' },
        { item: 'בדיקת רצועת תזמון (טיימינג) ומחזירי שמן', intervalKm: 90000, intervalMonths: 60, importance: 'critical' },
        { item: 'החלפת נוזל בלמים DOT 4', intervalKm: 30000, intervalMonths: 24, importance: 'critical' }
      ]
    },
    reliability: {
      engineRating: 4.2,
      transmissionRating: 3.4,
      electricalRating: 4.0,
      suspensionRating: 4.4,
      overallScore: 4.0,
      partsAvailabilityInIsrael: 'גבוהה מאוד',
      maintenanceComplexity: 'בינונית',
      summaryHebrew: 'רכבי קבוצת VAG מציעים הנדסת אנוש מעולה, ביצועי מנוע מרשימים וצריכת דלק מצוינת הודות לשילוב TSI + DSG. עם זאת, תיבת ה-DSG ה-7 הילוכים היבשה דורשת מודעות ותקציב תחזוקה ייעודי לנהיגה עירונית בפקקים.'
    },
    verdict: {
      pros: ['ביצועי מנוע מצוינים וזמינות כוח מעולה', 'מרחב פנים ותא מטען ענק (במיוחד בדגמי סקודה)', 'צריכת דלק נמוכה מאוד בשיוט בין-עירוני', 'זמינות חלפים ומומחיות במוסכים מעולה בישראל'],
      cons: ['בלאי מצמדים בתיבת DSG בשימוש עירוני כבד', 'רגישות לדליפות ממשאבת המים והתרמוסטט', 'עלויות חלפים מקוריים מעט יקרות ביחס לרכב יפני'],
      top5Considerations: [
        'בדיקת תיבת ההילוכים DSG: ודאו שאין רעידות ביציאה מהמקום או בהעברה בין הילוך 1 ל-2.',
        'היסטוריית החלפת מצמדים/מוח גיר: בדקו מתי בוצע טיפול גיר לאחרונה במוסך מורשה או מומחה.',
        'בדיקת מפלס נוזל קירור: חפשו סימני דליפה ורודים מתחת לבית משאבת המים והתרמוסטט.',
        'טיימינג: ודאו שרצועת התזמון הוחלפה במידה והרכב עבר 100,000 ק"מ או 5 שנים.',
        'היסטוריית טיפולים סדירה עם שמן בתקן VW מתאים בלבד (חיוני למגדש הטורבו).'
      ],
      bottomLine: 'רכב משפחתי ואיכותי מהטובים בקטגוריה, מומלץ מאד לנסיעות בין-עירוניות. לקונה יד שנייה: חובה לבדוק תקינות גיר DSG ומשאבת מים.'
    }
  },

  // 2. Toyota Hybrid (Corolla, Yaris, RAV4, C-HR, Prius)
  {
    makeMatch: /טויוטה|toyota|לקסוס|lexus/i,
    modelMatch: /קורולה|יאריס|ראב|chr|c-hr|פריוס|פריוס פלוס|קאמרי|corolla|yaris|rav4|prius|camry/i,
    fuelMatch: /היברידי|חשמל\/בנזין|בנזין/i,
    modelSlug: 'toyota-hybrid',
    modelHubTitle: 'מדריך קנייה לרכבי טויוטה היברידיים (קורולה, ראב4, יאריס)',
    problems: [
      {
        id: 'toyota-inverter-cooling',
        name: 'סתימת מסנן מאוורר קירור סוללת היברידית',
        category: 'hybrid_ev',
        description: 'מאוורר קירור סוללת המתח הגבוה שואב אוויר מתא הנוסעים. הצטברות אבק ושערות חוסמת את מעבר האוויר, גורמת להתחממות הסוללה ולקיצור חייה.',
        affectedYears: 'כל השנים',
        affectedEngines: 'מערכות היברידיות HSD 1.5, 1.8, 2.5',
        symptoms: ['רעש מאוורר מוגבר מהמושב האחורי', 'נורית תקלה היברידית', 'ירידה בביצועים וצריכת דלק מוגברת'],
        possibleCauses: ['הזנחת ניקוי מסנן יניקת האוויר של הסוללה בטיפולים'],
        severity: 'medium',
        estimatedCostIls: { min: 250, max: 600, description: 'ניקוי מאוורר ומסנן במוסך' },
        isRecurring: false,
        hasRecallOrTsb: true,
        sources: [{ name: 'Toyota Technical Service Bulletin', date: '2021' }]
      },
      {
        id: 'toyota-12v-battery',
        name: 'פריקת מצבר עזר 12V ברכבים היברידיים',
        category: 'electrical',
        description: 'מצבר ה-12V הקטן ברכבים היברידיים נפרק במהירות בעמידה ממושכת (שבועיים ומעלה ללא נסיעה) או בשל התקנות מקומיות לא מקוריות (קודן/איתוראן).',
        affectedYears: '2016–2024',
        symptoms: ['הרכב אינו מגיב ללחיצה על כפתור START', 'הודעת "Check Hybrid System" פתאומית'],
        possibleCauses: ['זליגת זרם ממערכות מיגון ישראליות', 'קיבולת מצבר קטנה יחסית'],
        severity: 'low',
        estimatedCostIls: { min: 650, max: 1100, description: 'מצבר AGM 12V ייעודי' },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'מועדון טויוטה ישראל', date: '2023' }]
      },
      {
        id: 'toyota-egr-carbon',
        name: 'הצטברות פיח במצנן ושסתום ה-EGR',
        category: 'engine',
        description: 'במנועי 1.8 היברידיים בקילומטראז גבוה (מעל 140,000 ק"מ) מצטבר פיח במעברי מערכת מחזור גזי הפליטה (EGR), מה שעלול לגרום לרעידות מנוע בעומס נמוך.',
        affectedYears: '2013–2020',
        affectedEngines: '1.8L 2ZR-FXE',
        symptoms: ['רעידות קלות בהתנעת מנוע הבנזין בקור', 'נורית תקלה P0401'],
        possibleCauses: ['נסיעות קצרות ועירוניות מרובות'],
        severity: 'medium',
        estimatedCostIls: { min: 800, max: 1800, description: 'פירוק וניקוי יסודי של מכלול ה-EGR והסעפת' },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'Toyota Owners Guild', date: '2022' }]
      }
    ],
    specificSellerQuestions: [
      {
        question: 'האם קיימת תעודת אחריות מורחבת בתוקף לסוללה ההיברידית ממוסך טויוטה רשמי?',
        reason: 'טויוטה מאפשרת הארכת אחריות לסוללה עד גיל 10-12 שנים בבדיקה שנתית בעלות של כ-₪350. קיומה מעניק שקט נפשי מלא מפני כשל סוללה שעלותו מעל ₪9,000.',
        watchOutFor: 'אם בעל הרכב הפסיק לחדש את ביטוח הסוללה, ייתכן שקיבל התרעה על תאים חלשים.'
      },
      {
        question: 'האם פתח יניקת האוויר של הסוללה במושב האחורי נוקה באופן סדיר?',
        reason: 'סתימת המאוורר גורמת להתחממות הסוללה ההיברידית ומקצרת משמעותית את אורך חייה.',
        watchOutFor: 'לכלוך, שערות בעלי חיים או חסימה מוחלטת של רשת היניקה בצידי המושב האחורי.'
      }
    ],
    maintenance: {
      recommendedOilSpec: '0W-16 או 0W-20 בתקן API SP / ILSAC GF-6B סינטטי מלא בלבד',
      oilCapacityLiters: 4.2,
      timingType: 'שרשרת תזמון',
      timingNotes: 'שרשרת תזמון ארוכת חיים לכל אורך חיי המנוע ללא החלפה יזומה.',
      schedule: [
        { item: 'החלפת שמן מנוע 0W-20/0W-16 ומסנן מקורי', intervalKm: 15000, intervalMonths: 12, importance: 'critical', notes: 'הכרחי להשתמש בצמיגות דלילה לשימון אופטימלי בהתנעות מרובות של המנוע ההיברידי' },
        { item: 'בדיקת בריאות סוללה היברידית וניקוי מסנן מאוורר קירור', intervalKm: 15000, intervalMonths: 12, importance: 'critical' },
        { item: 'החלפת מסנן מזגן ומסנן אוויר', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' },
        { item: 'החלפת נוזל בלמים', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' },
        { item: 'החלפת מצתי אירידיום מקוריים Denso', intervalKm: 90000, intervalMonths: 72, importance: 'critical' },
        { item: 'בדיקת נוזל ממסרת היברידית e-CVT', intervalKm: 90000, intervalMonths: 72, importance: 'recommended' }
      ]
    },
    reliability: {
      engineRating: 4.9,
      transmissionRating: 4.9,
      electricalRating: 4.7,
      suspensionRating: 4.6,
      overallScore: 4.8,
      partsAvailabilityInIsrael: 'גבוהה מאוד',
      maintenanceComplexity: 'פשוטה',
      summaryHebrew: 'טויוטה היברידית היא ממכוניות האמינות והחסכוניות ביותר בשוק הרכב הישראלי. תיבת ה-e-CVT היא פלנטרית ללא רצועות או מצמדים נשחקים, והבלאי הכללי נמוך במיוחד. שמירת ערך וביקוש מהגבוהים בישראל.'
    },
    verdict: {
      pros: ['אמינות מופתית לאורך מאות אלפי קילומטרים', 'צריכת דלק נמוכה להפליא (18–22 ק"מ לליטר בממוצע)', 'שמירת ערך וסחירות יוצאת דופן בישראל', 'עלויות אחזקה ובלאי בלמים מינימליות'],
      cons: ['בידוד רעשים סביר בלבד במהירויות כביש מהיר', 'חוויית נהיגה פונקציונלית ופחות ספורטיבית', 'תא מטען מעט מוגבל בחלק מדגמי ההאצ\'בק עקב הסוללה'],
      top5Considerations: [
        'בדיקת בריאות סוללה היברידית (Hybrid Health Check) במוסך מורשה טויוטה.',
        'בדיקת קיום תעודת אחריות מורחבת לסוללה ההיברידית (עד 10–12 שנים).',
        'וידוא ניקיון מסנן מאוורר הסוללה במושב האחורי.',
        'בדיקת היסטוריית טיפולים בשמן 0W-20/0W-16 איכותי.',
        'בדיקת מצבר עזר 12V למניעת הפתעות פריקה.'
      ],
      bottomLine: 'הרכישה הבטוחה והמשתלמת ביותר בשוק המשומשות בישראל למי שמחפש שקט נפשי, חיסכון בדלק ועלויות אחזקה אפסיות.'
    }
  },

  // 3. Hyundai / Kia (Ioniq, Tucson, Sportage, i10, i20, i30, Picanto, Niro)
  {
    makeMatch: /יונדאי|קיה|hyundai|kia/i,
    modelMatch: /איוניק|טוסון|ספורטאז|i10|i20|i30|פיקנטו|נירו|קונה|סטוניק|סורנטו|ioniq|tucson|sportage|picanto|niro|kona/i,
    modelSlug: 'hyundai-kia',
    modelHubTitle: 'מדריך קנייה לרכבי יונדאי וקיה יד שנייה (איוניק, נירו, ספורטאז, טוסון)',
    problems: [
      {
        id: 'hyundai-dct-dry-wear',
        name: 'בלאי מצמדי גיר רובוטי כפול מצמדים (7DCT / 6DCT)',
        category: 'transmission',
        description: 'תיבת ההילוכים הרובוטית DCT (בדגמי איוניק, נירו, טוסון וספורטאז טורבו) סובלת מהתחממות ושחיקת מצמדים בפקקים ממושכים, ומצריכה החלפת מצמדים כל 70k-120k ק"מ.',
        affectedYears: '2016–2022',
        affectedEngines: '1.6 GDI, 1.6 T-GDI, 1.6 Hybrid',
        symptoms: ['רעידות בהאצה ממהירות אפס', 'התחממות גיר (הודעת אזהרה בלוח השעונים בפקקים)', 'השתהות במעבר להילוך אחורי'],
        possibleCauses: ['זחילת פקקים רצופה ללא שחרור מלא של הבלם'],
        severity: 'high',
        estimatedCostIls: { min: 3500, max: 6200, description: 'סט מצמדים + עבודה וכוונון מפעילים' },
        isRecurring: true,
        hasRecallOrTsb: true,
        sources: [{ name: 'קיה ויונדאי ישראל - מוסכים מורשים', date: '2023' }]
      },
      {
        id: 'hyundai-steering-coupler',
        name: 'שחיקת גומיית מצמד מוט הגה (Steering Coupler)',
        category: 'suspension',
        description: 'כוכב הגומי הקטן בתוך מנוע תגבור ההגה החשמלי מתפורר עם השנים ומייצר נקישות מורגשות בעת סיבוב ההגה.',
        affectedYears: '2011–2019',
        symptoms: ['נקישות בעת הזזת גלגל ההגה ימינה ושמאלה בחניה', 'חופש קל בתחושת ההיגוי'],
        possibleCauses: ['התיישנות החומר האלסטומרי של כוכב ההגה'],
        severity: 'low',
        estimatedCostIls: { min: 450, max: 900, description: 'החלפת גומיית כוכב הגה (חלק זול, עבודה מדויקת)' },
        isRecurring: false,
        hasRecallOrTsb: true,
        sources: [{ name: 'Hyundai TSB 14-ST-002-1', date: '2018' }]
      }
    ],
    specificSellerQuestions: [
      {
        question: 'האם המצמדים בגיר הוחלפו בעבר, והאם מורגשות רעידות ביציאה מהמקום?',
        reason: 'החלפת מצמדים בגיר DCT עולה כ-₪4,500. חיוני לדעת אם הוחלפו ומתי.',
        watchOutFor: 'רעידה קלה בתחילת נסיעה או השהיה בלחיצה על הגז ביציאה מרמזור.'
      },
      {
        question: 'בדגמי איוניק/נירו: האם הוחלף נוזל מפעיל מצמדים היברידי במוסך מורשה?',
        reason: 'הנוזל ההידראולי של מפעיל המצמדים דורש החלפה כל שנתיים / 30,000 ק"מ. הזנחתו גורמת לשריפת מפעיל.',
        watchOutFor: 'היסטוריית טיפולים ללא שורת "החלפת שמן מפעיל היברידי".'
      }
    ],
    maintenance: {
      recommendedOilSpec: '5W-30 או 0W-20 בתקן ACEA C2/C3 או API SP',
      oilCapacityLiters: 3.8,
      timingType: 'שרשרת תזמון',
      timingNotes: 'מצויד בשרשרת תזמון, אולם מומלץ לבדוק מותחן שרשרת מעל 150,000 ק"מ.',
      schedule: [
        { item: 'החלפת שמן מנוע ומסנן שמן מקורי', intervalKm: 15000, intervalMonths: 12, importance: 'critical' },
        { item: 'בדיקה והחלפת נוזל מפעיל מצמדים היברידי (בדגמי איוניק/נירו)', intervalKm: 30000, intervalMonths: 24, importance: 'critical', notes: 'קריטי לפעולה חלקה של תיבת ה-DCT ההיברידית' },
        { item: 'החלפת מסנני אוויר ומזגן', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' },
        { item: 'החלפת מצתים', intervalKm: 75000, intervalMonths: 48, importance: 'recommended' },
        { item: 'בדיקת בלאי מצמדי תיבת ה-DCT בסורק', intervalKm: 60000, intervalMonths: 48, importance: 'recommended' }
      ]
    },
    reliability: {
      engineRating: 4.4,
      transmissionRating: 3.8,
      electricalRating: 4.5,
      suspensionRating: 4.3,
      overallScore: 4.3,
      partsAvailabilityInIsrael: 'גבוהה מאוד',
      maintenanceComplexity: 'פשוטה',
      summaryHebrew: 'דגמי יונדאי וקיה פופולריים מאוד בישראל בזכות רמת אבזור גבוהה, בטיחות מתקדמת ומערכות מולטימדיה מעולות. האמינות הכללית גבוהה, אך בדגמים המצוידים בגיר רובוטי DCT מומלץ לבדוק את מצב המצמדים.'
    },
    verdict: {
      pros: ['אבזור עשיר ומערכות בטיחות אקטיביות מתקדמות', 'זמינות חלפים ומוסכים בכל רחבי ישראל', 'אחזקה פשוטה וזולה יחסית', 'בידוד רעשים ונוחות נסיעה טובה'],
      cons: ['גיר DCT דורש הסתגלות ועלול להישחק בפקקים', 'פלסטיקה פנימית מעט פשוטה בחלק מהדגמים', 'צריכת דלק בינונית בדגמי בנזין רגילים (טוסון/ספורטאז בנזין)'],
      top5Considerations: [
        'בדיקת תיבת ה-DCT: ודאו שאין רעידות או קפיצות בתחילת נסיעה.',
        'בדגמי היבריד (איוניק/נירו): בדיקת החלפת נוזל מפעיל מצמדים היברידי במועד.',
        'בדיקת נקישות בהגה במגרש חניה (גומיית כוכב הגה).',
        'בדיקת מפלס שמן מנוע והיסטוריית טיפולים סדירה.',
        'בדיקת מקוריות בעלות: רכבים רבים הגיעו מליסינג/השכרה, חשוב לוודא היסטוריה.'
      ],
      bottomLine: 'אחת המשפחתיות והרכבים הנמכרים והפרקטיים בישראל, עסקה מצוינת בשוק המשומשות כפוף לבדיקת גיר קפדנית.'
    }
  }
];

export function calculateOwnershipEstimate(
  modelYear: number,
  firstRegDate: string,
  currentBaalut: string,
  originalMkoriut: string
) {
  const currentYear = 2026;
  const ageYears = Math.max(0.5, currentYear - modelYear);
  const orig = (originalMkoriut || currentBaalut || 'פרטי').trim();

  let estimatedHandMin = 1;
  let estimatedHandMax = 1;
  let explanation = '';
  let resaleImpact = '';

  if (ageYears <= 2) {
    estimatedHandMin = 1;
    estimatedHandMax = 1;
    explanation = `רכב חדיש יחסית (שנתון ${modelYear}). בסבירות גבוהה מאוד מדובר ברכב יד ראשונה (יד 1).`;
  } else if (ageYears <= 4) {
    estimatedHandMin = 1;
    estimatedHandMax = 2;
    explanation = `גיל הרכב כ-${Math.round(ageYears)} שנים. ממוצע החלפת בעלות בישראל עומד על כ-3.5 שנים, ולכן הרכב צפוי להיות יד 1 או יד 2 לכל היותר.`;
  } else if (ageYears <= 7) {
    estimatedHandMin = 2;
    estimatedHandMax = 3;
    explanation = `גיל הרכב כ-${Math.round(ageYears)} שנים. בטווח שנים זה מרבית הרכבים נמצאים ביד 2 או יד 3.`;
  } else {
    estimatedHandMin = 2;
    estimatedHandMax = Math.min(5, Math.round(ageYears / 2.8));
    explanation = `רכב ותיק (שנתון ${modelYear}). הערכה סטטיסטית של יד 3 ומעלה לפי ממוצע תחלופת בעלים בישראל.`;
  }

  if (/ליסינג/i.test(orig)) {
    resaleImpact = 'מקוריות מליסינג גוררת בדרך כלל הפחתה של 8%–14% ממחיר המחירון ביד שנייה (תלוי אם ליסינג מימוני או תפעולי).';
  } else if (/השכרה/i.test(orig)) {
    resaleImpact = 'מקוריות מהשכרה גוררת הפחתה ממוצעת של 14%–22% במחירון לוי יצחק / יד 2.';
  } else if (/חברה/i.test(orig)) {
    resaleImpact = 'מקוריות מחברה גוררת הפחתה של 10%–16% במחירון.';
  } else {
    resaleImpact = 'מקוריות פרטית: שומרת על מחירון מלא ומבוקשת מאוד בשוק המשומשות בישראל.';
  }

  const handText = estimatedHandMin === estimatedHandMax 
    ? `יד ${estimatedHandMin} משוערת` 
    : `יד ${estimatedHandMin} - ${estimatedHandMax} משוערת`;

  return {
    currentCategory: currentBaalut || 'פרטי',
    originalHandOrigin: orig,
    estimatedHandText: handText,
    estimatedHandMin,
    estimatedHandMax,
    estimatedHandExplanation: explanation,
    resalePriceImpact: resaleImpact,
    howToVerifyDocument: [
      'ברישיון הרכב המודפס (המקורי): בדקו את השדה "בעלים קודמים" (00 = יד 1, 01 = יד 2, 02 = יד 3, 03 = יד 4).',
      'באזור האישי הממשלתי (Gov.il): בעל הרכב יכול להפיק אישור בעלויות רשמי בחינם המפרט את תאריכי העברות הבעלות הקודמות.',
      'בהעברת בעלות בדואר או באינטרנט: המספר מוצג בצורה מפורשת לפני אישור התשלום.'
    ]
  };
}

export function calculateBuyerDecision(
  modelYear: number,
  lastMileageKm: number | undefined,
  hasActiveRecall: boolean,
  hasStructuralMod: boolean,
  isTestValid: boolean,
  problems: KnownProblem[],
  specificQuestions?: any[]
) {
  const currentYear = 2026;
  const ageYears = Math.max(1, currentYear - modelYear);
  const expectedMileage = Math.round(ageYears * 17500); // 17,500 km Israeli annual avg

  let score = 88;
  const factors: any[] = [];

  // Factor 1: Recalls
  if (hasActiveRecall) {
    score -= 30;
    factors.push({
      label: 'קריאת שירות בטיחותית פתוחה (ריקול)',
      score: -30,
      weight: 'קריטי',
      status: 'alert',
      description: 'קיים ריקול פתוח במאגר משרד התחבורה. הרכב לא יוכל לעבור טסט או העברת בעלות עד לביצועו במוסך היבואן.'
    });
  } else {
    factors.push({
      label: 'סטטוס ריקולים בטיחותיים',
      score: 10,
      weight: 'חיובי',
      status: 'good',
      description: 'אין קריאות שירות פתוחות המגבילות את רישיון הרכב.'
    });
  }

  // Factor 2: Test Validity
  if (!isTestValid) {
    score -= 15;
    factors.push({
      label: 'תוקף מבחן רישוי שנתי (טסט)',
      score: -15,
      weight: 'אזהרה',
      status: 'warning',
      description: 'הטסט פג תוקף או קרוב מאוד לסיומו. יש לקחת בחשבון עלות אגרה ותיקונים למבחן.'
    });
  } else {
    factors.push({
      label: 'מבחן רישוי שנתי בתוקף',
      score: 10,
      weight: 'חיובי',
      status: 'good',
      description: 'הרכב עבר טסט ומורשה לתנועה כחוק.'
    });
  }

  // Factor 3: Structural Modification
  if (hasStructuralMod) {
    score -= 10;
    factors.push({
      label: 'שינוי מבנה מתועד במאגר',
      score: -10,
      weight: 'בדיקה נדרשת',
      status: 'warning',
      description: 'מתועד שינוי מבנה (וו גרירה, התקן גז, מיגונים וכו\'). יש לוודא התאמה לרישיון.'
    });
  }

  // Factor 4: Mileage vs Age
  if (lastMileageKm) {
    const diff = lastMileageKm - expectedMileage;
    if (diff > 35000) {
      score -= 12;
      factors.push({
        label: 'נסועה (קילומטראז\') מעל הממוצע',
        score: -12,
        weight: 'בלאי מואץ',
        status: 'warning',
        description: `בטסט האחרון נרשמו ${lastMileageKm.toLocaleString()} ק"מ (מעל הממוצע של ${expectedMileage.toLocaleString()} לשנתון זה).`
      });
    } else if (diff < -20000) {
      score += 8;
      factors.push({
        label: 'קילומטראז\' נמוך מהממוצע',
        score: +8,
        weight: 'יתרון משמעותי',
        status: 'good',
        description: `נסועה נמוכה ביחס לשנתון (${lastMileageKm.toLocaleString()} ק"מ בלבד לעומת צפי של ${expectedMileage.toLocaleString()}).`
      });
    }
  }

  // Factor 5: Mechanical weaknesses
  const criticalProblems = problems.filter(p => p.severity === 'critical' || p.severity === 'high');
  if (criticalProblems.length > 0) {
    score -= 10;
    factors.push({
      label: 'נקודות תורפה מכניות מוכרות בדגם',
      score: -10,
      weight: 'דורש בדיקה מכנית',
      status: 'warning',
      description: `זוהו ${criticalProblems.length} רכיבים הדורשים בדיקה ממוקדת במכון לפני קנייה.`
    });
  }

  score = Math.max(20, Math.min(98, score));
  const riskLevel = score >= 80 ? 'נמוך' : score >= 60 ? 'בינוני' : 'גבוה';
  const verdictHebrew = score >= 80 
    ? 'מומלץ לבדיקה: הרכב מציג נתונים חיוביים בעלי סיכון נמוך כפוף לבדיקת מכון שגרתית.'
    : score >= 60
      ? 'כדאיות בינונית: הרכב דורש בדיקה ממוקדת סביב נקודות התורפה וההיסטוריה שצוינו.'
      : 'רמת סיכון גבוהה: אותרו התראות משמעותיות (ריקול פתוח או ליקויים). לא מומלץ להתקדם ללא תיקון והסדרה מראש.';

  const defaultQuestions = [
    {
      question: 'האם יש בידיך היסטוריית טיפולים מלאה ומסודרת עם קבלות?',
      reason: 'ספר טיפולים מתועד הוא ההוכחה היחידה לקילומטראז אמיתי ולשימוש בשמנים בתקן הנכון.',
      watchOutFor: 'תשובות כמו "טיפלתי אצל חבר" או היעדר תיעוד של יותר מ-30,000 ק"מ רצופים.'
    },
    {
      question: 'האם הרכב עבר תאונות עם פגיעות שלדה (שאסי) או ירידת ערך ביטוחית?',
      reason: 'מוכרים רבים מעדיפים לא לגלות על תאונות קודמות עד שלב הבדיקה במכון.',
      watchOutFor: 'בקשו לראות דוח סליקה מחברות הביטוח לפני תשלום למכון בדיקה.'
    },
    {
      question: 'האם הרכב משועבד לבנק או לחברת מימון, והאם קיימים עיקולים?',
      reason: 'רכב משועבד לא ניתן להעביר בעלות ללא מכתב שחרור רשמי מהגוף המממן.',
      watchOutFor: 'הפיקו בעצמכם בדיקה ברשם המשכונות (עולה ₪10 בלבד) ואל תסתמכו על הבטחה בעל פה.'
    }
  ];

  return {
    purchaseScore: score,
    riskLevel,
    verdictHebrew,
    scoreFactors: factors,
    sellerQuestionsScript: specificQuestions && specificQuestions.length > 0 ? [...specificQuestions, ...defaultQuestions] : defaultQuestions,
    physicalTestTips: [
      'מכסה מנוע קר: הגיעו כשהמנוע קר לחלוטין. פתחו את פקק מילוי השמן ובדקו שאין משקע דמוי מיונז (סימן לחדירת מים/פריצת אטם ראש).',
      'מיכל עיבוי נוזל קירור: ודאו שנוזל הקירור נקי וצבעוני (ורוד או ירוק) וללא כתמי שמן צפים או מים רגילים.',
      'מזגן וחימום בקיץ הישראלי: הדליקו מזגן על מקסימום קור ל-5 דקות. ודאו שהמאוורר נכנס לפעולה ולא נדלקת נורית חום מנוע.',
      'בדיקת צמיגים ותאריך ייצור: בדקו את קוד ה-DOT בעל 4 הספרות (למשל 2322 = שבוע 23 של שנת 2022). צמיגים בני מעל 4 שנים דורשים החלפה.',
      'נסיעת מבחן בעיר ובמהיר: שחררו הגה לרגע בכביש ישר לוודא שהרכב לא מושך לצד, והאזינו לנקישות בפניות מלאות במגרש חניה.'
    ],
    officialRegistryChecks: [
      {
        title: 'בדיקת משכונות ושעבודים',
        serviceName: 'רשם המשכונות - משרד המשפטים',
        url: 'https://ica.justice.gov.il/Request/OpenServicesList?Unit=mashkonot',
        cost: '₪10 באונליין',
        isMandatory: true,
        description: 'בדיקה חיונית המוודאת שהרכב אינו משועבד לבנק, הלוואה או חברת ליסינג. העברת בעלות אינה מבטלת משכון קודם!'
      },
      {
        title: 'בדיקת עבר ביטוחי ותביעות',
        serviceName: 'מרכז הסליקה של חברות הביטוח',
        url: 'https://slika-ins.co.il',
        cost: '₪10',
        isMandatory: true,
        description: 'חושף את כל תביעות הביטוח, ירידות הערך, תאונות ואובדן להלכה (טוטאל-לוס) ב-7 השנים האחרונות.'
      },
      {
        title: 'אימות בעלות ועיקולים ממשלתי',
        serviceName: 'האזור האישי הממשלתי Gov.il',
        url: 'https://my.gov.il',
        cost: 'חינם (דורש הזדהות בעל הרכב)',
        isMandatory: true,
        description: 'הפקת אישור בעלות רשמי המאמת שהמוכר הוא אכן הבעלים החוקי ואין צווי עיקול על הרכב.'
      }
    ]
  };
}

export function generateSeoInterlinking(plateNumber: string, make: string, commercialName: string, year: number, fuelType: string) {
  // Diverse Israeli vehicle plates database for internal linking (4-5 direct referrals)
  const pool = [
    { plate: '42822302', title: 'טויוטה קורולה היברידית', year: 2021, fuel: 'היברידי', badge: 'משפחתית פופולרית' },
    { plate: '84457801', title: 'יונדאי איוניק היבריד', year: 2020, fuel: 'היברידי', badge: 'חסכונית מבוקשת' },
    { plate: '7943026', title: 'סקודה סופרב דיזל FL', year: 2021, fuel: 'דיזל', badge: 'מנהלים / מרווחת' },
    { plate: '71385104', title: 'לינק אנד קו 02 חשמלי', year: 2026, fuel: 'חשמל', badge: '100% חשמלי' },
    { plate: '36181801', title: 'סקודה אוקטביה TSI', year: 2017, fuel: 'בנזין', badge: 'תא מטען ענק' },
    { plate: '1001160', title: 'טויוטה קורולה RunX', year: 2006, fuel: 'בנזין', badge: 'בדיקת ריקול' }
  ];

  const relatedVehicles = pool.filter(p => p.plate !== plateNumber).slice(0, 4);

  const geoGuides = [
    { name: 'תל אביב וגוש דן', slug: 'tel-aviv', description: 'מדריך קנייה ומכוני בדיקה מומלצים במרכז' },
    { name: 'ירושלים והסביבה', slug: 'jerusalem', description: 'דגשים לרכבים שעלו בעליות לירושלים ומכונים מורשים' },
    { name: 'חיפה והקריות', slug: 'haifa', description: 'בדיקת בלאי בלמים ומנוע בנסיעות הכרמל ומכוני בדיקה' },
    { name: 'באר שבע והדרום', slug: 'beer-sheva', description: 'בדיקת מערכות קירור ומזגן באקלים חם' },
    { name: 'ראשון לציון והשפלה', slug: 'rishon-lezion', description: 'מרכזי טרייד-אין ומכוני בדיקה מובילים בשפלה' }
  ];

  const cleanModelSlug = `${make}-${commercialName}`.toLowerCase().replace(/[^a-z0-9א-ת]/g, '-');

  return {
    relatedVehicles,
    modelHub: {
      title: `מדריך רכב מלא לדגם ${make} ${commercialName}`,
      slug: cleanModelSlug,
      description: `כל מה שצריך לדעת לפני קניית ${make} ${commercialName}: מפרט, אמינות, עלויות ותקלות.`
    },
    geoGuides
  };
}

export function getLicensingFeeByGroup(group: number): number {
  const fees: Record<number, number> = {
    1: 1235,
    2: 1529,
    3: 1801,
    4: 2130,
    5: 2426,
    6: 3364,
    7: 4721
  };
  return fees[group] || 1801;
}

export function resolveVehicleIntelligence(
  make: string,
  model: string,
  commercialName: string,
  year: number,
  engineDisplacement: number,
  fuelType: string,
  engineCode?: string,
  licensingGroup: number = 3
) {
  const fullText = `${make} ${model} ${commercialName}`.trim();

  // Search knowledge base
  const matched = MODEL_KNOWLEDGE_BASE.find(profile => {
    const makeOk = profile.makeMatch.test(fullText);
    const modelOk = profile.modelMatch ? profile.modelMatch.test(fullText) : true;
    const fuelOk = profile.fuelMatch ? profile.fuelMatch.test(fuelType) : true;
    return makeOk && modelOk && fuelOk;
  });

  const annualLicensingFeeIls = getLicensingFeeByGroup(licensingGroup || 3);

  if (matched) {
    return {
      knownProblems: matched.problems,
      maintenance: matched.maintenance,
      reliability: matched.reliability,
      verdict: matched.verdict,
      specificSellerQuestions: matched.specificSellerQuestions,
      modelSlug: matched.modelSlug,
      modelHubTitle: matched.modelHubTitle,
      costs: {
        annualLicensingFeeIls,
        licensingGroup: licensingGroup || 3,
        estimatedAnnualMaintenanceIls: matched.fuelMatch?.test('חשמל') ? 950 : 1850,
        tireSetReplacementIls: { min: 1400, max: 2800 },
        brakePadSetIls: { min: 450, max: 950 },
        batteryReplacementIls: { min: 650, max: 1200 },
        annualCostNotes: 'אומדן המבוסס על מחירי מוסכים מורשים ומומחים בישראל לשנת 2024–2026.'
      }
    };
  }

  // Sensible generic fallback tailored by fuel type and displacement
  const isHybrid = /היברידי|hybrid/i.test(fuelType);
  const isElectric = /חשמל|electric/i.test(fuelType);
  const isDiesel = /דיזל|diesel/i.test(fuelType);

  return {
    knownProblems: [
      {
        id: 'gen-wear-brakes',
        name: 'בלאי רפידות וצלחות בלם קדמיות',
        category: 'brakes' as const,
        description: 'שחיקה שגרתית של רפידות וצלחות הבלימה, בלאי אופייני לתנאי הפקקים והאקלים בישראל לאחר 30,000–45,000 ק"מ.',
        affectedYears: 'כל השנים',
        symptoms: ['שריקות בבלימה', 'רעד קל בדוושה במהירות גבוהה'],
        possibleCauses: ['בלאי חיכוך רגיל'],
        severity: 'low' as const,
        estimatedCostIls: { min: 450, max: 950 },
        isRecurring: true,
        hasRecallOrTsb: false,
        sources: [{ name: 'המלצות איגוד המוסכים בישראל', date: '2024' }]
      },
      {
        id: 'gen-suspension-bushings',
        name: 'שחיקת תותבי משולשים ומוטות מייצב',
        category: 'suspension' as const,
        description: 'גומיות המשולשים ומוטות המייצב מתייבשות ונשחקות מפסי האטה ובורות בכביש, מה שגורם לרעשי נקישה במעבר על שיבושים.',
        affectedYears: 'כל השנים',
        symptoms: ['נקישות במעבר פסי האטה', 'שחיקת צמיגים לא סימטרית'],
        possibleCauses: ['עומסי כביש עירוניים ובלאי גומי טבעי'],
        severity: 'medium' as const,
        estimatedCostIls: { min: 650, max: 1400 },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'מפרט בדיקת רכב ממוחשבת', date: '2023' }]
      }
    ],
    specificSellerQuestions: undefined,
    modelSlug: 'general-vehicle',
    modelHubTitle: `מדריך קנייה לרכבי ${make}`,
    maintenance: {
      recommendedOilSpec: isElectric ? 'אין שמן מנוע' : '5W-30 או 0W-20 סינטטי מלא בתקן יצרן',
      oilCapacityLiters: isElectric ? 0 : 4.0,
      timingType: 'לא ידוע' as const,
      schedule: [
        { item: isElectric ? 'בדיקת מערכת קירור סוללה ונוזל בלמים' : 'החלפת שמן מנוע ומסנן שמן', intervalKm: 15000, intervalMonths: 12, importance: 'critical' as const },
        { item: 'החלפת מסנן מזגן ומסנן אוויר', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' as const },
        { item: 'החלפת נוזל בלמים DOT 4', intervalKm: 30000, intervalMonths: 24, importance: 'critical' as const }
      ]
    },
    reliability: {
      engineRating: 4.4,
      transmissionRating: 4.3,
      electricalRating: 4.2,
      suspensionRating: 4.2,
      overallScore: 4.3,
      partsAvailabilityInIsrael: 'גבוהה' as const,
      maintenanceComplexity: 'בינונית' as const,
      summaryHebrew: `רכב בעל מנוע ${isElectric ? 'חשמלי' : isDiesel ? 'דיזל' : isHybrid ? 'היברידי' : 'בנזין'} בנפח ${engineDisplacement || 0} סמ"ק. מציג אמינות כללית טובה כפוף לתחזוקה תקופתית סדירה לפי הוראות היצרן.`
    },
    verdict: {
      pros: ['חלפים זמינים ברחבי ישראל', 'אחזקה שגרתית ברורה ומוכרת במוסכים', 'התאמה טובה לתנאי הנסיעה בארץ'],
      cons: ['בלאי טבעי של רכיבי מתלה ובלמים בפקקים עירוניים'],
      top5Considerations: [
        'בדיקת היסטוריית טיפולים מלאה במוסך מורשה או מומחה.',
        'בדיקת קילומטראז בטסט האחרון מול מד האוץ ברכב.',
        'בדיקת תקינות תיבת ההילוכים בעומס ובחניה.',
        'בדיקת בלמים וצמיגים לפני מבחן הרישוי השנתי.',
        'בדיקת היעדר משכון ברשם המשכונות.'
      ],
      bottomLine: 'רכב פופולרי המתאים לצרכים משפחתיים או יומיומיים. מומלץ לבצע בדיקה מכנית מקצועית לפני רכישה.'
    },
    costs: {
      annualLicensingFeeIls,
      licensingGroup: licensingGroup || 3,
      estimatedAnnualMaintenanceIls: isElectric ? 900 : 1750,
      tireSetReplacementIls: { min: 1300, max: 2600 },
      brakePadSetIls: { min: 450, max: 900 },
      batteryReplacementIls: { min: 650, max: 1100 },
      annualCostNotes: 'אומדן טיפולים שוטפים שנתי ממוצע בישראל.'
    }
  };
}
