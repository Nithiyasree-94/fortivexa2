import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, LogOut, Radio, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = () => {
  const { officer, logout } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Branding & MHA Insignia */}
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sih-orange/20 via-navy-800 to-sih-teal/20 border border-sih-orange/40 flex items-center justify-center shadow-glow-orange">
            <Shield className="w-6 h-6 text-sih-orange animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-lg tracking-wider text-slate-100 uppercase">
                FortiVexa <span className="text-sih-teal">Intelligence</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-sih-orange/20 text-sih-orange border border-sih-orange/40 font-semibold font-mono">
                SIH26184
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center space-x-1.5 font-sans">
              <span>Cybercrime Cash-Out Prediction & Interception</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">MHA / I4C Portal</span>
            </p>
          </div>
        </div>

        {/* Center: Live Terminal & Security Status */}
        <div className="hidden lg:flex items-center space-x-4 bg-navy-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 font-mono text-xs">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span className="text-[11px] font-medium tracking-wide">NCRP SECURE FEED: ACTIVE</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center space-x-1.5 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-sih-teal" />
            <span>{formattedDate} {formattedTime} IST</span>
          </div>
        </div>

        {/* Right: Officer Profile & Logout */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <div className="flex items-center justify-end space-x-1.5">
              <UserCheck className="w-3.5 h-3.5 text-sih-teal" />
              <span className="text-xs font-semibold text-slate-200">
                {officer?.officerId || 'OFFICER-SESSION'}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                LVL 4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
              {officer?.department || 'Cyber Crime Cell'}
            </p>
          </div>

          <button
            onClick={logout}
            title="Sign Out"
            className="p-2 rounded-lg bg-navy-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-700/60 transition-all flex items-center space-x-1 text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Exit</span>
          </button>
        </div>

      </div>
    </header>
  );
};
