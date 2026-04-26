import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@hris-components/Sidebar';
import LogoutModal from '@components/ui/LogoutModal';
import authService from '@services/authService';
import '@styles/components/Sidebar.css';
import '@styles/components/StatCard.css';
import '@styles/components/FilterBar.css';
import '@styles/hris/Dashboard.css';
import '@styles/hris/Clients.css';
import '@styles/hris/Billing.css';
import '@styles/hris/Employees.css';
import '@styles/hris/Dialogs.css';
import '@styles/hris/Profile.css';

export default function DashboardLayout() {
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogoutClick={() => setShowLogout(true)} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      <main className="dashboard-main">
        <Outlet context={{ toggleSidebar: () => setSidebarOpen(!sidebarOpen) }} />
      </main>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
