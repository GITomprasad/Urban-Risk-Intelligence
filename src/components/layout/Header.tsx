import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Clock, 
  UserCheck, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { CITIES } from '../../data/cities';
import { TimeWindow, UserRole } from '../../types';
import { getRiskColor } from '../common/HexRiskBadge';

interface HeaderProps {
  onOpenScenarioModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenScenarioModal }) => {
  const {
    currentCity,
    setCity,
    timeWindow,
    setTimeWindow,
    userRole,
    setUserRole,
    audioAlertsEnabled,
    setAudioAlertsEnabled,
    isSimulating,
    setIsSimulating,
    cityRiskIndex,
    unreadAlertCount,
    activeScenario,
    resetScenario
  } = useRisk();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeWindows: { id: TimeWindow; label: string; desc: string }[] = [
    { id: 'now', label: 'NOW', desc: 'Real-time telemetry' },
    { id: '+15m', label: '+15m', desc: 'Immediate hotspot' },
    { id: '+1hr', label: '+1h', desc: 'Tactical dispatch' },
    { id: '+6hr', label: '+6h', desc: 'Shift planning' },
    { id: '+24hr', label: '+24h', desc: 'Strategic diurnal' }
  ];

  const roles: { id: UserRole; label: string; clearance: string }[] = [
    { id: 'super_admin', label: 'Super Admin', clearance: 'Full Access (L5)' },
    { id: 'city_admin', label: 'City Admin', clearance: 'Departmental (L4)' },
    { id: 'analyst', label: 'Risk Analyst', clearance: 'Data & Models (L3)' },
    { id: 'responder', label: 'EMS / Police Dispatcher', clearance: 'Tactical (L2)' },
    { id: 'viewer', label: 'Public Safety Viewer', clearance: 'Read Only (L1)' }
  ];

  const riskColor = getRiskColor(cityRiskIndex);

  return (
    <header className="bg-urip-dark/95 border-b border-urip-border sticky top-0 z-40 backdrop-blur-md px-4 py-2.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Branding & City Selector */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-urip-navy to-slate-900 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
              <ShieldAlert className="w-5 h-5 text-cyan-400 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-urip-darkest animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-wider text-white font-mono flex items-center gap-1.5">
                  URIP <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-mono">v1.0 AI</span>
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Urban Risk Intelligence Platform</p>
            </div>
          </div>

          <div className="h-6 w-px bg-urip-border hidden md:block" />

          {/* City Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-urip-card hover:bg-urip-panel border border-urip-border text-sm font-semibold text-slate-100 transition-all hover:border-cyan-500/50 group"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>{currentCity.name}</span>
              <span className="text-xs text-slate-400 font-mono">({currentCity.country})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {isCityDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-60 rounded-lg bg-urip-card border border-urip-border shadow-2xl z-50 py-1.5 backdrop-blur-xl">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-urip-border/50">
                  Select Monitored Metro
                </div>
                {CITIES.map(city => (
                  <button
                    key={city.id}
                    onClick={() => {
                      setCity(city.id);
                      setIsCityDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors hover:bg-urip-panel ${
                      city.id === currentCity.id ? 'bg-cyan-950/50 text-cyan-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-100">{city.name}</div>
                      <div className="text-[10px] text-slate-400">{city.districts.length} risk districts • {city.weatherCondition}</div>
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-300">{city.cityRiskIndex}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Time Horizon Switcher */}
        <div className="hidden lg:flex items-center gap-1 bg-urip-darkest/90 p-1 rounded-lg border border-urip-border/80">
          <div className="flex items-center gap-1 px-2 text-[11px] font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>HORIZON:</span>
          </div>
          {timeWindows.map(tw => (
            <button
              key={tw.id}
              onClick={() => setTimeWindow(tw.id)}
              title={tw.desc}
              className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all ${
                timeWindow === tw.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-urip-panel'
              }`}
            >
              {tw.label}
            </button>
          ))}
        </div>

        {/* Right: City Risk Widget, Scenario Simulation, Audio, Role & Clock */}
        <div className="flex items-center gap-2.5">
          {/* City Risk Score Widget */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-md border ${riskColor.bg} ${riskColor.border} backdrop-blur-md`}>
            <Activity className="w-3.5 h-3.5 text-slate-300" />
            <div className="text-left">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block leading-none">City Risk</span>
              <span className={`text-sm font-bold font-mono ${riskColor.text} flex items-center gap-1`}>
                {cityRiskIndex}/100
                {currentCity.riskTrend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-red-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-emerald-400" />
                )}
              </span>
            </div>
          </div>

          {/* Active Scenario Indicator / Scenario Launcher */}
          {activeScenario ? (
            <div className="flex items-center gap-2 px-2.5 py-1 bg-red-950/80 border border-red-500/80 rounded-md animate-pulse text-xs font-semibold text-red-300">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden xl:inline truncate max-w-[130px]">{activeScenario.name}</span>
              <button
                onClick={resetScenario}
                className="text-[10px] bg-red-500 hover:bg-red-600 text-white font-mono px-1.5 py-0.5 rounded transition-colors"
                title="Reset simulation scenario"
              >
                CLEAR
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenScenarioModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold font-mono transition-all shadow-[0_0_10px_rgba(0,229,255,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Simulate Scenario</span>
            </button>
          )}

          {/* Audio Alert Toggle */}
          <button
            onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
            className={`p-2 rounded-md border transition-colors ${
              audioAlertsEnabled
                ? 'bg-urip-card border-urip-border text-cyan-400 hover:bg-urip-panel'
                : 'bg-urip-darkest border-urip-border/50 text-slate-500 hover:text-slate-400'
            }`}
            title={audioAlertsEnabled ? 'Audio Alerts Enabled' : 'Audio Alerts Muted'}
          >
            {audioAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Pause / Resume Live Engine */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`p-2 rounded-md border transition-colors ${
              isSimulating
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400 hover:bg-emerald-950/60'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-400 hover:bg-amber-950/60'
            }`}
            title={isSimulating ? 'Pause Real-Time Stream' : 'Resume Real-Time Stream'}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* User Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-urip-card hover:bg-urip-panel border border-urip-border text-xs font-mono font-medium text-slate-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">{roles.find(r => r.id === userRole)?.label}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-56 rounded-lg bg-urip-card border border-urip-border shadow-2xl z-50 py-1.5 backdrop-blur-xl">
                <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-urip-border/50">
                  Switch Operational Role
                </div>
                {roles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setUserRole(r.id);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-urip-panel ${
                      userRole === r.id ? 'bg-cyan-950/60 text-cyan-300 font-semibold' : 'text-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-100">{r.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{r.clearance}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Live UTC Clock */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded bg-urip-darkest border border-urip-border/60 text-xs font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{currentTime || '00:00:00'} UTC</span>
          </div>
        </div>
      </div>
    </header>
  );
};
