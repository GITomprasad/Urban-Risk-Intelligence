import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Award, 
  CheckCircle2, 
  Crosshair, 
  Zap, 
  Layers, 
  Activity,
  ArrowUpRight,
  Sparkles,
  PieChart,
  FileDown
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { CORRELATION_DATASETS, generateAnnualRiskCalendar } from '../../data/mockMetrics';
import { getRiskColor, HexRiskBadge } from '../common/HexRiskBadge';

export const AnalyticsDashboard: React.FC = () => {
  const { currentCity, hexCells, setSelectedCell, setActiveScreen } = useRisk();
  const [selectedCorrelationKey, setSelectedCorrelationKey] = useState<keyof typeof CORRELATION_DATASETS>('rain_vs_crashes');
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<{ date: string; risk: number; incidents: number; weather: string } | null>(null);
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  const annualCalendar = useMemo(() => generateAnnualRiskCalendar(), []);
  const correlationData = CORRELATION_DATASETS[selectedCorrelationKey];

  // Top 10 High Risk Hex Zones
  const top10Zones = useMemo(() => {
    return [...hexCells].sort((a, b) => b.overallRisk - a.overallRisk).slice(0, 10);
  }, [hexCells]);

  const handleDownloadPDFReport = () => {
    // Printable summary download or trigger browser print
    window.print();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-104px)] overflow-y-auto print:p-0 print:h-auto">
      {/* Screen Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-urip-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Executive Analytics & Accuracy Scorecards
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono">
                  {currentCity.name}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Model validation metrics, multi-signal correlation matrices, and 365-day longitudinal incident patterns
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-urip-border rounded-lg p-1 text-xs font-mono">
            {(['30d', '90d', '1y'] as const).map(tr => (
              <button
                key={tr}
                onClick={() => setTimeRange(tr)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === tr ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tr.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownloadPDFReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-colors shadow-md"
          >
            <FileDown className="w-4 h-4" />
            Export Executive PDF
          </button>
        </div>
      </div>

      {/* KPI Cards (Accuracy Targets from Blueprint Page 7 & 17) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">High-Risk Precision</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">86.4%</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">+2.1%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target: ≥85.0% (Met)</span>
        </div>

        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Major Incident Recall</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-cyan-400 font-mono">91.2%</span>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">+3.4%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target: ≥90.0% (Met)</span>
        </div>

        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">False Alert Rate</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-amber-400 font-mono">7.8%</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">-1.9%</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target: &lt;10.0% (Met)</span>
        </div>

        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Mean Time to Alert</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-white font-mono">1.8 min</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">-24s</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Target: &lt;3.0 min (Met)</span>
        </div>

        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Response Time Cut</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-purple-400 font-mono">-22.4%</span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">YoY</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Pre-positioning gain</span>
        </div>

        <div className="bg-urip-card border border-urip-border rounded-xl p-3.5 space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Model Uptime SLA</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-emerald-400 font-mono">99.98%</span>
            <span className="text-[10px] text-slate-400 font-mono">4 9s</span>
          </div>
          <span className="text-[10px] text-slate-500 block">Sub-100ms inference</span>
        </div>
      </div>

      {/* Two-Column Section: Top 10 Risk Sectors + Multi-Signal Correlation Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top 10 Risk Sectors */}
        <div className="lg:col-span-5 bg-urip-card border border-urip-border rounded-xl p-5 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Top 10 High-Risk Hex Sectors
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">5-Year Weight</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {top10Zones.map((zone, rank) => {
              const colors = getRiskColor(zone.overallRisk);
              return (
                <div
                  key={zone.id}
                  onClick={() => {
                    setSelectedCell(zone);
                    setActiveScreen('command_center');
                  }}
                  className="p-2.5 rounded-lg bg-urip-dark/80 hover:bg-urip-panel border border-urip-border flex items-center justify-between cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded bg-slate-800 text-slate-300 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                      #{rank + 1}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {zone.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {zone.district} • {zone.liveSensors.trafficSpeedKmh} km/h • {zone.breakdown.accidentProbability}% Crash
                      </div>
                    </div>
                  </div>
                  <HexRiskBadge score={zone.overallRisk} size="sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Multi-Signal Correlation Explorer */}
        <div className="lg:col-span-7 bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-urip-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Interactive Correlation Explorer
                </h3>
              </div>
              
              {/* Correlation Selector */}
              <select
                value={selectedCorrelationKey}
                onChange={e => setSelectedCorrelationKey(e.target.value as keyof typeof CORRELATION_DATASETS)}
                className="px-3 py-1 rounded-lg bg-slate-900 border border-urip-border text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="rain_vs_crashes">Rainfall vs. Collision Probability</option>
                <option value="aqi_vs_speed">PM2.5 Pollution vs. Traffic Congestion</option>
                <option value="darkness_vs_fatalities">Sun Elevation vs. Fatality Multiplier</option>
                <option value="junction_vs_risk">Junction Complexity vs. Conflicts</option>
              </select>
            </div>

            {/* Selected Dataset Summary */}
            <div className="mt-3 flex items-center justify-between text-xs bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="font-semibold text-white">{correlationData.title}</span>
                <p className="text-[11px] text-slate-400 mt-0.5">{correlationData.description}</p>
              </div>
              <div className="text-right shrink-0 pl-4">
                <span className="text-[10px] text-slate-400 font-mono block">Pearson (r)</span>
                <span className="text-base font-bold font-mono text-cyan-400">r = {correlationData.rValue}</span>
              </div>
            </div>

            {/* Scatter & Trend Visualizer */}
            <div className="mt-4 h-48 bg-urip-darkest/90 rounded-lg border border-urip-border p-4 relative flex items-end justify-between">
              {correlationData.points.map((pt, i) => {
                const heightPercent = (pt.y / Math.max(...correlationData.points.map(p => p.y))) * 80 + 10;
                return (
                  <div key={i} className="flex flex-col items-center gap-1 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-10 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl border border-cyan-500/40 z-20 whitespace-nowrap">
                      <span>{pt.label}</span>
                      <span className="text-cyan-300">X: {pt.x} → Y: {pt.y}</span>
                    </div>

                    {/* Dot */}
                    <div
                      className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.6)] group-hover:scale-125 transition-transform"
                      style={{ marginBottom: `${heightPercent}px` }}
                    />
                    
                    <span className="text-[9px] font-mono text-slate-400 truncate max-w-[50px]">
                      {pt.x}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-urip-border/40">
            <span>X-Axis: {correlationData.xLabel}</span>
            <span>Y-Axis: {correlationData.yLabel}</span>
          </div>
        </div>
      </div>

      {/* 365-Day Annual Risk Heatmap Matrix (Blueprint Page 11) */}
      <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-urip-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                365-Day Longitudinal Risk Matrix (GitHub-Style Calendar)
              </h3>
            </div>
            <p className="text-xs text-slate-400">Daily historical risk severity over 52 weeks</p>
          </div>

          {selectedCalendarDay && (
            <div className="text-xs font-mono bg-slate-900 px-3 py-1 rounded border border-urip-border text-slate-200">
              <strong className="text-cyan-300">{selectedCalendarDay.date}</strong>: Risk Score {selectedCalendarDay.risk}/100 • {selectedCalendarDay.incidents} incidents ({selectedCalendarDay.weather})
            </div>
          )}
        </div>

        {/* 52-Week Grid */}
        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[750px]">
            {annualCalendar.map((day, idx) => {
              const colors = getRiskColor(day.risk);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedCalendarDay(day)}
                  className="w-3.5 h-3.5 rounded-sm cursor-pointer transition-transform hover:scale-125 relative group"
                  style={{ backgroundColor: colors.hex }}
                  title={`${day.date}: Risk ${day.risk}/100 (${day.weather})`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-urip-border/40">
          <span>52 Weeks (Jan 1 → Dec 31)</span>
          <div className="flex items-center gap-2">
            <span>Low (Green)</span>
            <div className="w-3 h-3 rounded bg-emerald-600" />
            <div className="w-3 h-3 rounded bg-yellow-500" />
            <div className="w-3 h-3 rounded bg-orange-500" />
            <div className="w-3 h-3 rounded bg-red-600" />
            <span>Critical (Red)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
