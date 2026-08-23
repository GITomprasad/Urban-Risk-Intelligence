import React, { useState } from 'react';
import { 
  Bell, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  UserPlus, 
  RotateCcw, 
  Search, 
  ChevronRight, 
  ShieldAlert, 
  Flame, 
  CloudRain, 
  Users, 
  Activity, 
  ExternalLink,
  CheckCheck,
  FileText,
  UserCheck
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { AlertItem, AlertStatus, RiskSeverity } from '../../types';
import { SlaCountdown } from '../common/SlaCountdown';
import { HexRiskBadge } from '../common/HexRiskBadge';

export const AlertManagement: React.FC = () => {
  const { 
    alerts, 
    updateAlertStatus, 
    assignAlertOperator, 
    undoLastAction, 
    canUndo,
    setSelectedCell,
    hexCells,
    setActiveScreen
  } = useRisk();

  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(alerts[0] || null);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [operatorInput, setOperatorInput] = useState<string>('');
  const [actionNotes, setActionNotes] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    const matchSev = filterSeverity === 'all' || a.severity === filterSeverity;
    const matchStat = filterStatus === 'all' || a.status === filterStatus;
    const matchCat = filterCategory === 'all' || a.category === filterCategory;
    const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        a.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSev && matchStat && matchCat && matchSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'traffic_collision': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'flash_flood': return <CloudRain className="w-4 h-4 text-cyan-400" />;
      case 'crowd_surge': return <Users className="w-4 h-4 text-purple-400" />;
      case 'air_quality_spike': return <Activity className="w-4 h-4 text-amber-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getStatusBadge = (status: AlertStatus) => {
    switch (status) {
      case 'new': return 'bg-red-950/80 border-red-500/60 text-red-300 animate-pulse';
      case 'assigned': return 'bg-amber-950/80 border-amber-500/60 text-amber-300';
      case 'in_progress': return 'bg-blue-950/80 border-blue-500/60 text-blue-300';
      case 'resolved': return 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300';
      case 'closed': return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  const handleBulkAcknowledge = () => {
    alerts.filter(a => a.status === 'new').forEach(a => {
      updateAlertStatus(a.id, 'assigned', 'Bulk acknowledged by shift supervisor');
    });
  };

  const handleStatusChange = (status: AlertStatus) => {
    if (!selectedAlert) return;
    updateAlertStatus(selectedAlert.id, status, actionNotes);
    setActionNotes('');
    // update local reference
    const updated = alerts.find(a => a.id === selectedAlert.id);
    if (updated) setSelectedAlert({ ...updated, status });
  };

  const handleAssignOperator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlert || !operatorInput.trim()) return;
    assignAlertOperator(selectedAlert.id, operatorInput.trim());
    setOperatorInput('');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-104px)] overflow-y-auto">
      {/* Screen Header & Bulk / Undo Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-urip-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                Mission-Critical Alert Center
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 border border-red-500/40 text-red-300 font-mono">
                  {alerts.filter(a => a.status === 'new').length} New Unacknowledged
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                SLA-governed incident escalation pipeline with multi-signal fusion and full audit traceability
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Undo Action Button */}
          <button
            onClick={undoLastAction}
            disabled={!canUndo}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold transition-all ${
              canUndo
                ? 'bg-urip-panel hover:bg-urip-border border-cyan-500/40 text-cyan-300 cursor-pointer'
                : 'bg-urip-darkest border-urip-border/40 text-slate-600 cursor-not-allowed'
            }`}
            title="Undo last operator status transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo Action</span>
          </button>

          {/* Bulk Acknowledge */}
          <button
            onClick={handleBulkAcknowledge}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-mono font-bold transition-colors shadow-md"
          >
            <CheckCheck className="w-4 h-4" />
            Bulk Acknowledge ({alerts.filter(a => a.status === 'new').length})
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-urip-card p-3.5 rounded-xl border border-urip-border">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search ID, title, district..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity */}
        <div>
          <select
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Statuses</option>
            <option value="new">New (Unassigned)</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Risk Categories</option>
            <option value="traffic_collision">Traffic Collisions</option>
            <option value="flash_flood">Flash Floods</option>
            <option value="crowd_surge">Crowd Surges</option>
            <option value="air_quality_spike">Air Quality (AQI)</option>
            <option value="emergency_surge">Emergency Calls</option>
          </select>
        </div>
      </div>

      {/* Main Alert Layout: Master List + Deep Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Master Alert Queue (Left 6 cols) */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
            <span>SHOWING {filteredAlerts.length} OF {alerts.length} ALERTS</span>
            <span>SORT: SEVERITY + SLA DEADLINE</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredAlerts.map(alert => {
              const isSelected = selectedAlert?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-urip-panel border-cyan-500 text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                      : 'bg-urip-card hover:bg-urip-panel/70 border-urip-border text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(alert.category)}
                      <span className="font-mono text-cyan-400 font-bold text-xs">{alert.id}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {alert.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SlaCountdown seconds={alert.slaRemainingSec} status={alert.status} />
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${getStatusBadge(alert.status)}`}>
                        {alert.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-semibold text-white mt-2 leading-snug">{alert.title}</h4>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-urip-border/40 pt-2 font-mono">
                    <span>Impact: <strong className="text-slate-200">{alert.predictedImpactWindow}</strong></span>
                    <span>Confidence: <strong className="text-cyan-400">{alert.confidencePercent}%</strong></span>
                    {alert.assignedOperator && (
                      <span className="text-slate-300 flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-cyan-400" />
                        {alert.assignedOperator.split(' ')[0]}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deep Detail & Escalation Panel (Right 6 cols) */}
        {selectedAlert ? (
          <div className="lg:col-span-6 bg-urip-card border border-urip-border rounded-xl p-5 space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-urip-border pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">{selectedAlert.id}</span>
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border font-semibold ${getStatusBadge(selectedAlert.status)}`}>
                    {selectedAlert.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Created {new Date(selectedAlert.createdAt).toLocaleTimeString()}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">{selectedAlert.title}</h3>
              </div>
              <button
                onClick={() => {
                  const cell = hexCells.find(c => c.id === selectedAlert.cellId);
                  if (cell) {
                    setSelectedCell(cell);
                    setActiveScreen('command_center');
                  }
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono transition-colors shrink-0"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Locate Map</span>
              </button>
            </div>

            {/* AI Explanation Callout */}
            <div className="bg-cyan-950/40 border border-cyan-500/40 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  URIP Multi-Signal Predictive Synthesis
                </span>
                <span className="font-mono text-cyan-400 font-bold">{selectedAlert.confidencePercent}% Confidence</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedAlert.aiExplanation}</p>
            </div>

            {/* Contributing Data Signals Grid */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Fused Telemetry Signals</h5>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {selectedAlert.dataSignals.map((sig, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded border ${
                      sig.isAnomaly
                        ? 'bg-red-950/40 border-red-500/40 text-red-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block font-sans">{sig.name}</span>
                    <span className="font-bold">{sig.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended SOP Action Checklist */}
            <div className="space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400">Standard Operating Procedures (SOP)</h5>
              <div className="space-y-1.5">
                {selectedAlert.recommendedActions.map((act, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-200 p-2 rounded bg-slate-900/80 border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operator Escalation Workflow Buttons */}
            <div className="border-t border-urip-border/60 pt-3 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">OPERATOR WORKFLOW:</span>
                <span className="text-cyan-300">Assignee: {selectedAlert.assignedOperator || 'Unassigned'}</span>
              </div>

              {/* Status Transition Row */}
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleStatusChange('assigned')}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-semibold border transition-all ${
                    selectedAlert.status === 'assigned'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-semibold border transition-all ${
                    selectedAlert.status === 'in_progress'
                      ? 'bg-blue-500 text-white border-blue-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleStatusChange('resolved')}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-semibold border transition-all ${
                    selectedAlert.status === 'resolved'
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  Mark Resolved
                </button>
                <button
                  onClick={() => handleStatusChange('closed')}
                  className={`py-1.5 px-2 rounded text-xs font-mono font-semibold border transition-all ${
                    selectedAlert.status === 'closed'
                      ? 'bg-slate-700 text-white border-slate-600 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Close & Archive
                </button>
              </div>

              {/* Assign Operator Field */}
              <form onSubmit={handleAssignOperator} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Assign unit / dispatcher name..."
                  value={operatorInput}
                  onChange={e => setOperatorInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-urip-panel hover:bg-urip-border border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-colors"
                >
                  Assign
                </button>
              </form>
            </div>

            {/* Audit Trail Log */}
            <div className="border-t border-urip-border/60 pt-3 space-y-2">
              <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                Immutable Audit Trail ({selectedAlert.auditTrail.length} Events)
              </h5>
              <div className="space-y-1.5 max-h-32 overflow-y-auto text-[11px] font-mono text-slate-400">
                {selectedAlert.auditTrail.map((log, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900/60 border border-slate-800/80 space-y-0.5">
                    <div className="flex items-center justify-between text-slate-300">
                      <strong className="text-cyan-300">{log.actor}</strong>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div>{log.action}</div>
                    {log.details && <div className="text-slate-400 text-[10px]">{log.details}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-6 bg-urip-card border border-urip-border rounded-xl p-12 text-center text-slate-500 font-mono text-xs">
            Select an alert from the queue to inspect AI signals, SLA metrics, and action workflow.
          </div>
        )}
      </div>
    </div>
  );
};
