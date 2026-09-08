import React, { useState } from 'react';
import { Search, Filter, ArrowRight, ShieldAlert, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { formatINR, formatDateTime, getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/helpers';

export const ComplaintsTable = ({ complaints, onSelectCase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = complaints.filter(item => {
    const matchesSearch = 
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.victim.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.victim.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fraudType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.victim.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="cyber-card rounded-xl border border-slate-800/80 overflow-hidden shadow-xl">
      {/* Table Header Controls */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-navy-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
            <span>Live NCRP Complaint Ingestion Feed</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
              {filtered.length} Active Feeds
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any complaint row to launch the predictive cash-out interception workflow
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search case, bank, victim..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-navy-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sih-teal"
            />
          </div>

          <div className="flex items-center space-x-1 bg-navy-950 p-1 rounded-lg border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            {['ALL', 'Pending Analysis', 'Alert Dispatched', 'Intercepted'].map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2.5 py-1 rounded text-xs transition-colors ${
                  statusFilter === filter
                    ? 'bg-sih-orange/20 text-sih-orange border border-sih-orange/50 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {filter === 'ALL' ? 'All' : filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-navy-950/80 text-slate-400 border-b border-slate-800 font-mono text-xs uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Case / FIR No.</th>
              <th className="py-3.5 px-4">Victim & City</th>
              <th className="py-3.5 px-4">Victim Bank</th>
              <th className="py-3.5 px-4">Fraud Category</th>
              <th className="py-3.5 px-4 text-right">Amount (INR)</th>
              <th className="py-3.5 px-4">Priority</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-500 text-sm">
                  No complaints match your search filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onSelectCase(item.id)}
                  className="hover:bg-navy-850/70 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-medium text-slate-200">
                    <div className="text-sih-cyan group-hover:text-sih-orange transition-colors">
                      {item.id}
                    </div>
                    <div className="text-[11px] text-slate-500">{item.firNumber}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{item.victim.name}</div>
                    <div className="text-[11px] text-slate-400">{item.victim.city}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-navy-900 border border-slate-700 text-xs font-mono text-slate-300">
                      {item.victim.bank}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 max-w-[220px]">
                    <div className="text-slate-300 truncate font-medium" title={item.fraudType}>
                      {item.fraudType}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {formatDateTime(item.timestamp)}
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-100">
                    {formatINR(item.amount)}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${getPriorityBadgeClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs inline-flex items-center space-x-1 ${getStatusBadgeClass(item.status)}`}>
                      <span>{item.status}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCase(item.id);
                      }}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-sih-orange/10 hover:bg-sih-orange/20 text-sih-orange border border-sih-orange/40 text-xs font-semibold group-hover:border-sih-orange transition-all"
                    >
                      <span>Analyze</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
