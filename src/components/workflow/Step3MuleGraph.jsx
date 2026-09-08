import React, { useState } from 'react';
import { ArrowRight, Layers, ShieldAlert, User, Landmark, Banknote, AlertTriangle, Eye, Shield } from 'lucide-react';
import { formatINR } from '../../utils/helpers';

export const Step3MuleGraph = ({ complaint }) => {
  const { muleChain } = complaint;
  const [selectedNode, setSelectedNode] = useState(muleChain.nodes[0] || null);

  const getNodeColor = (role, risk) => {
    if (role.toLowerCase().includes('victim')) {
      return {
        bg: 'bg-cyan-950/90',
        border: 'border-cyan-500',
        glow: 'shadow-glow-teal',
        text: 'text-cyan-400',
        badge: 'bg-cyan-900/60 text-cyan-300'
      };
    }
    if (role.toLowerCase().includes('cash') || risk >= 95) {
      return {
        bg: 'bg-red-950/95',
        border: 'border-red-500',
        glow: 'shadow-glow-red animate-pulse',
        text: 'text-red-400',
        badge: 'bg-red-900/60 text-red-300'
      };
    }
    if (risk >= 85) {
      return {
        bg: 'bg-orange-950/90',
        border: 'border-orange-500',
        glow: 'shadow-glow-orange',
        text: 'text-orange-400',
        badge: 'bg-orange-900/60 text-orange-300'
      };
    }
    return {
      bg: 'bg-amber-950/90',
      border: 'border-amber-500',
      glow: 'shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]',
      text: 'text-amber-400',
      badge: 'bg-amber-900/60 text-amber-300'
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-navy-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-sih-teal uppercase">
            STAGE 3: MULTI-HOP MULE ACCOUNT GRAPH TOPOLOGY
          </span>
          <h3 className="text-lg sm:text-xl font-bold font-mono text-slate-100 mt-0.5">
            Fund Dispersion & Laundering Trail Visualization
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tracking money hop-by-hop from Victim account to final cash withdrawal mule nodes
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Total Hops:</span>
          <span className="text-sih-orange font-bold">{muleChain.links.length} Layer Transitions</span>
        </div>
      </div>

      {/* Main Interactive Graph Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Canvas: 2 Cols */}
        <div className="lg:col-span-2 cyber-card rounded-2xl border border-slate-800 p-4 sm:p-6 overflow-hidden relative min-h-[420px] flex flex-col justify-between bg-navy-950/90">
          
          {/* Subtle Cyber Radar Lines in Background */}
          <div className="absolute inset-0 cyber-grid pointer-events-none opacity-40" />

          <div className="relative z-10 flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Interactive Money Flow Topology</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Click any node to inspect risk dossier</span>
          </div>

          {/* Node-Edge Flow Display */}
          <div className="relative z-10 flex flex-col space-y-4 my-auto">
            {muleChain.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const style = getNodeColor(node.role, node.risk);
              const linkFromThis = muleChain.links.find(l => l.source === node.id);

              return (
                <div key={node.id} className="space-y-3">
                  {/* Node Card */}
                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`cursor-pointer rounded-xl p-3.5 sm:p-4 border transition-all duration-300 flex items-center justify-between gap-4 ${
                      style.bg
                    } ${
                      isSelected
                        ? `ring-2 ring-sih-teal border-sih-teal shadow-glow-teal`
                        : `${style.border} hover:border-slate-400`
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`p-2.5 rounded-lg bg-navy-950/80 border ${style.border}`}>
                        {index === 0 ? (
                          <User className="w-5 h-5 text-cyan-400" />
                        ) : index === muleChain.nodes.length - 1 ? (
                          <Banknote className="w-5 h-5 text-red-400 animate-bounce" />
                        ) : (
                          <Landmark className="w-5 h-5 text-orange-400" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-100">
                            {node.label}
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${style.badge}`}>
                            {node.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 flex items-center space-x-2 mt-0.5 font-mono">
                          <span className="text-slate-300">{node.bank}</span>
                          <span>•</span>
                          <span>{node.acc}</span>
                          {node.city && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400">{node.city}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Risk Badge */}
                    <div className="text-right font-mono flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 uppercase">Mule Risk Index</span>
                      <div className="flex items-center space-x-1">
                        <span className={`text-base sm:text-lg font-bold ${style.text}`}>
                          {node.risk}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Edge Connection with Transaction Amount & Type */}
                  {linkFromThis && (
                    <div className="pl-6 sm:pl-8 flex items-center space-x-3 text-xs font-mono py-1">
                      <div className="h-6 w-0.5 bg-gradient-to-b from-sih-teal via-sih-orange to-red-500" />
                      <div className="flex flex-wrap items-center gap-2 bg-navy-900/90 px-3 py-1.5 rounded-lg border border-slate-700/80 shadow">
                        <ArrowRight className="w-3.5 h-3.5 text-sih-orange animate-pulse" />
                        <span className="font-bold text-slate-100">{formatINR(linkFromThis.amount)}</span>
                        <span className="text-slate-500">•</span>
                        <span className="px-1.5 py-0.2 rounded bg-navy-950 text-cyan-300 border border-cyan-800 text-[10px] font-semibold">
                          {linkFromThis.type}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px]">{linkFromThis.time}</span>
                        <span className="text-[10px] text-slate-500 hidden sm:inline">UTR: {linkFromThis.txId}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Graph Algorithm: Directed Acyclic Mule Chain (DAMC)</span>
            <span className="text-sih-teal font-mono">Velocity: ₹{(complaint.amount / (muleChain.links.length || 1) / 1000).toFixed(1)}k / hop</span>
          </div>
        </div>

        {/* Node Intelligence Dossier Panel: 1 Col */}
        <div className="cyber-card rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col justify-between bg-navy-950">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Eye className="w-4 h-4 text-sih-teal" />
                <span>Node Forensics Dossier</span>
              </h4>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-900 text-slate-300 border border-slate-700">
                {selectedNode ? selectedNode.id : 'SELECT NODE'}
              </span>
            </div>

            {selectedNode ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Entity Name / Node ID</span>
                  <p className="font-bold text-slate-100 text-sm">{selectedNode.label}</p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-navy-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">Network Role</span>
                    <span className="font-semibold text-slate-200">{selectedNode.role}</span>
                  </div>
                  <div className="bg-navy-900/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 text-[10px] block font-mono">Affiliated Bank</span>
                    <span className="font-semibold text-sih-cyan">{selectedNode.bank}</span>
                  </div>
                </div>

                <div className="bg-navy-900/80 p-3 rounded-lg border border-slate-800 space-y-2">
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">Account Identifier</span>
                    <span className="font-mono text-slate-200">{selectedNode.acc}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block font-mono">Operating Jurisdiction</span>
                    <span className="text-slate-200">{selectedNode.city || 'National Clearing'}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Syndicate Risk Assessment</span>
                    <span className="font-mono font-bold text-sih-orange">{selectedNode.risk}% Confidence</span>
                  </div>
                  <div className="w-full bg-navy-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${
                        selectedNode.risk > 80 ? 'bg-red-500' : selectedNode.risk > 50 ? 'bg-orange-500' : 'bg-teal-500'
                      }`}
                      style={{ width: `${selectedNode.risk}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-navy-900/50 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                  {selectedNode.role.includes('Victim') ? (
                    <span>Original complainant source funds. Account frozen for outbound debit under 1930 NCRP emergency guidelines.</span>
                  ) : selectedNode.role.includes('Extraction') || selectedNode.risk > 90 ? (
                    <span className="text-red-300 font-medium">CRITICAL WITHDRAWAL TARGET: ML model predicts physical debit extraction will occur at this terminal.</span>
                  ) : (
                    <span>Intermediary mule layering node. High-frequency routing detected, often used to bypass single-day IMPS limits.</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-xs text-center py-12">Click a node to view forensic intelligence.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>MHA Mule Intelligence Registry</span>
            <span className="text-emerald-400 font-mono">SYNCHRONIZED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
