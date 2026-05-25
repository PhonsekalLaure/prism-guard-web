import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell,
  FaCheck,
  FaClock,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaFilter,
  FaInbox,
  FaSearch,
  FaTimes,
} from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import Pagination from '@components/ui/Pagination';
import StatCards from '@components/ui/StatCards';
import useNotification from '@hooks/useNotification';
import notificationsService from '@services/notificationsService';
import '@styles/NotificationsPage.css';

const TYPE_LABELS = {
  leave_request_submitted: 'Leave Request',
  incident_report_submitted: 'Incident Report',
  service_request_submitted: 'Service Request',
  service_request_updated: 'Service Request',
  contract_needs_renewal: 'Contract',
};

const PRIORITY_LABELS = {
  urgent: 'Urgent',
  important: 'Important',
  normal: 'Normal',
};

const DEFAULT_METADATA = { total: 0, page: 1, limit: 10, totalPages: 0 };

function formatDateTime(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatType(type) {
  if (!type) return 'Notification';
  if (TYPE_LABELS[type]) return TYPE_LABELS[type];
  return type
    .split(/[_:-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getPortalPath(path, portal) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  if (portal === 'cms' && path.startsWith('/cms/')) return path;
  if (portal === 'hris' && !path.startsWith('/cms/')) return path;
  return path;
}

function buildOpenState(item) {
  const event = item.event || {};
  const metadata = event.metadata || {};
  const serviceRequestId = metadata.serviceRequestId || event.related_entity_id;
  const incidentId = metadata.incidentId || event.related_entity_id;

  if (event.action_url === '/cms/service-requests' && serviceRequestId) {
    return { openServiceRequestId: serviceRequestId };
  }

  if (event.action_url === '/cms/incident-reports' && incidentId) {
    return { openIncidentId: incidentId };
  }

  return undefined;
}

function NotificationRow({ item, portal, onOpen, onMarkRead, onDismiss }) {
  const event = item.event || {};
  const priority = event.priority || 'normal';
  const actionUrl = getPortalPath(event.action_url, portal);

  return (
    <article className={`notif-row${item.is_read ? '' : ' notif-row--unread'}`}>
      <div className={`notif-row-icon notif-row-icon--${priority}`}>
        {priority === 'urgent' ? <FaExclamationTriangle /> : <FaBell />}
      </div>

      <div className="notif-row-main">
        <div className="notif-row-head">
          <div className="notif-row-title-wrap">
            {!item.is_read && <span className="notif-unread-dot" aria-label="Unread" />}
            <h3>{event.title || 'Notification'}</h3>
          </div>
          <div className="notif-row-badges">
            <span className="notif-type-badge">{formatType(event.type)}</span>
            <span className={`notif-priority notif-priority--${priority}`}>
              {PRIORITY_LABELS[priority] || 'Normal'}
            </span>
          </div>
        </div>

        <p className="notif-row-message">{event.message || 'No message provided.'}</p>

        <div className="notif-row-meta">
          <span><FaClock /> {formatDateTime(event.created_at || item.created_at)}</span>
          {event.actor?.display_name && <span>From {event.actor.display_name}</span>}
          {event.related_entity_type && <span>{formatType(event.related_entity_type)}</span>}
        </div>
      </div>

      <div className="notif-row-actions">
        {actionUrl && (
          <button type="button" className="notif-action-btn primary" onClick={() => onOpen(item, actionUrl)}>
            <FaExternalLinkAlt />
            Open
          </button>
        )}
        {!item.is_read && (
          <button type="button" className="notif-icon-btn" onClick={() => onMarkRead(item.id)} aria-label="Mark as read">
            <FaCheck />
          </button>
        )}
        <button type="button" className="notif-icon-btn danger" onClick={() => onDismiss(item.id)} aria-label="Dismiss">
          <FaTimes />
        </button>
      </div>
    </article>
  );
}

export default function NotificationsPage({ portal = 'hris' }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0, urgent: 0, by_type: {} });
  const [metadata, setMetadata] = useState(DEFAULT_METADATA);
  const [filters, setFilters] = useState({ filter: 'all', type: 'all', search: '' });
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, closeNotification } = useNotification();

  const typeOptions = useMemo(() => {
    const entries = Object.entries(stats.by_type || {}).sort((a, b) => a[0].localeCompare(b[0]));
    return entries.map(([type, count]) => ({ type, count, label: formatType(type) }));
  }, [stats.by_type]);

  const loadStats = useCallback(async () => {
    try {
      const result = await notificationsService.getStats();
      setStats(result);
    } catch {
      setStats({ total: 0, unread: 0, urgent: 0, by_type: {} });
    }
  }, []);

  const loadNotifications = useCallback(async (page = metadata.page, nextFilters = filters) => {
    setLoading(true);
    try {
      const result = await notificationsService.getNotifications({
        page,
        limit: metadata.limit,
        filter: nextFilters.filter,
        type: nextFilters.type !== 'all' ? nextFilters.type : undefined,
        search: nextFilters.search || undefined,
      });
      setNotifications(result.data);
      setMetadata(result.metadata || DEFAULT_METADATA);
    } catch (err) {
      setNotifications([]);
      showNotification(err.response?.data?.error || 'Failed to load notifications.', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, metadata.limit, metadata.page, showNotification]);

  useEffect(() => {
    loadStats();
    loadNotifications(1, filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshCurrentPage = useCallback(async () => {
    await Promise.all([
      loadStats(),
      loadNotifications(metadata.page, filters),
    ]);
  }, [filters, loadNotifications, loadStats, metadata.page]);

  const handleFilterChange = (patch) => {
    const nextFilters = { ...filters, ...patch };
    setFilters(nextFilters);
    setMetadata((prev) => ({ ...prev, page: 1 }));
    loadNotifications(1, nextFilters);
  };

  const handlePageChange = (page) => {
    setMetadata((prev) => ({ ...prev, page }));
    loadNotifications(page, filters);
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationsService.markRead(id);
      await refreshCurrentPage();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to mark notification as read.', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const result = await notificationsService.markAllRead();
      showNotification(`${result.updated || 0} notification${result.updated === 1 ? '' : 's'} marked as read.`, 'success');
      await refreshCurrentPage();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to mark notifications as read.', 'error');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await notificationsService.dismiss(id);
      await refreshCurrentPage();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to dismiss notification.', 'error');
    }
  };

  const handleOpen = async (item, actionUrl) => {
    if (!item.is_read) {
      await notificationsService.markRead(item.id).catch(() => null);
    }

    if (/^https?:\/\//i.test(actionUrl)) {
      window.open(actionUrl, '_blank', 'noopener,noreferrer');
    } else {
      navigate(actionUrl, { state: buildOpenState(item) });
    }
  };

  const start = metadata.total === 0 ? 0 : ((metadata.page - 1) * metadata.limit) + 1;
  const end = Math.min(metadata.page * metadata.limit, metadata.total);
  const portalLabel = portal === 'cms' ? 'Client Portal' : 'Admin Portal';
  const statCards = [
    {
      key: 'total',
      label: 'Total',
      valueColor: '#093269',
      borderColor: '#093269',
      icon: FaInbox,
      iconBg: 'rgba(9, 50, 105, 0.1)',
      iconColor: '#093269',
    },
    {
      key: 'unread',
      label: 'Unread',
      valueColor: '#b45309',
      borderColor: '#e6b215',
      icon: FaBell,
      iconBg: 'rgba(230, 178, 21, 0.12)',
      iconColor: '#b45309',
    },
    {
      key: 'urgent',
      label: 'Urgent',
      valueColor: '#dc2626',
      borderColor: '#ef4444',
      icon: FaExclamationTriangle,
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#dc2626',
    },
  ];

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <header className="notif-topbar">
        <div className="notif-title-group">
          <div>
            <h2>Notifications</h2>
            <p>{portalLabel} activity inbox</p>
          </div>
        </div>

        <button
          type="button"
          className="notif-mark-all-btn"
          onClick={handleMarkAllRead}
          disabled={!stats.unread}
        >
          <FaEnvelopeOpenText />
          Mark all read
        </button>
      </header>

      <div className={portal === 'cms' ? 'cms-content' : 'dashboard-content'}>
        <StatCards cards={statCards} stats={stats} columns={3} />

        <section className="notif-panel">
          <div className="notif-filter-bar">
            <label className="notif-search-box">
              <FaSearch />
              <input
                type="search"
                value={filters.search}
                onChange={(event) => handleFilterChange({ search: event.target.value })}
                placeholder="Search notifications"
              />
            </label>

            <label className="notif-select-wrap">
              <FaFilter />
              <select
                value={filters.filter}
                onChange={(event) => handleFilterChange({ filter: event.target.value })}
              >
                <option value="all">All notifications</option>
                <option value="unread">Unread only</option>
              </select>
            </label>

            <select
              className="notif-type-select"
              value={filters.type}
              onChange={(event) => handleFilterChange({ type: event.target.value })}
            >
              <option value="all">All types</option>
              {typeOptions.map((option) => (
                <option key={option.type} value={option.type}>
                  {option.label} ({option.count})
                </option>
              ))}
            </select>
          </div>

          <div className="notif-list">
            {loading && Array.from({ length: 5 }).map((_, index) => (
              <div className="notif-row notif-row--skeleton" key={index}>
                <span className="notif-skel notif-skel-icon" />
                <div className="notif-row-main">
                  <span className="notif-skel notif-skel-title" />
                  <span className="notif-skel notif-skel-message" />
                  <span className="notif-skel notif-skel-meta" />
                </div>
              </div>
            ))}

            {!loading && notifications.length === 0 && (
              <div className="notif-empty">
                <FaInbox />
                <h3>No notifications</h3>
                <p>New activity that needs your attention will appear here.</p>
              </div>
            )}

            {!loading && notifications.map((item) => (
              <NotificationRow
                key={item.id}
                item={item}
                portal={portal}
                onOpen={handleOpen}
                onMarkRead={handleMarkRead}
                onDismiss={handleDismiss}
              />
            ))}
          </div>

          {metadata.total > 0 && (
            <Pagination
              currentPage={metadata.page}
              totalPages={metadata.totalPages || 1}
              onPageChange={handlePageChange}
              startIndex={start - 1}
              endIndex={end}
              totalItems={metadata.total}
              label="notifications"
              disabled={loading}
            />
          )}
        </section>
      </div>
    </>
  );
}
