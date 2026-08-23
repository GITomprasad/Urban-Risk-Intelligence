import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  CityConfig, 
  H3HexCell, 
  AlertItem, 
  TimeWindow, 
  UserRole, 
  ActiveScreen, 
  DataFeedStatus, 
  SimulationScenario,
  AlertStatus
} from '../types';
import { CITIES, NYC_HEX_CELLS, getCityHexCells } from '../data/cities';
import { INITIAL_ALERTS, SIMULATION_SCENARIOS } from '../data/mockAlerts';
import { DATA_FEEDS_STATUS } from '../data/mockMetrics';

interface RiskContextType {
  currentCity: CityConfig;
  setCity: (cityId: string) => void;
  timeWindow: TimeWindow;
  setTimeWindow: (tw: TimeWindow) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  hexCells: H3HexCell[];
  selectedCell: H3HexCell | null;
  setSelectedCell: (cell: H3HexCell | null) => void;
  alerts: AlertItem[];
  unreadAlertCount: number;
  activeLayers: {
    weatherRadar: boolean;
    pollutionAqi: boolean;
    cctvNodes: boolean;
    trafficFlow: boolean;
    roadDefects: boolean;
    incidentBeacons: boolean;
    hexGrid: boolean;
  };
  toggleLayer: (layerKey: keyof RiskContextType['activeLayers']) => void;
  dataFeeds: DataFeedStatus[];
  toggleFeedOutage: (feedId: string) => void;
  activeScenario: SimulationScenario | null;
  triggerScenario: (scenario: SimulationScenario) => void;
  resetScenario: () => void;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
  isSimulating: boolean;
  setIsSimulating: (simulating: boolean) => void;
  // Alert actions
  updateAlertStatus: (alertId: string, newStatus: AlertStatus, notes?: string) => void;
  assignAlertOperator: (alertId: string, operatorName: string) => void;
  dispatchEmergencyUnit: (cellId: string, unitType: string) => void;
  undoLastAction: () => void;
  canUndo: boolean;
  // Custom Upload
  uploadCustomDataset: (name: string, recordCount: number) => void;
  uploadedDatasets: { name: string; records: number; timestamp: string }[];
  cityRiskIndex: number;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

// Web Audio synthesizer for alert beep
function playAlertBeep() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // ignore audio block
  }
}

export const RiskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCityId, setCurrentCityId] = useState<string>('nyc');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('now');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('command_center');
  const [selectedCell, setSelectedCell] = useState<H3HexCell | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [dataFeeds, setDataFeeds] = useState<DataFeedStatus[]>(DATA_FEEDS_STATUS);
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [historyStack, setHistoryStack] = useState<AlertItem[][]>([]);
  const [uploadedDatasets, setUploadedDatasets] = useState<{ name: string; records: number; timestamp: string }[]>([]);

  const [activeLayers, setActiveLayers] = useState({
    weatherRadar: true,
    pollutionAqi: false,
    cctvNodes: true,
    trafficFlow: true,
    roadDefects: true,
    incidentBeacons: true,
    hexGrid: true,
  });

  const currentCity = CITIES.find(c => c.id === currentCityId) || CITIES[0];

  // Base hex cells for current city
  const [baseHexCells, setBaseHexCells] = useState<H3HexCell[]>(NYC_HEX_CELLS);

  // Update base hex cells on city switch
  useEffect(() => {
    const cells = getCityHexCells(currentCityId);
    setBaseHexCells(cells);
    setSelectedCell(null);
  }, [currentCityId]);

  // Compute live hex cells taking timeWindow and activeScenario into account
  const hexCells = React.useMemo(() => {
    return baseHexCells.map(cell => {
      let riskMultiplier = 1.0;
      if (timeWindow === '+15m') riskMultiplier = 1.06;
      else if (timeWindow === '+1hr') riskMultiplier = 1.15;
      else if (timeWindow === '+6hr') riskMultiplier = 1.25;
      else if (timeWindow === '+24hr') riskMultiplier = 0.95;

      let additionalRisk = 0;
      if (activeScenario && activeScenario.riskBoostCells.includes(cell.id)) {
        additionalRisk = 22;
      }

      const calculatedRisk = Math.min(99, Math.max(8, Math.round(cell.overallRisk * riskMultiplier + additionalRisk)));
      
      return {
        ...cell,
        overallRisk: calculatedRisk,
        breakdown: {
          ...cell.breakdown,
          accidentProbability: Math.min(99, Math.round(cell.breakdown.accidentProbability * riskMultiplier + additionalRisk)),
          floodProbability: activeScenario?.id === 'storm_flood' ? Math.min(99, cell.breakdown.floodProbability + 45) : cell.breakdown.floodProbability,
          crowdDensity: activeScenario?.id === 'stadium_surge' ? Math.min(100, cell.breakdown.crowdDensity + 35) : cell.breakdown.crowdDensity,
        }
      };
    });
  }, [baseHexCells, timeWindow, activeScenario]);

  // Compute dynamic city-wide risk index
  const cityRiskIndex = React.useMemo(() => {
    if (hexCells.length === 0) return currentCity.cityRiskIndex;
    const sum = hexCells.reduce((acc, c) => acc + c.overallRisk, 0);
    return Math.round(sum / hexCells.length);
  }, [hexCells, currentCity.cityRiskIndex]);

  // SLA countdown timer simulation every second
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => {
        if (alert.status === 'resolved' || alert.status === 'closed') {
          return alert;
        }
        return {
          ...alert,
          slaRemainingSec: Math.max(0, alert.slaRemainingSec - 1)
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Push history on alert change for undo
  const saveStateToHistory = useCallback(() => {
    setHistoryStack(prev => [...prev.slice(-10), alerts]);
  }, [alerts]);

  const undoLastAction = useCallback(() => {
    if (historyStack.length > 0) {
      const previousState = historyStack[historyStack.length - 1];
      setAlerts(previousState);
      setHistoryStack(prev => prev.slice(0, -1));
    }
  }, [historyStack]);

  const updateAlertStatus = useCallback((alertId: string, newStatus: AlertStatus, notes?: string) => {
    saveStateToHistory();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          status: newStatus,
          auditTrail: [
            ...a.auditTrail,
            {
              timestamp: new Date().toISOString(),
              actor: `${userRole.toUpperCase()} Operator`,
              action: `Status changed to ${newStatus.toUpperCase()}`,
              details: notes || `Operational status updated via command interface.`
            }
          ]
        };
      }
      return a;
    }));
  }, [saveStateToHistory, userRole]);

  const assignAlertOperator = useCallback((alertId: string, operatorName: string) => {
    saveStateToHistory();
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return {
          ...a,
          assignedOperator: operatorName,
          status: a.status === 'new' ? 'assigned' : a.status,
          auditTrail: [
            ...a.auditTrail,
            {
              timestamp: new Date().toISOString(),
              actor: `${userRole.toUpperCase()} Dispatcher`,
              action: 'Assigned Operator',
              details: `Unit dispatched / assigned to ${operatorName}`
            }
          ]
        };
      }
      return a;
    }));
  }, [saveStateToHistory, userRole]);

  const dispatchEmergencyUnit = useCallback((cellId: string, unitType: string) => {
    saveStateToHistory();
    const targetCell = hexCells.find(c => c.id === cellId);
    const newAlert: AlertItem = {
      id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: `${unitType.toUpperCase()} Field Response Dispatched to ${targetCell?.name || 'Grid Sector'}`,
      category: 'emergency_surge',
      severity: 'high',
      status: 'in_progress',
      cellId: cellId,
      district: targetCell?.district || 'Central',
      lat: targetCell?.lat || currentCity.center[0],
      lng: targetCell?.lng || currentCity.center[1],
      createdAt: new Date().toISOString(),
      slaRemainingSec: 360,
      assignedOperator: `${unitType} Rapid Team Alpha`,
      predictedImpactWindow: 'Immediate (Next 5–15 mins)',
      confidencePercent: 95,
      aiExplanation: `Proactive pre-positioning recommendation triggered by operator for ${unitType} deployment to high-risk H3 cell.`,
      recommendedActions: [
        'Maintain open radio channel 4 with dispatch coordinator',
        'Establish perimeter buffer around high conflict intersection'
      ],
      auditTrail: [
        {
          timestamp: new Date().toISOString(),
          actor: `${userRole.toUpperCase()} Operator`,
          action: 'Proactive Unit Dispatch',
          details: `Dispatched ${unitType} to cell ${cellId}`
        }
      ],
      dataSignals: [
        { name: 'Dispatch Channel', value: 'CAD Priority 1', isAnomaly: false },
        { name: 'Estimated Arrival', value: '3.2 minutes', isAnomaly: false }
      ]
    };

    setAlerts(prev => [newAlert, ...prev]);
    if (audioAlertsEnabled) playAlertBeep();
  }, [hexCells, currentCity.center, saveStateToHistory, userRole, audioAlertsEnabled]);

  const toggleLayer = useCallback((layerKey: keyof RiskContextType['activeLayers']) => {
    setActiveLayers(prev => ({
      ...prev,
      [layerKey]: !prev[layerKey]
    }));
  }, []);

  const triggerScenario = useCallback((scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    if (scenario.alertToTrigger && scenario.alertToTrigger.title) {
      const fullAlert: AlertItem = {
        id: scenario.alertToTrigger.id || `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        title: scenario.alertToTrigger.title,
        category: scenario.alertToTrigger.category || scenario.targetCategory,
        severity: scenario.alertToTrigger.severity || 'critical',
        status: 'new',
        cellId: scenario.alertToTrigger.cellId || 'nyc-hex-101',
        district: scenario.alertToTrigger.district || 'Central District',
        lat: scenario.alertToTrigger.lat || currentCity.center[0],
        lng: scenario.alertToTrigger.lng || currentCity.center[1],
        createdAt: new Date().toISOString(),
        slaRemainingSec: 300,
        predictedImpactWindow: scenario.alertToTrigger.predictedImpactWindow || 'Next 15–30 mins',
        confidencePercent: scenario.alertToTrigger.confidencePercent || 92,
        aiExplanation: scenario.alertToTrigger.aiExplanation || 'Simulation alert generated.',
        recommendedActions: scenario.alertToTrigger.recommendedActions || ['Monitor and dispatch personnel.'],
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actor: 'Simulation Engine',
            action: 'Scenario Injected',
            details: `Injected scenario: ${scenario.name}`
          }
        ],
        dataSignals: scenario.alertToTrigger.dataSignals || []
      };

      setAlerts(prev => [fullAlert, ...prev]);
      if (audioAlertsEnabled) playAlertBeep();
    }
  }, [currentCity.center, audioAlertsEnabled]);

  const resetScenario = useCallback(() => {
    setActiveScenario(null);
  }, []);

  const toggleFeedOutage = useCallback((feedId: string) => {
    setDataFeeds(prev => prev.map(feed => {
      if (feed.id === feedId) {
        const nextStatus = feed.status === 'online' ? 'offline' : 'online';
        return {
          ...feed,
          status: nextStatus,
          latencyMs: nextStatus === 'offline' ? 8400 : 150,
          completenessPercent: nextStatus === 'offline' ? 0 : 98.4
        };
      }
      return feed;
    }));
  }, []);

  const uploadCustomDataset = useCallback((name: string, recordCount: number) => {
    setUploadedDatasets(prev => [
      { name, records: recordCount, timestamp: new Date().toLocaleTimeString() },
      ...prev
    ]);
  }, []);

  const unreadAlertCount = alerts.filter(a => a.status === 'new').length;

  return (
    <RiskContext.Provider
      value={{
        currentCity,
        setCity: setCurrentCityId,
        timeWindow,
        setTimeWindow,
        userRole,
        setUserRole,
        activeScreen,
        setActiveScreen,
        hexCells,
        selectedCell,
        setSelectedCell,
        alerts,
        unreadAlertCount,
        activeLayers,
        toggleLayer,
        dataFeeds,
        toggleFeedOutage,
        activeScenario,
        triggerScenario,
        resetScenario,
        audioAlertsEnabled,
        setAudioAlertsEnabled,
        isSimulating,
        setIsSimulating,
        updateAlertStatus,
        assignAlertOperator,
        dispatchEmergencyUnit,
        undoLastAction,
        canUndo: historyStack.length > 0,
        uploadCustomDataset,
        uploadedDatasets,
        cityRiskIndex
      }}
    >
      {children}
    </RiskContext.Provider>
  );
};

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (!context) {
    throw new Error('useRisk must be used within a RiskProvider');
  }
  return context;
};
