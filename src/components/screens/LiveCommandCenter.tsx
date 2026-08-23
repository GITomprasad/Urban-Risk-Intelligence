import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Eye, 
  EyeOff, 
  CloudRain, 
  Wind, 
  Video, 
  Navigation, 
  AlertTriangle, 
  Sliders, 
  Activity, 
  Flame, 
  ShieldAlert, 
  Truck, 
  Crosshair, 
  Info,
  Maximize2,
  Filter
} from 'lucide-react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useRisk } from '../../context/RiskContext';
import { H3HexCell, AlertItem } from '../../types';
import { getRiskColor, getRiskSeverity } from '../common/HexRiskBadge';
import { CellDetailDrawer } from './CellDetailDrawer';

// Fix for default Leaflet icon paths in React/Vite
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle map view updates when current city changes
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

export const LiveCommandCenter: React.FC = () => {
  const { 
    currentCity, 
    hexCells, 
    selectedCell, 
    setSelectedCell, 
    activeLayers, 
    toggleLayer, 
    alerts,
    cityRiskIndex,
    timeWindow
  } = useRisk();

  const [minRiskFilter, setMinRiskFilter] = useState<number>(0);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [gridOpacity, setGridOpacity] = useState<number>(0.65);

  const filteredHexCells = hexCells.filter(cell => {
    const matchesRisk = cell.overallRisk >= minRiskFilter;
    const matchesDistrict = selectedDistrict === 'all' || cell.district === selectedDistrict;
    return matchesRisk && matchesDistrict;
  });

  return (
    <div className="relative w-full h-[calc(100vh-104px)] flex overflow-hidden bg-urip-darkest">
      {/* Left Collapsible Layer & Filter Panel */}
      <div
        className={`bg-urip-dark/95 border-r border-urip-border backdrop-blur-xl z-20 transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'w-72' : 'w-12'
        }`}
      >
        {/* Panel Header */}
        <div className="p-3 border-b border-urip-border flex items-center justify-between">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">Map Layers & Telemetry</span>
            </div>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mx-auto text-cyan-400 p-1 hover:bg-slate-800 rounded"
              title="Open Layer Controls"
            >
              <Layers className="w-5 h-5" />
            </button>
          )}
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              title="Collapse Panel"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Panel Body */}
        {isSidebarOpen && (
          <div className="p-3 space-y-4 flex-1 overflow-y-auto">
            {/* H3 Risk Heatmap Layer Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  H3 Hex Grid (500m)
                </span>
                <button
                  onClick={() => toggleLayer('hexGrid')}
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                    activeLayers.hexGrid
                      ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  {activeLayers.hexGrid ? 'VISIBLE' : 'HIDDEN'}
                </button>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Opacity</span>
                  <span>{Math.round(gridOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.9"
                  step="0.05"
                  value={gridOpacity}
                  onChange={e => setGridOpacity(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            <div className="h-px bg-urip-border/60" />

            {/* Layer Toggles */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Sensor Overlays</span>
              
              <button
                onClick={() => toggleLayer('trafficFlow')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.trafficFlow
                    ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Navigation className="w-3.5 h-3.5 text-blue-400" />
                  Traffic Congestion Vectors
                </span>
                <span className="text-[10px] font-mono">{activeLayers.trafficFlow ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => toggleLayer('incidentBeacons')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.incidentBeacons
                    ? 'bg-red-950/40 border-red-500/40 text-red-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  Pulsing Incident Beacons
                </span>
                <span className="text-[10px] font-mono">{activeLayers.incidentBeacons ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => toggleLayer('weatherRadar')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.weatherRadar
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                  NEXRAD Doppler Radar
                </span>
                <span className="text-[10px] font-mono">{activeLayers.weatherRadar ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => toggleLayer('pollutionAqi')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.pollutionAqi
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Wind className="w-3.5 h-3.5 text-amber-400" />
                  AQI Air Pollution Mesh
                </span>
                <span className="text-[10px] font-mono">{activeLayers.pollutionAqi ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => toggleLayer('cctvNodes')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.cctvNodes
                    ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Video className="w-3.5 h-3.5 text-purple-400" />
                  CCTV Vision Density Nodes
                </span>
                <span className="text-[10px] font-mono">{activeLayers.cctvNodes ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={() => toggleLayer('roadDefects')}
                className={`w-full flex items-center justify-between p-2 rounded-lg border text-xs transition-colors ${
                  activeLayers.roadDefects
                    ? 'bg-yellow-950/40 border-yellow-500/40 text-yellow-300'
                    : 'bg-urip-card/50 border-urip-border text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
                  Road Surface Defect Index
                </span>
                <span className="text-[10px] font-mono">{activeLayers.roadDefects ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <div className="h-px bg-urip-border/60" />

            {/* Filters */}
            <div className="space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">Spatial & Risk Filters</span>
              
              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-mono flex justify-between">
                  <span>Min Risk Filter</span>
                  <span className="text-cyan-400 font-bold">{minRiskFilter}+</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="10"
                  value={minRiskFilter}
                  onChange={e => setMinRiskFilter(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-mono">District Scope</label>
                <select
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 border border-urip-border text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Metro Sectors ({hexCells.length})</option>
                  {currentCity.districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Legend */}
            <div className="p-2.5 rounded bg-slate-900/90 border border-slate-800 text-[10px] space-y-1.5 font-mono">
              <span className="text-slate-400 uppercase tracking-wider block font-bold">H3 Risk Color Scale</span>
              <div className="grid grid-cols-4 gap-1 text-center font-bold">
                <div className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 p-1 rounded">0-20 Low</div>
                <div className="bg-yellow-950 text-yellow-400 border border-yellow-500/40 p-1 rounded">21-50 Med</div>
                <div className="bg-orange-950 text-orange-400 border border-orange-500/40 p-1 rounded">51-79 High</div>
                <div className="bg-red-950 text-red-400 border border-red-500/40 p-1 rounded">80+ Crit</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Map View */}
      <div className="relative flex-1 h-full">
        {/* Leaflet Map */}
        <MapContainer
          center={currentCity.center}
          zoom={currentCity.zoom}
          style={{ width: '100%', height: '100%', backgroundColor: '#070d18' }}
          zoomControl={false}
        >
          <MapRecenter center={currentCity.center} zoom={currentCity.zoom} />
          
          {/* CartoDB Dark Matter Basemap */}
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          {/* H3 Hexagonal Grid Layer */}
          {activeLayers.hexGrid && filteredHexCells.map(cell => {
            const colors = getRiskColor(cell.overallRisk);
            const isSelected = selectedCell?.id === cell.id;

            return (
              <Polygon
                key={cell.id}
                positions={cell.bounds}
                pathOptions={{
                  color: isSelected ? '#00E5FF' : colors.hex,
                  weight: isSelected ? 3 : 1.5,
                  fillColor: colors.hex,
                  fillOpacity: isSelected ? 0.85 : gridOpacity,
                  dashArray: isSelected ? '4, 4' : undefined
                }}
                eventHandlers={{
                  click: () => setSelectedCell(cell),
                }}
              >
                <Popup className="urip-custom-popup">
                  <div className="p-1 font-sans text-slate-900">
                    <div className="font-bold text-xs">{cell.name}</div>
                    <div className="text-[11px] text-slate-600 font-mono">
                      Risk Index: <span className="font-bold" style={{ color: colors.hex }}>{cell.overallRisk}/100</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Crash: {cell.breakdown.accidentProbability}% • Flood: {cell.breakdown.floodProbability}%
                    </div>
                    <button
                      onClick={() => setSelectedCell(cell)}
                      className="mt-2 w-full px-2 py-1 bg-slate-900 text-white rounded text-[10px] font-mono hover:bg-slate-800"
                    >
                      Inspect Cell Telemetry & SHAP →
                    </button>
                  </div>
                </Popup>
              </Polygon>
            );
          })}

          {/* Incident Beacons Layer */}
          {activeLayers.incidentBeacons && alerts.map(alert => {
            if (alert.status === 'resolved' || alert.status === 'closed') return null;
            const isCritical = alert.severity === 'critical';
            return (
              <CircleMarker
                key={alert.id}
                center={[alert.lat, alert.lng]}
                radius={isCritical ? 10 : 7}
                pathOptions={{
                  color: isCritical ? '#FF334B' : '#FFA000',
                  fillColor: isCritical ? '#D32F2F' : '#F57C00',
                  fillOpacity: 0.9,
                  weight: 2
                }}
                eventHandlers={{
                  click: () => {
                    const target = hexCells.find(c => c.id === alert.cellId);
                    if (target) setSelectedCell(target);
                  }
                }}
              >
                <Popup>
                  <div className="text-slate-900 text-xs">
                    <div className="font-bold font-mono text-red-600">{alert.id}: {alert.title}</div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{alert.predictedImpactWindow}</div>
                    <div className="text-[10px] text-slate-700 mt-1">{alert.aiExplanation}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}

          {/* CCTV Camera Pins Layer */}
          {activeLayers.cctvNodes && hexCells.map(cell => (
            <CircleMarker
              key={`cctv-${cell.id}`}
              center={[cell.lat + 0.0015, cell.lng - 0.0012]}
              radius={4}
              pathOptions={{
                color: '#A855F7',
                fillColor: '#7E22CE',
                fillOpacity: 0.8,
                weight: 1
              }}
            >
              <Popup>
                <div className="text-slate-900 text-xs font-mono">
                  <div className="font-bold">CCTV Node #{cell.id.slice(-3)} (Zero PII)</div>
                  <div>Optical Crowd: {cell.liveSensors.cctvDensityPeopleM2} p/m²</div>
                  <div>Flow: {cell.liveSensors.cctvVehicleCount} vehicles/min</div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Top-Right Floating Live Telemetry HUD */}
        <div className="absolute top-4 right-4 z-10 space-y-2 pointer-events-none">
          <div className="bg-urip-card/90 border border-urip-border rounded-xl p-3 shadow-2xl backdrop-blur-xl pointer-events-auto min-w-[240px]">
            <div className="flex items-center justify-between border-b border-urip-border/60 pb-2">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Live City HUD</span>
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                HORIZON: {timeWindow.toUpperCase()}
              </span>
            </div>
            
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Active Incidents</span>
                <span className="font-mono font-bold text-red-400 text-base">{alerts.filter(a => a.status === 'new').length} Critical</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Current Weather</span>
                <span className="font-mono font-bold text-cyan-300 text-xs truncate block">{currentCity.rainMm} mm/hr</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-urip-border/40 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>H3 Resolution 8</span>
              <span>{hexCells.length} Sectors Synced</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Overlay */}
        {!selectedCell && (
          <div className="absolute bottom-4 left-4 z-10 pointer-events-auto bg-urip-card/85 border border-urip-border px-3 py-2 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-2 backdrop-blur-md">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Click any H3 hexagonal cell on the map to inspect live sensor metrics & SHAP explanations</span>
          </div>
        )}
      </div>

      {/* Sliding Right Drawer for Selected Hex Cell */}
      {selectedCell && (
        <CellDetailDrawer
          cell={selectedCell}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </div>
  );
};
