import React, { useState } from 'react';
import { RiskProvider, useRisk } from './context/RiskContext';
import { Header } from './components/layout/Header';
import { Navbar } from './components/layout/Navbar';
import { AlertTicker } from './components/layout/AlertTicker';
import { ScenarioModal } from './components/layout/ScenarioModal';
import { LiveCommandCenter } from './components/screens/LiveCommandCenter';
import { PredictiveTimeline } from './components/screens/PredictiveTimeline';
import { AlertManagement } from './components/screens/AlertManagement';
import { AnalyticsDashboard } from './components/screens/AnalyticsDashboard';
import { DataHealthMonitor } from './components/screens/DataHealthMonitor';
import { AIEngineInspector } from './components/screens/AIEngineInspector';
import { CitizenPortal } from './components/screens/CitizenPortal';

const AppContent: React.FC = () => {
  const { activeScreen } = useRisk();
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'command_center':
        return <LiveCommandCenter />;
      case 'predictive_timeline':
        return <PredictiveTimeline />;
      case 'alert_management':
        return <AlertManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'data_health':
        return <DataHealthMonitor />;
      case 'ai_inspector':
        return <AIEngineInspector />;
      case 'citizen_portal':
        return <CitizenPortal />;
      default:
        return <LiveCommandCenter />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-urip-darkest text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <Header onOpenScenarioModal={() => setIsScenarioModalOpen(true)} />

      {/* Screen Navigation Bar */}
      <Navbar />

      {/* Main Screen View Area */}
      <main className="flex-1 relative overflow-hidden">
        {renderActiveScreen()}
      </main>

      {/* Bottom Live Alert Ticker */}
      <AlertTicker />

      {/* Scenario Injection Modal */}
      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RiskProvider>
      <AppContent />
    </RiskProvider>
  );
};

export default App;
