import React, { useState } from 'react';
import { Fuel, Zap, Calculator } from 'lucide-react';
import { VehicleReportData } from '../types/vehicle';

interface FuelCostCalculatorProps {
  fuelData: VehicleReportData['fuel'];
  engineData: VehicleReportData['specs']['engine'];
}

export const FuelCostCalculator: React.FC<FuelCostCalculatorProps> = ({
  fuelData,
}) => {
  const isElectric = fuelData.isElectricOrHybrid && /חשמל|electric/i.test(fuelData.fuelType);
  
  const [monthlyKm, setMonthlyKm] = useState<number>(1500);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(7.45);
  const [electricityKwhCost, setElectricityKwhCost] = useState<number>(0.64);
  const [drivingPattern, setDrivingPattern] = useState<'mixed' | 'city' | 'highway'>('mixed');

  const baseL100 = fuelData.combinedLitersPer100Km || 6.8;
  let activeL100 = baseL100;
  if (drivingPattern === 'city') {
    activeL100 = fuelData.cityLitersPer100Km || (baseL100 * 1.15);
  } else if (drivingPattern === 'highway') {
    activeL100 = fuelData.highwayLitersPer100Km || (baseL100 * 0.88);
  }

  const batteryKwh = fuelData.batteryCapacityKwh || 60;
  const electricRangeKm = fuelData.officialElectricRangeKm || 420;
  const kwhPer100Km = (batteryKwh / electricRangeKm) * 100;

  let monthlyCostIls = 0;
  let annualCostIls = 0;
  let costPerKmIls = 0;
  let fullTankCostIls = 0;

  if (isElectric) {
    const monthlyKwh = (monthlyKm / 100) * kwhPer100Km;
    monthlyCostIls = Math.round(monthlyKwh * electricityKwhCost);
    annualCostIls = monthlyCostIls * 12;
    costPerKmIls = parseFloat((monthlyCostIls / monthlyKm).toFixed(2));
    fullTankCostIls = Math.round(batteryKwh * electricityKwhCost);
  } else {
    const monthlyLiters = (monthlyKm / 100) * activeL100;
    monthlyCostIls = Math.round(monthlyLiters * fuelPricePerLiter);
    annualCostIls = monthlyCostIls * 12;
    costPerKmIls = parseFloat((monthlyCostIls / monthlyKm).toFixed(2));
    const tankSize = fuelData.tankCapacityLiters || 48;
    fullTankCostIls = Math.round(tankSize * fuelPricePerLiter);
  }

  return (
    <div className="bg-[#f7f8fc] rounded-2xl p-5 sm:p-6 border border-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white text-brand-600 flex items-center justify-center shadow-sm border border-slate-100">
            {isElectric ? <Zap className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-950">
              מחשבון הוצאות {isElectric ? 'טעינה' : 'דלק'} אישי
            </h3>
            <p className="text-xs text-slate-500">
              התאימו את הנסועה החודשית לחישוב העלות המדויקת עבורכם
            </p>
          </div>
        </div>

        <div className="bg-white px-3 py-1 rounded-xl border border-slate-200/70 text-xs font-bold text-brand-700">
          {isElectric 
            ? `${kwhPer100Km.toFixed(1)} קוט"ש ל-100 ק"מ` 
            : `${activeL100.toFixed(1)} ליטר ל-100 ק"מ (${(100 / activeL100).toFixed(1)} ק"מ/ל׳)`}
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        
        {/* Monthly Km */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-slate-700">נסועה חודשית</span>
            <span className="font-black text-brand-600 font-mono text-sm">
              {monthlyKm.toLocaleString()} ק"מ
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="4500"
            step="100"
            value={monthlyKm}
            onChange={(e) => setMonthlyKm(Number(e.target.value))}
            aria-label="נסועה חודשית בקילומטרים"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>400 ק"מ</span>
            <span>{(monthlyKm * 12).toLocaleString()} ק"מ בשנה</span>
            <span>4,500 ק"מ</span>
          </div>
        </div>

        {/* Driving Pattern */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60">
          <span className="text-xs font-bold text-slate-700 block mb-2">אופי נסיעה עיקרי</span>
          <div className="grid grid-cols-3 gap-1.5 bg-[#f7f8fc] p-1 rounded-xl text-xs">
            {[
              { id: 'mixed', label: 'משולב' },
              { id: 'city', label: 'עירוני' },
              { id: 'highway', label: 'בין-עירוני' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setDrivingPattern(mode.id as any)}
                className={`py-1.5 rounded-lg font-bold transition-all ${
                  drivingPattern === mode.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel / Electricity Price */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/60">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-bold text-slate-700">
              {isElectric ? 'תעריף קוט"ש ביתי' : 'מחיר ליטר דלק'}
            </span>
            <span className="font-black text-brand-600 font-mono text-sm">
              ₪{isElectric ? electricityKwhCost.toFixed(2) : fuelPricePerLiter.toFixed(2)}
            </span>
          </div>
          {isElectric ? (
            <input
              type="range"
              min="0.45"
              max="2.20"
              step="0.05"
              value={electricityKwhCost}
              onChange={(e) => setElectricityKwhCost(Number(e.target.value))}
              aria-label="תעריף חשמל לקוטש"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          ) : (
            <input
              type="range"
              min="6.00"
              max="9.00"
              step="0.05"
              value={fuelPricePerLiter}
              onChange={(e) => setFuelPricePerLiter(Number(e.target.value))}
              aria-label="מחיר ליטר דלק"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          )}
          <div className="text-[11px] text-slate-400 mt-1 text-center">
            {isElectric ? 'תעריף חברת החשמל / עמדה מהירה' : 'תעריף שירות עצמי בישראל'}
          </div>
        </div>

      </div>

      {/* Results Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="bg-white p-3.5 rounded-xl border border-brand-100 shadow-sm">
          <span className="text-[11px] font-bold text-brand-600 block mb-0.5">הוצאה חודשית צפויה</span>
          <div className="text-xl sm:text-2xl font-black text-slate-950 font-mono">
            ₪{monthlyCostIls.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">הוצאה שנתית צפויה</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ₪{annualCostIls.toLocaleString()}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">עלות לכל ק"מ נסיעה</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ₪{costPerKmIls}
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/60">
          <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
            {isElectric ? 'טעינה מלאה (0–100%)' : 'תדלוק מיכל מלא'}
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ₪{fullTankCostIls}
          </div>
        </div>
      </div>
    </div>
  );
};
