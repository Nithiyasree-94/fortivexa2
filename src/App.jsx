import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Navigation } from './components/common/Navigation';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkflowWizard } from './components/workflow/WorkflowWizard';
import { AlertsPanel } from './components/alerts/AlertsPanel';
import { FullMapPage } from './pages/FullMapPage';
import { IntakeModal } from './components/dashboard/IntakeModal';
import {
  getComplaints,
  getStats,
  getAlerts,
  updateComplaintStatus,
  updateAlertStatus,
} from './services/api';

const AppContent = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('CMP-2026-8941');
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const loadData = async () => {
    try {
      const [cData, sData, aData] = await Promise.all([
        getComplaints(),
        getStats(),
        getAlerts()
      ]);
      setComplaints(cData || []);
      setStats(sData || null);
      setAlerts(aData || []);
    } catch (err) {
      console.error('Failed to load portal data:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleSelectCase = (caseId) => {
    setSelectedCaseId(caseId);
    setActiveTab('workflow');
  };

  const handleUpdateStatus = async (caseId, newStatus) => {
    try {
      await updateComplaintStatus(caseId, newStatus);
      setNotification({
        type: 'success',
        message: `Case ${caseId} status updated to: ${newStatus.toUpperCase()}`
      });
      setTimeout(() => setNotification(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAlertStatus = async (alertId, newStatus) => {
    try {
      await updateAlertStatus(alertId, newStatus);
      setNotification({
        type: 'success',
        message: `Tactical Alert ${alertId} marked as: ${newStatus.toUpperCase()}`
      });
      setTimeout(() => setNotification(null), 4000);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComplaint = (newComplaint) => {
    setComplaints([newComplaint, ...complaints]);
    setSelectedCaseId(newComplaint.id);
    setActiveTab('workflow');
    setNotification({
      type: 'info',
      message: `New complaint ${newComplaint.id} ingested. Beginning analysis...`
    });
    setTimeout(() => setNotification(null), 4000);
  };

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const selectedComplaint = complaints.find(c => c.id === selectedCaseId) || complaints[0];
  const pendingAlertCount = alerts.filter(a => a.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-sih-teal selection:text-navy-950">
      
      {/* Top Banner Header */}
      <Header />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'intake') {
            setIsIntakeModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        pendingAlertCount={pendingAlertCount}
        selectedCaseId={selectedCaseId}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-navy-900 to-navy-850 border border-sih-teal text-xs font-mono font-bold text-sih-teal shadow-glow-teal flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-sih-teal animate-ping" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 pb-12">
        {activeTab === 'dashboard' && (
          <DashboardPage
            stats={stats}
            complaints={complaints}
            onSelectCase={handleSelectCase}
            onAddComplaint={handleAddComplaint}
            onRefresh={loadData}
          />
        )}

        {activeTab === 'workflow' && (
          <WorkflowWizard
            complaint={selectedComplaint}
            onUpdateStatus={handleUpdateStatus}
            onBackToDashboard={() => setActiveTab('dashboard')}
            onSelectCase={handleSelectCase}
            allComplaints={complaints}
          />
        )}

        {activeTab === 'map' && (
          <FullMapPage
            complaints={complaints}
            onSelectCase={handleSelectCase}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsPanel
            alerts={alerts}
            onUpdateAlertStatus={handleUpdateAlertStatus}
            onSelectCase={handleSelectCase}
          />
        )}
      </main>

      {/* Modal for manual intake */}
      <IntakeModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onSubmit={handleAddComplaint}
      />

      {/* Footer */}
      <footer className="bg-navy-950 border-t border-slate-900 py-4 px-6 text-center text-xs text-slate-500 font-mono">
        <p>
          Ministry of Home Affairs (MHA) | Smart India Hackathon 2026 — Problem Statement SIH26184
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Predictive Analytics Framework for Cybercrime Complaints • Official Law-Enforcement Prototype
        </p>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
