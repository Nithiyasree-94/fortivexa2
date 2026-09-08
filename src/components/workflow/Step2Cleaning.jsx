import React, { useState, useEffect } from 'react';
import { CheckCircle2, Loader2, AlertCircle, Terminal, ShieldCheck, RefreshCw } from 'lucide-react';

export const Step2Cleaning = ({ complaint }) => {
  const [completedSteps, setCompletedSteps] = useState([0, 1, 2, 3]);
  const [isSimulating, setIsSimulating] = useState(false);

  const checks = [
    {
      title: 'IFSC Format & RBI Clearing Route Validation',
      detail: `Validated code '${complaint.victim.ifsc}' against Reserve Bank of India National Financial Switch registry. Status: Active branch verified.`,
      status: 'VERIFIED',
    },
    {
      title: 'NCRP Deduplication & Multi-FIR Collision Analysis',
      detail: 'Checked against 1,240,000+ national cybercrime complaint database. No conflicting FIR or dual-reporting detected.',
      status: 'CLEARED',
    },
    {
      title: 'Entity Normalization & PAN/Aadhaar Cross-Reference',
      detail: 'Standardized beneficiary names, flagged synthetic shell identity mapped across multiple state jurisdictions.',
      status: 'RESOLVED',
    },
    {
      title: 'Telecom CDR Geofence & IMSI Triangulation Check',
      detail: 'Parsed victim telecom circle, matched IP hop to mule cell tower coordinates within extraction corridor.',
      status: 'CROSS-MATCHED',
    },
    {
      title: 'Missing Field Imputation & Formatting Normalization',
      detail: 'Normalized ISO timestamps, UTC+05:30 offset aligned, currency decimals rounded to precision standards.',
      status: 'COMPLETED',
    }
  ];

  const handleRerun = () => {
    setCompletedSteps([]);
    setIsSimulating(true);
  };

  useEffect(() => {
    if (isSimulating) {
      const timers = checks.map((_, index) => {
        return setTimeout(() => {
          setCompletedSteps((prev) => [...prev, index]);
          if (index === checks.length - 1) {
            setIsSimulating(false);
          }
        }, (index + 1) * 450);
      });

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [isSimulating]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 2: AUTOMATED DATA CLEANING & STANDARDIZATION ENGINE
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
            Automated Ingestion Pipeline Quality Audit
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Standardizes raw telemetry, validates bank IFSC formats, and deduplicates complaint signatures
          </p>
        </div>

        <button
          onClick={handleRerun}
          disabled={isSimulating}
          className="px-3.5 py-1.5 rounded-lg bg-navy-850 hover:bg-navy-800 text-sih-teal border border-sih-teal/40 text-xs font-mono flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'Validating...' : 'Re-Run Verification'}</span>
        </button>
      </div>

      {/* Validation Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Step by Step Checklist */}
        <div className="lg:col-span-2 space-y-3">
          {checks.map((check, index) => {
            const isDone = completedSteps.includes(index);
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isDone
                    ? 'bg-navy-900/80 border-emerald-900/60 shadow-[0_0_15px_-5px_rgba(16,185,129,0.1)]'
                    : 'bg-navy-950/60 border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 flex-shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-scaleUp" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-slate-500 animate-spin" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-slate-100' : 'text-slate-400'}`}>
                        {check.title}
                      </h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        isDone
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isDone ? check.status : 'PROCESSING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {check.detail}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Live Simulated Terminal Log */}
        <div className="cyber-card rounded-xl border border-slate-800 p-4 font-mono text-xs flex flex-col h-full bg-navy-950">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-sih-teal" />
              <span className="font-semibold text-[11px] text-slate-200">SANITIZATION AUDIT LOG</span>
            </div>
            <span className="text-[10px] text-emerald-400 animate-pulse">● LIVE</span>
          </div>

          <div className="space-y-2 text-[11px] text-slate-300 flex-1 overflow-y-auto max-h-[280px]">
            <p className="text-slate-500">[{new Date().toLocaleTimeString('en-IN')}] Initializing Data Cleaning Pipeline v2.4...</p>
            <p className="text-cyan-400">&gt; Ingesting FIR: {complaint.firNumber}</p>
            <p className="text-slate-400">&gt; Originating Bank IFSC: {complaint.victim.ifsc} [MATCH OK]</p>
            <p className="text-emerald-400">&gt; Deduplication: Zero collisions in active 24h index</p>
            <p className="text-amber-400">&gt; Entity Profiling: Pan-India shell entity flagged</p>
            <p className="text-slate-400">&gt; Amount verified: INR {complaint.amount.toLocaleString('en-IN')}</p>
            <p className="text-emerald-300">&gt; Normalization: Schema transformed to Graph Format</p>
            <p className="text-slate-500">------------------------------------</p>
            <p className="text-sih-teal font-bold">&gt;&gt; READY FOR MULE GRAPH SYNTHESIS</p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pipeline Confidence</span>
            <span className="font-bold text-emerald-400">100% CLEANED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
