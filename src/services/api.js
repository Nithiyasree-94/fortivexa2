import { initialComplaints } from '../data/mockComplaints';

const API_BASE = '/api';

// In-browser fallback state if backend server isn't reached
let localComplaints = [...initialComplaints];

export const getComplaints = async () => {
  try {
    const res = await fetch(`${API_BASE}/complaints`);
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();
    localComplaints = data;
    return data;
  } catch (err) {
    console.warn('Using client-side cache for complaints:', err.message);
    return localComplaints;
  }
};

export const getComplaintById = async (id) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}`);
    if (!res.ok) throw new Error('Complaint not found');
    return await res.json();
  } catch (err) {
    console.warn(`Falling back to local data for ${id}:`, err.message);
    return localComplaints.find(c => c.id === id) || null;
  }
};

export const updateComplaintStatus = async (id, status) => {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Update failed');
    const updated = await res.json();
    // update local cache
    const idx = localComplaints.findIndex(c => c.id === id);
    if (idx !== -1) localComplaints[idx] = updated;
    return updated;
  } catch (err) {
    console.warn('Updating status locally:', err.message);
    const idx = localComplaints.findIndex(c => c.id === id);
    if (idx !== -1) {
      localComplaints[idx].status = status;
      if (status === 'Intercepted' && localComplaints[idx].alert) {
        localComplaints[idx].alert.interceptStatus = 'Intercepted';
      }
      return localComplaints[idx];
    }
    return null;
  }
};

export const getStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Stats error');
    return await res.json();
  } catch (err) {
    // calculate locally
    const totalComplaints = localComplaints.length;
    const interceptedCases = localComplaints.filter(c => c.status === 'Intercepted').length;
    return {
      totalComplaintsToday: 42 + totalComplaints - 8,
      activeMuleChains: 18,
      highRiskPending: localComplaints.filter(c => c.priority === 'CRITICAL' && c.status !== 'Intercepted').length,
      casesIntercepted: 29 + interceptedCases - 2,
      totalAmountProtected: 18450000,
      fraudTypeBreakdown: [
        { name: 'Digital Arrest', count: 18 },
        { name: 'Crypto Ponzi', count: 11 },
        { name: 'Job Task Fraud', count: 9 },
        { name: 'Electricity Phish', count: 6 },
        { name: 'SIM Swap', count: 5 },
        { name: 'Loan App Extortion', count: 3 },
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
  }
};

export const getAlerts = async () => {
  try {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Alerts error');
    return await res.json();
  } catch (err) {
    return localComplaints
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
  }
};

export const updateAlertStatus = async (alertId, status) => {
  try {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update alert');
    return await res.json();
  } catch (err) {
    const complaint = localComplaints.find(c => c.alert && c.alert.alertId === alertId);
    if (complaint) {
      complaint.alert.interceptStatus = status;
      if (status === 'Intercepted') complaint.status = 'Intercepted';
      return { success: true, alertId, newStatus: status };
    }
    return { success: false };
  }
};
