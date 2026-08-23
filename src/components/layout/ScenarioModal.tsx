import React from 'react';
import { 
  X, 
  CloudRain, 
  Users, 
  AlertTriangle, 
  WifiOff, 
  Sparkles, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { SIMULATION_SCENARIOS } from '../../data/mockAlerts';
import { SimulationScenario } from '../../types';

interface ScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioModal: React.FC<ScenarioModalProps> = ({ isOpen, onClose }) => {
  const { triggerScenario, activeScenario, resetScenario } = useRisk();

  if (!isOpen) return null;

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain':
        return <CloudRain className="w-6 h-6 text-cyan-400" />;
      case 'Users':
        return <Users className="w-6 h-6 text-purple-400" />;
      case 'AlertTriangle':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'WifiOff':
        return <WifiOff className="w-6 h-6 text-amber-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  const handleSelectScenario = (sc: SimulationScenario) => {
    triggerScenario(sc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-urip-card border border-urip-border rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-urip-panel px-6 py-4 border-b border-urip-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">Urban Risk Scenario Simulator</h3>
              <p className="text-xs text-slate-400">Inject synthetic stress scenarios to evaluate real-time multi-signal response</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {activeScenario && (
            <div className="p-4 rounded-lg bg-red-950/60 border border-red-500/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="text-xs font-mono text-red-300 uppercase font-bold">Currently Active Scenario</div>
                  <div className="text-sm font-semibold text-white">{activeScenario.name}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  resetScenario();
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-semibold transition-colors"
              >
                End & Reset
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {SIMULATION_SCENARIOS.map(sc => {
              const isCurrent = activeScenario?.id === sc.id;
              return (
                <div
                  key={sc.id}
                  onClick={() => handleSelectScenario(sc)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-urip-dark/80 border-urip-border hover:border-cyan-500/40 hover:bg-urip-panel/90 text-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60">
                        {getScenarioIcon(sc.icon)}
                      </div>
                      {isCurrent ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                          <CheckCircle className="w-3 h-3 text-cyan-400" /> ACTIVE
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded">
                          {sc.targetCategory.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug">{sc.name}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{sc.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-urip-border/40 flex items-center justify-between text-xs text-cyan-400 font-mono font-semibold">
                    <span>Inject Scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-urip-panel px-6 py-3 border-t border-urip-border flex items-center justify-between text-xs font-mono text-slate-400">
          <span>Simulation triggers instant H3 risk recalculation & alerts</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
