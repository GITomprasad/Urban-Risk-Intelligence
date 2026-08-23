import { DataFeedStatus, PredictiveHourPoint } from '../types';

export const PREDICTIVE_TIMELINE_24H: PredictiveHourPoint[] = [
  { hour: '00:00', timestamp: '00:00', predictedRisk: 34, lowerBound: 26, upperBound: 42, daylightPhase: 'night', trafficVolumeIndex: 22, projectedPrecipitationMm: 1.2 },
  { hour: '01:00', timestamp: '01:00', predictedRisk: 38, lowerBound: 30, upperBound: 48, daylightPhase: 'night', trafficVolumeIndex: 18, projectedPrecipitationMm: 1.5 },
  { hour: '02:00', timestamp: '02:00', predictedRisk: 44, lowerBound: 35, upperBound: 55, daylightPhase: 'night', trafficVolumeIndex: 15, projectedPrecipitationMm: 2.0, events: [{ title: 'Bar & Nightclub Closing Egress', venue: 'Meatpacking & Lower East Side', expectedCrowd: 6500, category: 'Nightlife' }] },
  { hour: '03:00', timestamp: '03:00', predictedRisk: 42, lowerBound: 32, upperBound: 52, daylightPhase: 'night', trafficVolumeIndex: 12, projectedPrecipitationMm: 2.2 },
  { hour: '04:00', timestamp: '04:00', predictedRisk: 28, lowerBound: 20, upperBound: 36, daylightPhase: 'pre_dawn', trafficVolumeIndex: 14, projectedPrecipitationMm: 1.8 },
  { hour: '05:00', timestamp: '05:00', predictedRisk: 31, lowerBound: 24, upperBound: 39, daylightPhase: 'pre_dawn', trafficVolumeIndex: 28, projectedPrecipitationMm: 1.4 },
  { hour: '06:00', timestamp: '06:00', predictedRisk: 52, lowerBound: 44, upperBound: 61, daylightPhase: 'golden_hour', trafficVolumeIndex: 62, projectedPrecipitationMm: 3.5 },
  { hour: '07:00', timestamp: '07:00', predictedRisk: 74, lowerBound: 66, upperBound: 83, daylightPhase: 'day', trafficVolumeIndex: 88, projectedPrecipitationMm: 6.2 },
  { hour: '08:00', timestamp: '08:00', predictedRisk: 86, lowerBound: 79, upperBound: 94, daylightPhase: 'day', trafficVolumeIndex: 96, projectedPrecipitationMm: 8.5, events: [{ title: 'School Morning Opening & Commuter Peak', venue: 'District-wide Zone 1–4', expectedCrowd: 45000, category: 'Commute' }] },
  { hour: '09:00', timestamp: '09:00', predictedRisk: 78, lowerBound: 70, upperBound: 86, daylightPhase: 'day', trafficVolumeIndex: 84, projectedPrecipitationMm: 9.1 },
  { hour: '10:00', timestamp: '10:00', predictedRisk: 58, lowerBound: 50, upperBound: 67, daylightPhase: 'day', trafficVolumeIndex: 65, projectedPrecipitationMm: 6.0 },
  { hour: '11:00', timestamp: '11:00', predictedRisk: 54, lowerBound: 46, upperBound: 62, daylightPhase: 'day', trafficVolumeIndex: 68, projectedPrecipitationMm: 4.8 },
  { hour: '12:00', timestamp: '12:00', predictedRisk: 62, lowerBound: 54, upperBound: 71, daylightPhase: 'day', trafficVolumeIndex: 74, projectedPrecipitationMm: 5.0, events: [{ title: 'Midday Pedestrian Lunchtime Surge', venue: 'Midtown & Wall St Corridors', expectedCrowd: 28000, category: 'Pedestrian' }] },
  { hour: '13:00', timestamp: '13:00', predictedRisk: 59, lowerBound: 51, upperBound: 67, daylightPhase: 'day', trafficVolumeIndex: 71, projectedPrecipitationMm: 7.2 },
  { hour: '14:00', timestamp: '14:00', predictedRisk: 63, lowerBound: 55, upperBound: 72, daylightPhase: 'day', trafficVolumeIndex: 75, projectedPrecipitationMm: 9.8 },
  { hour: '15:00', timestamp: '15:00', predictedRisk: 71, lowerBound: 62, upperBound: 80, daylightPhase: 'day', trafficVolumeIndex: 82, projectedPrecipitationMm: 11.4, events: [{ title: 'School Dismissal & Bus Transit Congestion', venue: '28 School Crossings', expectedCrowd: 32000, category: 'School' }] },
  { hour: '16:00', timestamp: '16:00', predictedRisk: 79, lowerBound: 71, upperBound: 88, daylightPhase: 'day', trafficVolumeIndex: 90, projectedPrecipitationMm: 14.0 },
  { hour: '17:00', timestamp: '17:00', predictedRisk: 89, lowerBound: 82, upperBound: 96, daylightPhase: 'dusk', trafficVolumeIndex: 98, projectedPrecipitationMm: 16.5 },
  { hour: '18:00', timestamp: '18:00', predictedRisk: 93, lowerBound: 86, upperBound: 99, daylightPhase: 'dusk', trafficVolumeIndex: 97, projectedPrecipitationMm: 18.2, events: [{ title: 'Storm Cell Peak + Evening Peak Ingress', venue: 'FDR Drive & Lincoln Tunnel Approach', expectedCrowd: 55000, category: 'Hazard' }] },
  { hour: '19:00', timestamp: '19:00', predictedRisk: 87, lowerBound: 79, upperBound: 95, daylightPhase: 'night', trafficVolumeIndex: 86, projectedPrecipitationMm: 15.0, events: [{ title: 'NBA Basketball Game Arena Ingress', venue: 'Madison Square Garden (19,500 cap)', expectedCrowd: 19500, category: 'Sports Event' }] },
  { hour: '20:00', timestamp: '20:00', predictedRisk: 75, lowerBound: 66, upperBound: 84, daylightPhase: 'night', trafficVolumeIndex: 70, projectedPrecipitationMm: 11.2 },
  { hour: '21:00', timestamp: '21:00', predictedRisk: 68, lowerBound: 59, upperBound: 77, daylightPhase: 'night', trafficVolumeIndex: 58, projectedPrecipitationMm: 8.0 },
  { hour: '22:00', timestamp: '22:00', predictedRisk: 79, lowerBound: 70, upperBound: 88, daylightPhase: 'night', trafficVolumeIndex: 64, projectedPrecipitationMm: 6.5, events: [{ title: 'Broadway Curtain Call & Concert Egress', venue: 'Times Square Theater District', expectedCrowd: 38000, category: 'Entertainment' }] },
  { hour: '23:00', timestamp: '23:00', predictedRisk: 61, lowerBound: 51, upperBound: 71, daylightPhase: 'night', trafficVolumeIndex: 44, projectedPrecipitationMm: 4.0 }
];

export const DATA_FEEDS_STATUS: DataFeedStatus[] = [
  {
    id: 'feed-traffic',
    name: 'Real-Time Traffic Speed & Probes',
    category: 'traffic',
    source: 'HERE Traffic API + City DOT Inductive Loops',
    status: 'online',
    freshnessSeconds: 14,
    completenessPercent: 98.4,
    latencyMs: 142,
    recordsIngestedPerMin: 18450,
    lastSyncTime: 'Just now',
    uptime30Days: 99.98,
    historicalUptime: [100, 100, 100, 99.8, 100, 100, 100, 100, 99.9, 100]
  },
  {
    id: 'feed-weather',
    name: 'Hyperlocal NWP Radar & Weather Stations',
    category: 'weather',
    source: 'NOAA NEXRAD + Open-Meteo 1km Grid',
    status: 'online',
    freshnessSeconds: 42,
    completenessPercent: 99.9,
    latencyMs: 310,
    recordsIngestedPerMin: 3200,
    lastSyncTime: '42s ago',
    uptime30Days: 99.95,
    historicalUptime: [100, 100, 100, 100, 100, 99.6, 100, 100, 100, 100]
  },
  {
    id: 'feed-accidents',
    name: 'Police & CAD Emergency Dispatch Logs',
    category: 'emergency',
    source: 'City 911 / Police CAD REST Stream',
    status: 'online',
    freshnessSeconds: 5,
    completenessPercent: 100.0,
    latencyMs: 88,
    recordsIngestedPerMin: 420,
    lastSyncTime: '5s ago',
    uptime30Days: 100.0,
    historicalUptime: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  },
  {
    id: 'feed-cctv',
    name: 'Privacy-Safe Optical Crowd/Vehicle Counters',
    category: 'cctv',
    source: 'City Camera Optical Flow Edge Aggregators (Zero PII)',
    status: 'online',
    freshnessSeconds: 8,
    completenessPercent: 94.2,
    latencyMs: 220,
    recordsIngestedPerMin: 28400,
    lastSyncTime: '8s ago',
    uptime30Days: 99.82,
    historicalUptime: [99.5, 100, 100, 99.9, 100, 99.2, 100, 100, 100, 100]
  },
  {
    id: 'feed-road',
    name: 'Road Infrastructure Defect & Sensor Index',
    category: 'road',
    source: 'DOT Maintenance Work-Orders + Fleet Accelerometers',
    status: 'online',
    freshnessSeconds: 120,
    completenessPercent: 91.5,
    latencyMs: 450,
    recordsIngestedPerMin: 850,
    lastSyncTime: '2m ago',
    uptime30Days: 99.45,
    historicalUptime: [99.0, 99.8, 100, 100, 98.9, 100, 100, 100, 99.7, 100]
  },
  {
    id: 'feed-aqi',
    name: 'Air Quality Sensor Mesh (PM2.5, NO2, O3)',
    category: 'pollution',
    source: 'EPA AirNow + Fixed Municipal Station Network',
    status: 'online',
    freshnessSeconds: 180,
    completenessPercent: 96.0,
    latencyMs: 520,
    recordsIngestedPerMin: 1400,
    lastSyncTime: '3m ago',
    uptime30Days: 99.90,
    historicalUptime: [100, 100, 100, 100, 100, 100, 99.4, 100, 100, 100]
  },
  {
    id: 'feed-events',
    name: 'City Public Event & Term Calendars',
    category: 'incidents',
    source: 'Municipal Event Permits + Ticketing APIs',
    status: 'online',
    freshnessSeconds: 300,
    completenessPercent: 99.0,
    latencyMs: 190,
    recordsIngestedPerMin: 120,
    lastSyncTime: '5m ago',
    uptime30Days: 99.99,
    historicalUptime: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100]
  }
];

export const CORRELATION_DATASETS = {
  rain_vs_crashes: {
    title: 'Rainfall Intensity (mm/hr) vs. Accident Risk Score',
    xLabel: 'Precipitation Rate (mm/hr)',
    yLabel: 'Crash Probability Index (0–100)',
    rValue: 0.84,
    description: 'Strong exponential positive correlation: each 10 mm/hr increment above baseline increases collision probability by +38%.',
    points: [
      { x: 0, y: 12, label: 'Dry Pavement' },
      { x: 2.5, y: 22, label: 'Light Drizzle' },
      { x: 5.0, y: 34, label: 'Steady Rain' },
      { x: 8.5, y: 48, label: 'Moderate Downpour' },
      { x: 12.0, y: 64, label: 'Heavy Rain' },
      { x: 16.5, y: 78, label: 'Severe Rain' },
      { x: 22.0, y: 88, label: 'Torrents' },
      { x: 30.0, y: 94, label: 'Cloudburst Warning' },
      { x: 42.0, y: 98, label: 'Flash Flood Hazard' }
    ]
  },
  aqi_vs_speed: {
    title: 'Air Quality (PM2.5 µg/m³) vs. Traffic Congestion Factor',
    xLabel: 'PM2.5 Concentration (µg/m³)',
    yLabel: 'Traffic Delay Index (0–100)',
    rValue: 0.76,
    description: 'Moderate-high positive correlation during atmospheric stagnation events where idling vehicle queues trap micro-particulates.',
    points: [
      { x: 12, y: 15, label: 'Clean / Free Flow' },
      { x: 25, y: 28, label: 'Moderate' },
      { x: 40, y: 45, label: 'Light Congestion' },
      { x: 65, y: 68, label: 'Corridor Gridlock' },
      { x: 95, y: 82, label: 'Heavy Smog Stagnation' },
      { x: 130, y: 92, label: 'Severe Tunnel Portal Trap' },
      { x: 180, y: 96, label: 'Industrial Zone Inversion' }
    ]
  },
  darkness_vs_fatalities: {
    title: 'Ambient Lighting & Sun Angle vs. Incident Severity Weight',
    xLabel: 'Sun Elevation Angle (Degrees)',
    yLabel: 'Severity Weight Multiplier',
    rValue: -0.89,
    description: 'Critical inverse relationship: sub-zero sun angles (night/pre-dawn) increase fatal incident probability by 8× compared to full daylight.',
    points: [
      { x: 45, y: 1.0, label: 'Midday Full Light' },
      { x: 25, y: 1.2, label: 'Afternoon' },
      { x: 10, y: 1.8, label: 'Golden Hour' },
      { x: 0, y: 3.4, label: 'Dusk / Twilight' },
      { x: -6, y: 5.6, label: 'Civil Twilight' },
      { x: -18, y: 8.1, label: 'Full Night Darkness' },
      { x: -30, y: 8.8, label: 'Pre-Dawn 3 AM' }
    ]
  },
  junction_vs_risk: {
    title: 'Junction Complexity (# of Conflict Rays) vs. Pedestrian Conflicts',
    xLabel: 'Conflict Rays / Road Arms',
    yLabel: 'Pedestrian Near-Miss Count / Hr',
    rValue: 0.81,
    description: 'Complex 5-way and 6-way intersections experience non-linear conflict spikes during peak pedestrian volumes.',
    points: [
      { x: 2, y: 0.4, label: 'Straight Segment' },
      { x: 3, y: 1.2, label: 'T-Junction' },
      { x: 4, y: 3.8, label: 'Standard 4-Way' },
      { x: 5, y: 8.4, label: '5-Way Convergence' },
      { x: 6, y: 16.2, label: 'Times Sq 6-Way Complex' },
      { x: 7, y: 22.0, label: 'Multi-Leg Rotary' }
    ]
  }
};

// Generate 365 days of mock calendar data for the heat matrix
export function generateAnnualRiskCalendar() {
  const days = [];
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  
  for (let i = 0; i < 365; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    const dayOfWeek = d.getDay(); // 0 is Sun, 6 is Sat
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const month = d.getMonth();
    const isWinter = month === 0 || month === 1 || month === 11;
    
    // Baseline risk variation
    let risk = 35 + Math.sin(i / 15) * 15;
    if (isWeekend) risk += 12;
    if (isWinter) risk += 18;
    // Add random blips
    if (i % 23 === 0) risk += 28;
    if (i % 47 === 0) risk += 32;
    
    risk = Math.max(10, Math.min(98, Math.round(risk)));
    
    days.push({
      date: d.toISOString().split('T')[0],
      dayOfWeek,
      month,
      risk,
      incidents: Math.round(risk / 8),
      weather: risk > 75 ? 'Storm / Snow' : risk > 55 ? 'Rain / Fog' : 'Clear / Overcast'
    });
  }
  return days;
}
