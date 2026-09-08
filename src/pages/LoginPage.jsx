import React, { useState } from 'react';
import { Shield, Lock, User, Building, ArrowRight, Radio, AlertOctagon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [officerId, setOfficerId] = useState('CYB-DEL-742');
  const [password, setPassword] = useState('••••••••••••');
  const [department, setDepartment] = useState('Indian Cybercrime Coordination Centre (I4C)');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(officerId, department);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between relative overflow-hidden cyber-grid">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-sih-teal/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-sih-orange/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar / Gov Header */}
      <header className="p-4 sm:p-6 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-navy-900 border border-sih-orange/40 flex items-center justify-center text-sih-orange shadow-glow-orange">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-wider font-display uppercase text-slate-200">
              Government of India
            </h1>
            <p className="text-[11px] text-slate-400 font-sans">
              Ministry of Home Affairs • Cyber and Information Security (CIS) Division
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono bg-navy-900/80 px-3 py-1.5 rounded-full border border-slate-800">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="text-emerald-400">SERVER SECURE // SSL 4096-BIT</span>
        </div>
      </header>

      {/* Centered Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <div className="cyber-card w-full max-w-md rounded-2xl border border-slate-800/80 shadow-2xl p-6 sm:p-8 relative bg-navy-900/85 backdrop-blur-xl">
          
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-sih-orange rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-sih-teal rounded-tr-lg" />

          {/* Card Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 border border-slate-700/80 mb-3 shadow-inner">
              <Shield className="w-7 h-7 text-sih-orange" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-slate-100">
              Cybercrime Cash-Out Prediction Portal
            </h2>
            <div className="flex items-center justify-center space-x-2 mt-1.5">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sih-orange/15 text-sih-orange border border-sih-orange/40 font-semibold uppercase">
                SIH26184
              </span>
              <span className="text-xs text-slate-400 font-sans">
                Law Enforcement Intelligence Console
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Officer ID / Service Number
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. CYB-DEL-742"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sih-teal font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Security Password / Token PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Enter authorized password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sih-teal font-mono transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Department / Operational Wing
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-navy-950/80 border border-slate-700 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-sih-teal transition-colors"
                >
                  <option value="Indian Cybercrime Coordination Centre (I4C)">
                    Indian Cybercrime Coordination Centre (I4C)
                  </option>
                  <option value="Cyber Crime Cell (Special Unit)">
                    Cyber Crime Cell (State Police)
                  </option>
                  <option value="State Police Cyber Headquarters">
                    State Police Cyber Headquarters
                  </option>
                  <option value="Bank Fraud Liaison & Nodal Desk">
                    Bank Fraud Liaison & Nodal Desk
                  </option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sih-orange via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-navy-950 font-bold font-mono text-sm flex items-center justify-center space-x-2 shadow-glow-orange transition-all duration-200"
              >
                <span>SECURE LOGIN</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-navy-950/60 border border-slate-800 text-[11px] text-slate-400 text-center flex items-center justify-center space-x-1.5 font-mono">
              <AlertOctagon className="w-3.5 h-3.5 text-sih-orange" />
              <span>Prototype Mode: Enter any ID to access command console</span>
            </div>
          </form>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 font-mono relative z-10 border-t border-slate-900">
        <p>Ministry of Home Affairs | Restricted Access • Smart India Hackathon 2026</p>
      </footer>

    </div>
  );
};
