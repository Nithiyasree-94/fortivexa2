import React, { useState } from 'react';
import { Bell, ShieldAlert, CheckCircle, Clock, ArrowRight, Filter, Search, ShieldCheck } from 'lucide-react';
import { formatINR, getStatusBadgeClass } from '../../utils/helpers';

export const AlertsPanel = ({ alerts = [], onUpdateAlertStatus, onSelectCase }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredAlerts = alerts.filter(item => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch = 
      item.caseId.toLowerCase().includes(search.toLowerCase()) ||
      item.primaryLocation.toLowerCase().includes(search.toLowerCase()) ||
      item.unit.toLowerCase().includes(search.toLowerCase()) ||
      (item.victimName && item.victimName.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = alerts.filter(a => a.status === 'Pending').length;
  const watchCount = alerts.filter(a => a.status === 'Under Watch').length;
  const interceptedCount = alerts.filter(a => a.status === 'Intercepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header & Stat Counters */}
      <div className="cyber-card rounded-2xl p-6 border border-slate-800/80 bg-navy-900/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sih-orange uppercase tracking-wider">
            <Bell className="w-4 h-4 text-sih-orange" />
            <span>National Cybercrime Tactical Dispatch Registry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
            Active Cash-Out Interception Alerts
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tactical intelligence broadcasts transmitted to state police quick response teams
          </p>
        </div>

        {/* Quick KPI pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-navy-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Pending</span>
            <span className="text-lg font-bold font-mono text-amber-400">{pendingCount}</span>
          </div>
          <div className="bg-navy-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Under Watch</span>
            <span className="text-lg font-bold font-mono text-cyan-400">{watchCount}</span>
          </div>
          <div className="bg-navy-950 px-3.5 py-2 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-mono block">Intercepted</span>
            <span className="text-lg font-bold font-mono text-emerald-400">{interceptedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card rounded-xl p-4 border border-slate-800 bg-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Case ID, ATM location, unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sih-teal"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['ALL', 'Pending', 'Under Watch', 'Intercepted'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === status
                  ? 'bg-sih-orange/20 text-sih-orange border-sih-orange/60 font-semibold'
                  : 'bg-navy-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              {status === 'ALL' ? 'All Alerts' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-slate-500 cyber-card rounded-2xl border border-slate-800">
            No active tactical alerts match the selected filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isIntercepted = alert.status === 'Intercepted';
            const isHighRisk = alert.confidence >= 80;

            return (
              <div
                key={alert.alertId}
                className={`cyber-card rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                  isIntercepted
                    ? 'border-emerald-800/60 bg-navy-900/60'
                    : isHighRisk
                    ? 'border-orange-800/80 hover:border-sih-orange bg-navy-900/80 shadow-glow-orange'
                    : 'border-slate-800 hover:border-slate-700 bg-navy-900/70'
                }`}
              >
                <div>
                  {/* Top Bar: Alert ID & Status Badge */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center space-x-2 font-mono">
                      <span className="text-sih-orange font-bold text-xs">{alert.alertId}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 text-xs font-semibold">{alert.caseId}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${getStatusBadgeClass(alert.status)}`}>
                      {alert.status}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="mt-3 space-y-2.5">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-mono block">Forecasted Withdrawal ATM</span>
                      <h4 className="font-bold text-sm sm:text-base text-slate-100">
                        {alert.primaryLocation}
                      </h4>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{alert.address}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                      <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block font-mono">Prediction Confidence</span>
                        <span className={`font-mono font-bold text-sm ${isHighRisk ? 'text-red-400' : 'text-orange-400'}`}>
                          {alert.confidence}%
                        </span>
                      </div>

                      <div className="bg-navy-950 p-2.5 rounded-lg border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block font-mono">Amount at Risk</span>
                        <span className="font-mono font-bold text-sm text-slate-200">
                          {formatINR(alert.amount)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-slate-400">
                      <span className="text-slate-500">Field Unit: </span>
                      <span className="text-slate-300 font-medium">{alert.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCase(alert.caseId)}
                    className="text-xs text-sih-teal hover:text-cyan-300 font-semibold flex items-center space-x-1"
                  >
                    <span>View 6-Step Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {!isIntercepted ? (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.alertId, 'Intercepted')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-700/80 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Mark Intercepted</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400 flex items-center space-x-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Intervention Complete</span>
                    </span>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
