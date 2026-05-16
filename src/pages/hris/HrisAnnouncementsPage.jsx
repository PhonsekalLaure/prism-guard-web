import { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import HrisAnnouncementsTopbar from '@hris-components/announcements/HrisAnnouncementsTopbar';
import HrisAnnouncementsStatCards from '@hris-components/announcements/HrisAnnouncementsStatCards';
import HrisAnnouncementsCompose from '@hris-components/announcements/HrisAnnouncementsCompose';
import HrisAnnouncementsHistory from '@hris-components/announcements/HrisAnnouncementsHistory';
import '../../styles/hris/HrisAnnouncements.css';

let counter = 24;

function makeRow({ audience, priority, subject, message }) {
  counter++;
  const id = `ANN-2026-${String(counter).padStart(3, '0')}`;
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const audMap = {
    All: 'aud-all',
    'Clients Only': 'aud-clients',
    'Guards Only': 'aud-guards',
  };
  const priMap = { Normal: 'pri-normal', Important: 'pri-important', Urgent: 'pri-urgent' };
  const iconMap = { Normal: 'normal', Important: 'important', Urgent: 'urgent' };

  return {
    id,
    subject,
    audience,
    audienceClass: audMap[audience],
    priority,
    priorityClass: priMap[priority],
    date,
    status: 'Active',
    statusClass: 'st-active',
    iconClass: iconMap[priority],
    publishedBy: 'Admin (President)',
    message,
  };
}

export default function HrisAnnouncementsPage() {
  const [extraRows, setExtraRows] = useState([]);
  const [showToast, setShowToast] = useState(false);

  const handlePublish = (data) => {
    const row = makeRow(data);
    setExtraRows((prev) => [row, ...prev]);
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <>
      <HrisAnnouncementsTopbar />

      <div className="dashboard-content">
        <HrisAnnouncementsStatCards />
        <HrisAnnouncementsCompose onPublish={handlePublish} />
        <HrisAnnouncementsHistory extraRows={extraRows} />
      </div>

      {/* Toast */}
      {showToast && (
        <div className="an-toast">
          <FaCheckCircle style={{ fontSize: '1.1rem' }} />
          Announcement published successfully!
        </div>
      )}
    </>
  );
}
