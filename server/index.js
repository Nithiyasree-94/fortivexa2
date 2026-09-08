import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// In-memory data store initialized from JSON
const rawData = fs.readFileSync(path.join(__dirname, 'data', 'complaints.json'), 'utf-8');
let complaints = JSON.parse(rawData);

// Utility to calculate stats
const calculateStats = () => {
  const totalComplaints = complaints.length;
  const activeMuleChains = complaints.filter(c => c.status !== 'Intercepted' && c.status !== 'Missed').length;
  const highRiskPending = complaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'Intercepted').length;
  const interceptedCases = complaints.filter(c => c.status === 'Intercepted').length;
  const totalAmountProtected = complaints
    .filter(c => c.status === 'Intercepted')
    .reduce((sum, c) => sum + c.amount, 0);

  return {
    totalComplaintsToday: 42 + totalComplaints - 8,
    activeMuleChains: 18 + activeMuleChains - 6,
    highRiskPending: highRiskPending,
    casesIntercepted: 29 + interceptedCases - 2,
    totalAmountProtected: 18450000 + totalAmountProtected - 1180000,
    fraudTypeBreakdown: [
      { name: 'Digital Arrest', count: complaints.filter(c => c.fraudType.includes('Digital Arrest')).length + 14 },
      { name: 'Crypto Ponzi', count: complaints.filter(c => c.fraudType.includes('Cryptocurrency')).length + 9 },
      { name: 'Job Task Fraud', count: complaints.filter(c => c.fraudType.includes('Part-time')).length + 8 },
      { name: 'Electricity Phish', count: complaints.filter(c => c.fraudType.includes('Electricity')).length + 5 },
      { name: 'SIM Swap', count: complaints.filter(c => c.fraudType.includes('SIM Swap')).length + 4 },
      { name: 'Loan App Extortion', count: complaints.filter(c => c.fraudType.includes('Loan')).length + 2 },
    ],
    velocityTimeline: [
      { time: '00:00', amountLakhs: 4.2, cases: 2 },
      { time: '04:00', amountLakhs: 2.1, cases: 1 },
      { time: '08:00', amountLakhs: 8.5, cases: 4 },
      { time: '12:00', amountLakhs: 19.8, cases: 9 },
      { time: '16:00', amountLakhs: 34.2, cases: 16 },
      { time: '20:00', amountLakhs: 28.6, cases: 12 },
    ]
  };
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'MHA Cybercrime Cash-Out Prediction API',
    version: '2.4.0-SIH26184',
    timestamp: new Date().toISOString()
  });
});

// Get Dashboard Stats
app.get('/api/stats', (req, res) => {
  res.json(calculateStats());
});

// Get all complaints
app.get('/api/complaints', (req, res) => {
  res.json(complaints);
});

// Get single complaint by ID
app.get('/api/complaints/:id', (req, res) => {
  const complaint = complaints.find(c => c.id === req.params.id);
  if (!complaint) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  res.json(complaint);
});

// Update complaint status (e.g. Mark as Intercepted)
app.patch('/api/complaints/:id/status', (req, res) => {
  const { status } = req.body;
  const index = complaints.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Complaint not found' });
  }
  complaints[index].status = status;
  if (status === 'Intercepted' && complaints[index].alert) {
    complaints[index].alert.interceptStatus = 'Intercepted';
  }
  res.json(complaints[index]);
});

// Get all alerts
app.get('/api/alerts', (req, res) => {
  const alerts = complaints
    .filter(c => c.alert)
    .map(c => ({
      alertId: c.alert.alertId,
      caseId: c.id,
      firNumber: c.firNumber,
      victimName: c.victim.name,
      amount: c.amount,
      fraudType: c.fraudType,
      primaryLocation: c.predictions[0]?.locationName || 'Unknown Location',
      address: c.predictions[0]?.address || '',
      confidence: c.predictions[0]?.confidence || 0,
      riskLevel: c.predictions[0]?.riskLevel || 'MEDIUM',
      unit: c.alert.unit,
      officer: c.alert.officer,
      timestamp: c.alert.timestamp,
      status: c.alert.interceptStatus || 'Pending'
    }));
  res.json(alerts);
});

// Update alert status
app.patch('/api/alerts/:id/status', (req, res) => {
  const { status } = req.body;
  const alertId = req.params.id;
  const complaint = complaints.find(c => c.alert && c.alert.alertId === alertId);
  if (!complaint) {
    return res.status(404).json({ error: 'Alert not found' });
  }
  complaint.alert.interceptStatus = status;
  if (status === 'Intercepted') {
    complaint.status = 'Intercepted';
  } else if (status === 'Under Watch') {
    complaint.status = 'Under Investigation';
  }
  res.json({ success: true, alertId, newStatus: status });
});

// Add new complaint
app.post('/api/complaints', (req, res) => {
  const newComplaint = {
    id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    firNumber: `FIR/CYB/2026/0${Math.floor(850 + Math.random() * 100)}`,
    timestamp: new Date().toISOString(),
    status: 'Pending Analysis',
    priority: req.body.priority || 'HIGH',
    ...req.body
  };
  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

app.listen(PORT, () => {
  console.log(`[CYBER-INTEL SERVER] Running on port ${PORT}`);
});
