import { KnownProblem, MaintenanceItem, VehicleReportData } from '../types/vehicle';

interface ModelProfile {
  makeMatch: RegExp;
  modelMatch?: RegExp;
  engineMatch?: RegExp;
  fuelMatch?: RegExp;
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
}

export const MODEL_KNOWLEDGE_BASE: ModelProfile[] = [
  // 1. VAG Group (Skoda / VW / Seat / Audi) with EA211 or EA888 or TDI and DSG
  {
    makeMatch: /סקודה|פולקסווגן|סיאט|אאודי|אודי|skoda|volkswagen|seat|audi/i,
    modelMatch: /אוקטביה|סופרב|קודיאק|קארוק|גולף|פולו|טיגואן|פאסאט|איביזה|לאון|ארונה|אטקה|octavia|superb|kodiaq|golf|ibiza|leon/i,
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
      },
      {
        id: 'hyundai-engine-oil-consumption',
        name: 'צריכת שמן מנוע במנועי GDI ו-Nu 2.0',
        category: 'engine',
        description: 'בחלק ממנועי הבנזין בהזרקה ישירה (GDI) קיימת נטייה להצטברות פיח על טבעות הבוכנה ושסתומי היניקה, המובילה לעלייה בצריכת השמן.',
        affectedYears: '2014–2020',
        affectedEngines: '1.6 GDI, 2.0 Nu',
        symptoms: ['צריכת שמן בין טיפולים', 'הצטברות פיח באגזוז'],
        possibleCauses: ['סתימת חרירי שמן בטבעות הבוכנה'],
        severity: 'medium',
        estimatedCostIls: { min: 500, max: 2000 },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'Consumer Reports Automotive', date: '2022' }]
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
  },

  // 4. Stellantis (Peugeot, Citroen, Opel) - PureTech 1.2 & BlueHDi
  {
    makeMatch: /פיג'ו|פיגו|פז'ו|סיטרואן|אופל|peugeot|citroen|opel/i,
    modelMatch: /208|308|2008|3008|5008|c3|c4|c5|קורסה|גרנדלנד|corsa|grandland/i,
    problems: [
      {
        id: 'psa-puretech-belt',
        name: 'התפוררות רצועת תזמון טבולה בשמן (1.2 PureTech)',
        category: 'engine',
        description: 'רצועת התזמון במנועי 1.2 PureTech פועלת בתוך אמבט שמן מנוע. אדי דלק וחומציות שמן גורמים להתפוררות גומי הרצועה. השבבים סותמים את רשתית משאבת השמן ומשאבת הוואקום של הבלמים, מה שעלול להוביל לאובדן כוח בלימה והרס מנוע.',
        affectedYears: '2014–2022',
        affectedEngines: '1.2 PureTech 110hp / 130hp (EB2DT / EB2DTS)',
        symptoms: ['נורית לחץ שמן נדלקת בעומס', 'דוושת בלם קשה (ירידה בעוצמת התגבור)', 'שבבי גומי שחורים על מדיד השמן או בפילטר'],
        possibleCauses: ['התיישנות גומי הרצועה במגע עם שמן מנוע ודלק'],
        severity: 'critical',
        estimatedCostIls: { min: 2800, max: 5500, description: 'החלפת רצועה משודרגת, פירוק קרטר וניקוי רשתית משאבת השמן. (חלקית באחריות יבואן מורחבת)' },
        isRecurring: true,
        hasRecallOrTsb: true,
        recallCode: 'קמפיין שירות עולמי HNZ / JZR משרד התחבורה ישראל',
        sources: [
          { name: 'קריאת שירות משרד התחבורה ישראל לובינסקי', date: '2021' },
          { name: 'L\'Argus France Automobile', date: '2023' }
        ]
      },
      {
        id: 'psa-bluehdi-adblue',
        name: 'תקלות במכל ומערכת האוריאה (AdBlue) בדגמי דיזל',
        category: 'engine',
        description: 'משאבת האוריאה המשולבת בתוך מכל ה-AdBlue נוטה להתקלקל עקב התגבשות נוזל האוריאה, ומצריכה החלפת כל המכל.',
        affectedYears: '2015–2021',
        affectedEngines: '1.5 / 1.6 / 2.0 BlueHDi',
        symptoms: ['הודעת "Emissions fault: starting prevented in 1100 km"', 'נורית UREA מהבהבת'],
        possibleCauses: ['התגבשות אוריאה וסתימת המשאבה הפנימית'],
        severity: 'high',
        estimatedCostIls: { min: 3500, max: 5800, description: 'החלפת מכל אוריאה קומפלט' },
        isRecurring: true,
        hasRecallOrTsb: true,
        sources: [{ name: 'לובינסקי שירות לקוחות', date: '2022' }]
      }
    ],
    maintenance: {
      recommendedOilSpec: '0W-20 או 0W-30 בתקן ייעודי מחמיר PSA B71 2010 / B71 2312 בלבד!',
      oilCapacityLiters: 3.5,
      timingType: 'רצועת תזמון (טיימינג)',
      timingNotes: 'מרווח החלפה מקוצר בישראל למנועי PureTech: כל 60,000 ק"מ או 4 שנים בלבד (ולא 100k כמצוין בספר הרכב המקורי).',
      schedule: [
        { item: 'החלפת שמן מנוע בתקן PSA בלבד ובדיקת רוחב רצועת טיימינג עם מד ייעודי', intervalKm: 15000, intervalMonths: 12, importance: 'critical', notes: 'אסור בתכלית האיסור למלא שמן ללא התקן המדויק של היצרן' },
        { item: 'החלפת רצועת תזמון ופירוק קרטר לניקוי רשתית שמן', intervalKm: 60000, intervalMonths: 48, importance: 'critical' },
        { item: 'החלפת שמן גיר אוטומטי Aisin EAT6/EAT8', intervalKm: 60000, intervalMonths: 48, importance: 'recommended' },
        { item: 'החלפת מצתים ייעודיים', intervalKm: 40000, intervalMonths: 36, importance: 'critical' }
      ]
    },
    reliability: {
      engineRating: 3.2,
      transmissionRating: 4.8,
      electricalRating: 3.9,
      suspensionRating: 4.7,
      overallScore: 3.7,
      partsAvailabilityInIsrael: 'גבוהה',
      maintenanceComplexity: 'מורכבת',
      summaryHebrew: 'דגמי פיג\'ו וסיטרואן מצטיינים בנוחות נסיעה עילאית, עיצוב מרשים, בטיחות מצוינת ותיבות הילוכים אוטומטיות יפניות מעולות (Aisin EAT8). יחד עם זאת, מנוע ה-1.2 PureTech דורש הקפדה יתרה על שמן ייעודי ובדיקה מתמדת של רצועת הטיימינג הטבולה.'
    },
    verdict: {
      pros: ['נוחות נסיעה ושיכוך מהמורות המובילים בקטגוריה', 'גיר אוטומטי פלנטרי יפני Aisin אמין וחלק במיוחד', 'תא נוסעים מעוצב ואיכות חומרים גבוהה', 'מחיר רכישה אטרקטיבי כמשומש'],
      cons: ['רגישות קריטית של רצועת הטיימינג במנועי 1.2 PureTech', 'ירידת ערך מהירה יותר מרכבים יפניים', 'תקלות במערכת האוריאה AdBlue בדגמי דיזל'],
      top5Considerations: [
        'בדיקה קריטית של רצועת הטיימינג: מדדו את רוחבה דרך פתח מילוי השמן עם המד המיוחד.',
        'ודאו מתי הוחלפה רצועת הטיימינג לאחרונה ואם בוצע ניקוי רשתית משאבת שמן.',
        'בדקו האם הרכב זכאי לאחריות המורחבת של היבואן (לובינסקי) עד 10 שנים למנוע.',
        'בדקו האם מולא שמן בתקן PSA המדויק בלבד בכל הטיפולים.',
        'ברכבי דיזל: בדקו שאין תקלות או התראות במערכת ה-AdBlue.'
      ],
      bottomLine: 'רכב נוח ומפנק עם גיר יפני מצוין, אך קנייתו כמשומש מחייבת בדיקת מנוע וטיימינג מקצועית ללא פשרות.'
    }
  },

  // 5. Mazda (Mazda 2, 3, 6, CX-3, CX-5, CX-30)
  {
    makeMatch: /מאזדה|mazda/i,
    modelMatch: /2|3|6|cx|cx-3|cx-5|cx-30|cx-9/i,
    problems: [
      {
        id: 'mazda-ghost-touch',
        name: 'לחיצות רפאים (Ghost Touch) במסך מולטימדיה MZD Connect',
        category: 'electrical',
        description: 'התפרקות שכבת המגע במסך המרכזי גורמת לפקודות שווא וקפיצות בין תחנות רדיו או תפריטים בעיקר בחום השמש הישראלית.',
        affectedYears: '2014–2019',
        symptoms: ['המסך פותח תפריטים לבד בעצירה', 'ביפים מרובים ממערכת השמע'],
        possibleCauses: ['דה-למינציה של שכבת הדיגיטייזר מחום'],
        severity: 'low',
        estimatedCostIls: { min: 450, max: 1200, description: 'החלפת דיגיטייזר בלבד או נטרול מגע' },
        isRecurring: true,
        hasRecallOrTsb: true,
        sources: [{ name: 'Mazda North American Operations TSB', date: '2019' }]
      },
      {
        id: 'mazda-lower-control-arm',
        name: 'בלאי תותבי (בוקסות) משולשים קדמיים',
        category: 'suspension',
        description: 'תותבי הגומי האחוריים של המשולשים הקדמיים נוטים להיקרע לאחר כ-80,000–100,000 ק"מ בכבישי ישראל.',
        affectedYears: '2013–2021',
        symptoms: ['חבטה קלה בבלימה חזקה', 'שחיקת צמיגים לא אחידה'],
        possibleCauses: ['בלאי גומי טבעי ממשקל הרכב ופסי האטה'],
        severity: 'medium',
        estimatedCostIls: { min: 900, max: 1800, description: 'החלפת זוג משולשים/בוקסות + כיוון פרונט' },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'מועדון מאזדה ישראל', date: '2023' }]
      }
    ],
    maintenance: {
      recommendedOilSpec: '0W-20 או 5W-30 בתקן API SP / ILSAC GF-6',
      oilCapacityLiters: 4.2,
      timingType: 'שרשרת תזמון',
      timingNotes: 'מצויד בשרשרת תזמון אמינה לכל חיי הרכב.',
      schedule: [
        { item: 'החלפת שמן מנוע ומסנן שמן מקורי', intervalKm: 15000, intervalMonths: 12, importance: 'critical' },
        { item: 'החלפת מסנני אוויר ומזגן', intervalKm: 30000, intervalMonths: 24, importance: 'recommended' },
        { item: 'החלפת מצתי אירידיום מקוריים Denso/NGK', intervalKm: 90000, intervalMonths: 72, importance: 'critical' },
        { item: 'החלפת שמן גיר אוטומטי מקורי Mazda FZ', intervalKm: 90000, intervalMonths: 72, importance: 'recommended', notes: 'מומלץ להחלפה יזומה לשמירה על אורך חיי הגיר' }
      ]
    },
    reliability: {
      engineRating: 4.8,
      transmissionRating: 4.9,
      electricalRating: 4.6,
      suspensionRating: 4.5,
      overallScore: 4.7,
      partsAvailabilityInIsrael: 'גבוהה מאוד',
      maintenanceComplexity: 'פשוטה',
      summaryHebrew: 'מאזדה היא מהיצרניות האמינות ביותר בישראל. שילוב מנועי ה-SkyActiv האטמוספריים עם תיבת ה-6 הילוכים הפלנטרית מעניק אמינות כמעט מוחלטת לאורך שנים עם מינימום תקלות.'
    },
    verdict: {
      pros: ['אמינות מכנית פנומנלית של מנוע וגיר', 'איכות הרכבה וחומרים גבוהה מאוד', 'התנהגות כביש מהנה ומדויקת', 'סחירות ושמירת ערך גבוהה בשוק הישראלי'],
      cons: ['צריכת דלק מעט גבוהה יותר מהיברידיות וטורבו קטנות', 'מרווח רגליים אחורי ותא מטען מעט צפופים ביחס למתחרות', 'נוחות נסיעה מעט נוקשה על שיבושים'],
      top5Considerations: [
        'בדיקת תקינות מסך המולטימדיה (היעדר "לחיצות רפאים" בחום).',
        'בדיקת מצב גומיות המשולשים הקדמיים בטסט/בדיקה.',
        'וידוא החלפת מצתי אירידיום מקוריים לפי המועד.',
        'היסטוריית טיפולים סדירה עם שמן 0W-20 איכותי.',
        'בדיקת צמיגים וכיוון פרונט.'
      ],
      bottomLine: 'אחת הקניות הבטוחות והאמינות ביותר בישראל, מומלצת בחום למי שרוצה רכב איכותי בלי הפתעות במוסך.'
    }
  },

  // 6. Electric Vehicles (Tesla Model 3/Y, BYD Atto 3, MG4, Geely Geometry C)
  {
    makeMatch: /טסלה|tesla|byd|ביוואידי|בי ואי די|ג'ילי|גילי|geely|mg|אמ ג'י/i,
    modelMatch: /מודל|model 3|model y|atto|atto 3|dolphin|seal|geometry|mg4|zs ev/i,
    fuelMatch: /חשמל|electric/i,
    problems: [
      {
        id: 'ev-tire-wear',
        name: 'שחיקת צמיגים מואצת',
        category: 'suspension',
        description: 'עקב מומנט מיידי גבוה ומשקל רכב כבד (סוללת מתח גבוה), צמיגי רכב חשמלי נשחקים במהירות גבוהה בכ-30% ביחס לרכב בנזין (החלפה כל 35k-50k ק"מ).',
        affectedYears: 'כל השנים',
        symptoms: ['שחיקת דופן פנימית בצמיגים', 'ירידה באחיזה בגשם ראשון'],
        possibleCauses: ['משקל עצמי כבד והאצות חזקות'],
        severity: 'low',
        estimatedCostIls: { min: 2400, max: 4800, description: 'סט צמיגים מחוזקים בתקן EV' },
        isRecurring: true,
        hasRecallOrTsb: false,
        sources: [{ name: 'Tyre Reviews UK', date: '2023' }]
      },
      {
        id: 'ev-12v-battery',
        name: 'כשל במצבר עזר 12V / 16V',
        category: 'electrical',
        description: 'מערכות המחשוב, הדלתות והבטיחות פועלות על מצבר עזר מתח נמוך. כשהוא נפרק או מזדקן, הרכב ננעל לחלוטין ואינו מאפשר נסיעה.',
        affectedYears: '2019–2023',
        symptoms: ['הודעת "12V battery needs service"', 'חוסר אפשרות לפתוח דלתות או תא מטען'],
        possibleCauses: ['עומס מערכות מחשוב רצוף במצב חניה'],
        severity: 'medium',
        estimatedCostIls: { min: 700, max: 1400 },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'Tesla Motors Club', date: '2023' }]
      },
      {
        id: 'ev-brake-calipers',
        name: 'תפיסת קליפרים וחלודה בצלחות בלימה',
        category: 'brakes',
        description: 'בשל שימוש מסיבי בבלימה רגנרטיבית (טעינה בהאטה), הבלמים המכניים כמעט אינם מופעלים ונוטים לצבור חלודה ולתפוס את מובילי הקליפר.',
        affectedYears: 'כל השנים',
        symptoms: ['חריקות בלימה פתאומיות', 'אי-אחידות בבלימת חירום'],
        possibleCauses: ['חוסר שימוש בבלמי החיכוך'],
        severity: 'low',
        estimatedCostIls: { min: 350, max: 800, description: 'גירוז מובילים וניקוי צלחות בטיפול תקופתי' },
        isRecurring: false,
        hasRecallOrTsb: false,
        sources: [{ name: 'ADAC EV Test', date: '2023' }]
      }
    ],
    maintenance: {
      recommendedOilSpec: 'אין שמן מנוע (הנעה 100% חשמלית)',
      oilCapacityLiters: 0,
      timingType: 'לא ידוע',
      timingNotes: 'אין מנוע בעירה פנימית, אין רצועת טיימינג או שרשרת.',
      schedule: [
        { item: 'החלפת מסנני מזגן (תא נוסעים / HEPA)', intervalKm: 20000, intervalMonths: 12, importance: 'recommended' },
        { item: 'בדיקת נוזל בלמים DOT 4 ועובי רפידות', intervalKm: 40000, intervalMonths: 24, importance: 'critical' },
        { item: 'רוטציית צמיגים וכיוון פרונט', intervalKm: 15000, intervalMonths: 12, importance: 'critical', notes: 'קריטי למניעת שחיקה לא אחידה עקב המשקל הרב' },
        { item: 'בדיקת נוזל קירור סוללת מתח גבוה וצנרת קירור', intervalKm: 80000, intervalMonths: 48, importance: 'critical' }
      ]
    },
    reliability: {
      engineRating: 4.9,
      transmissionRating: 5.0,
      electricalRating: 4.4,
      suspensionRating: 4.2,
      overallScore: 4.6,
      partsAvailabilityInIsrael: 'גבוהה',
      maintenanceComplexity: 'פשוטה',
      summaryHebrew: 'רכב חשמלי מציע עלויות אנרגיה ואחזקה נמוכות משמעותית ביחס לרכב בנזין (אין שמנים, פלאגים או טיימינג). אמינות המנועים החשמליים והסוללה גבוהה מאוד עם אחריות יצרן של 8 שנים במרבית המקרים.'
    },
    verdict: {
      pros: ['חיסכון כספי עצום באנרגיה (טעינה ביתית עולה כ-₪12 ל-100 ק"מ)', 'ביצועים ותאוצה מיידית ללא השהיות', 'שקט מופתי בתא הנוסעים', 'טיפולים תקופתיים זולים ומינימליים'],
      cons: ['תלות בעמדות טעינה מהירות בנסיעות ארוכות', 'שחיקת צמיגים מהירה מהממוצע', 'ירידת ערך מהירה יותר בעקבות הוזלות מחירים תכופות ברכבים חדשים'],
      top5Considerations: [
        'בדיקת בריאות סוללה (State of Health - SOH) דרך מחשב הרכב או אפליקציה.',
        'בדיקת היסטוריית טעינה: האם נטען בעיקר בטעינה איטית AC ביתית או טעינות מהירות DC.',
        'בדיקת מצב הצמיגים ותאריך ייצורם (דורשים צמיגי EV מחוזקים).',
        'וידוא תוקף אחריות היצרן על הסוללה ומנוע ההנעה (לרוב 8 שנים / 150k ק"מ).',
        'בדיקת תקינות שקע הטעינה ומטען החירום הנייד שמגיע עם הרכב.'
      ],
      bottomLine: 'הפתרון המשתלם ביותר למי שיש לו עמדת טעינה ביתית או בעבודה ונוסע קילומטראז גבוה מדי חודש.'
    }
  }
];

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
