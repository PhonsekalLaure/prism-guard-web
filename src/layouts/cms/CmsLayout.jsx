import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import CmsSidebar from '@components/cms/CmsSidebar';
import LogoutModal from '@components/ui/LogoutModal';
import GlobalNotificationToasts from '@components/notifications/GlobalNotificationToasts';
import useNotificationCenter from '@hooks/useNotificationCenter';
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
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const {
    currentRoutePrefixes,
    markCurrentRouteRead,
    notificationStats,
    refreshNotificationStats,
    setNotificationStats,
  } = useNotificationCenter('cms', location.pathname);

  // Profile is cached in localStorage at login — no extra network call needed
  const profile = authService.getProfile();

  const outletContext = useMemo(() => ({
    toggleSidebar: () => {},
    refreshNotificationStats,
  }), [refreshNotificationStats]);

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  useEffect(() => {
    let isCurrent = true;

    markCurrentRouteRead()
      .then(() => {
        if (isCurrent) return refreshNotificationStats();
        return null;
      })
      .catch(() => null);

    return () => {
      isCurrent = false;
    };
  }, [markCurrentRouteRead, refreshNotificationStats]);

  return (
    <div className="cms-layout">
      <CmsSidebar
        profile={profile}
        onLogoutClick={() => setShowLogout(true)}
        notificationStats={notificationStats}
      />
      <main className="cms-main">
        <Outlet context={outletContext} />
      </main>

      <GlobalNotificationToasts
        portal="cms"
        currentRoutePrefixes={currentRoutePrefixes}
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
