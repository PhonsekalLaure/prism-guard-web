import { SECTION_NOTIFICATION_PREFIXES } from '@utils/notificationRouting';

export function getNotificationBadgeCount(item, stats = {}) {
  if (!stats) return 0;

  const unreadByType = stats.unread_by_type || {};

  if (item.notificationUncategorized) {
    return Object.entries(unreadByType).reduce((sum, [type, count]) => (
      SECTION_NOTIFICATION_PREFIXES.some((prefix) => type.startsWith(prefix))
        ? sum
        : sum + Number(count || 0)
    ), 0);
  }

  return (item.notificationPrefixes || []).reduce((sum, prefix) => (
    sum + Object.entries(unreadByType).reduce((typeSum, [type, count]) => (
      type.startsWith(prefix) ? typeSum + Number(count || 0) : typeSum
    ), 0)
  ), 0);
}

export function formatNotificationBadgeCount(count) {
  return count > 99 ? '99+' : String(count);
}
