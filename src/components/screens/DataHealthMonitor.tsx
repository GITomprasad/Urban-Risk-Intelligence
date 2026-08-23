import React, { useState } from 'react';
import { 
  Radio, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Upload, 
  FileText, 
  RefreshCw, 
  Cpu, 
  HardDrive, 
  Activity, 
  ShieldCheck,
  ZapOff,
  Server
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { DataFeedStatus } from '../../types';

export const DataHealthMonitor: React.FC = () => {
  const { 
    dataFeeds, 
    toggleFeedOutage, 
    uploadCustomDataset, 
    uploadedDatasets 
  } = useRisk();

  const [dragOver, setDragOver] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleSimulateDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      uploadCustomDataset(file.name, Math.floor(1200 + Math.random() * 8500));
      setUploadSuccess(`Ingested & Validated: ${file.name} (Schema Passed WGS84)`);
      setTimeout(() => setUploadSuccess(null), 4000);
    }
  };

  const handleManualUploadClick = () => {
    uploadCustomDataset(`sensor_payload_${Date.now().toString().slice(-4)}.csv`, 4250);
    setUploadSuccess(`Ingested & Validated: sensor_payload.csv (Schema Passed WGS84)`);
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  const getStatusBadge = (status: DataFeedStatus['status']) => {
    switch (status) {
      case 'online':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ONLINE
          </span>
        );
      case 'degraded':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            DEGRADED
          </span>
        );
      case 'stale':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-400 bg-yellow-950/80 border border-yellow-500/40 px-2.5 py-0.5 rounded-full">
            STALE
          </span>
        );
      case 'offline':
        return (
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-400 bg-red-950/80 border border-red-500/40 px-2.5 py-0.5 rounded-full animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            OUTAGE
          </span>
        );
    }
  };

  const totalIngestionRate = dataFeeds
    .filter(f => f.status === 'online')
    .reduce((sum, f) => sum + f.recordsIngestedPerMin, 0);

  const hasOutage = dataFeeds.some(f => f.status === 'offline');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-104px)] overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-urip-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Data Stream Health & Ingestion Pipeline
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono">
                  {totalIngestionRate.toLocaleString()} records/min
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live monitoring for 7 multi-source city telemetry streams with schema validation and automated fallback triggers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-slate-400 block">Ingestion Cluster</span>
            <span className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1.5 justify-end">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              Kafka + Flink Stream Active
            </span>
          </div>
        </div>
      </div>

      {/* Model Degradation Notice if Outage */}
      {hasOutage && (
        <div className="bg-red-950/80 border border-red-500 p-4 rounded-xl flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-3 text-red-200 text-xs">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <strong className="text-red-100 uppercase font-mono block">AUTOMATIC MODEL DEGRADATION ACTIVE:</strong>
              One or more primary sensor feeds are offline. XGBoost fusion engine has fallen back to historical spatial priors. Confidence metric scaled down by 18%.
            </div>
          </div>
        </div>
      )}

      {/* Feed Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataFeeds.map(feed => {
          const isOffline = feed.status === 'offline';
          return (
            <div
              key={feed.id}
              className={`bg-urip-card border rounded-xl p-4.5 space-y-3.5 transition-all ${
                isOffline ? 'border-red-500/60 bg-red-950/20' : 'border-urip-border hover:border-cyan-500/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 block">{feed.category} Feed</span>
                  <h4 className="text-sm font-bold text-white leading-snug">{feed.name}</h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">{feed.source}</p>
                </div>
                {getStatusBadge(feed.status)}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-urip-dark border border-urip-border">
                  <span className="text-[10px] text-slate-400 block font-sans">Freshness</span>
                  <span className="font-bold text-slate-200">{feed.freshnessSeconds}s ago</span>
                </div>

                <div className="p-2 rounded bg-urip-dark border border-urip-border">
                  <span className="text-[10px] text-slate-400 block font-sans">Grid Coverage</span>
                  <span className="font-bold text-cyan-300">{feed.completenessPercent}%</span>
                </div>

                <div className="p-2 rounded bg-urip-dark border border-urip-border">
                  <span className="text-[10px] text-slate-400 block font-sans">API Latency</span>
                  <span className="font-bold text-slate-200">{feed.latencyMs} ms</span>
                </div>

                <div className="p-2 rounded bg-urip-dark border border-urip-border">
                  <span className="text-[10px] text-slate-400 block font-sans">Throughput</span>
                  <span className="font-bold text-emerald-400">{feed.recordsIngestedPerMin.toLocaleString()} /m</span>
                </div>
              </div>

              {/* 10-Day Historical Uptime Bars */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>30-Day SLA: {feed.uptime30Days}%</span>
                  <span>10-Day Uptime</span>
                </div>
                <div className="flex gap-1 h-3">
                  {feed.historicalUptime.map((val, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${val >= 100 ? 'bg-emerald-500' : val >= 99 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      title={`Day -${10 - i}: ${val}%`}
                    />
                  ))}
                </div>
              </div>

              {/* Chaos Engineering Outage Toggle */}
              <div className="pt-2 border-t border-urip-border/50 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">Fault Injection Test</span>
                <button
                  onClick={() => toggleFeedOutage(feed.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold transition-colors ${
                    isOffline
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-red-300'
                  }`}
                >
                  {isOffline ? 'Restore Feed' : 'Inject Outage'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Data Upload & Schema Ingestion Zone (Blueprint Page 11 & 12) */}
      <div className="bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-urip-border/60 pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Supplemental Dataset Ingestion & Validation Zone
              </h3>
              <p className="text-xs text-slate-400">Drop custom CSV / GeoJSON files (WGS84 reprojected, GPS-tagged accident records, sensor surveys)</p>
            </div>
          </div>
          <span className="text-xs font-mono text-cyan-400">GDPR & Privacy Guardrail Enforced</span>
        </div>

        {uploadSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{uploadSuccess}</span>
          </div>
        )}

        {/* Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleSimulateDrop}
          onClick={handleManualUploadClick}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-cyan-400 bg-cyan-950/30'
              : 'border-urip-border hover:border-cyan-500/50 bg-slate-900/50 hover:bg-slate-900/80'
          }`}
        >
          <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2 animate-bounce" />
          <h4 className="text-sm font-semibold text-white">Click or drag & drop supplemental city datasets</h4>
          <p className="text-xs text-slate-400 mt-1">Accepts CSV, Parquet, GeoJSON with columns: <code>latitude, longitude, timestamp, incident_code</code></p>
          <span className="inline-block mt-3 px-3 py-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono rounded">
            Click to Ingest Sample Data
          </span>
        </div>

        {/* Uploaded History List */}
        {uploadedDatasets.length > 0 && (
          <div className="space-y-2 pt-2">
            <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Recently Ingested Custom Batches</h5>
            <div className="space-y-1.5">
              {uploadedDatasets.map((ds, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-2 text-slate-200">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{ds.name}</span>
                  </div>
                  <div className="text-slate-400">
                    <span className="text-emerald-400 font-bold">{ds.records.toLocaleString()} records</span> • Ingested at {ds.timestamp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
