import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import LogoutModal from '../components/dashboard/LogoutModal';
import '../styles/Dashboard.css';

export default function DashboardLayout() {
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('rememberDevice');
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogoutClick={() => setShowLogout(true)} />

      <main className="dashboard-main">
        <Outlet />
      </main>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
