import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from 'react-icons/fa';
import notificationsService from '@services/notificationsService';
import { getSafePortalPath } from '@utils/security';
import '@styles/components/Notification.css';

const POLL_INTERVAL_MS = 30000;
const MAX_VISIBLE_TOASTS = 5;

function isCriticalIncidentAlert(event = {}, portal) {
  return portal === 'hris' && event.type === 'incident_report_submitted';
}

function getToastType(event = {}) {
  if (event.priority === 'urgent') return 'warning';
  if (event.priority === 'important') return 'info';
  return 'info';
}

function getToastIcon(type) {
  if (type === 'warning') return FaExclamationTriangle;
  return type === 'info' ? FaBell : FaInfoCircle;
}

function getFallbackRoute(portal) {
  return portal === 'cms' ? '/cms/notifications' : '/notifications';
}

export default function GlobalNotificationToasts({
  portal = 'hris',
  currentRoutePrefixes = [],
  onStatsChange,
}) {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const seenIdsRef = useRef(new Set());
  const loadingRef = useRef(false);

  const loadUnreadNotifications = useCallback(async () => {
    if (loadingRef.current) return;
    loadingRef.current = true;

    try {
      const [stats, result] = await Promise.all([
        notificationsService.getStats(),
        notificationsService.getNotifications({
          filter: 'unread',
          page: 1,
          limit: MAX_VISIBLE_TOASTS,
        }),
      ]);

      onStatsChange?.(stats);

      const freshItems = (result.data || [])
        .filter((item) => item?.id && !seenIdsRef.current.has(item.id))
        .slice(0, MAX_VISIBLE_TOASTS);

      if (freshItems.length > 0) {
        freshItems.forEach((item) => seenIdsRef.current.add(item.id));
        const freshCriticalAlerts = freshItems.filter((item) => (
          isCriticalIncidentAlert(item.event || {}, portal)
        ));
        const freshToasts = freshItems.filter((item) => (
          !isCriticalIncidentAlert(item.event || {}, portal)
        ));

        if (freshCriticalAlerts.length > 0) {
          setCriticalAlerts((current) => {
            const currentIds = new Set(current.map((item) => item.id));
            return [
              ...current,
              ...freshCriticalAlerts.filter((item) => !currentIds.has(item.id)),
            ].slice(0, MAX_VISIBLE_TOASTS);
          });
        }

        if (freshToasts.length === 0) return;
        setToasts((current) => {
          const currentIds = new Set(current.map((item) => item.id));
          const merged = [
            ...freshToasts.filter((item) => !currentIds.has(item.id)),
            ...current,
          ];
          return merged.slice(0, MAX_VISIBLE_TOASTS);
        });
      }
    } catch {
      // Passive watcher only; page-level errors still surface locally.
    } finally {
      loadingRef.current = false;
    }
  }, [onStatsChange, portal]);

  useEffect(() => {
    loadUnreadNotifications();
    const timer = setInterval(loadUnreadNotifications, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [loadUnreadNotifications]);

  useEffect(() => {
    if (currentRoutePrefixes.length === 0) return;

    setToasts((current) => current.filter((toast) => {
      const type = String(toast.event?.type || '').toLowerCase();
      return !currentRoutePrefixes.some((prefix) => type.startsWith(prefix));
    }));
  }, [currentRoutePrefixes]);

  useEffect(() => {
    const clearToasts = () => setToasts([]);
    const clearCriticalAlerts = () => setCriticalAlerts([]);

    window.addEventListener('notifications:bulk-clear', clearToasts);
    window.addEventListener('notifications:bulk-clear', clearCriticalAlerts);
    window.addEventListener('notifications:bulk-read', clearToasts);
    window.addEventListener('notifications:bulk-read', clearCriticalAlerts);
    return () => {
      window.removeEventListener('notifications:bulk-clear', clearToasts);
      window.removeEventListener('notifications:bulk-clear', clearCriticalAlerts);
      window.removeEventListener('notifications:bulk-read', clearToasts);
      window.removeEventListener('notifications:bulk-read', clearCriticalAlerts);
    };
  }, []);

  const markReadAndRemove = useCallback(async (item) => {
    setToasts((current) => current.filter((toast) => toast.id !== item.id));
    setCriticalAlerts((current) => current.filter((alert) => alert.id !== item.id));
    try {
      await notificationsService.markRead(item.id);
      const stats = await notificationsService.getStats();
      onStatsChange?.(stats);
    } catch {
      if (item?.id) {
        seenIdsRef.current.delete(item.id);
      }
      loadUnreadNotifications();
    }
  }, [loadUnreadNotifications, onStatsChange]);

  const handleOpen = useCallback(async (item) => {
    const route = getSafePortalPath(
      item.event?.action_url,
      portal,
      getFallbackRoute(portal)
    );
    await markReadAndRemove(item);
    navigate(route);
  }, [markReadAndRemove, navigate, portal]);

  const handleDismiss = useCallback((event, item) => {
    event.preventDefault();
    event.stopPropagation();
    markReadAndRemove(item);
  }, [markReadAndRemove]);

  const stopDismissEvent = useCallback((event) => {
    event.stopPropagation();
  }, []);

  if (toasts.length === 0 && criticalAlerts.length === 0) return null;

  const activeCriticalAlert = criticalAlerts[0] || null;

  return (
    <>
      {activeCriticalAlert && (
        <div className="notif-critical-overlay" role="alertdialog" aria-modal="true" aria-label="New incident report">
          <div className="notif-critical-panel">
            <div className="notif-critical-icon">
              <FaExclamationTriangle />
            </div>
            <div className="notif-critical-body">
              <span className="notif-critical-kicker">Incident Alert</span>
              <h2>{activeCriticalAlert.event?.title || 'New incident report'}</h2>
              <p>{activeCriticalAlert.event?.message || 'Open the incident report for details.'}</p>
            </div>
            <div className="notif-critical-actions">
              <button
                type="button"
                className="notif-critical-btn primary"
                onClick={() => handleOpen(activeCriticalAlert)}
              >
                Open Incident
              </button>
              <button
                type="button"
                className="notif-critical-btn secondary"
                onClick={() => markReadAndRemove(activeCriticalAlert)}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      {toasts.length > 0 && (
        <div className="notif-stack" aria-live="polite" aria-label="New notifications">
          {toasts.map((item) => {
            const event = item.event || {};
            const type = getToastType(event);
            const Icon = getToastIcon(type);

            return (
              <div
                key={item.id}
                className={`notif notif-${type} notif-enter notif-clickable`}
                role="button"
                tabIndex={0}
                onClick={() => handleOpen(item)}
                onKeyDown={(eventKey) => {
                  if (eventKey.key === 'Enter' || eventKey.key === ' ') {
                    eventKey.preventDefault();
                    handleOpen(item);
                  }
                }}
              >
                <Icon className="notif-icon" />
                <div className="notif-body">
                  <span className="notif-title">{event.title || 'New notification'}</span>
                  <span className="notif-message">{event.message || 'Open notifications to review details.'}</span>
                </div>
                <button
                  className="notif-close"
                  type="button"
                  onPointerDown={stopDismissEvent}
                  onKeyDown={stopDismissEvent}
                  onClick={(clickEvent) => handleDismiss(clickEvent, item)}
                  aria-label="Close notification"
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
