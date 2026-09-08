import React, { useState } from 'react';
import { X, ShieldAlert, ArrowRight, Check } from 'lucide-react';

export const IntakeModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    victimName: 'Aditya Sen',
    victimCity: 'Delhi NCR',
    victimBank: 'State Bank of India',
    amount: '620000',
    fraudType: 'Digital Arrest / Police Impersonation',
    priority: 'CRITICAL',
    summary: 'Senior citizen received fake high-court summons video call, transferred funds via IMPS to unknown mule accounts.',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCase = {
      id: `CMP-2026-${Math.floor(8950 + Math.random() * 50)}`,
      firNumber: `FIR/CYB/2026/0${Math.floor(850 + Math.random() * 50)}`,
      timestamp: new Date().toISOString(),
      victim: {
        name: formData.victimName,
        phone: '+91 98101 XXXXX',
        city: formData.victimCity,
        bank: formData.victimBank,
        accountNumber: '50100XXXX6621',
        ifsc: 'SBIN0001421'
      },
      amount: parseFloat(formData.amount) || 500000,
      fraudType: formData.fraudType,
      priority: formData.priority,
      status: 'Pending Analysis',
      reportedStation: 'Special Cell Cyber Crime, New Delhi',
      summary: formData.summary,
      cleaningAudit: [
        { id: "C1", name: "IFSC Routing Verification", status: "VERIFIED", detail: "RBI clearing gateway validated", badge: "Success" },
        { id: "C2", name: "NCRP Deduplication Check", status: "CLEARED", detail: "Unique FIR record confirmed", badge: "Success" },
        { id: "C3", name: "Beneficiary Entity Normalization", status: "RESOLVED", detail: "Mule PAN flagged under high velocity watch", badge: "Flagged" },
        { id: "C4", name: "Cellular Tower Geolocation Check", status: "CROSS-MATCHED", detail: "Active IMSI localized in North Delhi", badge: "Critical Alert" }
      ],
      muleChain: {
        nodes: [
          { id: "V0", label: `${formData.victimName.split(' ')[0]} (Victim)`, role: "Victim Source", bank: formData.victimBank, acc: "XXXX-6621", risk: 2, city: formData.victimCity },
          { id: "M1", label: "Pankaj M. (Mule L1)", role: "Layer 1 Mule", bank: "Axis Bank", acc: "XXXX-3101", risk: 78, city: "Connaught Place" },
          { id: "M2", label: "Apex Apex Bullion (Mule L2)", role: "Layer 2 Mule", bank: "Yes Bank", acc: "XXXX-9912", risk: 91, city: "Karol Bagh" },
          { id: "M3", label: "Target Cash-Out ATM", role: "Target Outflow", bank: "SBI ATM", acc: "ATM Pull", risk: 97, city: "Delhi" }
        ],
        links: [
          { source: "V0", target: "M1", amount: parseFloat(formData.amount), time: "Just now", type: "IMPS", txId: "TXN-AUTO-01" },
          { source: "M1", target: "M2", amount: parseFloat(formData.amount) * 0.9, time: "10 mins ago", type: "IMPS", txId: "TXN-AUTO-02" },
          { source: "M2", target: "M3", amount: parseFloat(formData.amount) * 0.85, time: "Pending", type: "ATM Cash Pull", txId: "ATM-SCHEDULED" }
        ]
      },
      predictions: [
        {
          rank: 1,
          locationName: "State Bank of India ATM - Connaught Place Inner Circle",
          bank: "State Bank of India",
          address: "Block B, Connaught Place, New Delhi 110001",
          lat: 28.6328,
          lng: 77.2197,
          confidence: 91,
          riskLevel: "HIGH",
          window: "Next 1 - 3 hours",
          historicalWithdrawals: 22,
          nearestUnit: "Connaught Place Police Post Cyber Unit (150m away)",
          rationale: "Matches primary withdrawal zone for Layer 2 mule card cluster."
        },
        {
          rank: 2,
          locationName: "HDFC Bank ATM - Karol Bagh Market",
          bank: "HDFC Bank",
          address: "Ajmal Khan Road, Karol Bagh, New Delhi 110005",
          lat: 28.6521,
          lng: 77.1904,
          confidence: 73,
          riskLevel: "MEDIUM",
          window: "Next 2 - 4 hours",
          historicalWithdrawals: 11,
          nearestUnit: "Karol Bagh PCR Mobile (400m away)",
          rationale: "Dense commercial cash-out point with high transaction ceiling."
        }
      ],
      alert: {
        alertId: `ALT-2026-${Math.floor(9050 + Math.random() * 50)}`,
        unit: "Delhi Police Cyber Cell Special QRT",
        officer: "Insp. Neeraj Tyagi",
        dispatchChannel: "Delhi Police Command Emergency Net",
        timestamp: new Date().toLocaleTimeString('en-IN') + ' IST',
        interceptStatus: "Pending"
      }
    };

    onSubmit(newCase);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="cyber-card w-full max-w-xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-navy-900/80 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-5 h-5 text-sih-orange" />
            <h3 className="font-bold text-slate-100 text-base sm:text-lg">
              Manual Cyber Complaint Intake & Simulation
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Victim Full Name</label>
              <input
                type="text"
                required
                value={formData.victimName}
                onChange={(e) => setFormData({ ...formData, victimName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Victim City / State</label>
              <input
                type="text"
                required
                value={formData.victimCity}
                onChange={(e) => setFormData({ ...formData, victimCity: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Victim Originating Bank</label>
              <select
                value={formData.victimBank}
                onChange={(e) => setFormData({ ...formData, victimBank: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal"
              >
                <option value="State Bank of India">State Bank of India</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Bank of Baroda">Bank of Baroda</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Siphoned Amount (INR ₹)</label>
              <input
                type="number"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Fraud Category</label>
              <select
                value={formData.fraudType}
                onChange={(e) => setFormData({ ...formData, fraudType: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal"
              >
                <option value="Digital Arrest / Police Impersonation">Digital Arrest / Police Impersonation</option>
                <option value="Cryptocurrency Investment Ponzi">Cryptocurrency Investment Ponzi</option>
                <option value="Part-time Job / YouTube Task Ponzi">Part-time Job / YouTube Task Ponzi</option>
                <option value="Electricity Bill Phishing / Fake APK">Electricity Bill Phishing / Fake APK</option>
                <option value="SIM Swap & Net Banking Takeover">SIM Swap & Net Banking Takeover</option>
                <option value="Loan App Extortion">Loan App Extortion</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Operational Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal"
              >
                <option value="CRITICAL">CRITICAL (Immediate Intercept)</option>
                <option value="HIGH">HIGH (Under 6 hours)</option>
                <option value="MEDIUM">MEDIUM (Standard Queue)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Incident Brief / Modus Operandi</label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-navy-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-sih-teal text-xs"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-navy-900 text-slate-400 hover:text-white border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-sih-orange to-amber-600 hover:from-orange-500 hover:to-amber-500 text-navy-950 font-bold flex items-center space-x-2 shadow-glow-orange transition-all"
            >
              <span>Ingest & Start Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
