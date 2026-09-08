import React from 'react';
import { LayoutDashboard, FilePlus, GitBranch, Map, Bell } from 'lucide-react';

export const Navigation = ({ activeTab, onTabChange, pendingAlertCount = 0, selectedCaseId }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'intake', label: 'New Complaint Intake', icon: FilePlus },
    { 
      id: 'workflow', 
      label: selectedCaseId ? `Case Analysis (${selectedCaseId})` : 'Case Analysis (Workflow)', 
      icon: GitBranch,
      highlight: !!selectedCaseId 
    },
    { id: 'map', label: 'Risk Map Hotspots', icon: Map },
    { 
      id: 'alerts', 
      label: 'Tactical Alerts', 
      icon: Bell, 
      badge: pendingAlertCount > 0 ? pendingAlertCount : null 
    },
  ];

  return (
    <nav className="bg-navy-900/60 border-b border-slate-800/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-4 overflow-x-auto py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-sih-orange/20 to-sih-teal/10 text-white border border-sih-orange/50 shadow-glow-orange'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-navy-850/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sih-orange' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] font-bold font-mono bg-red-500 text-white animate-pulse">
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
