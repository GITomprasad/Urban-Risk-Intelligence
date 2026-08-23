export type RiskSeverity = 'low' | 'medium' | 'high' | 'critical';

export type TimeWindow = 'now' | '+15m' | '+1hr' | '+6hr' | '+24hr';

export type UserRole = 'super_admin' | 'city_admin' | 'analyst' | 'responder' | 'viewer';

export type AlertStatus = 'new' | 'assigned' | 'in_progress' | 'resolved' | 'closed';

export type IncidentCategory = 
  | 'traffic_collision' 
  | 'flash_flood' 
  | 'crowd_surge' 
  | 'air_quality_spike' 
  | 'road_hazard' 
  | 'emergency_surge'
  | 'visibility_fog';

export interface H3HexCell {
  id: string;
  h3Index: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  overallRisk: number; // 0 to 100
  confidenceScore: number; // 0 to 100%
  breakdown: {
    accidentProbability: number; // 0 to 100
    floodProbability: number; // 0 to 100
    crowdDensity: number; // 0 to 100 (normalized)
    aqiForecast: number; // e.g. 20 - 350
    roadHazardScore: number; // 0 to 100
    emergencyCallSurgeProb: number; // 0 to 100
  };
  shapFactors: {
    factor: string;
    category: 'temporal' | 'spatial' | 'environmental' | 'infrastructure';
    impact: number; // -100 to +100 % relative contribution
    description: string;
  }[];
  liveSensors: {
    precipitationRateMmHr: number;
    trafficSpeedKmh: number;
    trafficCongestionRatio: number; // 0 to 1
    cctvDensityPeopleM2: number;
    cctvVehicleCount: number;
    potholeDefectCount: number;
    streetLightStatus: 'lit' | 'dark' | 'flickering';
    distanceToHospitalKm: number;
    junctionComplexityScore: number;
    activeEventsCount: number;
  };
  bounds: [number, number][]; // Polygon coordinates
}

export interface CityConfig {
  id: string;
  name: string;
  country: string;
  center: [number, number];
  zoom: number;
  districts: string[];
  weatherCondition: string;
  tempC: number;
  rainMm: number;
  avgAqi: number;
  activeIncidentsCount: number;
  cityRiskIndex: number;
  riskTrend: 'up' | 'down' | 'stable';
  riskDelta1h: number;
}

export interface AlertItem {
  id: string;
  title: string;
  category: IncidentCategory;
  severity: RiskSeverity;
  status: AlertStatus;
  cellId: string;
  district: string;
  lat: number;
  lng: number;
  createdAt: string; // ISO string
  slaRemainingSec: number; // e.g. 300 sec
  assignedOperator?: string;
  predictedImpactWindow: string; // e.g. "Next 15–45 mins"
  confidencePercent: number;
  aiExplanation: string;
  recommendedActions: string[];
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
    details?: string;
  }[];
  dataSignals: {
    name: string;
    value: string;
    isAnomaly: boolean;
  }[];
}

export interface PredictiveHourPoint {
  hour: string; // e.g. "14:00"
  timestamp: string;
  predictedRisk: number; // 0 to 100
  lowerBound: number;
  upperBound: number;
  daylightPhase: 'day' | 'golden_hour' | 'dusk' | 'night' | 'pre_dawn';
  trafficVolumeIndex: number;
  projectedPrecipitationMm: number;
  events?: {
    title: string;
    venue: string;
    expectedCrowd: number;
    category: string;
  }[];
}

export interface DataFeedStatus {
  id: string;
  name: string;
  category: 'traffic' | 'weather' | 'incidents' | 'cctv' | 'road' | 'pollution' | 'emergency';
  source: string;
  status: 'online' | 'degraded' | 'stale' | 'offline';
  freshnessSeconds: number;
  completenessPercent: number;
  latencyMs: number;
  recordsIngestedPerMin: number;
  lastSyncTime: string;
  uptime30Days: number;
  historicalUptime: number[]; // 10 bars
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  icon: string;
  targetCategory: IncidentCategory;
  riskBoostCells: string[];
  weatherMod: {
    rainMm: number;
    windKmh: number;
    visibilityM: number;
  };
  alertToTrigger: Partial<AlertItem>;
}

export type ActiveScreen = 
  | 'command_center' 
  | 'predictive_timeline' 
  | 'alert_management' 
  | 'analytics' 
  | 'data_health' 
  | 'ai_inspector' 
  | 'citizen_portal';
