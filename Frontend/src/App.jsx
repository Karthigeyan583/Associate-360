import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './components/LoginPage';

import Sidebar from './components/Sidebar';
import BackendStatusHeader from './components/BackendStatusHeader';
import ControlTowerDashboard from './components/ControlTowerDashboard';
import AssociateDirectory from './components/AssociateDirectory';
import ReportsModule from './components/ReportsModule';
import Associate360Drawer from './components/Associate360Drawer';
import ToolkitView from './components/ToolkitView';

import CreateAssociateModal from './components/CreateAssociateModal';
import ComplianceHub from './components/ComplianceHub';
import ClientsView from './components/ClientsView';
import ActivityView from './components/ActivityView';
import ApiDiagnosticsModal from './components/ApiDiagnosticsModal';
import { apiService } from './services/api';

function MainApp() {
  const { isAuthenticated, user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Backend & Data States
  const [healthData, setHealthData] = useState(null);
  const [latency, setLatency] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [associates, setAssociates] = useState([]);
  const [clients, setClients] = useState([]);
  const [loadingAssociates, setLoadingAssociates] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReadiness, setFilterReadiness] = useState('');
  const [filterEmploymentType, setFilterEmploymentType] = useState('');
  const [filterExpiry, setFilterExpiry] = useState('');

  // Modals & Drawers
  const [selectedAssociate, setSelectedAssociate] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDiagnosticsModalOpen, setIsDiagnosticsModalOpen] = useState(false);



  // 1. Check Health & Connectivity
  const checkApiHealth = useCallback(async () => {
    const res = await apiService.checkHealth();
    setHealthData(res.data);
    setLatency(res.latency);
  }, []);

  // 2. Fetch Dashboard & General Data
  const fetchAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsRefreshing(true);
    try {
      await checkApiHealth();
      
      const [statsRes, clientsRes] = await Promise.all([
        apiService.getDashboardStats().catch(() => null),
        apiService.getClients().catch(() => [])
      ]);

      if (statsRes) setDashboardStats(statsRes);
      if (clientsRes) setClients(clientsRes);
    } catch (err) {
      console.error('Data refresh error:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, [checkApiHealth, isAuthenticated]);

  // 3. Fetch Filtered Associates List
  const fetchAssociates = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingAssociates(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (filterReadiness) params.readiness = filterReadiness;
      if (filterEmploymentType) params.employment_type = filterEmploymentType;
      if (filterExpiry) params.expiry_bucket = filterExpiry;

      const data = await apiService.getAssociates(params);
      setAssociates(data);
    } catch (err) {
      console.error('Error fetching associates:', err);
    } finally {
      setLoadingAssociates(false);
    }
  }, [searchQuery, filterReadiness, filterEmploymentType, filterExpiry, isAuthenticated]);

  // 4. Fetch Associate Detail for 360° Drawer with instant fallback
  const handleSelectAssociate = async (target) => {
    if (!target) return;
    const targetId = typeof target === 'object' ? (target.id || target.associate_id || target.ba_id) : target;
    
    // Optimistic fallback: immediately find in local associates if available
    const localMatch = associates.find(a => a.id === targetId || a.ba_id === targetId || a.id === Number(targetId));
    if (localMatch) {
      setSelectedAssociate(localMatch);
    } else if (typeof target === 'object' && target.full_name) {
      setSelectedAssociate(target);
    }

    // Fetch full enriched detail from API
    try {
      const detail = await apiService.getAssociate(targetId);
      if (detail && detail.id) {
        setSelectedAssociate(detail);
      }
    } catch (err) {
      console.warn('API associate detail fetch, using current profile data:', err);
    }
  };

  // Initial Load
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
      fetchAssociates();
    }
  }, [fetchAllData, fetchAssociates, isAuthenticated]);

  // If user is not authenticated, show LoginPage
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container">
      
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <div className="main-content">
        
        {/* Sticky Real-Time Backend Status Header with Top-Right Notification Center & Toolkit Shortcut */}
        <BackendStatusHeader
          healthData={healthData}
          latency={latency}
          isRefreshing={isRefreshing}
          notifications={dashboardStats?.urgent_actions || []}
          onSelectAssociate={handleSelectAssociate}
          onOpenToolkit={() => setActiveTab('toolkit')}
          onRefresh={() => {
            fetchAllData();
            fetchAssociates();
          }}
          onOpenDiagnostics={() => setIsDiagnosticsModalOpen(true)}
        />

        {/* Dynamic Page Views */}
        <main className="page-body">
          {activeTab === 'dashboard' && (
            <ControlTowerDashboard
              stats={dashboardStats}
              associates={associates}
              onSelectAssociate={handleSelectAssociate}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          )}

          {activeTab === 'associates' && (
            <AssociateDirectory
              associates={associates}
              loading={loadingAssociates}
              onSelectAssociate={handleSelectAssociate}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterReadiness={filterReadiness}
              setFilterReadiness={setFilterReadiness}
              filterEmploymentType={filterEmploymentType}
              setFilterEmploymentType={setFilterEmploymentType}
              filterExpiry={filterExpiry}
              setFilterExpiry={setFilterExpiry}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsModule onSelectAssociate={handleSelectAssociate} />
          )}

          {activeTab === 'compliance' && (
            <ComplianceHub onSelectAssociate={handleSelectAssociate} />
          )}

          {activeTab === 'clients' && (
            <ClientsView onSelectAssociate={handleSelectAssociate} />
          )}

          {activeTab === 'toolkit' && (
            <ToolkitView />
          )}

          {activeTab === 'activity' && (
            <ActivityView onSelectAssociate={handleSelectAssociate} />
          )}
        </main>
      </div>


      {/* Associate 360° Drawer */}
      {selectedAssociate && (
        <Associate360Drawer
          associate={selectedAssociate}
          onClose={() => setSelectedAssociate(null)}
          onRefreshData={() => {
            handleSelectAssociate(selectedAssociate.id);
            fetchAssociates();
            fetchAllData();
          }}
        />
      )}

      {/* Add Associate Modal */}
      <CreateAssociateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        clients={clients}
        onCreated={() => {
          fetchAssociates();
          fetchAllData();
        }}
      />


      {/* REST API Diagnostic Modal */}
      <ApiDiagnosticsModal
        isOpen={isDiagnosticsModalOpen}
        onClose={() => setIsDiagnosticsModalOpen(false)}
        initialHealth={healthData}
      />


    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

