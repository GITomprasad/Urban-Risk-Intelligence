import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface SlaCountdownProps {
  seconds: number;
  status: string;
}

export const SlaCountdown: React.FC<SlaCountdownProps> = ({ seconds, status }) => {
  if (status === 'resolved' || status === 'closed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded font-mono">
        ✓ SLA MET
      </span>
    );
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const isCritical = seconds < 60;
  const isWarning = seconds < 180;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded font-mono text-xs font-semibold border ${
        isCritical
          ? 'bg-red-950/80 border-red-500 text-red-300 animate-pulse'
          : isWarning
          ? 'bg-amber-950/70 border-amber-500 text-amber-300'
          : 'bg-slate-900/80 border-slate-700 text-slate-300'
      }`}
      title="Time remaining before automated SLA escalation"
    >
      {isCritical ? <AlertCircle className="w-3.5 h-3.5 text-red-400" /> : <Clock className="w-3.5 h-3.5 opacity-70" />}
      <span>{formatted}</span>
      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">SLA</span>
    </div>
  );
};
