import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';

export const AnalyticsCharts = ({ stats }) => {
  const velocityData = stats?.velocityTimeline || [
    { time: '00:00', amountLakhs: 4.2, cases: 2 },
    { time: '04:00', amountLakhs: 2.1, cases: 1 },
    { time: '08:00', amountLakhs: 8.5, cases: 4 },
    { time: '12:00', amountLakhs: 19.8, cases: 9 },
    { time: '16:00', amountLakhs: 34.2, cases: 16 },
    { time: '20:00', amountLakhs: 28.6, cases: 12 },
  ];

  const categoryData = stats?.fraudTypeBreakdown || [
    { name: 'Digital Arrest', count: 18, fill: '#f97316' },
    { name: 'Crypto Ponzi', count: 11, fill: '#06b6d4' },
    { name: 'Job Task Fraud', count: 9, fill: '#3b82f6' },
    { name: 'Electricity Phish', count: 6, fill: '#eab308' },
    { name: 'SIM Swap', count: 5, fill: '#ec4899' },
    { name: 'Loan App Extortion', count: 3, fill: '#8b5cf6' },
  ];

  const barColors = ['#f97316', '#06b6d4', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
      {/* 24-Hour Velocity Curve */}
      <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sih-orange animate-ping" />
              <span>24h Siphoned Fund Velocity & Extraction Wave</span>
            </h4>
            <p className="text-xs text-slate-400">Total volume in ₹ Lakhs routed to withdrawal nodes</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
            PEAK: 16:00 - 20:00
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e162b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val) => [`₹${val} Lakhs`, 'Siphoned Outflow']}
              />
              <Area
                type="monotone"
                dataKey="amountLakhs"
                stroke="#f97316"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fraud Category Breakdown */}
      <div className="cyber-card rounded-xl p-4 sm:p-5 border border-slate-800/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-slate-100 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sih-teal animate-pulse" />
              <span>Cybercrime Taxonomy Breakdown (Today)</span>
            </h4>
            <p className="text-xs text-slate-400">Cases flagged by I4C National Cyber Intelligence</p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            NCRP TAXONOMY
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                width={95}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0e162b',
                  borderColor: '#334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '12px',
                }}
                formatter={(val) => [`${val} Cases`, 'Frequency']}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
