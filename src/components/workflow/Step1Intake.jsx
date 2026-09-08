import React from 'react';
import { FileText, User, Building, IndianRupee, ShieldAlert, Calendar, MapPin, Phone } from 'lucide-react';
import { formatINR, formatDateTime, getPriorityBadgeClass } from '../../utils/helpers';

export const Step1Intake = ({ complaint }) => {
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 1: RAW NCRP COMPLAINT DOSSIER
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
            {complaint.id} <span className="text-slate-500 font-normal">| {complaint.firNumber}</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{complaint.reportedStation}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-navy-950 px-3 py-2 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-500 uppercase block font-mono">Reported At</span>
            <span className="text-xs font-mono font-semibold text-slate-200">
              {formatDateTime(complaint.timestamp)}
            </span>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold ${getPriorityBadgeClass(complaint.priority)}`}>
            {complaint.priority} PRIORITY
          </span>
        </div>
      </div>

      {/* Grid of Key Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Victim Information */}
        <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <User className="w-4 h-4 text-sih-teal" />
            <span>Complainant Details</span>
          </h4>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 text-[11px] block">Full Name</span>
              <span className="font-semibold text-slate-200">{complaint.victim.name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Registered Contact</span>
              <span className="font-mono text-slate-300">{complaint.victim.phone}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Location / Jurisdiction</span>
              <span className="text-slate-300">{complaint.victim.city}</span>
            </div>
          </div>
        </div>

        {/* Source Banking Channel */}
        <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <Building className="w-4 h-4 text-sih-orange" />
            <span>Originating Banking Node</span>
          </h4>
          <div className="space-y-2.5 text-xs sm:text-sm">
            <div>
              <span className="text-slate-500 text-[11px] block">Victim Bank</span>
              <span className="font-semibold text-slate-200 font-mono">{complaint.victim.bank}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Masked Account Number</span>
              <span className="font-mono text-slate-300">{complaint.victim.accountNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">Branch IFSC Code</span>
              <span className="font-mono text-sih-teal font-semibold">{complaint.victim.ifsc}</span>
            </div>
          </div>
        </div>

        {/* Financial Loss */}
        <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800 bg-gradient-to-br from-navy-900 via-navy-850 to-red-950/20">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-red-400" />
            <span>Financial Siphoned Impact</span>
          </h4>
          <div className="space-y-2.5">
            <div>
              <span className="text-slate-500 text-[11px] block font-mono">Total Siphoned Amount</span>
              <span className="text-2xl sm:text-3xl font-mono font-bold text-red-400">
                {formatINR(complaint.amount)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <span className="text-slate-500 text-[11px] block">Modus Operandi Category</span>
              <span className="font-semibold text-orange-300 text-xs sm:text-sm">
                {complaint.fraudType}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Narrative Summary */}
      <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-sih-teal" />
          <span>Case Narrative & Modus Operandi Intelligence</span>
        </h4>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-navy-950/70 p-3.5 rounded-lg border border-slate-800/80">
          {complaint.summary}
        </p>
      </div>
    </div>
  );
};
