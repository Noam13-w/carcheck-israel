/**
 * AutoScope Israel - Automotive Data Normalizer
 * Cleans and transforms raw Israeli Ministry of Transport database values into
 * clear, professional, authoritative automotive Hebrew terminology.
 */

export interface NormalizedMake {
  nameHebrew: string;
  nameEnglish: string;
  countryOfOrigin?: string;
}

export interface NormalizedModel {
  cleanModelHebrew: string;
  cleanModelEnglish: string;
  cleanTrim: string;
}

export interface NormalizedPowertrain {
  fuelLabel: string;
  fuelTypeEnglish: string;
  isHybrid: boolean;
  isPhev: boolean;
  isElectric: boolean;
  isDiesel: boolean;
  isPetrol: boolean;
  techDescription: string;
}

export interface NormalizedOwnership {
  originalOwnership: string;
  originalOwnershipDesc: string;
  currentOwnership: string;
  currentOwnershipDesc: string;
  estimatedHandText: string;
  handVerificationTip: string;
  priceReductionWarning?: string;
}

// 1. Manufacturers mapping & cleaning
const BRAND_MAP: Record<string, { he: string; en: string }> = {
  'טויוטה': { he: 'טויוטה', en: 'Toyota' },
  'יונדאי': { he: 'יונדאי', en: 'Hyundai' },
  'סקודה': { he: 'סקודה', en: 'Skoda' },
  'קיה': { he: 'קיה', en: 'Kia' },
  'מאזדה': { he: 'מאזדה', en: 'Mazda' },
  'פולקסווגן': { he: 'פולקסווגן', en: 'Volkswagen' },
  'סיאט': { he: 'סיאט', en: 'Seat' },
  'קופרה': { he: 'קופרה', en: 'Cupra' },
  'רנו': { he: 'רנו', en: 'Renault' },
  'פיג\'ו': { he: 'פיג\'ו', en: 'Peugeot' },
  'סיטרואן': { he: 'סיטרואן', en: 'Citroen' },
  'ניסאן': { he: 'ניסאן', en: 'Nissan' },
  'סוזוקי': { he: 'סוזוקי', en: 'Suzuki' },
  'הונדה': { he: 'הונדה', en: 'Honda' },
  'מיצובישי': { he: 'מיצובישי', en: 'Mitsubishi' },
  'סובארו': { he: 'סובארו', en: 'Subaru' },
  'שברולט': { he: 'שברולט', en: 'Chevrolet' },
  'פורד': { he: 'פורד', en: 'Ford' },
  'מרצדס': { he: 'מרצדס-בנץ', en: 'Mercedes-Benz' },
  'ב.מ.וו': { he: 'ב.מ.וו', en: 'BMW' },
  'אאודי': { he: 'אאודי', en: 'Audi' },
  'טסלה': { he: 'טסלה', en: 'Tesla' },
  'וולוו': { he: 'וולוו', en: 'Volvo' },
  'ג\'יפ': { he: 'ג\'יפ', en: 'Jeep' },
  'לנד רובר': { he: 'לנד רובר', en: 'Land Rover' },
  'בי ווי די': { he: 'BYD', en: 'BYD' },
  'BYD': { he: 'BYD', en: 'BYD' },
  'ג\'ילי': { he: 'ג\'ילי', en: 'Geely' },
  'MG': { he: 'MG', en: 'MG' },
  'מג\'יק': { he: 'MG', en: 'MG' },
  'צ\'רי': { he: 'צ\'רי', en: 'Chery' },
  'לינק אנד קו': { he: 'לינק אנד קו', en: 'Lynk & Co' },
  'אורה': { he: 'אורה (ORA)', en: 'ORA' }
};

export function normalizeMake(rawTozeret: string = '', rawCountry: string = ''): NormalizedMake {
  let clean = rawTozeret.trim();
  let country = rawCountry.trim();

  // Extract country if embedded in string like "טויוטה טורקיה" or "יונדאי ד. קורי"
  const countryPatterns = [
    { regex: /טורקיה/i, country: 'טורקיה' },
    { regex: /צ'כיה/i, country: 'צ\'כיה' },
    { regex: /ד\.?\s*קורי/i, country: 'דרום קוריאה' },
    { regex: /קוריאה/i, country: 'דרום קוריאה' },
    { regex: /גרמניה/i, country: 'גרמניה' },
    { regex: /ספרד/i, country: 'ספרד' },
    { regex: /יפן/i, country: 'יפן' },
    { regex: /אנגליה|בריטניה/i, country: 'בריטניה' },
    { regex: /צרפת/i, country: 'צרפת' },
    { regex: /ארה"?ב/i, country: 'ארה"ב' },
    { regex: /סין/i, country: 'סין' },
    { regex: /הונגריה/i, country: 'הונגריה' },
    { regex: /סלובקיה/i, country: 'סלובקיה' },
    { regex: /פולין/i, country: 'פולין' },
    { regex: /איטליה/i, country: 'איטליה' },
    { regex: /שוודיה/i, country: 'שוודיה' },
    { regex: /הודו/i, country: 'הודו' },
    { regex: /מקסיקו/i, country: 'מקסיקו' }
  ];

  for (const p of countryPatterns) {
    if (p.regex.test(clean)) {
      if (!country) country = p.country;
      clean = clean.replace(p.regex, '').trim();
    }
  }

  // Find in brand map
  for (const [key, val] of Object.entries(BRAND_MAP)) {
    if (clean.includes(key)) {
      return {
        nameHebrew: val.he,
        nameEnglish: val.en,
        countryOfOrigin: country || undefined
      };
    }
  }

  return {
    nameHebrew: clean || 'לא צוין',
    nameEnglish: clean || 'Unknown',
    countryOfOrigin: country || undefined
  };
}

// 2. Models mapping & cleaning
const MODEL_TRANSLATIONS: Record<string, { he: string; en: string }> = {
  'COROLLA HYBRID': { he: 'קורולה היבריד', en: 'Corolla Hybrid' },
  'COROLLA': { he: 'קורולה', en: 'Corolla' },
  'COROLLA RUNX': { he: 'קורולה ראנקס', en: 'Corolla RunX' },
  'COROLLA CROSS': { he: 'קורולה קרוס', en: 'Corolla Cross' },
  'YARIS HYBRID': { he: 'יאריס היבריד', en: 'Yaris Hybrid' },
  'YARIS': { he: 'יאריס', en: 'Yaris' },
  'YARIS CROSS': { he: 'יאריס קרוס', en: 'Yaris Cross' },
  'C-HR': { he: 'C-HR היבריד', en: 'C-HR Hybrid' },
  'RAV4 HYBRID': { he: 'ראב 4 היבריד', en: 'RAV4 Hybrid' },
  'RAV4': { he: 'ראב 4', en: 'RAV4' },
  'CAMRY': { he: 'קאמרי היבריד', en: 'Camry Hybrid' },
  'PRIUS': { he: 'פריוס היבריד', en: 'Prius Hybrid' },
  'AYGO': { he: 'אייגו', en: 'Aygo' },
  'HILUX': { he: 'היילקס', en: 'Hilux' },
  'LAND CRUISER': { he: 'לנד קרוזר', en: 'Land Cruiser' },

  'IONIQ HYBRID': { he: 'איוניק היבריד', en: 'Ioniq Hybrid' },
  'IONIQ 5': { he: 'איוניק 5 (חשמלי)', en: 'Ioniq 5 EV' },
  'IONIQ 6': { he: 'איוניק 6 (חשמלי)', en: 'Ioniq 6 EV' },
  'I10': { he: 'i10', en: 'i10' },
  'I20': { he: 'i20', en: 'i20' },
  'I30': { he: 'i30', en: 'i30' },
  'TUCSON': { he: 'טוסון', en: 'Tucson' },
  'KONA HYBRID': { he: 'קונה היבריד', en: 'Kona Hybrid' },
  'KONA': { he: 'קונה', en: 'Kona' },
  'SANTA FE': { he: 'סנטה פה', en: 'Santa Fe' },
  'BAYON': { he: 'באיוס', en: 'Bayon' },
  'ELANTRA': { he: 'אלנטרה היבריד', en: 'Elantra Hybrid' },

  'OCTAVIA': { he: 'אוקטביה', en: 'Octavia' },
  'SUPERB FL': { he: 'סופרב', en: 'Superb' },
  'SUPERB': { he: 'סופרב', en: 'Superb' },
  'KODIAQ': { he: 'קודיאק', en: 'Kodiaq' },
  'KAROQ': { he: 'קארוק', en: 'Karoq' },
  'KAMIQ': { he: 'קאמיק', en: 'Kamiq' },
  'SCALA': { he: 'סקאלה', en: 'Scala' },
  'FABIA': { he: 'פאביה', en: 'Fabia' },
  'ENYAQ': { he: 'אניאק (חשמלי)', en: 'Enyaq iV' },

  'SPORTAGE': { he: 'ספורטאז\'', en: 'Sportage' },
  'PICANTO': { he: 'פיקנטו', en: 'Picanto' },
  'NIRO HYBRID': { he: 'נירו היבריד', en: 'Niro Hybrid' },
  'NIRO': { he: 'נירו', en: 'Niro' },
  'STONIC': { he: 'סטוניק', en: 'Stonic' },
  'SELTOS': { he: 'סלטוס', en: 'Seltos' },
  'SORENTO': { he: 'סורנטו', en: 'Sorento' },
  'CARNIVAL': { he: 'קרניבל', en: 'Carnival' },
  'EV6': { he: 'EV6 (חשמלי)', en: 'EV6' },

  'ATTO 3': { he: 'אטו 3 (חשמלי)', en: 'Atto 3 EV' },
  'DOLPHIN': { he: 'דולפין (חשמלי)', en: 'Dolphin EV' },
  'SEAL': { he: 'סיל (חשמלי)', en: 'Seal EV' },

  'GEOMETRY C': { he: 'ג\'יאומטרי C (חשמלי)', en: 'Geometry C EV' },
  'MODEL 3': { he: 'מודל 3 (חשמלי)', en: 'Model 3' },
  'MODEL Y': { he: 'מודל Y (חשמלי)', en: 'Model Y' },
  'LYNKCO 02': { he: 'לינק אנד קו 02 (חשמלי)', en: 'Lynk & Co 02 EV' },
  '01': { he: 'לינק אנד קו 01 (פלאג-אין)', en: 'Lynk & Co 01 PHEV' }
};

export function normalizeModel(
  rawKinuy: string = '', 
  rawDegem: string = '', 
  rawTrim: string = ''
): NormalizedModel {
  const upperKinuy = rawKinuy.toUpperCase().trim();
  const upperDegem = rawDegem.toUpperCase().trim();

  let cleanTrim = rawTrim.trim();
  // Fix common Ministry of Transport truncated trim strings
  if (cleanTrim.toUpperCase() === 'ECUTIVE PLUS' || cleanTrim.toUpperCase() === 'ECUTIV') {
    cleanTrim = 'Executive Plus';
  } else if (cleanTrim.toUpperCase() === 'AMBITION') {
    cleanTrim = 'Ambition';
  } else if (cleanTrim.toUpperCase() === 'PREMIUM FL' || cleanTrim.toUpperCase() === 'PREMIUM') {
    cleanTrim = 'Premium';
  } else if (cleanTrim.toUpperCase() === 'STYLE') {
    cleanTrim = 'Style';
  } else if (cleanTrim.toUpperCase() === 'INTENSE') {
    cleanTrim = 'Intense';
  } else if (cleanTrim.toUpperCase() === 'COMFORT') {
    cleanTrim = 'Comfort';
  }

  // Check matching translations
  for (const [key, val] of Object.entries(MODEL_TRANSLATIONS)) {
    if (upperKinuy.includes(key) || upperDegem.includes(key)) {
      return {
        cleanModelHebrew: val.he,
        cleanModelEnglish: val.en,
        cleanTrim
      };
    }
  }

  // Fallback: clean up English "FL", "NEW", etc.
  let cleanName = rawKinuy || rawDegem || 'דגם לא צוין';
  cleanName = cleanName.replace(/\bFL\b/gi, '').replace(/\bNEW\b/gi, '').trim();

  return {
    cleanModelHebrew: cleanName,
    cleanModelEnglish: cleanName,
    cleanTrim
  };
}

// 3. Powertrain normalization (Hybrid / Electric / Diesel / Petrol)
export function normalizePowertrain(
  rawFuel: string = '', 
  rawDriveTech: string = '', 
  modelName: string = ''
): NormalizedPowertrain {
  const fuelCombined = `${rawFuel} ${rawDriveTech} ${modelName}`.toLowerCase();

  const isElectric = /חשמל|electric|ev\b|bev/i.test(fuelCombined);
  const isPhev = /פלאג|phev|plug/i.test(fuelCombined);
  const isHybrid = !isElectric && (isPhev || /היבריד|hybrid|הנעת כלאיים/i.test(fuelCombined));
  const isDiesel = /דיזל|סולר|diesel/i.test(fuelCombined);
  const isPetrol = !isElectric && !isDiesel;

  let fuelLabel = 'בנזין';
  let fuelTypeEnglish = 'Petrol';
  let techDescription = 'מנוע בעירה פנימית בנזין';

  if (isElectric) {
    fuelLabel = 'חשמלי מלא (100% EV)';
    fuelTypeEnglish = 'Electric (EV)';
    techDescription = 'הנעה חשמלית מלאה עם סוללת ליתיום-יון ומנוע חשמלי שקט ללא פליטות מזהמים.';
  } else if (isPhev) {
    fuelLabel = 'היברידי נטען (PHEV)';
    fuelTypeEnglish = 'Plug-in Hybrid (PHEV)';
    techDescription = 'שילוב של מנוע בנזין וסוללה נטענת משקע חשמלי, המאפשר נסיעה חשמלית לטווח יומי וגיבוי בנזין.';
  } else if (isHybrid) {
    fuelLabel = 'היברידי (בנזין + חשמל)';
    fuelTypeEnglish = 'Hybrid (HEV)';
    techDescription = 'מערכת היברידית מתקדמת המשלבת מנוע בנזין יעיל עם מנוע חשמלי הנטען אוטונומית בבלימה (ללא שקע).';
  } else if (isDiesel) {
    fuelLabel = 'טורבו-דיזל (סולר)';
    fuelTypeEnglish = 'Turbo Diesel';
    techDescription = 'מנוע טורבו דיזל חסכוני בעל מומנט גבוה במיוחד, מותאם לנסיעות בין-עירוניות ממושכות.';
  }

  return {
    fuelLabel,
    fuelTypeEnglish,
    isHybrid,
    isPhev,
    isElectric,
    isDiesel,
    isPetrol,
    techDescription
  };
}

// 4. Ownership & Hand Normalization
export function normalizeOwnership(
  rawBaalut: string = '', 
  rawMkoriut: string = '', 
  modelYear: number = 2020
): NormalizedOwnership {
  const currentYear = 2026;
  const age = Math.max(1, currentYear - modelYear);

  let originalOwnership = 'פרטי';
  let originalOwnershipDesc = 'נרכש במקור מיבואן כרכב פרטי חדש מהחברה.';
  let priceReductionWarning: string | undefined = undefined;

  const mkoriutUpper = (rawMkoriut || '').trim();

  if (mkoriutUpper.includes('החכר') || mkoriutUpper.includes('ליסינג')) {
    originalOwnership = 'ליסינג (החכר)';
    originalOwnershipDesc = 'הרכב עלה לכביש ברישום ראשון של חברת ליסינג / החכר.';
    priceReductionWarning = 'לפי מחירון לוי יצחק, רכב שעלה לכביש בליסינג זכאי להפחתה של כ-8%–14% ממחיר המחירון.';
  } else if (mkoriutUpper.includes('השכרה')) {
    originalOwnership = 'השכרה';
    originalOwnershipDesc = 'הרכב עלה לכביש בחברת השכרה.';
    priceReductionWarning = 'רכב ממקוריות השכרה זכאי להפחתה משמעותית של כ-15%–22% ממחיר המחירון.';
  } else if (mkoriutUpper.includes('חברה')) {
    originalOwnership = 'חברה / תאגיד';
    originalOwnershipDesc = 'הרכב היה רשום על שם חברה או תאגיד עסקי.';
    priceReductionWarning = 'רכב בבעלות חברה עשוי להיות זכאי להפחתת מחירון של כ-8%–12%.';
  }

  let currentOwnership = 'פרטי';
  let currentOwnershipDesc = 'הרכב רשום כעת בבעלות אדם פרטי.';

  if (rawBaalut.includes('סוחר') || rawBaalut.includes('תו סחר')) {
    currentOwnership = 'תו סחר (סוחר / מגרש)';
    currentOwnershipDesc = 'הרכב מופקד כעת בתו סחר אצל סוחר רכב מורשה לצורך מכירה (היד אינה מתווספת ברישיון בזמן תו סחר).';
  } else if (rawBaalut.includes('החכר') || rawBaalut.includes('ליסינג')) {
    currentOwnership = 'ליסינג';
    currentOwnershipDesc = 'הרכב רשום כעת בבעלות חברת ליסינג.';
  }

  // Truthful hand explanation
  let estimatedHand = 1;
  if (age <= 2) {
    estimatedHand = 1;
  } else if (age <= 4) {
    estimatedHand = originalOwnership.includes('ליסינג') ? 2 : 1;
  } else if (age <= 7) {
    estimatedHand = originalOwnership.includes('ליסינג') ? 2 : 2;
  } else {
    estimatedHand = Math.min(4, Math.ceil(age / 3.2));
  }

  const estimatedHandText = `יד ${estimatedHand} משוערת (לפי גיל הרכב של ${age} שנים ומקוריות ${originalOwnership})`;
  const handVerificationTip = 'משרד התחבורה אינו מפרסם מספר יד במאגר הפתוח לשמירה על פרטיות. את מספר היד המדויק יש לאמת ברישיון הרכב המודפס בסעיף "בעלים קודמים" (00 = יד 1, 01 = יד 2, 02 = יד 3).';

  return {
    originalOwnership,
    originalOwnershipDesc,
    currentOwnership,
    currentOwnershipDesc,
    estimatedHandText,
    handVerificationTip,
    priceReductionWarning
  };
}
