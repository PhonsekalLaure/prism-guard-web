import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CmsSidebar from '@components/cms/CmsSidebar';
import LogoutModal from '@components/ui/LogoutModal';
import authService from '@services/authService';
import '@styles/cms/Dashboard.css';
import '@styles/cms/DeployedGuards.css';
import '@styles/cms/ServiceRequests.css';
import '@styles/cms/IncidentReports.css';
import '@styles/cms/CmsBilling.css';

export default function CmsLayout() {
  const [showLogout, setShowLogout] = useState(false);

  // Profile is cached in localStorage at login — no extra network call needed
  const profile = authService.getProfile();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="cms-layout">
      <CmsSidebar profile={profile} onLogoutClick={() => setShowLogout(true)} />
      <main className="cms-main">
        <Outlet context={{ toggleSidebar: () => {} }} />
      </main>

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}