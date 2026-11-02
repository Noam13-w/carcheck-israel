import React, { useState } from 'react';
import { Fuel, Zap, Calculator, Gauge, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { VehicleReportData } from '../types/vehicle';

interface FuelCostCalculatorProps {
  fuelData: VehicleReportData['fuel'];
  engineData: VehicleReportData['specs']['engine'];
}

export const FuelCostCalculator: React.FC<FuelCostCalculatorProps> = ({
  fuelData,
  engineData
}) => {
  const isElectric = fuelData.isElectricOrHybrid && /חשמל|electric/i.test(fuelData.fuelType);
  
  // State
  const [monthlyKm, setMonthlyKm] = useState<number>(1500); // 18,000 km/year default in Israel
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(7.50); // Israeli petrol benchmark ~₪7.50
  const [electricityKwhCost, setElectricityKwhCost] = useState<number>(0.62); // Israel Electric Corp home rate ~₪0.62/kWh
  const [drivingPattern, setDrivingPattern] = useState<'mixed' | 'city' | 'highway'>('mixed');

  // Base consumption figures
  const baseL100 = fuelData.combinedLitersPer100Km || 7.0;
  let activeL100 = baseL100;
  if (drivingPattern === 'city') {
    activeL100 = fuelData.cityLitersPer100Km || (baseL100 * 1.25);
  } else if (drivingPattern === 'highway') {
    activeL100 = fuelData.highwayLitersPer100Km || (baseL100 * 0.85);
  }

  // Electric calculation
  const batteryKwh = fuelData.batteryCapacityKwh || 60;
  const electricRangeKm = fuelData.officialElectricRangeKm || 400;
  const kwhPer100Km = (batteryKwh / electricRangeKm) * 100;

  // Calculations
  let monthlyCostIls = 0;
  let annualCostIls = 0;
  let annualVolume = 0; // Liters or kWh
  let costPerKmIls = 0;
  let fullChargeOrTankCostIls = 0;

  if (isElectric) {
    const monthlyKwh = (monthlyKm / 100) * kwhPer100Km;
    monthlyCostIls = Math.round(monthlyKwh * electricityKwhCost);
    annualCostIls = monthlyCostIls * 12;
    annualVolume = Math.round(monthlyKwh * 12);
    costPerKmIls = parseFloat((monthlyCostIls / monthlyKm).toFixed(2));
    fullChargeOrTankCostIls = Math.round(batteryKwh * electricityKwhCost);
  } else {
    const monthlyLiters = (monthlyKm / 100) * activeL100;
    monthlyCostIls = Math.round(monthlyLiters * fuelPricePerLiter);
    annualCostIls = monthlyCostIls * 12;
    annualVolume = Math.round(monthlyLiters * 12);
    costPerKmIls = parseFloat((monthlyCostIls / monthlyKm).toFixed(2));
    const tankSize = fuelData.tankCapacityLiters || 45;
    fullChargeOrTankCostIls = Math.round(tankSize * fuelPricePerLiter);
  }

  // Petrol comparison for EVs
  const equivalentPetrolMonthlyIls = Math.round((monthlyKm / 100) * 7.5 * 7.50);
  const evMonthlySavingsIls = equivalentPetrolMonthlyIls - monthlyCostIls;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            {isElectric ? <Zap className="w-6 h-6" /> : <Fuel className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <span>מחשבון עלויות דלק ואנרגיה לרכב זה</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-normal">אינטראקטיבי</span>
            </h3>
            <p className="text-sm text-slate-400 mt-0.5">
              מבוסס על צריכת היצרן ונתוני ה-WLTP המותאמים למפרט המנוע הספציפי
            </p>
          </div>
        </div>

        {/* Current Vehicle Badge */}
        <div className="bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700/60 text-xs">
          <span className="text-slate-400">צריכה רשמית: </span>
          <span className="font-bold text-amber-400">
            {isElectric 
              ? `${kwhPer100Km.toFixed(1)} קוט"ש / 100 ק"מ` 
              : `${activeL100.toFixed(1)} ליטר / 100 ק"מ (${(100 / activeL100).toFixed(1)} ק"מ/ל')`}
          </span>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        
        {/* Monthly Km Slider */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/40">
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-slate-300">נסועה חודשית משוערת</label>
            <span className="text-sm font-extrabold text-brand-400 font-mono">
              {monthlyKm.toLocaleString()} ק"מ
            </span>
          </div>
          <input
            type="range"
            min={500}
            max={4500}
            step={100}
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] text-slate-500 mt-1">
            <span>500 ק"מ</span>
            <span>ממוצע ישראלי (1,500)</span>
            <span>4,500 ק"מ</span>
          </div>
        </div>

        {/* Fuel/Energy Price */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/40">
          <label className="text-xs font-semibold text-slate-300 block mb-2">
            {isElectric ? 'תעריף חשמל ביתי לקוט"ש (₪)' : 'מחיר דלק לליטר (₪)'}
          </label>
          <div className="relative">
            <input
              type="number"
              step={isElectric ? 0.01 : 0.05}
              min={isElectric ? 0.3 : 4}
              max={isElectric ? 3.0 : 12}
              value={isElectric ? electricityKwhCost : fuelPricePerLiter}
              onChange={(e) => isElectric ? setElectricityKwhCost(Number(e.target.value)) : setFuelPricePerLiter(Number(e.target.value))}
              className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono font-bold text-base focus:outline-none focus:border-brand-500"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-medium">₪</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isElectric ? 'תעריף חברת החשמל לצריכה ביתית' : 'תעריף בנזין 95 בשירות עצמי'}
          </p>
        </div>

        {/* Driving Profile */}
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/40">
          <label className="text-xs font-semibold text-slate-300 block mb-2">אופי הנסיעה העיקרי</label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-700/60">
            <button
              type="button"
              onClick={() => setDrivingPattern('city')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                drivingPattern === 'city' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              עירוני
            </button>
            <button
              type="button"
              onClick={() => setDrivingPattern('mixed')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                drivingPattern === 'mixed' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              משולב
            </button>
            <button
              type="button"
              onClick={() => setDrivingPattern('highway')}
              className={`py-1.5 text-xs font-bold rounded-md transition-colors ${
                drivingPattern === 'highway' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              בינעירוני
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {drivingPattern === 'city' ? 'פקקים, רמזורים ונסיעות קצרות' : drivingPattern === 'highway' ? 'שיוט בכבישים מהירים' : 'שילוב מאוזן של עיר וכביש מהיר'}
          </p>
        </div>

      </div>

      {/* Output Results Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Monthly Cost */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>הוצאה חודשית</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            ₪{monthlyCostIls.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            ל-{(monthlyKm).toLocaleString()} ק"מ בחודש
          </div>
        </div>

        {/* Annual Cost */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>הוצאה שנתית</span>
            <Calendar className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-brand-300 font-mono">
            ₪{annualCostIls.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {annualVolume.toLocaleString()} {isElectric ? 'קוט"ש' : 'ליטרים'} בשנה
          </div>
        </div>

        {/* Cost per Km */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>עלות לקילומטר</span>
            <Gauge className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono">
            ₪{costPerKmIls.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            עלות אנרגיה נקייה
          </div>
        </div>

        {/* Full Tank / Full Charge */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>{isElectric ? 'עלות טעינה מלאה' : 'עלות תדלוק מיכל מלא'}</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
            ₪{fullChargeOrTankCostIls.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            טווח משוער: ~{fuelData.estimatedRangeKm || (isElectric ? electricRangeKm : 650)} ק"מ
          </div>
        </div>

      </div>

      {/* EV Bonus Savings Box */}
      {isElectric && evMonthlySavingsIls > 0 && (
        <div className="mt-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-300">חיסכון לעומת רכב בנזין מקביל</h4>
              <p className="text-xs text-slate-300">טעינה ביתית חוסכת כ-₪{evMonthlySavingsIls.toLocaleString()} בכל חודש (₪{(evMonthlySavingsIls * 12).toLocaleString()} בשנה!)</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-black text-emerald-400 font-mono">+₪{(evMonthlySavingsIls * 12).toLocaleString()}</div>
            <div className="text-[10px] text-emerald-300/80">חיסכון שנתי</div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] text-slate-400 text-center">
        * הנתונים מחושבים על סמך נתוני מעבדת WLTP/NEDC רשמיים ודפוס הנהיגה שנבחר. בפועל צריכת הדלק עשויה להשתנות לפי לחץ אוויר, שימוש במזגן ועומס משקל.
      </p>

    </div>
  );
};
