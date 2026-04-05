import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import LogoutModal from '../../components/admin/LogoutModal';
import '../../styles/Dashboard.css';

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
