import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  MapPin, 
  Activity, 
  CloudRain, 
  Car, 
  Users, 
  Wind, 
  AlertTriangle, 
  Radio, 
  CheckCircle2, 
  Send,
  Zap,
  Building,
  Navigation,
  Sliders
} from 'lucide-react';
import { H3HexCell } from '../../types';
import { useRisk } from '../../context/RiskContext';
import { HexRiskBadge, getRiskColor } from '../common/HexRiskBadge';
import { ShapBarChart } from '../common/ShapBarChart';

interface CellDetailDrawerProps {
  cell: H3HexCell;
  onClose: () => void;
}

export const CellDetailDrawer: React.FC<CellDetailDrawerProps> = ({ cell, onClose }) => {
  const { dispatchEmergencyUnit, updateAlertStatus, alerts } = useRisk();
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const colors = getRiskColor(cell.overallRisk);

  const handleDispatch = (unitType: string) => {
    dispatchEmergencyUnit(cell.id, unitType);
    setActionSuccess(`Dispatched ${unitType} to ${cell.name}`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="w-full md:w-[480px] bg-urip-card/95 border-l border-urip-border backdrop-blur-xl h-full flex flex-col z-30 shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className={`p-4 border-b border-urip-border ${colors.bg} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60">
            <MapPin className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider font-semibold">{cell.district}</span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-700">H3: {cell.h3Index.slice(0, 10)}...</span>
            </div>
            <h3 className="text-base font-bold text-white leading-tight">{cell.name}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/50 px-4 py-2 flex items-center gap-2 text-emerald-300 text-xs font-mono animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Risk Score Summary Banner */}
        <div className="bg-urip-dark/80 border border-urip-border rounded-xl p-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Composite Sector Risk</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-3xl font-extrabold font-mono ${colors.text}`}>{cell.overallRisk}</span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
          </div>
          <HexRiskBadge score={cell.overallRisk} size="lg" />
        </div>

        {/* Multi-Domain Risk Probabilities */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Specialist Model Risk Breakdown
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-urip-dark border border-urip-border">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Car className="w-3 h-3 text-red-400" /> Crash Probability</span>
                <span className="font-mono font-bold text-red-400">{cell.breakdown.accidentProbability}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${cell.breakdown.accidentProbability}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-urip-dark border border-urip-border">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><CloudRain className="w-3 h-3 text-cyan-400" /> Flood Probability</span>
                <span className="font-mono font-bold text-cyan-400">{cell.breakdown.floodProbability}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${cell.breakdown.floodProbability}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-urip-dark border border-urip-border">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Users className="w-3 h-3 text-purple-400" /> Crowd Surge Risk</span>
                <span className="font-mono font-bold text-purple-400">{cell.breakdown.crowdDensity}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${cell.breakdown.crowdDensity}%` }} />
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-urip-dark border border-urip-border">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1"><Wind className="w-3 h-3 text-amber-400" /> AQI Forecast</span>
                <span className="font-mono font-bold text-amber-400">{cell.breakdown.aqiForecast} AQI</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (cell.breakdown.aqiForecast / 300) * 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Explainable AI (SHAP Factor Attribution) */}
        <ShapBarChart factors={cell.shapFactors} confidenceScore={cell.confidenceScore} />

        {/* Live Multi-Signal Telemetry Values */}
        <div className="bg-urip-dark/70 border border-urip-border rounded-lg p-3 space-y-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400" />
            Live Ingestion Telemetry
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Precipitation Rate</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.precipitationRateMmHr} mm/hr</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Average Speed</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.trafficSpeedKmh} km/h</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">CCTV Optical Density</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.cctvDensityPeopleM2} p/m²</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Vehicles / min</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.cctvVehicleCount} v/m</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Road Surface State</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.potholeDefectCount} defects • {cell.liveSensors.streetLightStatus}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Nearest Hospital</span>
              <span className="font-bold text-slate-200">{cell.liveSensors.distanceToHospitalKm} km (4m ETA)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Actionable UI Principle from Blueprint) */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Human-in-the-Loop Interventions
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDispatch('Police Highway Patrol')}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Patrol
            </button>
            <button
              onClick={() => handleDispatch('EMS Paramedic Standby')}
              className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Pre-Position EMS
            </button>
            <button
              onClick={() => handleDispatch('Traffic Signal VSL Advisory')}
              className="px-3 py-2 rounded-lg bg-urip-panel hover:bg-urip-border border border-urip-border text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Adjust VSL Signs
            </button>
            <button
              onClick={() => handleDispatch('Stormwater Drainage Crew')}
              className="px-3 py-2 rounded-lg bg-urip-panel hover:bg-urip-border border border-urip-border text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              Deploy Drainage
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-3 bg-urip-darkest border-t border-urip-border flex items-center justify-between text-xs font-mono text-slate-400">
        <span>Coordinates: {cell.lat.toFixed(4)}, {cell.lng.toFixed(4)}</span>
        <button
          onClick={onClose}
          className="text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
