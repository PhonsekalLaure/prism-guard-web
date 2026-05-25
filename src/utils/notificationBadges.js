export function getNotificationBadgeCount(item, stats = {}) {
  if (!stats) return 0;
  if (item.notificationTotal) return Number(stats.unread) || 0;

  const unreadByType = stats.unread_by_type || {};
  return (item.notificationPrefixes || []).reduce((sum, prefix) => (
    sum + Object.entries(unreadByType).reduce((typeSum, [type, count]) => (
      type.startsWith(prefix) ? typeSum + Number(count || 0) : typeSum
    ), 0)
  ), 0);
}

export function formatNotificationBadgeCount(count) {
  return count > 99 ? '99+' : String(count);
}
