import { CityConfig, H3HexCell } from '../types';

// Helper to generate hexagonal coordinates given center lat, lng and radius in degrees (~500m)
function generateHexagonBounds(centerLat: number, centerLng: number, radius = 0.0048): [number, number][] {
  const points: [number, number][] = [];
  const cosLat = Math.cos((centerLat * Math.PI) / 180);
  for (let i = 0; i < 6; i++) {
    const angle = (i * 60 + 30) * (Math.PI / 180);
    const lat = centerLat + radius * Math.sin(angle);
    const lng = centerLng + (radius * Math.cos(angle)) / cosLat;
    points.push([lat, lng]);
  }
  return points;
}

export const CITIES: CityConfig[] = [
  {
    id: 'nyc',
    name: 'New York City',
    country: 'United States',
    center: [40.730610, -73.990240], // Manhattan / Midtown / Downtown
    zoom: 13,
    districts: ['Midtown', 'Lower Manhattan', 'Times Square', 'Chelsea', 'Financial District', 'Williamsburg', 'DUMBO', 'Long Island City'],
    weatherCondition: 'Moderate Rain & Surface Slickness',
    tempC: 14.2,
    rainMm: 12.4,
    avgAqi: 48,
    activeIncidentsCount: 6,
    cityRiskIndex: 68,
    riskTrend: 'up',
    riskDelta1h: +7
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    center: [51.5074, -0.1278],
    zoom: 13,
    districts: ['Westminster', 'City of London', 'Southwark', 'Camden', 'Tower Hamlets', 'Kensington', 'Islington'],
    weatherCondition: 'Heavy Fog & Low Visibility',
    tempC: 9.8,
    rainMm: 4.2,
    avgAqi: 34,
    activeIncidentsCount: 4,
    cityRiskIndex: 54,
    riskTrend: 'stable',
    riskDelta1h: -1
  },
  {
    id: 'chicago',
    name: 'Chicago',
    country: 'United States',
    center: [41.8781, -87.6298],
    zoom: 13,
    districts: ['The Loop', 'River North', 'West Loop', 'Lincoln Park', 'South Loop', 'Near North Side'],
    weatherCondition: 'High Gale Winds & Cold Flurries',
    tempC: 2.1,
    rainMm: 1.5,
    avgAqi: 52,
    activeIncidentsCount: 5,
    cityRiskIndex: 61,
    riskTrend: 'up',
    riskDelta1h: +4
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    center: [1.3521, 103.8198],
    zoom: 13,
    districts: ['Marina Bay', 'Orchard', 'Jurong East', 'Bugis', 'Tampines', 'Chinatown', 'Sentosa'],
    weatherCondition: 'Tropical Flash Downpour',
    tempC: 29.5,
    rainMm: 42.0,
    avgAqi: 38,
    activeIncidentsCount: 7,
    cityRiskIndex: 74,
    riskTrend: 'up',
    riskDelta1h: +12
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    center: [19.0760, 72.8777],
    zoom: 13,
    districts: ['BKC (Bandra Kurla)', 'South Mumbai (Fort)', 'Andheri West', 'Dadar', 'Worli', 'Lower Parel', 'Kurla Junction'],
    weatherCondition: 'Monsoon Saturation & Drainage Surge',
    tempC: 30.1,
    rainMm: 65.4,
    avgAqi: 142,
    activeIncidentsCount: 11,
    cityRiskIndex: 83,
    riskTrend: 'up',
    riskDelta1h: +9
  }
];

export const NYC_HEX_CELLS: H3HexCell[] = [
  {
    id: 'nyc-hex-101',
    h3Index: '882a100d29fffff',
    name: 'Times Square & 42nd St Corridor',
    district: 'Times Square',
    lat: 40.7580,
    lng: -73.9855,
    overallRisk: 88,
    confidenceScore: 92,
    breakdown: {
      accidentProbability: 84,
      floodProbability: 25,
      crowdDensity: 94,
      aqiForecast: 68,
      roadHazardScore: 72,
      emergencyCallSurgeProb: 89
    },
    shapFactors: [
      { factor: 'Crowd Density (Theater & Tourist Surge)', category: 'spatial', impact: 38, description: 'Live CCTV detects 3.4 persons/m²; pedestrian spillover into roadway lanes.' },
      { factor: 'Precipitation Wet-Pavement Friction Loss', category: 'environmental', impact: 28, description: '12.4 mm/hr rain on bitumen reduces emergency stopping distance by 45%.' },
      { factor: 'Complex 6-Way Intersect Geometry', category: 'spatial', impact: 18, description: 'Broadway & 7th Ave convergence creates 14 conflict cross-points.' },
      { factor: 'Sub-Optimal Night Visibility Index', category: 'environmental', impact: 10, description: 'Glare from LED billboards during wet night reflections.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 14.8,
      trafficSpeedKmh: 11.2,
      trafficCongestionRatio: 0.88,
      cctvDensityPeopleM2: 3.4,
      cctvVehicleCount: 142,
      potholeDefectCount: 4,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 0.8,
      junctionComplexityScore: 92,
      activeEventsCount: 2
    },
    bounds: generateHexagonBounds(40.7580, -73.9855)
  },
  {
    id: 'nyc-hex-102',
    h3Index: '882a100d21fffff',
    name: 'FDR Drive & Brooklyn Bridge Approach',
    district: 'Lower Manhattan',
    lat: 40.7112,
    lng: -73.9980,
    overallRisk: 82,
    confidenceScore: 95,
    breakdown: {
      accidentProbability: 91,
      floodProbability: 78,
      crowdDensity: 32,
      aqiForecast: 58,
      roadHazardScore: 65,
      emergencyCallSurgeProb: 80
    },
    shapFactors: [
      { factor: 'High-Speed Curvature & Merge Bottleneck', category: 'spatial', impact: 42, description: 'Sharp 40° radius underpass with simultaneous off-ramp queue buildup.' },
      { factor: 'East River Storm Surge Inundation', category: 'environmental', impact: 31, description: 'Catch basin water sensor at 82% capacity; hydroplaning risk elevated.' },
      { factor: 'Heavy Commercial Vehicle Transit', category: 'infrastructure', impact: 16, description: 'High percentage of freight trucks with slower braking envelopes.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 16.2,
      trafficSpeedKmh: 24.5,
      trafficCongestionRatio: 0.79,
      cctvDensityPeopleM2: 0.4,
      cctvVehicleCount: 218,
      potholeDefectCount: 7,
      streetLightStatus: 'flickering',
      distanceToHospitalKm: 1.4,
      junctionComplexityScore: 84,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7112, -73.9980)
  },
  {
    id: 'nyc-hex-103',
    h3Index: '882a100d23fffff',
    name: 'Grand Central & 42nd St Transit Hub',
    district: 'Midtown',
    lat: 40.7527,
    lng: -73.9772,
    overallRisk: 71,
    confidenceScore: 88,
    breakdown: {
      accidentProbability: 66,
      floodProbability: 18,
      crowdDensity: 82,
      aqiForecast: 74,
      roadHazardScore: 52,
      emergencyCallSurgeProb: 75
    },
    shapFactors: [
      { factor: 'Peak Commuter Ingress/Egress', category: 'temporal', impact: 36, description: 'Evening rush hour train arrivals dumping 22,000 pedestrians/hr.' },
      { factor: 'Taxi & Rideshare Double-Parking Rate', category: 'spatial', impact: 26, description: 'CCTV vision models detect 19 active curbside double-parked vehicles.' },
      { factor: 'Canyon Wind Funneling Effect', category: 'environmental', impact: 14, description: 'Park Avenue wind gusts measured at 48 km/h blowing debris.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 10.1,
      trafficSpeedKmh: 14.8,
      trafficCongestionRatio: 0.72,
      cctvDensityPeopleM2: 2.1,
      cctvVehicleCount: 164,
      potholeDefectCount: 2,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 0.6,
      junctionComplexityScore: 78,
      activeEventsCount: 1
    },
    bounds: generateHexagonBounds(40.7527, -73.9772)
  },
  {
    id: 'nyc-hex-104',
    h3Index: '882a100d25fffff',
    name: 'Chelsea Highline & 10th Ave Intersection',
    district: 'Chelsea',
    lat: 40.7485,
    lng: -74.0048,
    overallRisk: 58,
    confidenceScore: 84,
    breakdown: {
      accidentProbability: 54,
      floodProbability: 38,
      crowdDensity: 60,
      aqiForecast: 45,
      roadHazardScore: 48,
      emergencyCallSurgeProb: 44
    },
    shapFactors: [
      { factor: 'Bicycle & Micro-Mobility Conflict Density', category: 'spatial', impact: 32, description: 'High volume of e-bikes crossing arterial vehicle lanes.' },
      { factor: 'Nighttime Restaurant & Bar Egress', category: 'temporal', impact: 24, description: 'Alcohol outlet density correlation index 0.78.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 8.5,
      trafficSpeedKmh: 28.0,
      trafficCongestionRatio: 0.45,
      cctvDensityPeopleM2: 1.1,
      cctvVehicleCount: 88,
      potholeDefectCount: 3,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 1.8,
      junctionComplexityScore: 62,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7485, -74.0048)
  },
  {
    id: 'nyc-hex-105',
    h3Index: '882a100d27fffff',
    name: 'Wall Street & Financial District Concourse',
    district: 'Financial District',
    lat: 40.7075,
    lng: -74.0090,
    overallRisk: 39,
    confidenceScore: 91,
    breakdown: {
      accidentProbability: 32,
      floodProbability: 34,
      crowdDensity: 41,
      aqiForecast: 38,
      roadHazardScore: 28,
      emergencyCallSurgeProb: 31
    },
    shapFactors: [
      { factor: 'Narrow Cobblestone & Historic Street Grading', category: 'infrastructure', impact: 22, description: 'Limited lane clearance and tight turning radiuses.' },
      { factor: 'Security Bollards Restricting Emergency Routing', category: 'spatial', impact: 15, description: 'Pedestrianized blocks requiring detour routing.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 9.0,
      trafficSpeedKmh: 18.2,
      trafficCongestionRatio: 0.35,
      cctvDensityPeopleM2: 0.8,
      cctvVehicleCount: 52,
      potholeDefectCount: 1,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 1.1,
      junctionComplexityScore: 54,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7075, -74.0090)
  },
  {
    id: 'nyc-hex-106',
    h3Index: '882a100d2bfffff',
    name: 'Williamsburg Bridge Eastern Plaza',
    district: 'Williamsburg',
    lat: 40.7135,
    lng: -73.9620,
    overallRisk: 64,
    confidenceScore: 89,
    breakdown: {
      accidentProbability: 72,
      floodProbability: 15,
      crowdDensity: 48,
      aqiForecast: 62,
      roadHazardScore: 68,
      emergencyCallSurgeProb: 59
    },
    shapFactors: [
      { factor: 'Bridge Incline & Heavy Weekend Traffic', category: 'temporal', impact: 34, description: 'Inter-borough flow surge causing tailbacks onto Broadway.' },
      { factor: 'Pavement Surface Spalling & Road Defect Count', category: 'infrastructure', impact: 28, description: 'Sensor surveys identify 6 pothole anomalies in right lane.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 11.2,
      trafficSpeedKmh: 31.0,
      trafficCongestionRatio: 0.68,
      cctvDensityPeopleM2: 0.5,
      cctvVehicleCount: 175,
      potholeDefectCount: 6,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 2.2,
      junctionComplexityScore: 71,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7135, -73.9620)
  },
  {
    id: 'nyc-hex-107',
    h3Index: '882a100d2dfffff',
    name: 'Lincoln Tunnel Helix & 9th Ave Approach',
    district: 'Midtown',
    lat: 40.7605,
    lng: -73.9985,
    overallRisk: 86,
    confidenceScore: 94,
    breakdown: {
      accidentProbability: 88,
      floodProbability: 42,
      crowdDensity: 52,
      aqiForecast: 88,
      roadHazardScore: 78,
      emergencyCallSurgeProb: 84
    },
    shapFactors: [
      { factor: 'Underground Tunnel Ingress Bottleneck', category: 'spatial', impact: 40, description: '3 inbound lanes squeezed into single-lane tunnel portal.' },
      { factor: 'High AQI & Diesel Particulate Trapping', category: 'environmental', impact: 26, description: 'PM2.5 sensor peaks at 115 µg/m³ near portal mouth.' },
      { factor: 'Stop-and-Go Rear-End Collision Chain History', category: 'temporal', impact: 21, description: 'Historical 5-year crash frequency index 94th percentile.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 15.0,
      trafficSpeedKmh: 8.5,
      trafficCongestionRatio: 0.94,
      cctvDensityPeopleM2: 0.3,
      cctvVehicleCount: 290,
      potholeDefectCount: 5,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 1.5,
      junctionComplexityScore: 96,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7605, -73.9985)
  },
  {
    id: 'nyc-hex-108',
    h3Index: '882a100d2fffff',
    name: 'Central Park South & Columbus Circle',
    district: 'Midtown',
    lat: 40.7680,
    lng: -73.9819,
    overallRisk: 46,
    confidenceScore: 86,
    breakdown: {
      accidentProbability: 42,
      floodProbability: 10,
      crowdDensity: 65,
      aqiForecast: 34,
      roadHazardScore: 30,
      emergencyCallSurgeProb: 38
    },
    shapFactors: [
      { factor: 'Rotary Roundabout Merge Conflict', category: 'spatial', impact: 29, description: 'Multi-lane roundabout with mixed pedestrian crossing queues.' },
      { factor: 'Tourist Carriage & Cycle Lane Weaving', category: 'spatial', impact: 18, description: 'Speed differential between modes creates micro-friction.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 8.0,
      trafficSpeedKmh: 22.0,
      trafficCongestionRatio: 0.51,
      cctvDensityPeopleM2: 1.4,
      cctvVehicleCount: 110,
      potholeDefectCount: 1,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 0.9,
      junctionComplexityScore: 68,
      activeEventsCount: 1
    },
    bounds: generateHexagonBounds(40.7680, -73.9819)
  },
  {
    id: 'nyc-hex-109',
    h3Index: '882a100d31fffff',
    name: 'DUMBO Waterfront & Manhattan Bridge Base',
    district: 'DUMBO',
    lat: 40.7032,
    lng: -73.9885,
    overallRisk: 28,
    confidenceScore: 82,
    breakdown: {
      accidentProbability: 22,
      floodProbability: 40,
      crowdDensity: 35,
      aqiForecast: 28,
      roadHazardScore: 24,
      emergencyCallSurgeProb: 19
    },
    shapFactors: [
      { factor: 'Low Elevation Tidal Zone Proximity', category: 'environmental', impact: 20, description: 'Proximity to high-tide East River catchment basin.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 6.2,
      trafficSpeedKmh: 35.0,
      trafficCongestionRatio: 0.22,
      cctvDensityPeopleM2: 0.6,
      cctvVehicleCount: 44,
      potholeDefectCount: 2,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 1.7,
      junctionComplexityScore: 38,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7032, -73.9885)
  },
  {
    id: 'nyc-hex-110',
    h3Index: '882a100d33fffff',
    name: 'Queensboro Bridge Plaza & LIC Approach',
    district: 'Long Island City',
    lat: 40.7505,
    lng: -73.9400,
    overallRisk: 62,
    confidenceScore: 87,
    breakdown: {
      accidentProbability: 69,
      floodProbability: 20,
      crowdDensity: 38,
      aqiForecast: 64,
      roadHazardScore: 58,
      emergencyCallSurgeProb: 55
    },
    shapFactors: [
      { factor: 'Upper/Lower Deck Traffic Splitting', category: 'spatial', impact: 32, description: 'Rapid lane changes before toll gantry convergence.' },
      { factor: 'Wet Steel Expansion Joint Slippage', category: 'infrastructure', impact: 26, description: 'Pavement grip coefficient drops to 0.28 on bridge expansion plates.' }
    ],
    liveSensors: {
      precipitationRateMmHr: 12.0,
      trafficSpeedKmh: 28.5,
      trafficCongestionRatio: 0.64,
      cctvDensityPeopleM2: 0.3,
      cctvVehicleCount: 180,
      potholeDefectCount: 4,
      streetLightStatus: 'lit',
      distanceToHospitalKm: 2.5,
      junctionComplexityScore: 76,
      activeEventsCount: 0
    },
    bounds: generateHexagonBounds(40.7505, -73.9400)
  }
];

// Helper to generate dynamic hex cells for other cities if switched
export function getCityHexCells(cityId: string): H3HexCell[] {
  if (cityId === 'nyc') return NYC_HEX_CELLS;
  
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  const [cLat, cLng] = city.center;
  
  const offsets = [
    { name: 'Central District Concourse', dLat: 0, dLng: 0, risk: city.cityRiskIndex, d: city.districts[0] || 'Center' },
    { name: 'North Arterial Flyover', dLat: 0.015, dLng: 0.008, risk: Math.min(95, city.cityRiskIndex + 14), d: city.districts[1] || 'North' },
    { name: 'South Waterfront Highway', dLat: -0.014, dLng: -0.009, risk: Math.min(92, city.cityRiskIndex + 8), d: city.districts[2] || 'South' },
    { name: 'East Express Junction', dLat: 0.008, dLng: 0.018, risk: Math.max(25, city.cityRiskIndex - 12), d: city.districts[3] || 'East' },
    { name: 'West Commercial Boulevard', dLat: -0.007, dLng: -0.016, risk: Math.max(30, city.cityRiskIndex - 5), d: city.districts[4] || 'West' },
    { name: 'Metro Terminal Egress', dLat: 0.022, dLng: -0.012, risk: Math.min(98, city.cityRiskIndex + 18), d: city.districts[5] || 'Terminal' },
    { name: 'Industrial Logistics Hub', dLat: -0.020, dLng: 0.015, risk: Math.max(35, city.cityRiskIndex - 18), d: city.districts[6] || 'Industrial' },
    { name: 'University & Hospital Corridor', dLat: 0.012, dLng: -0.022, risk: Math.max(22, city.cityRiskIndex - 25), d: city.districts[0] || 'Campus' },
  ];

  return offsets.map((off, idx) => {
    const lat = cLat + off.dLat;
    const lng = cLng + off.dLng;
    const risk = off.risk;
    return {
      id: `${cityId}-hex-${idx + 1}`,
      h3Index: `882a${(idx + 10).toString(16)}0d29fffff`,
      name: `${off.name}`,
      district: off.d,
      lat,
      lng,
      overallRisk: risk,
      confidenceScore: 85 + (idx % 10),
      breakdown: {
        accidentProbability: Math.min(95, Math.round(risk * 1.05)),
        floodProbability: Math.min(95, Math.round(risk * (city.rainMm > 20 ? 1.2 : 0.4))),
        crowdDensity: Math.min(100, Math.round(risk * 0.9)),
        aqiForecast: Math.round(city.avgAqi * (1 + (idx % 3) * 0.15)),
        roadHazardScore: Math.min(90, Math.round(risk * 0.8)),
        emergencyCallSurgeProb: Math.min(95, Math.round(risk * 0.95))
      },
      shapFactors: [
        { factor: 'Dynamic Traffic Density Influx', category: 'temporal', impact: Math.round(risk * 0.35), description: 'Vehicle probe telemetry indicates rapid congestion buildup.' },
        { factor: 'Environmental Precipitation / Weather Index', category: 'environmental', impact: Math.round(risk * 0.30), description: `Live readings show ${city.rainMm} mm/hr with reduced tire adhesion.` },
        { factor: 'Road Topology & Intersection Geometry', category: 'spatial', impact: Math.round(risk * 0.20), description: 'High turn friction and weaving lane changes.' }
      ],
      liveSensors: {
        precipitationRateMmHr: city.rainMm,
        trafficSpeedKmh: Math.max(10, Math.round(60 - risk * 0.5)),
        trafficCongestionRatio: Math.min(0.99, Number((risk / 100).toFixed(2))),
        cctvDensityPeopleM2: Number((risk / 40).toFixed(1)),
        cctvVehicleCount: Math.round(risk * 2.2),
        potholeDefectCount: Math.round(risk / 20),
        streetLightStatus: risk > 70 ? 'flickering' : 'lit',
        distanceToHospitalKm: Number((1.2 + idx * 0.3).toFixed(1)),
        junctionComplexityScore: Math.min(95, Math.round(risk * 0.9)),
        activeEventsCount: risk > 75 ? 1 : 0
      },
      bounds: generateHexagonBounds(lat, lng)
    };
  });
}
