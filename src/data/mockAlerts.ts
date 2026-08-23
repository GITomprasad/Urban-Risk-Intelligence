import { AlertItem, SimulationScenario } from '../types';

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'ALT-8901',
    title: 'High Probability Collision Surge on FDR Drive Inbound',
    category: 'traffic_collision',
    severity: 'critical',
    status: 'new',
    cellId: 'nyc-hex-102',
    district: 'Lower Manhattan',
    lat: 40.7112,
    lng: -73.9980,
    createdAt: new Date(Date.now() - 140 * 1000).toISOString(),
    slaRemainingSec: 280, // ~4.6 mins SLA remaining
    assignedOperator: undefined,
    predictedImpactWindow: 'Next 15–35 mins',
    confidencePercent: 91,
    aiExplanation: 'FDR Drive underpass curvature combines with active 16.2mm/hr rainfall and sudden brake wave telemetry. Hydroplaning coefficient dropped by 45%. 3 heavy freight haulers queued upstream.',
    recommendedActions: [
      'Trigger Variable Speed Limit (VSL) matrix signs on FDR to 35 mph',
      'Pre-position Highway Patrol Cruiser Unit 14 at Brooklyn Bridge Ramp',
      'Broadcast automated slippery road alert to connected navigation apps (Waze/Apple Maps)',
      'Alert EMS Unit 08 at Bellevue Hospital for stand-by response'
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 140 * 1000).toISOString(),
        actor: 'URIP Risk Fusion Engine (XGBoost v4.2)',
        action: 'Alert Generated',
        details: 'Composite risk crossed critical threshold (88/100, confidence 91%)'
      }
    ],
    dataSignals: [
      { name: 'Precipitation Rate', value: '16.2 mm/hr', isAnomaly: true },
      { name: 'Average Speed', value: '24.5 km/h (Expected: 65 km/h)', isAnomaly: true },
      { name: 'Braking Deceleration Anomaly', value: '-4.8 m/s² (Sharp shockwave)', isAnomaly: true },
      { name: 'Pothole Density', value: '7 defects mapped', isAnomaly: false }
    ]
  },
  {
    id: 'ALT-8902',
    title: 'Severe Pedestrian Spillover & Crush Risk at Times Square 42nd St',
    category: 'crowd_surge',
    severity: 'critical',
    status: 'assigned',
    cellId: 'nyc-hex-101',
    district: 'Times Square',
    lat: 40.7580,
    lng: -73.9855,
    createdAt: new Date(Date.now() - 320 * 1000).toISOString(),
    slaRemainingSec: 180, // 3 mins left
    assignedOperator: 'Captain D. Harris (NYPD Transit)',
    predictedImpactWindow: 'Next 10–25 mins',
    confidencePercent: 94,
    aiExplanation: 'Live privacy-safe CCTV optical flow reveals crowd density of 3.4 persons/m² following simultaneous Broadway theater release. Pedestrians spilling over curb onto moving 7th Ave vehicle lanes.',
    recommendedActions: [
      'Dispatch 4 NYPD pedestrian safety marshals to 42nd & 7th Ave corner',
      'Extend pedestrian signal crossing phase duration by +20 seconds',
      'Restrict right turns from 43rd St onto Broadway',
      'Notify Port Authority Bus Terminal for queue diversion'
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 320 * 1000).toISOString(),
        actor: 'URIP Vision & Flow Engine (GNN-Dense)',
        action: 'Alert Generated',
        details: 'Threshold >3.0 persons/m² exceeded'
      },
      {
        timestamp: new Date(Date.now() - 180 * 1000).toISOString(),
        actor: 'Chief Dispatcher Kowalski',
        action: 'Assigned Operator',
        details: 'Assigned to Capt. D. Harris for field dispatch'
      }
    ],
    dataSignals: [
      { name: 'Pedestrian Density', value: '3.4 persons/m²', isAnomaly: true },
      { name: 'Curb Ingress Rate', value: '142 pedestrians/min', isAnomaly: true },
      { name: 'Traffic Speed', value: '11.2 km/h', isAnomaly: true },
      { name: 'Weather Condition', value: 'Rain Slick', isAnomaly: false }
    ]
  },
  {
    id: 'ALT-8903',
    title: 'Flash Flood Catch Basin Overflow at Lincoln Tunnel Helix',
    category: 'flash_flood',
    severity: 'high',
    status: 'in_progress',
    cellId: 'nyc-hex-107',
    district: 'Midtown',
    lat: 40.7605,
    lng: -73.9985,
    createdAt: new Date(Date.now() - 600 * 1000).toISOString(),
    slaRemainingSec: 120,
    assignedOperator: 'Eng. R. Patel (City Stormwater)',
    predictedImpactWindow: 'Next 20–45 mins',
    confidencePercent: 88,
    aiExplanation: 'Hydrological sensor in low-lying portal sump pump reads 89% capacity. Rainfall rate 15.0 mm/hr exceeds drainage capacity, leading to water accumulation on tunnel entry lane 1.',
    recommendedActions: [
      'Activate auxiliary sump pump station #4',
      'Deploy Department of Environmental Protection (DEP) rapid response truck',
      'Close Lane 1 entrance gate prior to vehicle hydroplaning'
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 600 * 1000).toISOString(),
        actor: 'URIP Hydro Physics-ML Model',
        action: 'Alert Generated'
      },
      {
        timestamp: new Date(Date.now() - 420 * 1000).toISOString(),
        actor: 'Eng. R. Patel',
        action: 'Status Changed to In Progress',
        details: 'Pump station #4 remote trigger sent; crew dispatched.'
      }
    ],
    dataSignals: [
      { name: 'Sump Level', value: '89% (Alarm at 85%)', isAnomaly: true },
      { name: 'Precipitation', value: '15.0 mm/hr', isAnomaly: true },
      { name: 'Queue Length', value: '1.2 km backup', isAnomaly: true }
    ]
  },
  {
    id: 'ALT-8904',
    title: 'Localized PM2.5 Inversion Spike in Queensboro Corridor',
    category: 'air_quality_spike',
    severity: 'medium',
    status: 'resolved',
    cellId: 'nyc-hex-110',
    district: 'Long Island City',
    lat: 40.7505,
    lng: -73.9400,
    createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
    slaRemainingSec: 0,
    assignedOperator: 'Dr. L. Chen (Public Health Dept)',
    predictedImpactWindow: 'Next 1–2 hours',
    confidencePercent: 86,
    aiExplanation: 'Microclimate atmospheric inversion trapping diesel exhaust from heavy bridge freight transit. AQI projected to reach 158 (Unhealthy for Sensitive Groups).',
    recommendedActions: [
      'Issue public health advisory for school outdoor activities in LIC',
      'Divert heavy diesel commercial transport to Queens Midtown Tunnel'
    ],
    auditTrail: [
      {
        timestamp: new Date(Date.now() - 1800 * 1000).toISOString(),
        actor: 'URIP LSTM Air Quality Network',
        action: 'Alert Generated'
      },
      {
        timestamp: new Date(Date.now() - 600 * 1000).toISOString(),
        actor: 'Dr. L. Chen',
        action: 'Status Changed to Resolved',
        details: 'Advisories pushed to school district 30 and air quality bulletin active.'
      }
    ],
    dataSignals: [
      { name: 'PM2.5 Concentration', value: '64.8 µg/m³ (Spike)', isAnomaly: true },
      { name: 'NO2 Reading', value: '42 ppb', isAnomaly: false },
      { name: 'Wind Vector', value: '2.1 km/h (Stagnant)', isAnomaly: true }
    ]
  }
];

export const SIMULATION_SCENARIOS: SimulationScenario[] = [
  {
    id: 'storm_flood',
    name: 'Sudden Severe Thunderstorm & Flash Inundation',
    description: 'Simulates a sudden cloudburst (45mm/hr) causing surface slickness, low-lying road flooding, and multi-vehicle braking disruptions.',
    icon: 'CloudRain',
    targetCategory: 'flash_flood',
    riskBoostCells: ['nyc-hex-102', 'nyc-hex-107', 'nyc-hex-109'],
    weatherMod: {
      rainMm: 48.0,
      windKmh: 58.0,
      visibilityM: 800
    },
    alertToTrigger: {
      id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
      title: 'CRITICAL: Severe Cloudburst Flood Warning across Highway Arterials',
      category: 'flash_flood',
      severity: 'critical',
      status: 'new',
      cellId: 'nyc-hex-102',
      district: 'Lower Manhattan',
      lat: 40.7112,
      lng: -73.9980,
      confidencePercent: 96,
      predictedImpactWindow: 'Next 10–30 mins',
      aiExplanation: 'Extreme precipitation intensity (48.0 mm/hr) exceeds stormwater sewer intake capacity by 210%. Water pooling depth on roadway projected to reach 12 cm.',
      recommendedActions: [
        'Issue Flash Flood Emergency warning to all digital overhead road signs',
        'Close low-lying underpasses and under-bridge connectors',
        'Pre-position emergency water rescue units along East River corridor'
      ],
      dataSignals: [
        { name: 'Precipitation Spike', value: '48.0 mm/hr (Extreme)', isAnomaly: true },
        { name: 'Runoff Coefficient', value: '0.94 (Saturated)', isAnomaly: true },
        { name: 'Traffic Braking Index', value: 'Hazard Level 4', isAnomaly: true }
      ]
    }
  },
  {
    id: 'stadium_surge',
    name: 'Major Arena Concert Egress & Crowd Surge',
    description: 'Injects an 18,000 attendee release event creating rapid pedestrian road spillovers, rideshare gridlocks, and elevated micro-mobility friction.',
    icon: 'Users',
    targetCategory: 'crowd_surge',
    riskBoostCells: ['nyc-hex-101', 'nyc-hex-103'],
    weatherMod: {
      rainMm: 12.0,
      windKmh: 15.0,
      visibilityM: 6000
    },
    alertToTrigger: {
      id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
      title: 'HIGH RISK: Arena Crowd Egress Influx & Transit Chokepoint',
      category: 'crowd_surge',
      severity: 'critical',
      status: 'new',
      cellId: 'nyc-hex-101',
      district: 'Times Square',
      lat: 40.7580,
      lng: -73.9855,
      confidencePercent: 95,
      predictedImpactWindow: 'Next 5–20 mins',
      aiExplanation: 'Post-event venue exit rate exceeds subway turnstile throughput. Optical camera models identify 4.1 persons/m² density with erratic pedestrian crossing.',
      recommendedActions: [
        'Hold traffic signals green on arterial to flush vehicles before crowd crossing',
        'Deploy mobile crowd management barriers at 7th Ave & 42nd St',
        'Open auxiliary subway station gates 4 and 5'
      ],
      dataSignals: [
        { name: 'Crowd Density', value: '4.1 persons/m² (Severe)', isAnomaly: true },
        { name: 'Pedestrian Flow Velocity', value: '0.4 m/s (Compacted)', isAnomaly: true },
        { name: 'Rideshare Pickup Surge', value: '+340% over baseline', isAnomaly: true }
      ]
    }
  },
  {
    id: 'highway_pileup',
    name: 'High-Speed Expressway Multi-Vehicle Crash Risk',
    description: 'Simulates rapid deceleration shockwave, black ice/oil slick friction loss, and emergency lane blocking.',
    icon: 'AlertTriangle',
    targetCategory: 'traffic_collision',
    riskBoostCells: ['nyc-hex-106', 'nyc-hex-110'],
    weatherMod: {
      rainMm: 22.0,
      windKmh: 35.0,
      visibilityM: 1200
    },
    alertToTrigger: {
      id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
      title: 'CRITICAL: High-Speed Deceleration Shockwave & Crash Prediction',
      category: 'traffic_collision',
      severity: 'critical',
      status: 'new',
      cellId: 'nyc-hex-106',
      district: 'Williamsburg',
      lat: 40.7135,
      lng: -73.9620,
      confidencePercent: 93,
      predictedImpactWindow: 'Next 10–25 mins',
      aiExplanation: 'Speed differential of 65 km/h detected between upstream and downstream bridge segments. Wet steel plates reduce friction. Chain collision probability at 93%.',
      recommendedActions: [
        'Trigger upstream warning flashing beacons 500m before bridge crest',
        'Dispatch Highway Incident Management vehicle to clear shoulder',
        'Activate variable message signs: SLOW DOWN - WET BRIDGE SURFACE'
      ],
      dataSignals: [
        { name: 'Delta Speed', value: '65 km/h drop in 200m', isAnomaly: true },
        { name: 'Surface Friction', value: '0.24 µ (Hazardous)', isAnomaly: true },
        { name: 'Lane Occupancy', value: '98%', isAnomaly: true }
      ]
    }
  },
  {
    id: 'sensor_dropout',
    name: 'Telemetry Outage & Automatic Model Degradation Notice',
    description: 'Tests resilience by simulating a drop in primary traffic probe stream and verifies fallback to historical Bayesian priors.',
    icon: 'WifiOff',
    targetCategory: 'emergency_surge',
    riskBoostCells: ['nyc-hex-104', 'nyc-hex-105'],
    weatherMod: {
      rainMm: 10.0,
      windKmh: 20.0,
      visibilityM: 5000
    },
    alertToTrigger: {
      id: `ALT-SIM-${Date.now().toString().slice(-4)}`,
      title: 'DATA HEALTH: Primary Ingestion Probe Offline — Fallback Active',
      category: 'emergency_surge',
      severity: 'medium',
      status: 'new',
      cellId: 'nyc-hex-104',
      district: 'Chelsea',
      lat: 40.7485,
      lng: -74.0048,
      confidencePercent: 72,
      predictedImpactWindow: 'Immediate',
      aiExplanation: 'HERE Traffic API heartbeat lost for 60 seconds. System automatically switched to secondary induction loop network and historical priors. Prediction confidence scaled down by 18%.',
      recommendedActions: [
        'Check API Gateway gateway logs and network socket pool',
        'Verify backup sensor feeds are receiving 100% telemetry',
        'Review model confidence flags on active dashboard'
      ],
      dataSignals: [
        { name: 'Feed Latency', value: '6200 ms (Timeout)', isAnomaly: true },
        { name: 'Fallback State', value: 'ACTIVE (Priors Loaded)', isAnomaly: false },
        { name: 'Confidence Penalty', value: '-18%', isAnomaly: true }
      ]
    }
  }
];
