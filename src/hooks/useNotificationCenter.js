import { useCallback, useMemo, useState } from 'react';
import notificationsService from '@services/notificationsService';
import { getNotificationPrefixesForPath } from '@utils/notificationRouting';

export default function useNotificationCenter(portal, pathname) {
  const [notificationStats, setNotificationStats] = useState(null);

  const currentRoutePrefixes = useMemo(
    () => getNotificationPrefixesForPath(pathname, portal),
    [pathname, portal]
  );

  const refreshNotificationStats = useCallback(async () => {
    const stats = await notificationsService.getStats();
    setNotificationStats(stats);
    return stats;
  }, []);

  const markCurrentRouteRead = useCallback(async () => {
    if (currentRoutePrefixes.length > 0) {
      await notificationsService.markMatchingRead({ typePrefixes: currentRoutePrefixes });
    }
  }, [currentRoutePrefixes]);

  return {
    currentRoutePrefixes,
    markCurrentRouteRead,
    notificationStats,
    refreshNotificationStats,
    setNotificationStats,
  };
}
