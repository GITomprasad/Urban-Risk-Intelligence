import React, { useState } from 'react';
import { 
  Eye, 
  ShieldCheck, 
  MapPin, 
  Wind, 
  CloudRain, 
  Navigation, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  Search, 
  Share2,
  Car
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { HexRiskBadge } from '../common/HexRiskBadge';

export const CitizenPortal: React.FC = () => {
  const { currentCity, hexCells } = useRisk();
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(hexCells[0]?.district || 'Midtown');
  const [searchDistrict, setSearchDistrict] = useState<string>('');

  const filteredNeighborhoodCells = hexCells.filter(c => 
    c.district.toLowerCase().includes(searchDistrict.toLowerCase()) ||
    c.name.toLowerCase().includes(searchDistrict.toLowerCase())
  );

  const activeDistrictCell = hexCells.find(c => c.district === selectedNeighborhood) || hexCells[0];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-104px)] overflow-y-auto">
      {/* Screen Header */}
      <div className="bg-gradient-to-r from-blue-900/60 via-cyan-950/50 to-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Official Municipal Public Safety & Transparency Portal</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {currentCity.name} Urban Safety & Hazard Advisory
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time, privacy-preserving safety intelligence generated from city sensor networks. Plan safer travel routes, avoid localized flooding, and check neighborhood air quality.
          </p>
        </div>
      </div>

      {/* City-Wide Citizen Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Weather & Road Safety Status */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Road Safety Status</span>
            <CloudRain className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse"></span>
            <h4 className="text-lg font-bold text-white">Caution: Wet Surfaces</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Current rainfall ({currentCity.rainMm} mm/hr) has increased vehicle braking distances by 35%. Drive with headlights and maintain extra car distance.
          </p>
        </div>

        {/* Air Quality Index */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Air Quality Health</span>
            <Wind className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
            <h4 className="text-lg font-bold text-emerald-400">{currentCity.avgAqi} AQI (Good to Moderate)</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Outdoor physical activity and cycling are safe for most residents. Sensitive groups in tunnel corridors should monitor updates.
          </p>
        </div>

        {/* Transit & Commute Advisory */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-400">Commuter Transit Flow</span>
            <Navigation className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-400"></span>
            <h4 className="text-lg font-bold text-white">Nominal Transit Operations</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Subway lines operating on standard schedules. FDR Drive and highway approaches experiencing localized slowdowns.
          </p>
        </div>
      </div>

      {/* Neighborhood Safety Search & Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Neighborhood List (Left 5 cols) */}
        <div className="lg:col-span-5 bg-urip-card border border-urip-border rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Neighborhood Safety Explorer
            </h3>
            <span className="text-xs font-mono text-cyan-400">{currentCity.districts.length} Districts</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search neighborhood or road name..."
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {filteredNeighborhoodCells.map(cell => {
              const isSelected = selectedNeighborhood === cell.district;
              return (
                <div
                  key={cell.id}
                  onClick={() => setSelectedNeighborhood(cell.district)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-urip-panel border-cyan-500 text-white shadow-md'
                      : 'bg-urip-dark/80 hover:bg-urip-panel/70 border-urip-border text-slate-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">{cell.district}</div>
                    <div className="text-[11px] text-slate-400">{cell.name}</div>
                  </div>
                  <HexRiskBadge score={cell.overallRisk} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Neighborhood Deep Advisory (Right 7 cols) */}
        {activeDistrictCell && (
          <div className="lg:col-span-7 bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between border-b border-urip-border pb-3">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-semibold uppercase">{activeDistrictCell.district} District</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{activeDistrictCell.name}</h3>
              </div>
              <HexRiskBadge score={activeDistrictCell.overallRisk} size="lg" />
            </div>

            {/* Neighborhood Indicators Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Pedestrian Safety</span>
                <span className="font-bold text-emerald-400">
                  {activeDistrictCell.breakdown.crowdDensity > 70 ? 'High Foot Density' : 'Normal Flow'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Puddle / Flood Risk</span>
                <span className="font-bold text-cyan-300">
                  {activeDistrictCell.breakdown.floodProbability > 60 ? 'Water Pooling Warning' : 'Low Drainage Risk'}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Air Quality</span>
                <span className="font-bold text-slate-200">{activeDistrictCell.breakdown.aqiForecast} AQI</span>
              </div>
            </div>

            {/* Recommended Citizen Safety Actions */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Resident & Commuter Recommendations</h5>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Use marked pedestrian crossings with signal timers; avoid crossing multi-lane intersections during dusk hours.</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Micro-mobility & cycling lanes in this corridor are active; watch for turns at arterial corners.</span>
                </div>
              </div>
            </div>

            {/* Privacy Compliance Statement (Blueprint Page 16) */}
            <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-[11px] text-cyan-300 font-mono flex items-center justify-between">
              <span>GDPR / CCPA Protected: Zero Personal Identifiable Information (PII) Stored.</span>
              <button title="Share District Advisory" className="p-1 text-cyan-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
