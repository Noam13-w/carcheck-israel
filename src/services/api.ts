import { DataSourceItem, VehicleReportData } from '../types/vehicle';
import { resolveVehicleIntelligence } from './intelligence';

const ACTIVE_VEHICLES_RESOURCE = '053cea08-09bc-40ec-8f7a-156f0677aff3';
const WLTP_RESOURCE = '142afde2-6228-49f9-8a29-9b6c3a0cbe40';
const SHINUI_MIVNE_1 = '56063a99-8a3e-4ff4-912e-5966c0279bad';
const SHINUI_MIVNE_2 = 'bb2355dc-9ec7-4f06-9c3f-3344672171da';
const HAGBALAT_RECALL_RESOURCE = '36bf1404-0be4-49d2-82dc-2f1ead4a8b93';
const RECALL_RESOURCE = '2c33523f-87aa-44ec-a736-edbb0a82975e';

export function normalizePlate(input: string): string {
  return input.replace(/\D/g, '').trim();
}

export function formatPlateDisplay(plate: string): string {
  const clean = normalizePlate(plate);
  if (clean.length === 7) {
    return `${clean.slice(0, 2)}-${clean.slice(2, 5)}-${clean.slice(5, 7)}`;
  }
  if (clean.length === 8) {
    return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5, 8)}`;
  }
  return clean;
}

export function isValidPlate(plate: string): boolean {
  const clean = normalizePlate(plate);
  return clean.length >= 6 && clean.length <= 8;
}

async function queryDatastoreSql(sql: string, timeoutMs: number = 12000): Promise<any[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = 'https://data.gov.il/api/3/action/datastore_search_sql?sql=' + encodeURIComponent(sql);
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.result?.records || [];
  } catch (e) {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function queryDatastoreSearch(resourceId: string, filters: Record<string, any>, timeoutMs: number = 10000): Promise<any[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const params = new URLSearchParams({
      resource_id: resourceId,
      filters: JSON.stringify(filters),
      limit: '10'
    });
    const url = 'https://data.gov.il/api/3/action/datastore_search?' + params.toString();
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.result?.records || [];
  } catch (e) {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function queryDatastoreText(resourceId: string, q: string, timeoutMs: number = 10000): Promise<any[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const params = new URLSearchParams({
      resource_id: resourceId,
      q,
      limit: '10'
    });
    const url = 'https://data.gov.il/api/3/action/datastore_search?' + params.toString();
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const data = await res.json();
    return data?.result?.records || [];
  } catch (e) {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

export interface ProgressCallback {
  (step: string, percent: number): void;
}

export async function fetchVehicleReport(
  rawPlate: string,
  onProgress?: ProgressCallback
): Promise<VehicleReportData> {
  const cleanPlate = normalizePlate(rawPlate);
  if (!isValidPlate(cleanPlate)) {
    throw new Error('מספר רישוי אינו תקין. יש להזין מספר בן 7 או 8 ספרות.');
  }

  const plateNum = parseInt(cleanPlate, 10);

  // Check cache
  const cacheKey = `autoscope_report_${cleanPlate}`;
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheAgeMs = Date.now() - new Date(parsed.generatedAt).getTime();
      if (cacheAgeMs < 24 * 60 * 60 * 1000) {
        onProgress?.('טוען נתונים מהמטמון המאומת...', 100);
        return parsed;
      }
    }
  } catch (e) {
    // Ignore localStorage errors
  }

  const sources: DataSourceItem[] = [];
  const nowStr = new Date().toISOString();

  // Step 1: Active vehicle lookup
  onProgress?.('מאמת מספר רישוי ומאתר רכב במאגר הפעיל...', 15);
  let activeRecords = await queryDatastoreSql(
    `SELECT * FROM "${ACTIVE_VEHICLES_RESOURCE}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
  );

  if (activeRecords.length === 0) {
    activeRecords = await queryDatastoreSearch(ACTIVE_VEHICLES_RESOURCE, { mispar_rechev: plateNum });
  }

  if (activeRecords.length === 0) {
    activeRecords = await queryDatastoreSearch(ACTIVE_VEHICLES_RESOURCE, { mispar_rechev: cleanPlate });
  }

  if (activeRecords.length === 0) {
    activeRecords = await queryDatastoreText(ACTIVE_VEHICLES_RESOURCE, cleanPlate);
    activeRecords = activeRecords.filter(r => String(r.mispar_rechev) === cleanPlate || parseInt(String(r.mispar_rechev), 10) === plateNum);
  }

  if (activeRecords.length === 0) {
    throw new Error(`רכב מספר ${formatPlateDisplay(cleanPlate)} לא אותר במאגר כלי הרכב הפעילים של משרד התחבורה. ייתכן שהרכב הורד מהכביש או שמספר הרישוי אינו פעיל.`);
  }

  const activeRec = activeRecords[0];
  sources.push({
    id: ACTIVE_VEHICLES_RESOURCE,
    name: 'מאגר כלי רכב פרטיים ומסחריים פעילים - משרד התחבורה',
    category: 'government',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/private-and-commercial-vehicles',
    fieldsSupplied: ['יצרן', 'דגם', 'כינוי מסחרי', 'שנת ייצור', 'קוד מנוע', 'תוקף טסט', 'צבע', 'צמיגים', 'רמת אבזור בטיחותי'],
    lastSync: nowStr,
    confidence: 'OFFICIAL',
    status: 'connected'
  });

  const tozeretCd = activeRec.tozeret_cd;
  const degemCd = activeRec.degem_cd;
  const shnatYitzur = parseInt(activeRec.shnat_yitzur, 10) || 2020;

  // Step 2, 3, 4, 5: Parallel queries
  onProgress?.('מצליב נתוני דגם WLTP, היסטוריה וריקולים...', 45);

  const [wltpRecords, shinuiRecords, hagbalatRecalls, modelRecalls] = await Promise.all([
    // WLTP model lookup
    (async () => {
      if (!tozeretCd || !degemCd) return [];
      let records = await queryDatastoreSql(
        `SELECT * FROM "${WLTP_RESOURCE}" WHERE tozeret_cd = ${tozeretCd} AND degem_cd = ${degemCd} AND shnat_yitzur = ${shnatYitzur} LIMIT 1`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(WLTP_RESOURCE, { tozeret_cd: tozeretCd, degem_cd: degemCd });
      }
      return records;
    })(),

    // Shinui Mivne / Mileage lookup
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${SHINUI_MIVNE_1}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
      );
      if (!records.length) {
        records = await queryDatastoreSql(
          `SELECT * FROM "${SHINUI_MIVNE_2}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
        );
      }
      if (!records.length) {
        records = await queryDatastoreSearch(SHINUI_MIVNE_1, { mispar_rechev: plateNum });
      }
      return records;
    })(),

    // Hagbalat recall lookup (uncompleted recalls)
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${HAGBALAT_RECALL_RESOURCE}" WHERE MISPAR_RECHEV = ${plateNum}`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(HAGBALAT_RECALL_RESOURCE, { MISPAR_RECHEV: plateNum });
      }
      if (!records.length) {
        records = await queryDatastoreSearch(HAGBALAT_RECALL_RESOURCE, { MISPAR_RECHEV: cleanPlate });
      }
      return records;
    })(),

    // General Model Recalls lookup
    (async () => {
      const tozeretNm = (activeRec.tozeret_nm || '').split(' ')[0];
      const modelWord = (activeRec.kinuy_mishari || activeRec.degem_nm || '').split(' ')[0];
      if (!tozeretNm) return [];
      
      let records = await queryDatastoreSql(
        `SELECT * FROM "${RECALL_RESOURCE}" WHERE TOZAR_TEUR ILIKE '%${tozeretNm}%' OR DEGEM ILIKE '%${modelWord}%' LIMIT 8`
      );
      return records;
    })()
  ]);

  onProgress?.('מנתח מפרט טכני ומחשב צריכת דלק ופליטות...', 75);

  const wltp = wltpRecords[0] || {};
  if (wltpRecords.length > 0) {
    sources.push({
      id: WLTP_RESOURCE,
      name: 'מאגר דגמי רכב ומדדי WLTP - משרד התחבורה',
      category: 'government',
      url: 'https://data.gov.il/he/datasets/ministry_of_transport/degem-rechev-wltp',
      fieldsSupplied: ['הספק כ"ס', 'נפח מנוע', 'תיבת הילוכים', 'מערכות בטיחות אקטיביות', 'פליטות WLTP', 'משקל וכושר גרירה'],
      lastSync: nowStr,
      confidence: 'OFFICIAL',
      status: 'connected'
    });
  }

  const shinui = shinuiRecords[0] || {};
  if (shinuiRecords.length > 0) {
    sources.push({
      id: SHINUI_MIVNE_1,
      name: 'מאגר היסטוריית כלי רכב ושינויי מבנה - משרד התחבורה',
      category: 'government',
      url: 'https://data.gov.il/he/datasets/ministry_of_transport/shinui_mivne',
      fieldsSupplied: ['קילומטראז בטסט אחרון', 'שינויי מבנה', 'שינוי צבע', 'שינוי מידת צמיג', 'הסבה לגפ"מ', 'מקוריות בעלות'],
      lastSync: nowStr,
      confidence: 'OFFICIAL',
      status: 'connected'
    });
  }

  sources.push({
    id: HAGBALAT_RECALL_RESOURCE,
    name: 'מאגר הגבלות וקריאות שירות (ריקול) פתוחות - משרד התחבורה',
    category: 'government',
    url: 'https://data.gov.il/he/datasets/ministry_of_transport/hagbalat_recall',
    fieldsSupplied: ['ריקולים פתוחים ספציפיים לרכב', 'תיאור תקלת ריקול', 'תאריך פתיחה'],
    lastSync: nowStr,
    confidence: 'OFFICIAL',
    status: 'connected'
  });

  onProgress?.('מפעיל מנוע מודיעין מכני ובונה את דוח הרכב...', 90);

  // Map fields cleanly
  const make = activeRec.tozeret_nm || 'לא צוין';
  const commercialName = activeRec.kinuy_mishari || activeRec.degem_nm || '';
  const model = activeRec.degem_nm || commercialName;
  const trimLevel = activeRec.ramat_gimur || wltp.ramat_gimur || 'סטנדרט';
  const fuelType = activeRec.sug_delek_nm || wltp.delek_nm || 'בנזין';
  const displacement = parseInt(wltp.nefah_manoa, 10) || 0;
  const horsepower = parseInt(wltp.koah_sus, 10) || 0;
  const licensingGroup = parseInt(wltp.kvuzat_agra_cd, 10) || 3;

  // Resolve AI intelligence / knowledge base
  const intelligence = resolveVehicleIntelligence(
    make,
    model,
    commercialName,
    shnatYitzur,
    displacement,
    fuelType,
    activeRec.degem_manoa,
    licensingGroup
  );

  // Calculate inspection months left
  let inspectionDueMonths = 0;
  if (activeRec.tokef_dt) {
    const validDate = new Date(activeRec.tokef_dt);
    const diffMs = validDate.getTime() - Date.now();
    inspectionDueMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  }

  // Calculate realistic fuel consumption
  const co2Wltp = parseFloat(wltp.CO2_WLTP) || undefined;
  let combinedL100: number | undefined;
  let cityL100: number | undefined;
  let highwayL100: number | undefined;
  let combinedKmL: number | undefined;

  const isElectric = /חשמל|electric/i.test(fuelType);
  const isHybrid = /היברידי|hybrid/i.test(fuelType);
  const isDiesel = /דיזל|diesel/i.test(fuelType);

  if (!isElectric) {
    if (co2Wltp && co2Wltp > 0) {
      // Estimate from WLTP CO2 emissions (typical: petrol produces ~23.5g CO2/L, diesel ~26.5g CO2/L)
      const co2Factor = isDiesel ? 26.5 : 23.5;
      combinedL100 = parseFloat(((co2Wltp * 10) / (co2Factor * 10)).toFixed(1));
    } else if (displacement > 0) {
      if (isHybrid) {
        combinedL100 = 4.7;
      } else if (isDiesel) {
        combinedL100 = 5.6;
      } else if (displacement <= 1200) {
        combinedL100 = 5.8;
      } else if (displacement <= 1600) {
        combinedL100 = 6.8;
      } else if (displacement <= 2000) {
        combinedL100 = 7.9;
      } else {
        combinedL100 = 9.8;
      }
    } else {
      combinedL100 = 6.9;
    }

    if (combinedL100) {
      combinedKmL = parseFloat((100 / combinedL100).toFixed(1));
      cityL100 = parseFloat((combinedL100 * (isHybrid ? 0.95 : 1.25)).toFixed(1));
      highwayL100 = parseFloat((combinedL100 * (isHybrid ? 1.05 : 0.85)).toFixed(1));
    }
  }

  // Map uncompleted vehicle recalls
  const specificVehicleRecalls = hagbalatRecalls.map((r: any) => ({
    recallId: r.RECALL_ID || r._id,
    faultType: r.SUG_TAKALA || r.SUG_RECALL || 'קריאת שירות בטיחותית',
    description: r.TEUR_TAKALA || 'קריאת שירות פתוחה במאגר משרד התחבורה',
    openDate: r.TAARICH_PTICHA || 'לא צוין',
    severity: 'קריטית - חובה לבצע לצורך חידוש רישיון'
  }));

  // Map model-level recalls
  const modelRecallsList = modelRecalls.map((r: any) => ({
    recallId: r.RECALL_ID || r._id,
    manufacturer: r.TOZAR_TEUR || make,
    model: r.DEGEM || commercialName,
    faultType: r.SUG_TAKALA || 'תקלה סדרתית',
    description: r.TEUR_TAKALA || '',
    repairAction: r.OFEN_TIKUN || 'בדיקה והחלפה במוסך היבואן ללא תשלום',
    recallYear: parseInt(r.SHNAT_RECALL, 10) || shnatYitzur,
    importerName: r.YEVUAN_TEUR || 'יבואן רשמי בישראל',
    importerPhone: r.TELEPHONE || '',
    importerWebsite: r.WEBSITE || ''
  }));

  const report: VehicleReportData = {
    plateNumber: cleanPlate,
    formattedPlate: formatPlateDisplay(cleanPlate),
    identity: {
      make,
      model,
      commercialName,
      trimLevel,
      modelYear: shnatYitzur,
      firstRegistrationDate: activeRec.moed_aliya_lakvish || `${shnatYitzur}-01`,
      registrationValidity: activeRec.tokef_dt || 'לא צוין',
      lastInspectionDate: activeRec.mivchan_acharon_dt || 'לא צוין',
      engineCode: activeRec.degem_manoa || 'לא צוין',
      engineDisplacementCc: displacement,
      fuelType,
      vehicleCategory: activeRec.sug_degem === 'P' ? 'רכב נוסעים פרטי (M1)' : (activeRec.sug_degem || 'רכב פרטי'),
      bodyStyle: wltp.merkav || 'האצ\'בק / סדאן',
      color: activeRec.tzeva_rechev || 'לא צוין',
      frontTire: activeRec.zmig_kidmi || 'לא צוין',
      rearTire: activeRec.zmig_ahori || 'לא צוין',
      ownershipCategory: activeRec.baalut || 'פרטי',
      countryOfOrigin: wltp.tozeret_eretz_nm,
      doorsCount: parseInt(wltp.mispar_dlatot, 10) || 5,
      seatsCount: parseInt(wltp.mispar_moshavim, 10) || 5,
      vinMasked: activeRec.misgeret ? `${activeRec.misgeret.slice(0, 3)}****${activeRec.misgeret.slice(-4)}` : undefined,
      horaatRishum: activeRec.horaat_rishum ? parseInt(activeRec.horaat_rishum, 10) : undefined
    },
    specs: {
      engine: {
        displacementCc: displacement,
        horsepower,
        engineCode: activeRec.degem_manoa || 'לא צוין',
        fuelType,
        driveTechnology: wltp.technologiat_hanaa_nm || (isElectric ? 'חשמלי מלא' : isHybrid ? 'היברידי' : 'הנעה רגילה'),
        timingType: intelligence.maintenance.timingType,
        turbocharged: Boolean(horsepower > 100 && displacement < 1600 && !isElectric)
      },
      transmission: {
        type: wltp.automatic_ind === 1 ? 'אוטומטית / רובוטית' : (wltp.automatic_ind === 0 ? 'ידנית' : 'אוטומטית'),
        description: isElectric ? 'הילוך ישיר (יחס יחיד)' : isHybrid ? 'תיבת הילוכים היברידית ייעודית' : 'תיבת הילוכים אוטומטית'
      },
      performance: {
        grossWeightKg: parseInt(wltp.mishkal_kolel, 10) || undefined,
        towingCapacityBrakedKg: parseInt(wltp.kosher_grira_im_blamim, 10) || undefined,
        towingCapacityUnbrakedKg: parseInt(wltp.kosher_grira_bli_blamim, 10) || undefined
      },
      safety: {
        safetyEquipmentLevel: parseInt(activeRec.ramat_eivzur_betihuty, 10) || parseInt(wltp.ramat_eivzur_betihuty, 10) || 0,
        safetyScore: parseFloat(wltp.nikud_betihut) || undefined,
        airbagsCount: parseInt(wltp.mispar_kariot_avir, 10) || 6,
        hasAbs: wltp.abs_ind === 1 || true,
        hasEsp: wltp.bakarat_yatzivut_ind === 1 || true,
        hasLaneDepartureWarning: wltp.bakarat_stiya_menativ_ind === 1,
        hasAutonomousEmergencyBraking: wltp.blima_otomatit_nesia_leahor === 1 || wltp.blimat_hirum_lifnei_holhei_regel_ofanaim === 1 || false,
        hasAdaptiveCruiseControl: wltp.bakarat_shyut_adaptivit_ind === 1,
        hasBlindSpotDetection: wltp.zihuy_beshetah_nistar_ind === 1,
        hasReverseCamera: wltp.matzlemat_reverse_ind === 1,
        hasTirePressureSensors: wltp.hayshaney_lahatz_avir_batzmigim_ind === 1,
        hasPedestrianDetection: wltp.zihuy_holchey_regel_ind === 1,
        pollutionGroup: parseInt(activeRec.kvutzat_zihum, 10) || parseInt(wltp.kvutzat_zihum, 10) || 1,
        greenIndex: parseInt(wltp.madad_yarok, 10) || undefined
      }
    },
    fuel: {
      fuelType,
      combinedLitersPer100Km: combinedL100,
      cityLitersPer100Km: cityL100,
      highwayLitersPer100Km: highwayL100,
      combinedKmPerLiter: combinedKmL,
      tankCapacityLiters: isElectric ? 0 : (displacement > 2000 ? 60 : 45),
      estimatedRangeKm: isElectric ? 420 : (combinedKmL ? Math.round(combinedKmL * 45) : undefined),
      co2Wltp,
      isElectricOrHybrid: isElectric || isHybrid,
      batteryCapacityKwh: isElectric ? 60 : (isHybrid ? 1.5 : undefined),
      officialElectricRangeKm: isElectric ? 440 : undefined,
      realWorldConsumptionEst: combinedL100 ? {
        cityL100: parseFloat((combinedL100 * 1.15).toFixed(1)),
        highwayL100: parseFloat((combinedL100 * 0.95).toFixed(1)),
        combinedL100: parseFloat((combinedL100 * 1.05).toFixed(1)),
        notes: 'הערכת צריכה אמיתית ממוצעת בתנאי אקלים ומזגן בישראל'
      } : undefined
    },
    knownProblems: intelligence.knownProblems,
    reliability: intelligence.reliability,
    maintenance: intelligence.maintenance,
    history: {
      lastInspectionMileageKm: shinui.kilometer_test_aharon ? parseInt(shinui.kilometer_test_aharon, 10) : undefined,
      hasStructuralModification: shinui.shinui_mivne_ind === 1,
      hasColorChange: shinui.shnui_zeva_ind === 1,
      hasTireSizeChange: shinui.shinui_zmig_ind === 1,
      hasLpgConversion: shinui.gapam_ind === 1,
      originalOwnership: shinui.mkoriut_nm || activeRec.baalut || 'פרטי',
      registrationStatus: inspectionDueMonths < 0 ? 'פג תוקף' : 'פעיל',
      inspectionDueMonths
    },
    recalls: {
      specificVehicleUncompletedRecalls: specificVehicleRecalls,
      modelRecalls: modelRecallsList,
      hasActiveRecall: specificVehicleRecalls.length > 0
    },
    prePurchaseChecklist: {
      title: 'צ\'ק-ליסט בדיקה לפני קנייה - מומלץ עבור דגם זה',
      items: [
        `בדיקת היסטוריית טיפולים: לוודא תיעוד במוסך מורשה ושימוש בשמן בתקן ${intelligence.maintenance.recommendedOilSpec}`,
        shinui.kilometer_test_aharon ? `הצלבת קילומטראז': במבחן הרישוי האחרון נרשמו ${shinui.kilometer_test_aharon.toLocaleString()} ק"מ. יש לוודא שהמד הנוכחי ברכב תואם והגיוני.` : 'בדיקת ספר טיפולים להוכחת קילומטראז מקורי',
        specificVehicleRecalls.length > 0 ? `זהירות: קיימת קריאת שירות פתוחה (${specificVehicleRecalls[0].faultType}). חובה לדרוש מבעל הרכב לבצע את הריקול לפני העברת בעלות!` : 'אימות סטטוס ריקולים פתוחים במאגר היבואן ומשרד התחבורה',
        'בדיקת משכון ועיקולים: הפקת דוח רשמי מרשם המשכונות הממשלתי (משרד המשפטים)',
        'בדיקת עבר ביטוחי: הפקת דוח סליקה ביטוחית (מרכז הסליקה של חברות הביטוח) לגילוי תביעות ותאונות קודמות',
        'בדיקת שלדה (שאסי) ומכלולים מכניים במכון בדיקה מורשה וניטרלי'
      ]
    },
    costs: intelligence.costs,
    verdict: {
      top5Considerations: intelligence.verdict.top5Considerations,
      pros: intelligence.verdict.pros,
      cons: intelligence.verdict.cons,
      citySuitability: isElectric || isHybrid ? 5 : 4,
      highwaySuitability: 4,
      familySuitability: 4,
      fuelEconomyRating: isElectric ? 5 : isHybrid ? 5 : (combinedKmL && combinedKmL > 16 ? 4 : 3),
      bottomLine: intelligence.verdict.bottomLine
    },
    sources,
    generatedAt: nowStr
  };

  // Cache report in localStorage
  try {
    localStorage.setItem(cacheKey, JSON.stringify(report));
  } catch (e) {
    // Ignore storage quota
  }

  onProgress?.('דוח הרכב מוכן!', 100);
  return report;
}
