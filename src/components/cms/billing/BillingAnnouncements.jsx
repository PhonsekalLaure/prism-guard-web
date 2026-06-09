import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBullhorn, FaChevronRight, FaExternalLinkAlt } from 'react-icons/fa';
import AnnouncementDetailModal from '@cms-components/announcements/AnnouncementDetailModal';
import announcementsService from '@services/cms/announcementsService';

const PRIORITY_CONFIG = {
  urgent:    { label: 'Urgent',    className: 'cms-billing-ann-badge cms-billing-ann-badge--urgent' },
  important: { label: 'Important', className: 'cms-billing-ann-badge cms-billing-ann-badge--important' },
  normal:    { label: 'Normal',    className: 'cms-billing-ann-badge cms-billing-ann-badge--normal' },
};

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatPublisher(publisher) {
  if (!publisher) return 'Prism Guard Admin';
  const name = [publisher.first_name, publisher.last_name].filter(Boolean).join(' ').trim();
  return name || 'Prism Guard Admin';
}

function formatAnnouncement(item) {
  const priorityMap = {
    urgent: { label: 'Urgent', className: 'cms-billing-ann-badge cms-billing-ann-badge--urgent' },
    important: { label: 'Important', className: 'cms-billing-ann-badge cms-billing-ann-badge--important' },
    normal: { label: 'Normal', className: 'cms-billing-ann-badge cms-billing-ann-badge--normal' },
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
    expiresAtDisplay: item.expires_at ? formatDate(item.expires_at) : 'No expiration',
  };
}

export default function BillingAnnouncements() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    announcementsService.getAnnouncements({ limit: 4, sort: 'newest' })
      .then((result) => {
        if (!cancelled) setAnnouncements((result.data || []).map(formatAnnouncement));
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const priorityConfig = (p) => PRIORITY_CONFIG[p] || PRIORITY_CONFIG.normal;

  return (
    <div className="cms-billing-ann-panel">
      <div className="cms-billing-ann-header">
        <div className="cms-billing-ann-title">
          <FaBullhorn className="cms-billing-ann-icon" />
          <span>Announcements</span>
        </div>
        <button
          className="cms-billing-ann-view-all"
          onClick={() => navigate('/cms/announcements')}
        >
          View all <FaExternalLinkAlt />
        </button>
      </div>

      <div className="cms-billing-ann-list">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="cms-billing-ann-skeleton">
              <div className="cms-billing-ann-sk-badge" />
              <div className="cms-billing-ann-sk-line cms-billing-ann-sk-line--title" />
              <div className="cms-billing-ann-sk-line" />
            </div>
          ))
        ) : announcements.length === 0 ? (
          <div className="cms-billing-ann-empty">
            <FaBullhorn className="cms-billing-ann-empty-icon" />
            <p>No announcements at this time.</p>
          </div>
        ) : (
          announcements.map((ann) => {
            const cfg = priorityConfig(ann.priorityValue);
            return (
              <button
                key={ann.id}
                className="cms-billing-ann-item"
                onClick={() => setSelected(ann)}
              >
                <div className="cms-billing-ann-item-top">
                  <span className={cfg.className}>{cfg.label}</span>
                  <span className="cms-billing-ann-date">{ann.date}</span>
                </div>
                <p className="cms-billing-ann-item-title">{ann.title}</p>
                <p className="cms-billing-ann-item-msg">{ann.message}</p>
                <div className="cms-billing-ann-item-footer">
                  <span className="cms-billing-ann-by">{ann.publishedBy}</span>
                  <FaChevronRight className="cms-billing-ann-arrow" />
                </div>
              </button>
            );
          })
        )}
      </div>

      <AnnouncementDetailModal
        isOpen={!!selected}
        announcement={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
