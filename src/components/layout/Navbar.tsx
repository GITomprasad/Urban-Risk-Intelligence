import React from 'react';
import { 
  Compass, 
  TrendingUp, 
  BarChart3, 
  Radio, 
  Cpu, 
  Eye, 
  Bell, 
  Layers 
} from 'lucide-react';
import { useRisk } from '../../context/RiskContext';
import { ActiveScreen } from '../../types';

export const Navbar: React.FC = () => {
  const { activeScreen, setActiveScreen, unreadAlertCount, dataFeeds } = useRisk();

  const offlineFeedCount = dataFeeds.filter(f => f.status === 'offline' || f.status === 'degraded').length;

  const navItems: {
    id: ActiveScreen;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'command_center',
      label: 'Live Command Center',
      icon: Compass
    },
    {
      id: 'predictive_timeline',
      label: '24h Predictive Timeline',
      icon: TrendingUp
    },
    {
      id: 'alert_management',
      label: 'Alert Center & SLA',
      icon: Bell,
      badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'analytics',
      label: 'Analytics & Accuracy',
      icon: BarChart3
    },
    {
      id: 'data_health',
      label: 'Data Stream Monitor',
      icon: Radio,
      badge: offlineFeedCount > 0 ? `${offlineFeedCount} issue` : '7/7 live',
      badgeColor: offlineFeedCount > 0 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
    },
    {
      id: 'ai_inspector',
      label: 'AI & SHAP Engine',
      icon: Cpu
    },
    {
      id: 'citizen_portal',
      label: 'Citizen Portal',
      icon: Eye
    }
  ];

  return (
    <nav className="bg-urip-darkest/90 border-b border-urip-border px-4 overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1 min-w-max">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-urip-card text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,229,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-urip-panel/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold leading-tight ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
