import { useEffect, useMemo, useState } from 'react';
import AnnouncementsTopbar from '@cms-components/announcements/AnnouncementsTopbar';
import AnnouncementsFilterBar from '@cms-components/announcements/AnnouncementsFilterBar';
import AnnouncementsTable from '@cms-components/announcements/AnnouncementsTable';
import AnnouncementDetailModal from '@cms-components/announcements/AnnouncementDetailModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import announcementsService from '@services/cms/announcementsService';
import '@styles/cms/CmsAnnouncements.css';

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

export default function CmsAnnouncementsPage() {
  const [filters, setFilters] = useState({ search: '', priority: 'all', sort: 'newest', date: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();
  const rows = useMemo(() => announcements.map(formatAnnouncement), [announcements]);

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
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnnouncements();

    return () => {
      cancelled = true;
    };
  }, [filters, metadata.limit, metadata.page, showNotification]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setMetadata((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page) => {
    setMetadata((prev) => ({ ...prev, page }));
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

      <AnnouncementsTopbar />

      <div className="cms-content">
        <AnnouncementsFilterBar onFilterChange={handleFilterChange} />
        <AnnouncementsTable
          announcements={rows}
          metadata={metadata}
          loading={loading}
          onPageChange={handlePageChange}
          onViewDetail={(ann) => setSelectedAnnouncement(ann)}
        />
      </div>

      <AnnouncementDetailModal
        isOpen={!!selectedAnnouncement}
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
      />
    </>
  );
}
