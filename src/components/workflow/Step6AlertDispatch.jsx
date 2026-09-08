import React, { useState } from 'react';
import { ShieldCheck, Send, Radio, CheckCircle, AlertTriangle, Building, PhoneCall, ArrowRight, UserCheck } from 'lucide-react';
import { formatINR, getStatusBadgeClass } from '../../utils/helpers';

export const Step6AlertDispatch = ({ complaint, onUpdateStatus }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(complaint.status === 'Intercepted');

  const topPrediction = complaint.predictions[0] || {};
  const alertInfo = complaint.alert || {
    alertId: `ALT-2026-${Math.floor(9000 + Math.random() * 900)}`,
    unit: topPrediction.nearestUnit || 'Cyber Crime Quick Response Unit',
    officer: 'Insp. Tactical Commander',
    dispatchChannel: 'I4C Secure Tactical Frequency',
    timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
    interceptStatus: complaint.status
  };

  const handleIntercept = async () => {
    setIsUpdating(true);
    await onUpdateStatus(complaint.id, 'Intercepted');
    setIsSuccess(true);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 6: ACTIONABLE INTELLIGENCE DISPATCH & INTERCEPTION
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
            Tactical Intervention Memo & Unit Coordination
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time broadcast to local field units, bank nodal officers, and rapid intervention teams
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Current Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${getStatusBadgeClass(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
      </div>

      {/* Success Notification Banner if Intercepted */}
      {isSuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/80 shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm sm:text-base text-emerald-200">
                CASE SUCCESSFULLY INTERCEPTED BY FIELD POLICE UNIT!
              </h4>
              <p className="text-xs text-emerald-300/80">
                Cash extraction prevented at {topPrediction.locationName}. {formatINR(complaint.amount)} safeguarded.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-900 text-emerald-300 border border-emerald-700">
            FUNDS FROZEN
          </span>
        </div>
      )}

      {/* Official Tactical Dispatch Memo Card */}
      <div className="cyber-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6 relative overflow-hidden bg-navy-950">
        
        {/* Top Memo Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-orange-950/80 border border-sih-orange/50 flex items-center justify-center text-sih-orange shadow-glow-orange">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-sih-orange uppercase tracking-wider">
                MHA TACTICAL DISPATCH ADVISORY
              </span>
              <h4 className="text-lg sm:text-xl font-bold font-mono text-slate-100">
                {alertInfo.alertId}
              </h4>
              <p className="text-xs text-slate-400">
                Generated from Complaint {complaint.id} • FIR {complaint.firNumber}
              </p>
            </div>
          </div>

          <div className="bg-navy-900/90 p-3 rounded-xl border border-slate-800 text-right font-mono text-xs">
            <div className="text-slate-400 text-[10px] uppercase">Dispatch Timestamp</div>
            <div className="font-bold text-slate-200 mt-0.5">{alertInfo.timestamp}</div>
            <div className="text-sih-teal text-[11px] flex items-center justify-end space-x-1 mt-1">
              <Radio className="w-3 h-3 animate-pulse" />
              <span>Broadcast Active</span>
            </div>
          </div>
        </div>

        {/* Dispatch Target Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Target Location Box */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              1. Targeted Cash-Out Periphery
            </span>
            <p className="font-bold text-slate-100 text-base">
              {topPrediction.locationName}
            </p>
            <p className="text-xs text-slate-400">{topPrediction.address}</p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Time Window:</span>
              <span className="text-sih-orange font-semibold">{topPrediction.window}</span>
            </div>
          </div>

          {/* Assigned QRT Unit */}
          <div className="p-4 rounded-xl bg-navy-900/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase block">
              2. Dispatched Enforcement Task Force
            </span>
            <p className="font-bold text-slate-100 text-base">
              {alertInfo.unit}
            </p>
            <p className="text-xs text-slate-400">Officer Assigned: {alertInfo.officer}</p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Radio Channel:</span>
              <span className="text-sih-teal font-semibold">{alertInfo.dispatchChannel}</span>
            </div>
          </div>
        </div>

        {/* Recommended Action Plan */}
        <div className="p-4 rounded-xl bg-navy-900/50 border border-slate-800 space-y-2 text-xs">
          <span className="font-mono text-slate-400 uppercase text-[11px] block font-bold text-sih-teal">
            Recommended Tactical Protocol (SOP-CYB-04):
          </span>
          <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs sm:text-sm">
            <li>Deploy 2 undercover officers in plainclothes at ATM vestibule entrance.</li>
            <li>Coordinate with {topPrediction.bank} nodal manager to place automated debit-hold on mule cards.</li>
            <li>Monitor nearby surveillance CCTV feeds for runner vehicle identification.</li>
          </ul>
        </div>

        {/* Action Button: Mark as Intercepted */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 font-mono">
            <span>Amount at Risk: </span>
            <span className="font-bold text-slate-100 text-sm">{formatINR(complaint.amount)}</span>
          </div>

          <button
            onClick={handleIntercept}
            disabled={isUpdating || isSuccess}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold font-mono text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all shadow-lg ${
              isSuccess
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 cursor-default'
                : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-navy-950 border border-emerald-400 shadow-[0_0_20px_-3px_rgba(16,185,129,0.4)]'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>
              {isSuccess
                ? 'CASE INTERCEPTED & CLOSED'
                : isUpdating
                ? 'UPDATING STATE...'
                : 'MARK AS INTERCEPTED'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
