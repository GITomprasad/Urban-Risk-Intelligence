import React from 'react';
import { Sparkles, MapPin, Clock, CloudRain, Construction } from 'lucide-react';

interface ShapFactor {
  factor: string;
  category: 'temporal' | 'spatial' | 'environmental' | 'infrastructure';
  impact: number;
  description: string;
}

interface ShapBarChartProps {
  factors: ShapFactor[];
  confidenceScore: number;
}

export const ShapBarChart: React.FC<ShapBarChartProps> = ({ factors, confidenceScore }) => {
  const getCategoryIcon = (category: ShapFactor['category']) => {
    switch (category) {
      case 'spatial':
        return <MapPin className="w-3.5 h-3.5 text-blue-400" />;
      case 'temporal':
        return <Clock className="w-3.5 h-3.5 text-purple-400" />;
      case 'environmental':
        return <CloudRain className="w-3.5 h-3.5 text-cyan-400" />;
      case 'infrastructure':
        return <Construction className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getCategoryBadge = (category: ShapFactor['category']) => {
    switch (category) {
      case 'spatial':
        return 'bg-blue-950/60 border-blue-500/30 text-blue-300';
      case 'temporal':
        return 'bg-purple-950/60 border-purple-500/30 text-purple-300';
      case 'environmental':
        return 'bg-cyan-950/60 border-cyan-500/30 text-cyan-300';
      case 'infrastructure':
        return 'bg-amber-950/60 border-amber-500/30 text-amber-300';
    }
  };

  return (
    <div className="bg-urip-dark/90 border border-urip-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between border-b border-urip-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide">SHAP Factor Attribution</h4>
            <p className="text-[11px] text-slate-400">Explainable AI feature weight breakdown</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-mono">Model Confidence</span>
          <span className="text-sm font-bold text-cyan-400 font-mono">{confidenceScore}%</span>
        </div>
      </div>

      <div className="space-y-3 pt-1">
        {factors.map((item, index) => {
          const isPositive = item.impact >= 0;
          return (
            <div key={index} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {getCategoryIcon(item.category)}
                  <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {item.factor}
                  </span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border font-mono ${getCategoryBadge(item.category)}`}>
                    {item.category}
                  </span>
                </div>
                <span className={`font-mono font-bold ${isPositive ? 'text-red-400' : 'text-emerald-400'}`}>
                  {isPositive ? `+${item.impact}%` : `${item.impact}%`}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.category === 'spatial' ? 'bg-blue-500' :
                    item.category === 'environmental' ? 'bg-cyan-500' :
                    item.category === 'infrastructure' ? 'bg-amber-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(item.impact) * 2)}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed pl-5">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-urip-border/40 font-mono">
        <span>XGBoost + LightGBM Ensemble</span>
        <span className="text-slate-400">Additive Tree SHAP v0.42</span>
      </div>
    </div>
  );
};
