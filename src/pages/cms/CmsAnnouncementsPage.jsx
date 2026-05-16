import { useState } from 'react';
import AnnouncementsTopbar from '@cms-components/announcements/AnnouncementsTopbar';
import AnnouncementsInfoBanner from '@cms-components/announcements/AnnouncementsInfoBanner';
import AnnouncementsFilterBar from '@cms-components/announcements/AnnouncementsFilterBar';
import AnnouncementsTable from '@cms-components/announcements/AnnouncementsTable';
import AnnouncementDetailModal from '@cms-components/announcements/AnnouncementDetailModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import '@styles/cms/CmsAnnouncements.css';

export default function CmsAnnouncementsPage() {
  const [filters, setFilters] = useState({ search: '', priority: 'all', sort: 'newest', date: '' });
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

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
          filters={filters}
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
