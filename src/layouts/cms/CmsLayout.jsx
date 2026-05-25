import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import CmsSidebar from '@components/cms/CmsSidebar';
import LogoutModal from '@components/ui/LogoutModal';
import GlobalNotificationToasts from '@components/notifications/GlobalNotificationToasts';
import authService from '@services/authService';
import '@styles/components/StatCard.css';
import '@styles/components/FilterBar.css';
import '@styles/components/Pagination.css';
import '@styles/components/Loading.css';
import '@styles/components/Dialogs.css';
import '@styles/cms/Dashboard.css';
import '@styles/cms/DeployedGuards.css';
import '@styles/cms/ServiceRequests.css';
import '@styles/cms/IncidentReports.css';
import '@styles/cms/CmsBilling.css';
import '@styles/cms/CmsAnnouncements.css';

export default function CmsLayout() {
  const [showLogout, setShowLogout] = useState(false);
  const [notificationStats, setNotificationStats] = useState(null);

  // Profile is cached in localStorage at login — no extra network call needed
  const profile = authService.getProfile();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <div className="cms-layout">
      <CmsSidebar
        profile={profile}
        onLogoutClick={() => setShowLogout(true)}
        notificationStats={notificationStats}
      />
      <main className="cms-main">
        <Outlet context={{ toggleSidebar: () => {} }} />
      </main>

      <GlobalNotificationToasts portal="cms" onStatsChange={setNotificationStats} />

      <LogoutModal
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
