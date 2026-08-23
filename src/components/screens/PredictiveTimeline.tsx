import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sun, 
  Moon, 
  Sunset, 
  Calendar, 
  Download, 
  Clock, 
  AlertTriangle, 
  CloudRain, 
  Car, 
  Sparkles,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { PREDICTIVE_TIMELINE_24H } from '../../data/mockMetrics';
import { HexRiskBadge, getRiskColor } from '../common/HexRiskBadge';

export const PredictiveTimeline: React.FC = () => {
  const { currentCity } = useRisk();
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Metro');
  const [selectedHour, setSelectedHour] = useState<number>(18); // Default to peak hour 18:00
  const [showConfidenceBands, setShowConfidenceBands] = useState<boolean>(true);

  const hourData = PREDICTIVE_TIMELINE_24H[selectedHour] || PREDICTIVE_TIMELINE_24H[0];

  const handleExportCSV = () => {
    const headers = 'Hour,PredictedRisk,LowerBound,UpperBound,DaylightPhase,TrafficIndex,PrecipitationMm,Events\n';
    const rows = PREDICTIVE_TIMELINE_24H.map(p => 
      `${p.hour},${p.predictedRisk},${p.lowerBound},${p.upperBound},${p.daylightPhase},${p.trafficVolumeIndex},${p.projectedPrecipitationMm},"${p.events?.map(e => e.title).join('; ') || 'None'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `URIP_24h_Forecast_${currentCity.id}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDaylightColor = (phase: string) => {
    switch (phase) {
      case 'day': return 'bg-sky-950/30 border-sky-500/20 text-sky-300';
      case 'golden_hour': return 'bg-amber-950/40 border-amber-500/30 text-amber-300';
      case 'dusk': return 'bg-purple-950/40 border-purple-500/30 text-purple-300';
      case 'night': return 'bg-slate-950/70 border-slate-800 text-slate-400';
      case 'pre_dawn': return 'bg-indigo-950/40 border-indigo-500/20 text-indigo-300';
      default: return 'bg-slate-900 text-slate-400';
    }
  };

  const getDaylightIcon = (phase: string) => {
    switch (phase) {
      case 'day': return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'golden_hour': return <Sunset className="w-3.5 h-3.5 text-amber-400" />;
      case 'dusk': return <Sunset className="w-3.5 h-3.5 text-purple-400" />;
      case 'night': return <Moon className="w-3.5 h-3.5 text-slate-400" />;
      case 'pre_dawn': return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto overflow-y-auto h-[calc(100vh-104px)]">
      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-urip-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                24-Hour Predictive Risk Timeline
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  {currentCity.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Diurnal risk forecasting model combining weather progression, transit schedules, and public event signals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-urip-card border border-urip-border text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="All Metro">All Metro Aggregation</option>
            {currentCity.districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Export CSV / Report */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-urip-panel hover:bg-urip-border border border-urip-border text-xs font-mono font-semibold text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Forecast CSV
          </button>
        </div>
      </div>

      {/* Main 24-Hour Timeline Visualizer */}
      <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              24-Hour Continuous Risk Curve (00:00 – 23:00)
            </h3>
            <p className="text-xs text-slate-400">Click any hour column to inspect detailed factors & public event correlation</p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <label className="flex items-center gap-1.5 text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showConfidenceBands}
                onChange={e => setShowConfidenceBands(e.target.checked)}
                className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
              />
              Show 95% Confidence Interval
            </label>
          </div>
        </div>

        {/* 24-Hour Interactive Bar Chart / Wave */}
        <div className="relative pt-6 pb-2">
          {/* Day/Night Phase Background Ribbon */}
          <div className="grid grid-cols-24 gap-1 h-64 items-end bg-urip-darkest/70 rounded-lg p-3 border border-urip-border/50">
            {PREDICTIVE_TIMELINE_24H.map((pt, idx) => {
              const isSelected = selectedHour === idx;
              const colors = getRiskColor(pt.predictedRisk);
              const heightPercent = pt.predictedRisk;
              const hasEvents = pt.events && pt.events.length > 0;

              return (
                <div
                  key={pt.hour}
                  onClick={() => setSelectedHour(idx)}
                  className={`relative flex flex-col items-center justify-end h-full group cursor-pointer transition-all ${
                    isSelected ? 'z-10' : ''
                  }`}
                >
                  {/* Event Marker Flag */}
                  {hasEvents && (
                    <div className="absolute -top-3 w-2 h-2 rounded-full bg-cyan-400 animate-ping" title={pt.events?.[0].title} />
                  )}

                  {/* Confidence interval shadow */}
                  {showConfidenceBands && (
                    <div
                      className="absolute w-full rounded bg-cyan-500/15 border-t border-b border-cyan-400/30 transition-all pointer-events-none"
                      style={{
                        bottom: `${pt.lowerBound}%`,
                        height: `${pt.upperBound - pt.lowerBound}%`
                      }}
                    />
                  )}

                  {/* Main Risk Bar */}
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.6)]'
                        : 'group-hover:opacity-100 opacity-85'
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: colors.hex
                    }}
                  />

                  {/* Hour label below bar */}
                  <span className={`text-[10px] font-mono mt-2 transition-colors ${
                    isSelected ? 'text-cyan-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                  }`}>
                    {pt.hour.slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Daylight Background Legend */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-urip-border/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Full Daylight (07:00–16:00)</span>
              <span className="flex items-center gap-1.5"><Sunset className="w-3.5 h-3.5 text-purple-400" /> Dusk Peak (17:00–18:00)</span>
              <span className="flex items-center gap-1.5"><Moon className="w-3.5 h-3.5 text-slate-400" /> Night (19:00–05:00)</span>
            </div>
            <div className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Cyan Dot = Scheduled High-Attendance City Event</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Hour Deep-Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hour Summary Card */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Forecast Window</span>
              <h3 className="text-xl font-bold text-white font-mono">{hourData.hour} : 00</h3>
            </div>
            <HexRiskBadge score={hourData.predictedRisk} size="lg" />
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-urip-dark border border-urip-border">
              <span className="text-slate-400">Daylight & Sun Angle</span>
              <span className={`px-2 py-0.5 rounded border text-[11px] font-mono flex items-center gap-1 ${getDaylightColor(hourData.daylightPhase)}`}>
                {getDaylightIcon(hourData.daylightPhase)}
                {hourData.daylightPhase.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-urip-dark border border-urip-border">
              <span className="text-slate-400 flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-blue-400" /> Projected Traffic Index</span>
              <span className="font-mono font-bold text-blue-300">{hourData.trafficVolumeIndex} / 100</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-urip-dark border border-urip-border">
              <span className="text-slate-400 flex items-center gap-1.5"><CloudRain className="w-3.5 h-3.5 text-cyan-400" /> NWP Projected Rain</span>
              <span className="font-mono font-bold text-cyan-300">{hourData.projectedPrecipitationMm} mm/hr</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-urip-dark border border-urip-border">
              <span className="text-slate-400">95% Risk Interval</span>
              <span className="font-mono font-bold text-slate-200">[{hourData.lowerBound} – {hourData.upperBound}]</span>
            </div>
          </div>
        </div>

        {/* Scheduled Event Overlays in this Window */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-urip-border/60 pb-3">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Scheduled Public Events</h3>
          </div>

          {hourData.events && hourData.events.length > 0 ? (
            <div className="space-y-3">
              {hourData.events.map((ev, i) => (
                <div key={i} className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{ev.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 uppercase">
                      {ev.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Venue: <span className="text-slate-100 font-medium">{ev.venue}</span></p>
                  <p className="text-xs text-cyan-300 font-mono">Expected Density: ~{ev.expectedCrowd.toLocaleString()} attendees</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs font-mono space-y-1">
              <Info className="w-5 h-5 mx-auto text-slate-600 mb-1" />
              <p>No major scheduled stadium concerts or sports events in this 1-hour window.</p>
              <p className="text-[11px] text-slate-600">Baseline commuter & commercial traffic models applied.</p>
            </div>
          )}
        </div>

        {/* Tactical Recommendation for Window */}
        <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-urip-border/60 pb-3">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">AI Operational Guidance</h3>
            </div>
            
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs space-y-2 leading-relaxed text-slate-300">
              {hourData.predictedRisk >= 80 ? (
                <>
                  <p className="text-red-300 font-semibold font-mono">⚠️ HIGH-RISK CONVERGENCE WINDOW:</p>
                  <p>Model detects overlap of rain-saturated roads ({hourData.projectedPrecipitationMm} mm/hr) and peak traffic surge. Recommend pre-positioning 2 rapid response wreckers at arterial junctions.</p>
                </>
              ) : hourData.predictedRisk >= 50 ? (
                <>
                  <p className="text-amber-300 font-semibold font-mono">⚠️ MODERATE SURGE ADVISORY:</p>
                  <p>Elevated pedestrian movements and lighting transition. Maintain active signal retiming and monitor CCTV flow nodes.</p>
                </>
              ) : (
                <>
                  <p className="text-emerald-300 font-semibold font-mono">✓ NOMINAL STABILITY WINDOW:</p>
                  <p>Low congestion and nominal environmental friction. Standard patrol intervals recommended.</p>
                </>
              )}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono">
            URIP Multi-Domain Time-Series ARIMA + LSTM Network
          </div>
        </div>
      </div>
    </div>
  );
};
