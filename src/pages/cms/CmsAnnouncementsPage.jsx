import { useCallback, useEffect, useMemo, useState } from 'react';
import AnnouncementsTopbar from '@cms-components/announcements/AnnouncementsTopbar';
import AnnouncementsFilterBar from '@cms-components/announcements/AnnouncementsFilterBar';
import AnnouncementsTable from '@cms-components/announcements/AnnouncementsTable';
import ClientAnnouncementsTable from '@cms-components/announcements/ClientAnnouncementsTable';
import AnnouncementDetailModal from '@cms-components/announcements/AnnouncementDetailModal';
import CreateAnnouncementModal from '@cms-components/announcements/CreateAnnouncementModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import announcementsService from '@services/cms/announcementsService';
import '@styles/cms/CmsAnnouncements.css';

// ─── Formatters ────────────────────────────────────────────────────────────────

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(value) {
  if (!value) return 'No expiration';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No expiration';
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPublisher(publisher) {
  if (!publisher) return 'Prism Guard Admin';
  const name = [publisher.first_name, publisher.last_name].filter(Boolean).join(' ').trim();
  if (name) return name;
  if (publisher.admin_role) return publisher.admin_role.replace(/_/g, ' ');
  return 'Prism Guard Admin';
}

function getLocalDayRange(value) {
  if (!value) return {};
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return {};

  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);
  return {
    publishedFrom: start.toISOString(),
    publishedTo: end.toISOString(),
  };
}

function formatAnnouncement(item) {
  const priorityMap = {
    urgent: { label: 'Urgent', className: 'ann-badge ann-badge--urgent' },
    important: { label: 'Important', className: 'ann-badge ann-badge--important' },
    normal: { label: 'Normal', className: 'ann-badge ann-badge--normal' },
  };
  const audienceMap = {
    both: { label: 'All', className: 'ann-aud ann-aud--all' },
    clients: { label: 'Clients Only', className: 'ann-aud ann-aud--clients' },
    employees: { label: 'Guards Only', className: 'ann-aud ann-aud--guards' },
  };
  const priority = priorityMap[item.priority] || priorityMap.normal;
  const audience = audienceMap[item.target_audience] || audienceMap.both;

  return {
    id: item.id,
    subject: item.title || 'Untitled announcement',
    title: item.title || 'Untitled announcement',
    message: item.message || '',
    priority: priority.label,
    priorityValue: item.priority || 'normal',
    priorityClass: priority.className,
    audience: audience.label,
    targetAudience: item.target_audience || 'both',
    audienceClass: audience.className,
    date: formatDate(item.published_at),
    dateValue: item.published_at || '',
    publishedBy: formatPublisher(item.publisher),
    expiresAt: item.expires_at || null,
    expiresAtDisplay: formatDateTime(item.expires_at),
  };
}

/** Format a client announcement for the detail modal (adapts to the same shape). */
function formatClientAnnouncementForDetail(item) {
  const priorityMap = {
    urgent: { label: 'Urgent', className: 'ann-badge ann-badge--urgent' },
    important: { label: 'Important', className: 'ann-badge ann-badge--important' },
    normal: { label: 'Normal', className: 'ann-badge ann-badge--normal' },
  };
  const priority = priorityMap[item.priority] || priorityMap.normal;

  return {
    id: item.id,
    subject: item.title || 'Untitled announcement',
    title: item.title || 'Untitled announcement',
    message: item.message || '',
    priority: priority.label,
    priorityValue: item.priority || 'normal',
    priorityClass: priority.className,
    audience: 'Deployed Guards',
    targetAudience: 'deployed_guards',
    audienceClass: 'ann-aud client-ann-aud--guards',
    date: formatDate(item.published_at),
    dateValue: item.published_at || '',
    publishedBy: item.company ? `${item.company} (You)` : 'You',
    expiresAt: item.expires_at || null,
    expiresAtDisplay: formatDateTime(item.expires_at),
    recipient_count: item.recipient_count ?? null,
    isClientAnnouncement: true,
  };
}

export default function CmsAnnouncementsPage() {
  // ── Admin announcements state ──────────────────────────────────────────────
  const [filters, setFilters] = useState({ search: '', priority: 'all', sort: 'newest', date: '' });
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);

  // ── Client announcements state ─────────────────────────────────────────────
  const [clientAnnouncements, setClientAnnouncements] = useState([]);
  const [clientMetadata, setClientMetadata] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [clientLoading, setClientLoading] = useState(true);
  const [deletingClientId, setDeletingClientId] = useState(null);

  // ── Modal state ────────────────────────────────────────────────────────────
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { notification, showNotification, closeNotification } = useNotification();
  const rows = useMemo(() => announcements.map(formatAnnouncement), [announcements]);

  // ── Load admin announcements ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      setLoading(true);
      try {
        const dateRange = getLocalDayRange(filters.date);
        const result = await announcementsService.getAnnouncements({
          page: metadata.page,
          limit: metadata.limit,
          search: filters.search || undefined,
          priority: filters.priority !== 'all' ? filters.priority : undefined,
          sort: filters.sort,
          ...dateRange,
        });

        if (!cancelled) {
          setAnnouncements(result.data);
          setMetadata(result.metadata);
        }
      } catch (err) {
        if (!cancelled) {
          showNotification(err.response?.data?.error || 'Failed to load announcements.', 'error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAnnouncements();
    return () => { cancelled = true; };
  }, [filters, metadata.limit, metadata.page, showNotification]);

  // ── Load client announcements ──────────────────────────────────────────────
  const loadClientAnnouncements = useCallback(async () => {
    setClientLoading(true);
    try {
      const result = await announcementsService.getClientAnnouncements({
        page: clientMetadata.page,
        limit: clientMetadata.limit,
      });
      setClientAnnouncements(result.data);
      setClientMetadata(result.metadata);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load your announcements.', 'error');
    } finally {
      setClientLoading(false);
    }
  }, [clientMetadata.page, clientMetadata.limit, showNotification]);

  useEffect(() => {
    loadClientAnnouncements();
  }, [loadClientAnnouncements]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setMetadata((prev) => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({ search: '', priority: 'all', sort: 'newest', date: '' });
    setFilterResetKey((key) => key + 1);
    setMetadata((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setMetadata((prev) => ({ ...prev, page }));
  };

  const handleClientPageChange = (page) => {
    setClientMetadata((prev) => ({ ...prev, page }));
  };

  const handleDeleteClientAnnouncement = async (id) => {
    setDeletingClientId(id);
    try {
      await announcementsService.deleteClientAnnouncement(id);
      showNotification('Announcement deleted.', 'success');
      setClientAnnouncements((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to delete announcement.', 'error');
    } finally {
      setDeletingClientId(null);
    }
  };

  const handleCreateSubmit = async (payload) => {
    const result = await announcementsService.createClientAnnouncement(payload);
    showNotification(
      `Announcement published to ${result.recipient_count ?? 0} guard${result.recipient_count !== 1 ? 's' : ''}.`,
      'success',
    );
    // Refresh client announcements table
    setClientMetadata((prev) => ({ ...prev, page: 1 }));
    loadClientAnnouncements();
  };

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

      {/* Topbar with Create button */}
      <AnnouncementsTopbar onCreateClick={() => setCreateModalOpen(true)} />

      <div className="cms-content">
        {/* ── Section 1: Admin-published announcements (from Prism Guard) ── */}
        <div className="ann-section">
          <div className="ann-section-label">
            <span className="ann-section-label-text">From Prism Guard</span>
          </div>
          <AnnouncementsFilterBar key={filterResetKey} onFilterChange={handleFilterChange} />
          <AnnouncementsTable
            announcements={rows}
            metadata={metadata}
            loading={loading}
            onPageChange={handlePageChange}
            onViewDetail={(ann) => setSelectedAnnouncement(ann)}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* ── Section 2: Client-authored announcements (your guard broadcasts) ── */}
        <div className="ann-section">
          <div className="ann-section-label">
            <span className="ann-section-label-text">My Guard Announcements</span>
          </div>
          <ClientAnnouncementsTable
            announcements={clientAnnouncements}
            metadata={clientMetadata}
            loading={clientLoading}
            onPageChange={handleClientPageChange}
            onViewDetail={(ann) => setSelectedAnnouncement(formatClientAnnouncementForDetail(ann))}
            onDelete={handleDeleteClientAnnouncement}
            deletingId={deletingClientId}
          />
        </div>
      </div>

      {/* Detail modal (shared for both admin and client announcements) */}
      <AnnouncementDetailModal
        isOpen={!!selectedAnnouncement}
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />

      {/* Create announcement modal */}
      <CreateAnnouncementModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />
    </>
  );
}
