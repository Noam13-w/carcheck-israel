export type ConfidenceLevel = 'OFFICIAL' | 'VERIFIED' | 'ESTIMATED' | 'MODEL-LEVEL' | 'UNVERIFIED' | 'UNAVAILABLE';

export type ProblemSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface KnownProblem {
  id: string;
  name: string;
  category: 'engine' | 'transmission' | 'electrical' | 'brakes' | 'cooling' | 'suspension' | 'body' | 'hybrid_ev';
  description: string;
  affectedYears: string;
  affectedEngines?: string;
  symptoms: string[];
  possibleCauses: string[];
  severity: ProblemSeverity;
  estimatedCostIls: {
    min: number;
    max: number;
    description?: string;
  };
  isRecurring: boolean;
  hasRecallOrTsb: boolean;
  recallCode?: string;
  sources: {
    name: string;
    url?: string;
    date?: string;
  }[];
}

export interface MaintenanceItem {
  item: string;
  intervalKm: number;
  intervalMonths: number;
  specification?: string;
  importance: 'critical' | 'recommended' | 'inspection';
  notes?: string;
}

export interface DataSourceItem {
  id: string;
  name: string;
  category: 'government' | 'manufacturer' | 'testing' | 'automotive_db';
  url: string;
  fieldsSupplied: string[];
  lastSync: string;
  sourceDate?: string;
  confidence: ConfidenceLevel;
  status: 'connected' | 'cached' | 'partial' | 'error';
}

export interface VehicleReportData {
  plateNumber: string;
  formattedPlate: string;
  
  // Section A: Vehicle Identity & Ownership / Hand details
  identity: {
    make: string;
    englishMake?: string;
    model: string;
    commercialName: string;
    englishCommercialName?: string;
    trimLevel: string;
    modelYear: number;
    firstRegistrationDate: string;
    registrationValidity: string;
    lastInspectionDate: string;
    engineCode: string;
    engineDisplacementCc: number;
    fuelType: string;
    vehicleCategory: string;
    bodyStyle: string;
    color: string;
    frontTire: string;
    rearTire: string;
    ownershipCategory: string;
    countryOfOrigin?: string;
    doorsCount?: number;
    seatsCount?: number;
    vinMasked?: string;
    horaatRishum?: number;

    // Advanced Hand & Ownership intelligence
    ownershipDetails: {
      currentCategory: string; // פרטי, חברה, ליסינג
      originalHandOrigin: string; // מקוריות יד ראשונה (פרטי, ליסינג, השכרה)
      estimatedHandText: string; // למשל: "יד 1 - 2 משוערת"
      estimatedHandMin: number;
      estimatedHandMax: number;
      estimatedHandExplanation: string;
      resalePriceImpact: string; // השפעה צפויה על מחירון
      howToVerifyDocument: string[];
    };
  };

  // Section B: Technical Specifications
  specs: {
    engine: {
      displacementCc: number;
      horsepower: number;
      engineCode: string;
      cylinders?: number;
      fuelType: string;
      driveTechnology: string;
      timingType?: 'רצועת תזמון (טיימינג)' | 'שרשרת תזמון' | 'לא ידוע';
      turbocharged?: boolean;
    };
    transmission: {
      type: string;
      gears?: number;
      description?: string;
    };
    performance: {
      grossWeightKg?: number;
      kerbWeightKg?: number;
      towingCapacityBrakedKg?: number;
      towingCapacityUnbrakedKg?: number;
      maxSpeedKmh?: number;
    };
    safety: {
      safetyEquipmentLevel: number; // 0 - 8 (רמת אבזור בטיחותי)
      safetyScore?: number;
      airbagsCount: number;
      hasAbs: boolean;
      hasEsp: boolean;
      hasLaneDepartureWarning: boolean;
      hasAutonomousEmergencyBraking: boolean;
      hasAdaptiveCruiseControl: boolean;
      hasBlindSpotDetection: boolean;
      hasReverseCamera: boolean;
      hasTirePressureSensors: boolean;
      hasPedestrianDetection: boolean;
      pollutionGroup: number; // 1 - 15 (קבוצת זיהום)
      greenIndex?: number; // מדד ירוק
    };
  };

  // Section C: Fuel Consumption
  fuel: {
    fuelType: string;
    combinedLitersPer100Km?: number;
    cityLitersPer100Km?: number;
    highwayLitersPer100Km?: number;
    combinedKmPerLiter?: number;
    tankCapacityLiters?: number;
    estimatedRangeKm?: number;
    co2Wltp?: number;
    isElectricOrHybrid: boolean;
    batteryCapacityKwh?: number;
    officialElectricRangeKm?: number;
    realWorldConsumptionEst?: {
      cityL100: number;
      highwayL100: number;
      combinedL100: number;
      notes: string;
    };
  };

  // Section D: Known Problems & Issues
  knownProblems: KnownProblem[];

  // Section E: Reliability Assessment
  reliability: {
    engineRating: number; // 1-5
    transmissionRating: number; // 1-5
    electricalRating: number; // 1-5
    suspensionRating: number; // 1-5
    overallScore: number; // 1-5
    partsAvailabilityInIsrael: 'גבוהה מאוד' | 'גבוהה' | 'בינונית' | 'נמוכה';
    maintenanceComplexity: 'פשוטה' | 'בינונית' | 'מורכבת';
    summaryHebrew: string;
  };

  // Section F: Maintenance Schedule
  maintenance: {
    schedule: MaintenanceItem[];
    recommendedOilSpec?: string;
    oilCapacityLiters?: number;
    timingReplacementNotes?: string;
  };

  // Section G: Ministry of Transport History & Real Ownership
  history: {
    lastInspectionMileageKm?: number;
    hasStructuralModification: boolean;
    hasColorChange: boolean;
    hasTireSizeChange: boolean;
    hasLpgConversion: boolean;
    originalOwnership: string;
    currentOwnership: string;
    registrationStatus: 'בתוקף' | 'פג תוקף' | 'מורד מהכביש' | 'פעיל';
    inspectionDueMonths: number;
    
    // Official Ownership Timeline from Ministry of Transport (SHINUI_MIVNE_2)
    actualHandNumber: number; // e.g. 2 for 2nd hand
    actualHandText: string; // e.g. "יד 2"
    previousOwnersCount: number; // e.g. 1
    licenseRegistrationNote: string; // e.g. "ברישיון הרכב רשום: 01 בעלים קודמים"
    averageHoldingDurationMonths?: number;
    ownershipTimeline: {
      dateStr: string; // "05/2021"
      rawDate: string; // "202105"
      ownership: string; // "החכר", "פרטי", "סוחר", "חברה"
      isDealer: boolean; // תו סחר - אינו מוסיף יד
      handIndex: number | null; // 1, 2, 3...
      isCurrent: boolean;
      note?: string;
    }[];

    // High Risk Flags
    isPublicVehicleOrTaxi: boolean;
    publicVehicleType?: string;
    isCancelledOrTotalLoss: boolean;
    cancellationDate?: string;

    mileageAnalysis?: {
      actualKm?: number;
      expectedKm: number;
      status: 'low' | 'normal' | 'high';
      text: string;
    };
  };

  // Section H: Recalls
  recalls: {
    specificVehicleUncompletedRecalls: {
      recallId: number | string;
      faultType: string;
      description: string;
      openDate: string;
      severity: string;
    }[];
    modelRecalls: {
      recallId: number | string;
      manufacturer: string;
      model: string;
      faultType: string;
      description: string;
      repairAction: string;
      recallYear: number;
      importerName: string;
      importerPhone?: string;
      importerWebsite?: string;
    }[];
    hasActiveRecall: boolean;
  };

  // Section I: Pre-Purchase Second-Hand Buyer Decision Suite
  buyerDecision: {
    purchaseScore: number; // 0 - 100
    riskLevel: 'נמוך' | 'בינוני' | 'גבוה';
    verdictHebrew: string;
    scoreFactors: {
      label: string;
      score: number;
      weight: string;
      status: 'good' | 'warning' | 'alert';
      description: string;
    }[];
    sellerQuestionsScript: {
      question: string;
      reason: string;
      watchOutFor: string;
    }[];
    physicalTestTips: string[];
    officialRegistryChecks: {
      title: string;
      serviceName: string;
      url: string;
      cost: string;
      isMandatory: boolean;
      description: string;
    }[];
  };

  // Pre-Purchase Checklist (legacy compatibility)
  prePurchaseChecklist: {
    title: string;
    items: string[];
  };

  // Section J: Operating & Ownership Costs
  costs: {
    annualLicensingFeeIls: number;
    licensingGroup: number;
    estimatedAnnualMaintenanceIls: number;
    tireSetReplacementIls: { min: number; max: number };
    brakePadSetIls: { min: number; max: number };
    batteryReplacementIls: { min: number; max: number };
    annualCostNotes: string;
  };

  // Section K: Overall Assessment Verdict
  verdict: {
    top5Considerations: string[];
    pros: string[];
    cons: string[];
    citySuitability: number; // 1-5
    highwaySuitability: number; // 1-5
    familySuitability: number; // 1-5
    fuelEconomyRating: number; // 1-5
    bottomLine: string;
  };

  // Programmatic SEO Interlinking (4-5 direct referrals)
  seoInterlinking: {
    relatedVehicles: {
      plate: string;
      title: string;
      year: number;
      fuel: string;
      badge: string;
    }[];
    modelHub: {
      title: string;
      slug: string;
      description: string;
    };
    geoGuides: {
      name: string;
      slug: string;
      description: string;
    }[];
  };

  // Transparency & Source Registry
  sources: DataSourceItem[];
  generatedAt: string;
  cacheMetadata?: {
    cachedAt: string;
    cacheAgeDays: number;
    isStale: boolean;
  };
}
