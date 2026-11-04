import { DataSourceItem, VehicleReportData } from '../types/vehicle';
import { 
  resolveVehicleIntelligence, 
  calculateOwnershipEstimate, 
  calculateBuyerDecision, 
  generateSeoInterlinking 
} from './intelligence';
import {
  normalizeMake,
  normalizeModel,
  normalizePowertrain,
  normalizeOwnership
} from './normalizer';

const ACTIVE_VEHICLES_RESOURCE = '053cea08-09bc-40ec-8f7a-156f0677aff3';
const WLTP_RESOURCE = '142afde2-6228-49f9-8a29-9b6c3a0cbe40';
const SHINUI_MIVNE_1 = '56063a99-8a3e-4ff4-912e-5966c0279bad';
const SHINUI_MIVNE_2 = 'bb2355dc-9ec7-4f06-9c3f-3344672171da';
const HAGBALAT_RECALL_RESOURCE = '36bf1404-0be4-49d2-82dc-2f1ead4a8b93';
const RECALL_RESOURCE = '2c33523f-87aa-44ec-a736-edbb0a82975e';
const PUBLIC_VEHICLES_RESOURCE = 'cf29862d-ca25-4691-84f6-1be60dcb4a1e';
const CANCELLED_VEHICLES_RESOURCE = '851ecab1-0622-4dbe-a6c7-f950cf82abf9';

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
  onProgress?: ProgressCallback,
  forceRefresh: boolean = false
): Promise<VehicleReportData> {
  const cleanPlate = normalizePlate(rawPlate);
  if (!isValidPlate(cleanPlate)) {
    throw new Error('מספר רישוי אינו תקין. יש להזין מספר בן 7 או 8 ספרות.');
  }

  const plateNum = parseInt(cleanPlate, 10);
  const cacheKey = `autoscope_report_${cleanPlate}`;

  // Smart Cache Invalidation logic
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: VehicleReportData = JSON.parse(cached);
        const cacheAgeMs = Date.now() - new Date(parsed.generatedAt).getTime();
        const cacheAgeDays = Math.floor(cacheAgeMs / (1000 * 60 * 60 * 24));

        // If cache is fresh (< 7 days) and valid, use it immediately
        if (cacheAgeDays < 7) {
          onProgress?.('טוען נתונים מהמטמון המאומת...', 100);
          parsed.cacheMetadata = {
            cachedAt: parsed.generatedAt,
            cacheAgeDays,
            isStale: false
          };
          return parsed;
        }

        // If cache is between 7 and 30 days, we can mark it as stale or revalidate
        if (cacheAgeDays < 30) {
          parsed.cacheMetadata = {
            cachedAt: parsed.generatedAt,
            cacheAgeDays,
            isStale: true
          };
          // Return stale data quickly, but user can click refresh
          return parsed;
        }
      }
    } catch (e) {
      // Ignore localStorage errors
    }
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
    fieldsSupplied: ['יצרן', 'דגם', 'כינוי מסחרי', 'שנת ייצור', 'קוד מנוע', 'תוקף טסט', 'צבע', 'צמיגים', 'רמת אבזור בטיחותי', 'בעלות'],
    lastSync: nowStr,
    confidence: 'OFFICIAL',
    status: 'connected'
  });

  const tozeretCd = activeRec.tozeret_cd;
  const degemCd = activeRec.degem_cd;
  const shnatYitzur = parseInt(activeRec.shnat_yitzur, 10) || 2020;

  // Step 2, 3, 4, 5: Parallel queries
  onProgress?.('מצליב נתוני דגם WLTP, היסטוריה וריקולים...', 45);

  // Parallel queries to official databases
  onProgress?.('מצליב נתוני בעלויות, WLTP, היסטוריה וקריאות שירות...', 45);

  const [
    wltpRecords, 
    shinui1Records, 
    ownershipHistoryRecords, 
    hagbalatRecalls, 
    modelRecalls,
    publicVehicleRecords,
    cancelledVehicleRecords
  ] = await Promise.all([
    // 1. WLTP model specs lookup
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

    // 2. Shinui Mivne 1: Test mileage, structural changes, original ownership
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${SHINUI_MIVNE_1}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(SHINUI_MIVNE_1, { mispar_rechev: plateNum });
      }
      return records;
    })(),

    // 3. Shinui Mivne 2: Complete chronological ownership transfer history (כל העברות הבעלות מ-2017)
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${SHINUI_MIVNE_2}" WHERE mispar_rechev = ${plateNum} ORDER BY baalut_dt ASC`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(SHINUI_MIVNE_2, { mispar_rechev: plateNum });
      }
      return records;
    })(),

    // 4. Hagbalat recall lookup (uncompleted recalls on this vehicle)
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

    // 5. General Model Recalls lookup
    (async () => {
      const tozeretNm = (activeRec.tozeret_nm || '').split(' ')[0];
      const modelWord = (activeRec.kinuy_mishari || activeRec.degem_nm || '').split(' ')[0];
      if (!tozeretNm) return [];
      
      let records = await queryDatastoreSql(
        `SELECT * FROM "${RECALL_RESOURCE}" WHERE TOZAR_TEUR ILIKE '%${tozeretNm}%' OR DEGEM ILIKE '%${modelWord}%' LIMIT 8`
      );
      return records;
    })(),

    // 6. Check if registered in Public Vehicle registry (Taxi, Tour, Bus, etc.)
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${PUBLIC_VEHICLES_RESOURCE}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(PUBLIC_VEHICLES_RESOURCE, { mispar_rechev: plateNum });
      }
      return records;
    })(),

    // 7. Check if registered in Cancelled / Total Loss registry
    (async () => {
      let records = await queryDatastoreSql(
        `SELECT * FROM "${CANCELLED_VEHICLES_RESOURCE}" WHERE mispar_rechev = ${plateNum} LIMIT 1`
      );
      if (!records.length) {
        records = await queryDatastoreSearch(CANCELLED_VEHICLES_RESOURCE, { mispar_rechev: plateNum });
      }
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

  const shinui = shinui1Records[0] || {};
  const isPublicVehicle = publicVehicleRecords.length > 0;
  const isCancelled = cancelledVehicleRecords.length > 0;
  const publicType = isPublicVehicle ? (publicVehicleRecords[0].sug_rechev_nm || 'רכב ציבורי') : undefined;
  const cancellationDate = isCancelled ? (cancelledVehicleRecords[0].bitul_dt || 'תאריך לא צוין') : undefined;

  // Map & normalize fields into clean, authoritative Israeli automotive terminology
  const normMake = normalizeMake(activeRec.tozeret_nm, wltp.tozeret_eretz_nm);
  const normModel = normalizeModel(activeRec.kinuy_mishari, activeRec.degem_nm, activeRec.ramat_gimur || wltp.ramat_gimur);
  const normPowertrain = normalizePowertrain(activeRec.sug_delek_nm, wltp.technologiat_hanaa_nm, normModel.cleanModelEnglish);
  const normOwnership = normalizeOwnership(activeRec.baalut, shinui.mkoriut_nm, shnatYitzur);

  const make = normMake.nameHebrew;
  const englishMake = normMake.nameEnglish;
  const commercialName = normModel.cleanModelHebrew;
  const englishCommercialName = normModel.cleanModelEnglish;
  const model = activeRec.degem_nm || commercialName;
  const trimLevel = normModel.cleanTrim || 'סטנדרט';
  const fuelType = normPowertrain.fuelLabel;
  const displacement = parseInt(wltp.nefah_manoa, 10) || 0;
  const horsepower = parseInt(wltp.koah_sus, 10) || 0;
  const licensingGroup = parseInt(wltp.kvuzat_agra_cd, 10) || 3;
  const countryOfOrigin = normMake.countryOfOrigin || wltp.tozeret_eretz_nm;

  // Resolve mechanical knowledge base
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

  // Process verified chronological ownership timeline from Ministry of Transport (SHINUI_MIVNE_2)
  const sortedOwnership = [...ownershipHistoryRecords].sort((a: any, b: any) => 
    (a.baalut_dt || '').localeCompare(b.baalut_dt || '')
  );

  let currentHandCount = 0;
  const ownershipTimeline = sortedOwnership.map((item: any, idx: number) => {
    const isDealer = item.baalut === 'סוחר';
    if (!isDealer) {
      currentHandCount++;
    }
    let dateStr = item.baalut_dt || '';
    if (dateStr.length === 6) {
      dateStr = `${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
    }
    return {
      dateStr: dateStr || 'תאריך לא צוין',
      rawDate: item.baalut_dt || '',
      ownership: item.baalut || 'לא צוין',
      isDealer,
      handIndex: isDealer ? null : currentHandCount,
      isCurrent: idx === sortedOwnership.length - 1
    };
  });

  const actualHandNumber = Math.max(1, currentHandCount || 1);
  const actualHandText = `יד ${actualHandNumber}`;
  const previousOwnersCount = Math.max(0, actualHandNumber - 1);
  const licenseRegistrationNote = `ברישיון הרכב רשום: 0${previousOwnersCount} בעלים קודמים`;

  // Ownership & Hand Intelligence
  const firstReg = activeRec.moed_aliya_lakvish || `${shnatYitzur}-01`;
  const originalOrigin = shinui.mkoriut_nm || (ownershipTimeline[0]?.ownership) || activeRec.baalut || 'פרטי';
  const currentOwner = activeRec.baalut || (ownershipTimeline[ownershipTimeline.length - 1]?.ownership) || 'פרטי';

  const ownershipDetails = {
    currentCategory: currentOwner,
    originalHandOrigin: originalOrigin,
    estimatedHandText: actualHandText,
    estimatedHandMin: actualHandNumber,
    estimatedHandMax: actualHandNumber,
    estimatedHandExplanation: licenseRegistrationNote,
    resalePriceImpact: normOwnership.priceReductionWarning || 'מקוריות פרטית: שומרת על מחירון מלא ומבוקשת בשוק המשומשות.',
    howToVerifyDocument: [
      `ברישיון הרכב המודפס המקורי: רשום "בעלים קודמים: 0${previousOwnersCount}" (שזה אומר יד ${actualHandNumber}).`,
      'באזור האישי הממשלתי (Gov.il): בעל הרכב יכול להפיק פירוט בעלויות רשמי ומאומת.'
    ]
  };

  // Calculate inspection months left
  let inspectionDueMonths = 0;
  if (activeRec.tokef_dt) {
    const validDate = new Date(activeRec.tokef_dt);
    const diffMs = validDate.getTime() - Date.now();
    inspectionDueMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
  }
  const isTestValid = inspectionDueMonths >= 0;

  // Calculate realistic fuel consumption
  const co2Wltp = parseFloat(wltp.CO2_WLTP) || undefined;
  let combinedL100: number | undefined;
  let cityL100: number | undefined;
  let highwayL100: number | undefined;
  let combinedKmL: number | undefined;

  const isElectric = normPowertrain.isElectric;
  const isHybrid = normPowertrain.isHybrid;
  const isDiesel = normPowertrain.isDiesel;

  if (!isElectric) {
    if (co2Wltp && co2Wltp > 0) {
      const co2Factor = isDiesel ? 26.5 : (isHybrid ? 23.5 : 23.8);
      combinedL100 = parseFloat(((co2Wltp * 10) / (co2Factor * 10)).toFixed(1));
    } else if (isHybrid) {
      combinedL100 = 4.4;
    } else if (isDiesel) {
      combinedL100 = 5.5;
    } else if (displacement <= 1200) {
      combinedL100 = 5.8;
    } else if (displacement <= 1600) {
      combinedL100 = 6.6;
    } else if (displacement <= 2000) {
      combinedL100 = 7.7;
    } else {
      combinedL100 = 9.2;
    }

    if (combinedL100) {
      combinedKmL = parseFloat((100 / combinedL100).toFixed(1));
      cityL100 = parseFloat((combinedL100 * (isHybrid ? 0.90 : 1.25)).toFixed(1));
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

  const lastKm = shinui.kilometer_test_aharon ? parseInt(shinui.kilometer_test_aharon, 10) : undefined;

  // Buyer Decision Suite Calculation
  const buyerDecision = calculateBuyerDecision(
    shnatYitzur,
    lastKm,
    specificVehicleRecalls.length > 0,
    shinui.shinui_mivne_ind === 1,
    isTestValid,
    intelligence.knownProblems,
    intelligence.specificSellerQuestions
  );

  // Programmatic SEO Interlinking (4-5 direct referrals)
  const seoInterlinking = generateSeoInterlinking(cleanPlate, make, commercialName, shnatYitzur, fuelType);

  const report: VehicleReportData = {
    plateNumber: cleanPlate,
    formattedPlate: formatPlateDisplay(cleanPlate),
    identity: {
      make,
      englishMake,
      model,
      commercialName,
      englishCommercialName,
      trimLevel,
      modelYear: shnatYitzur,
      firstRegistrationDate: firstReg,
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
      ownershipCategory: normOwnership.currentOwnership,
      countryOfOrigin,
      doorsCount: parseInt(wltp.mispar_dlatot, 10) || 5,
      seatsCount: parseInt(wltp.mispar_moshavim, 10) || 5,
      vinMasked: activeRec.misgeret ? `${activeRec.misgeret.slice(0, 3)}****${activeRec.misgeret.slice(-4)}` : undefined,
      horaatRishum: activeRec.horaat_rishum ? parseInt(activeRec.horaat_rishum, 10) : undefined,
      ownershipDetails
    },
    specs: {
      engine: {
        displacementCc: displacement,
        horsepower,
        engineCode: activeRec.degem_manoa || 'לא צוין',
        fuelType,
        driveTechnology: normPowertrain.techDescription,
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
        safetyEquipmentLevel: parseInt(activeRec.ramat_eivzur_betihuty, 10) || parseInt(wltp.ramat_eivzur_betihuty, 10) || 6,
        safetyScore: parseFloat(wltp.nikud_betihut) || undefined,
        airbagsCount: parseInt(wltp.mispar_kariot_avir, 10) || 7,
        hasAbs: Number(wltp.abs_ind) === 1 || true,
        hasEsp: Number(wltp.bakarat_yatzivut_ind) === 1 || true,
        hasLaneDepartureWarning: Number(wltp.bakarat_stiya_menativ_ind) === 1 || Number(wltp.bakarat_stiya_menativ_makor_ind) === 1 || shnatYitzur >= 2018,
        hasAutonomousEmergencyBraking: Number(wltp.nitur_merhak_milfanim_ind) === 1 || Number(wltp.blimat_hirum_lifnei_holhei_regel_ofanaim) === 1 || Number(wltp.blima_otomatit_nesia_leahor) === 1 || shnatYitzur >= 2019,
        hasAdaptiveCruiseControl: Number(wltp.bakarat_shyut_adaptivit_ind) === 1 || isHybrid || isElectric,
        hasBlindSpotDetection: Number(wltp.zihuy_beshetah_nistar_ind) === 1,
        hasReverseCamera: Number(wltp.matzlemat_reverse_ind) === 1 || shnatYitzur >= 2018,
        hasTirePressureSensors: Number(wltp.hayshaney_lahatz_avir_batzmigim_ind) === 1 || shnatYitzur >= 2015,
        hasPedestrianDetection: Number(wltp.zihuy_holchey_regel_ind) === 1 || Number(wltp.blimat_hirum_lifnei_holhei_regel_ofanaim) === 1 || shnatYitzur >= 2019,
        pollutionGroup: parseInt(activeRec.kvutzat_zihum, 10) || parseInt(wltp.kvutzat_zihum, 10) || 2,
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
      lastInspectionMileageKm: lastKm,
      hasStructuralModification: shinui.shinui_mivne_ind === 1,
      hasColorChange: shinui.shnui_zeva_ind === 1,
      hasTireSizeChange: shinui.shinui_zmig_ind === 1,
      hasLpgConversion: shinui.gapam_ind === 1,
      originalOwnership: originalOrigin,
      currentOwnership: currentOwner,
      registrationStatus: isCancelled ? 'מורד מהכביש' : (isTestValid ? 'פעיל' : 'פג תוקף'),
      inspectionDueMonths,
      actualHandNumber,
      actualHandText,
      previousOwnersCount,
      licenseRegistrationNote,
      ownershipTimeline,
      isPublicVehicleOrTaxi: isPublicVehicle,
      publicVehicleType: publicType,
      isCancelledOrTotalLoss: isCancelled,
      cancellationDate,
      mileageAnalysis: lastKm ? {
        actualKm: lastKm,
        expectedKm: Math.round((2026 - shnatYitzur) * 17500),
        status: lastKm > (2026 - shnatYitzur) * 19000 ? 'high' : lastKm < (2026 - shnatYitzur) * 12000 ? 'low' : 'normal',
        text: lastKm > (2026 - shnatYitzur) * 19000 ? 'קילומטראז גבוה מהממוצע בישראל' : lastKm < (2026 - shnatYitzur) * 12000 ? 'קילומטראז נמוך מהממוצע - יתרון!' : 'קילומטראז תואם לממוצע השנתי בישראל'
      } : undefined
    },
    recalls: {
      specificVehicleUncompletedRecalls: specificVehicleRecalls,
      modelRecalls: modelRecallsList,
      hasActiveRecall: specificVehicleRecalls.length > 0
    },
    buyerDecision,
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
    seoInterlinking,
    sources,
    generatedAt: nowStr,
    cacheMetadata: {
      cachedAt: nowStr,
      cacheAgeDays: 0,
      isStale: false
    }
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
