import { useEffect, useMemo, useState } from 'react';
import AnnouncementsTopbar from '@cms-components/announcements/AnnouncementsTopbar';
import AnnouncementsInfoBanner from '@cms-components/announcements/AnnouncementsInfoBanner';
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
  const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
  const isExpired = expiresAt && expiresAt <= new Date();
  const status = item.status === 'archived' ? 'Archived' : (isExpired ? 'Expired' : 'Active');

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
    status,
    statusValue: item.status || 'published',
    statusClass: `ann-status ann-status--${status.toLowerCase()}`,
    publishedBy: formatPublisher(item.publisher),
    expiresAt: item.expires_at || null,
    expiresAtDisplay: formatDateTime(item.expires_at),
  };
}

export default function CmsAnnouncementsPage() {
  const [filters, setFilters] = useState({ search: '', priority: 'all', sort: 'newest', date: '' });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();
  const rows = useMemo(() => announcements.map(formatAnnouncement), [announcements]);

  useEffect(() => {
    let cancelled = false;

    async function loadAnnouncements() {
      setLoading(true);
      try {
        const data = await announcementsService.getAnnouncements({ limit: 100 });
        if (!cancelled) {
          setAnnouncements(data);
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
  }, [showNotification]);

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
        <AnnouncementsInfoBanner />
        <AnnouncementsFilterBar onFilterChange={setFilters} />
        <AnnouncementsTable
          announcements={rows}
          filters={filters}
          loading={loading}
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
