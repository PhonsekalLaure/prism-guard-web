import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@hris-components/Sidebar';
import LogoutModal from '@components/ui/LogoutModal';
import '@styles/hris/Dashboard.css';
import '@styles/hris/Clients.css';
import '@styles/hris/Billing.css';

export default function DashboardLayout() {
  const [showLogout, setShowLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberDevice');
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
