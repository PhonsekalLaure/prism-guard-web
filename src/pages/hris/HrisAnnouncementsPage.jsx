import { useState, useEffect, useCallback, useRef } from 'react';
import HrisAnnouncementsTopbar from '@hris-components/announcements/HrisAnnouncementsTopbar';
import HrisAnnouncementsStatCards from '@hris-components/announcements/HrisAnnouncementsStatCards';
import HrisAnnouncementsCompose from '@hris-components/announcements/HrisAnnouncementsCompose';
import HrisAnnouncementsHistory from '@hris-components/announcements/HrisAnnouncementsHistory';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import announcementsService from '@services/hris/announcementsService';
import authService from '@services/authService';
import { hasPermission } from '@utils/adminPermissions';
import '../../styles/hris/HrisAnnouncements.css';

const PAGE_LIMIT = 8;
const EMPTY_FILTERS = {
  search: '',
  targetAudience: '',
  priority: '',
  status: '',
};

function formatRow(item) {
  const audMap = {
    both: { label: 'All', className: 'aud-all' },
    clients: { label: 'Clients Only', className: 'aud-clients' },
    employees: { label: 'Guards Only', className: 'aud-guards' },
  };
  const priMap = {
    normal: { label: 'Normal', className: 'pri-normal', iconClass: 'normal' },
    important: { label: 'Important', className: 'pri-important', iconClass: 'important' },
    urgent: { label: 'Urgent', className: 'pri-urgent', iconClass: 'urgent' },
  };
  const publishedAt = item.published_at ? new Date(item.published_at) : null;
  const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
  const isArchived = item.status === 'archived';
  const isExpired = !isArchived && expiresAt && expiresAt <= new Date();
  const status = isArchived ? 'Archived' : (isExpired ? 'Expired' : 'Active');
  const audience = audMap[item.target_audience] || audMap.both;
  const priority = priMap[item.priority] || priMap.normal;
  const publisher = item.publisher
    ? [item.publisher.first_name, item.publisher.last_name].filter(Boolean).join(' ')
    : 'Admin';

  return {
    id: item.id,
    subject: item.title,
    targetAudience: item.target_audience,
    audience: audience.label,
    audienceClass: audience.className,
    priorityValue: item.priority,
    priority: priority.label,
    priorityClass: priority.className,
    date: publishedAt
      ? publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'N/A',
    status,
    statusClass: isArchived ? 'st-archived' : (isExpired ? 'st-expired' : 'st-active'),
    iconClass: (isArchived || isExpired) ? 'expired' : priority.iconClass,
    publishedBy: publisher || 'Admin',
    message: item.message,
    expiresAt: item.expires_at,
  };
}

export default function HrisAnnouncementsPage() {
  const profile = authService.getProfile() || {};
  const canWriteAnnouncements = hasPermission(profile, 'announcements.write');
  const latestRequestId = useRef(0);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState(null);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: PAGE_LIMIT, totalPages: 0 });
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadAnnouncements = useCallback(async (nextParams = {}) => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;
    setLoading(true);
    try {
      const nextPage = nextParams.page || 1;
      const nextFilters = nextParams.filters || EMPTY_FILTERS;
      const [announcementData, statData] = await Promise.all([
        announcementsService.getAnnouncements({
          page: nextPage,
          limit: PAGE_LIMIT,
          ...nextFilters,
        }),
        announcementsService.getStats(),
      ]);
      if (latestRequestId.current !== requestId) return;
      setRows((announcementData.data || []).map(formatRow));
      setMetadata(announcementData.metadata || { total: 0, page: nextPage, limit: PAGE_LIMIT, totalPages: 0 });
      setStats(statData);
    } catch (err) {
      if (latestRequestId.current !== requestId) return;
      showNotification(err.response?.data?.error || 'Failed to load announcements.', 'error');
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, [showNotification]);

  const refreshPageAfterRemoval = async () => {
    const nextPage = rows.length === 1 && (metadata.page || 1) > 1
      ? metadata.page - 1
      : metadata.page;
    await loadAnnouncements({ page: nextPage, filters });
  };

  const refreshCurrentPage = async () => {
    await loadAnnouncements({ page: metadata.page, filters });
  };

  const handlePublish = async (data) => {
    setPublishing(true);
    try {
      await announcementsService.publishAnnouncement(data);
      await loadAnnouncements({ page: 1, filters });
      showNotification('Announcement published successfully!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to publish announcement.', 'error');
      throw err;
    } finally {
      setPublishing(false);
    }
  };

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    loadAnnouncements({ page: 1, filters: nextFilters });
  };

  const handleResetFilters = () => {
    setFilters(EMPTY_FILTERS);
    loadAnnouncements({ page: 1, filters: EMPTY_FILTERS });
  };

  const handlePageChange = (page) => {
    loadAnnouncements({ page, filters });
  };

  const handleEdit = async (id, data) => {
    setActionLoadingId(id);
    try {
      await announcementsService.updateAnnouncement(id, data);
      await refreshCurrentPage();
      showNotification('Announcement updated successfully.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update announcement.', 'error');
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleArchive = async (id) => {
    setActionLoadingId(id);
    try {
      await announcementsService.archiveAnnouncement(id);
      await refreshPageAfterRemoval();
      showNotification('Announcement archived.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to archive announcement.', 'error');
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (id) => {
    setActionLoadingId(id);
    try {
      await announcementsService.deleteAnnouncement(id);
      await refreshPageAfterRemoval();
      showNotification('Announcement deleted.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to delete announcement.', 'error');
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    loadAnnouncements({ page: 1, filters: EMPTY_FILTERS });
  }, [loadAnnouncements]);

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
      <HrisAnnouncementsTopbar />

      <div className="dashboard-content">
        <HrisAnnouncementsStatCards stats={stats} loading={loading} />
        <HrisAnnouncementsCompose
          onPublish={handlePublish}
          publishing={publishing}
          canWrite={canWriteAnnouncements}
        />
        <HrisAnnouncementsHistory
          rows={rows}
          loading={loading}
          metadata={metadata}
          filters={filters}
          actionLoadingId={actionLoadingId}
          onArchive={handleArchive}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onFiltersChange={handleFiltersChange}
          onPageChange={handlePageChange}
          onResetFilters={handleResetFilters}
          canWrite={canWriteAnnouncements}
        />
      </div>

    </>
  );
}
