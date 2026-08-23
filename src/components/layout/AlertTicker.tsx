import React from 'react';
import { AlertCircle, AlertTriangle, ArrowRight, Bell, Shield } from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { SlaCountdown } from '../common/SlaCountdown';
import { getRiskColor } from '../common/HexRiskBadge';

export const AlertTicker: React.FC = () => {
  const { alerts, setActiveScreen, setSelectedCell, hexCells } = useRisk();

  const activeAlerts = alerts.filter(a => a.status === 'new' || a.status === 'assigned' || a.status === 'in_progress');

  if (activeAlerts.length === 0) {
    return (
      <div className="bg-urip-darkest/95 border-t border-urip-border py-1.5 px-4 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>ALL OPERATIONAL SECTORS NOMINAL — NO ACTIVE CRITICAL ESCALATIONS</span>
        </div>
        <span className="text-[11px] text-slate-500">Live Ingestion Rate: 48.2k events/sec</span>
      </div>
    );
  }

  return (
    <div className="bg-urip-darkest border-t border-urip-border py-1.5 px-3 flex items-center gap-3 overflow-hidden select-none z-30">
      {/* Ticker Header */}
      <div className="flex items-center gap-2 bg-red-950/80 border border-red-500/50 px-2.5 py-1 rounded text-red-300 text-xs font-mono font-bold shrink-0 animate-pulse">
        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
        <span>LIVE ALERTS ({activeAlerts.length})</span>
      </div>

      {/* Horizontal scrolling stream */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5 flex-1">
        {activeAlerts.map(alert => {
          const colors = getRiskColor(alert.severity === 'critical' ? 90 : alert.severity === 'high' ? 75 : 50);
          return (
            <div
              key={alert.id}
              onClick={() => {
                const target = hexCells.find(c => c.id === alert.cellId);
                if (target) setSelectedCell(target);
                setActiveScreen('alert_management');
              }}
              className="flex items-center gap-2.5 px-3 py-1 rounded-md bg-urip-card hover:bg-urip-panel border border-urip-border hover:border-cyan-500/40 cursor-pointer shrink-0 transition-all text-xs group"
            >
              <span className={`w-2 h-2 rounded-full ${alert.severity === 'critical' ? 'bg-red-500 animate-ping' : 'bg-amber-500'}`} />
              <span className="font-mono text-cyan-300 font-semibold">{alert.id}</span>
              <span className="text-slate-200 group-hover:text-white font-medium max-w-[280px] truncate">
                {alert.title}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-800 px-1.5 py-0.5 rounded">
                {alert.district}
              </span>
              <SlaCountdown seconds={alert.slaRemainingSec} status={alert.status} />
              <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 transition-colors ml-1" />
            </div>
          );
        })}
      </div>

      {/* Quick View All */}
      <button
        onClick={() => setActiveScreen('alert_management')}
        className="hidden md:flex items-center gap-1 text-xs font-mono font-semibold text-cyan-400 hover:text-cyan-300 shrink-0 px-2 py-1 rounded hover:bg-cyan-950/40"
      >
        <span>MANAGE</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
