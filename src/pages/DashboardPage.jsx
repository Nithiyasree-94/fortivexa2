import React, { useState } from 'react';
import { Shield, ShieldAlert, GitBranch, Crosshair, CheckCircle, PlusCircle, RefreshCw } from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { AnalyticsCharts } from '../components/dashboard/AnalyticsCharts';
import { ComplaintsTable } from '../components/dashboard/ComplaintsTable';
import { IntakeModal } from '../components/dashboard/IntakeModal';
import { formatINR } from '../utils/helpers';

export const DashboardPage = ({
  stats,
  complaints,
  onSelectCase,
  onAddComplaint,
  onRefresh
}) => {
  const [isIntakeOpen, setIsIntakeOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner / Intelligence Status */}
      <div className="cyber-card rounded-2xl p-5 border border-slate-800/80 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sih-teal uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>National Cyber Threat Analytics Unit (NCTAU)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-mono text-slate-100 mt-1">
            Predictive Cash-Out Interception Console
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-hop mule trail tracking and preemptive ATM withdrawal forecasting
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsIntakeOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sih-orange to-amber-600 hover:from-orange-500 hover:to-amber-500 text-navy-950 font-bold text-xs font-mono flex items-center space-x-2 shadow-glow-orange transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ INGEST COMPLAINT</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Complaints Today"
          value={stats?.totalComplaintsToday || 42}
          subtext="vs 37 daily avg"
          trend="+14%"
          icon={ShieldAlert}
          color="orange"
        />

        <StatCard
          title="Active Mule Chains Tracked"
          value={stats?.activeMuleChains || 18}
          subtext="across 8 banking nodes"
          trend="+3 new"
          icon={GitBranch}
          color="teal"
        />

        <StatCard
          title="High-Risk Predictions Pending"
          value={stats?.highRiskPending || 6}
          subtext="withdrawal within 4 hrs"
          trend="ACTION REQUIRED"
          icon={Crosshair}
          color="red"
        />

        <StatCard
          title="Cases Intercepted (30 Days)"
          value={stats?.casesIntercepted || 29}
          subtext="₹1.84 Cr safeguarded"
          trend="+87% success"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts stats={stats} />

      {/* Live Complaints Ingestion Table */}
      <ComplaintsTable
        complaints={complaints}
        onSelectCase={onSelectCase}
      />

      {/* Quick Intake Modal */}
      <IntakeModal
        isOpen={isIntakeOpen}
        onClose={() => setIsIntakeOpen(false)}
        onSubmit={onAddComplaint}
      />

    </div>
  );
};
