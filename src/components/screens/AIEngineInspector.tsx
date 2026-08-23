import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  Activity, 
  RotateCw, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  Database, 
  Code2, 
  Layers, 
  GitBranch,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

export const AIEngineInspector: React.FC = () => {
  const [retrainingState, setRetrainingState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [feedbackCount, setFeedbackCount] = useState<number>(142);
  const [lastFeedback, setLastFeedback] = useState<string | null>(null);

  const handleRetrainTrigger = () => {
    setRetrainingState('running');
    setTimeout(() => {
      setRetrainingState('completed');
      setTimeout(() => setRetrainingState('idle'), 3500);
    }, 2000);
  };

  const handleOperatorFeedback = (type: 'positive' | 'negative') => {
    setFeedbackCount(prev => prev + 1);
    setLastFeedback(type === 'positive' ? 'Logged Verified Positive' : 'Logged False Positive Correction');
    setTimeout(() => setLastFeedback(null), 3000);
  };

  const specialistModels = [
    {
      task: 'Traffic Accident Probability',
      model: 'XGBoost + LightGBM Ensemble',
      metric: '86.4% Precision (F1: 0.88)',
      latency: '24 ms',
      status: 'Active (v4.2)'
    },
    {
      task: 'Pedestrian & Micro-Mobility Conflict',
      model: 'Gradient Boosted Decision Trees',
      metric: '89.1% Recall',
      latency: '18 ms',
      status: 'Active (v3.8)'
    },
    {
      task: 'Road Flash Flooding Inundation',
      model: 'Random Forest + Hydro Physics ODE',
      metric: '2.1h Lead Time Accuracy',
      latency: '45 ms',
      status: 'Active (v2.9)'
    },
    {
      task: 'Air Quality (AQI / PM2.5) Spikes',
      model: '2-Layer Bidirectional LSTM',
      metric: '±6.2 AQI Margin',
      latency: '62 ms',
      status: 'Active (v5.0)'
    },
    {
      task: 'Emergency Dispatch Surge Demand',
      model: 'ARIMA + Poisson ML Regressor',
      metric: '88.5% Call Volume Fit',
      latency: '31 ms',
      status: 'Active (v3.1)'
    },
    {
      task: 'Optical Crowd Flow & Surge',
      model: 'Spatio-Temporal Graph Neural Network (GNN)',
      metric: '0.92 IoU Hotspot Accuracy',
      latency: '78 ms',
      status: 'Active (v1.6)'
    }
  ];

  const globalShapFeatures = [
    { name: 'Precipitation Intensity (mm/hr)', impact: 34, cat: 'Environmental' },
    { name: 'Junction Complexity & Conflict Rays', impact: 26, cat: 'Spatial' },
    { name: 'Cyclical Time of Day (Sin/Cos Hour)', impact: 22, cat: 'Temporal' },
    { name: 'Sun Angle / Ambient Darkness', impact: 19, cat: 'Environmental' },
    { name: '5-Year Historical Accident Kernel Density', impact: 17, cat: 'Spatial' },
    { name: 'Curvature & Road Slope Gradient', impact: 15, cat: 'Infrastructure' },
    { name: 'Active Public Stadium / Concert Distance', impact: 13, cat: 'Temporal' },
    { name: 'Pavement Friction & Spalling Index', impact: 11, cat: 'Infrastructure' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-104px)] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-urip-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                AI & Machine Learning Engine Architecture
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-mono">
                  SHAP Explainability Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Multi-model ensemble pipeline, Platt probability calibration, and continuous operator feedback flywheel
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRetrainTrigger}
            disabled={retrainingState === 'running'}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
          >
            <RotateCw className={`w-4 h-4 ${retrainingState === 'running' ? 'animate-spin' : ''}`} />
            {retrainingState === 'running' ? 'Retraining Pipeline...' : retrainingState === 'completed' ? '✓ Retrained (v4.3)' : 'Trigger Model Retraining'}
          </button>
        </div>
      </div>

      {/* Retraining Notification Banner */}
      {retrainingState === 'completed' && (
        <div className="p-4 rounded-xl bg-purple-950/80 border border-purple-500 text-purple-200 text-xs font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Automated retraining run complete. 142 new verified operator labels ingested. F1-Score increased by +0.014.</span>
          </div>
          <span className="text-[10px] text-purple-400">MLflow Run #8904</span>
        </div>
      )}

      {/* Specialist Model Grid (Blueprint Page 6) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Specialist Micro-Prediction Models
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {specialistModels.map((m, i) => (
            <div key={i} className="bg-urip-card border border-urip-border rounded-xl p-4 space-y-2 hover:border-cyan-500/40 transition-all">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold">{m.task}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/30">
                  {m.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">{m.model}</h4>
              <div className="pt-2 border-t border-urip-border/40 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 text-[11px]">{m.metric}</span>
                <span className="text-cyan-300 text-[11px]">&lt; {m.latency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Diagnostics: SHAP Global Feature Importance & Confusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* SHAP Global Importance Ranking */}
        <div className="lg:col-span-7 bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Global SHAP Feature Importance Ranking
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Mean |SHAP Value|</span>
          </div>

          <div className="space-y-3">
            {globalShapFeatures.map((f, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-200">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">{f.cat}</span>
                    <span className="text-cyan-400 font-bold">+{f.impact}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                    style={{ width: `${(f.impact / 34) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confusion Matrix & Calibration Curve */}
        <div className="lg:col-span-5 bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Confusion Matrix & ROC Area
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">ROC-AUC: 0.912</span>
            </div>

            {/* 2x2 Matrix Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs font-mono">
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">True Positive (TP)</span>
                <span className="text-lg font-bold text-emerald-400">1,842</span>
                <span className="text-[10px] text-slate-400 block">Predicted & Occurred</span>
              </div>

              <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">False Positive (FP)</span>
                <span className="text-lg font-bold text-amber-400">156</span>
                <span className="text-[10px] text-slate-400 block">False Alert (7.8%)</span>
              </div>

              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">False Negative (FN)</span>
                <span className="text-lg font-bold text-red-400">178</span>
                <span className="text-[10px] text-slate-400 block">Missed Incident (8.8%)</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block uppercase">True Negative (TN)</span>
                <span className="text-lg font-bold text-slate-200">18,490</span>
                <span className="text-[10px] text-slate-400 block">Nominal State</span>
              </div>
            </div>
          </div>

          {/* Platt Calibration Banner */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1 font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Platt Scaling Calibration</span>
              <span className="text-cyan-300">Brier Score: 0.042</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Raw Sigmoid logits scaled into true empirical frequency probabilities.
            </p>
          </div>
        </div>
      </div>

      {/* Accuracy Flywheel & Operator Feedback Loop (Blueprint Page 16) */}
      <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-urip-border/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Operator Feedback Loop & The Accuracy Flywheel
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Human-in-the-loop dispatch validation labels automatically fed back into next scheduled retraining checkpoint
            </p>
          </div>

          <div className="text-xs font-mono text-cyan-300 bg-cyan-950 px-3 py-1 rounded border border-cyan-500/40">
            {feedbackCount} Verified Operational Labels
          </div>
        </div>

        {lastFeedback && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-mono animate-in fade-in flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{lastFeedback} — Buffered in ML training queue</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Simulate Ground-Truth Operator Verification:</span>
            <p className="text-slate-400 text-[11px]">Did the predicted incident occur in the active 15-minute window?</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleOperatorFeedback('positive')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-semibold transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              Confirm Incident (True Positive)
            </button>
            <button
              onClick={() => handleOperatorFeedback('negative')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-mono font-semibold transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              Flag False Positive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
