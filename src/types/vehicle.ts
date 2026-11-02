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
  
  // Section A: Vehicle Identity
  identity: {
    make: string;
    model: string;
    commercialName: string;
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

  // Section G: Ministry of Transport History
  history: {
    lastInspectionMileageKm?: number;
    hasStructuralModification: boolean;
    hasColorChange: boolean;
    hasTireSizeChange: boolean;
    hasLpgConversion: boolean;
    originalOwnership: string;
    registrationStatus: 'בתוקף' | 'פג תוקף' | 'מורד מהכביש' | 'פעיל';
    inspectionDueMonths: number;
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

  // Section I: Pre-Purchase Checklist
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

  // Transparency & Source Registry
  sources: DataSourceItem[];
  generatedAt: string;
}
