import { useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@hris-components/Sidebar';
import LogoutModal from '@components/ui/LogoutModal';
import GlobalNotificationToasts from '@components/notifications/GlobalNotificationToasts';
import useNotificationCenter from '@hooks/useNotificationCenter';
import authService from '@services/authService';
import '@styles/components/Sidebar.css';
import '@styles/components/StatCard.css';
import '@styles/components/FilterBar.css';
import '@styles/hris/Dashboard.css';
import '@styles/hris/Clients.css';
import '@styles/hris/Billing.css';
import '@styles/hris/Employees.css';
import '@styles/components/Dialogs.css';
import '@styles/components/Loading.css';
import '@styles/hris/Profile.css';

export default function DashboardLayout() {
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    markCurrentRouteRead,
    notificationStats,
    refreshNotificationStats,
    setNotificationStats,
  } = useNotificationCenter('hris', location.pathname);

  const outletContext = useMemo(() => ({
    toggleSidebar: () => setSidebarOpen((current) => !current),
    refreshNotificationStats,
  }), [refreshNotificationStats]);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        onLogoutClick={() => setShowLogout(true)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notificationStats={notificationStats}
      />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="dashboard-main">
        <Outlet context={outletContext} />
      </main>

      <GlobalNotificationToasts
        portal="hris"
        onBeforeRefresh={markCurrentRouteRead}
        onStatsChange={setNotificationStats}
      />

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
