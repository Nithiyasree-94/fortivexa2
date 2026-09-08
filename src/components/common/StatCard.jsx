import React from 'react';

export const StatCard = ({ title, value, subtext, icon: Icon, color = 'teal', trend }) => {
  const colorStyles = {
    teal: {
      border: 'border-cyan-800/50 hover:border-cyan-500/60',
      iconBg: 'bg-cyan-950/80 text-cyan-400 border border-cyan-700/40',
      glow: 'hover:shadow-glow-teal',
      text: 'text-cyan-400'
    },
    orange: {
      border: 'border-orange-800/50 hover:border-orange-500/60',
      iconBg: 'bg-orange-950/80 text-orange-400 border border-orange-700/40',
      glow: 'hover:shadow-glow-orange',
      text: 'text-orange-400'
    },
    red: {
      border: 'border-red-800/50 hover:border-red-500/60',
      iconBg: 'bg-red-950/80 text-red-400 border border-red-700/40',
      glow: 'hover:shadow-glow-red',
      text: 'text-red-400'
    },
    emerald: {
      border: 'border-emerald-800/50 hover:border-emerald-500/60',
      iconBg: 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/40',
      glow: 'hover:shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]',
      text: 'text-emerald-400'
    }
  };

  const currentStyle = colorStyles[color] || colorStyles.teal;

  return (
    <div className={`cyber-card rounded-xl p-4 sm:p-5 transition-all duration-300 ${currentStyle.border} ${currentStyle.glow}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-slate-100">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${currentStyle.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {(subtext || trend) && (
        <div className="mt-3 flex items-center space-x-2 text-xs">
          {trend && (
            <span className={`font-semibold font-mono px-1.5 py-0.5 rounded ${
              trend.startsWith('+') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-300'
            }`}>
              {trend}
            </span>
          )}
          <span className="text-slate-400">{subtext}</span>
        </div>
      )}
    </div>
  );
};
