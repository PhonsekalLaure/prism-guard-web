import { useState, useEffect } from 'react';
import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronRight,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import announcementsService from '@services/cms/announcementsService';

/* ── helpers ── */
function formatDate(value) {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatAnnouncement(item) {
  const priorityMap = {
    urgent:    { label: 'Urgent',    cls: 'dga-badge--urgent' },
    important: { label: 'Important', cls: 'dga-badge--important' },
    normal:    { label: 'Normal',    cls: 'dga-badge--normal' },
  };
  const audienceMap = {
    both:      { label: 'All',          cls: 'ann-aud ann-aud--all' },
    clients:   { label: 'Clients Only', cls: 'ann-aud ann-aud--clients' },
    employees: { label: 'Guards Only',  cls: 'ann-aud ann-aud--guards' },
  };
  const priority = priorityMap[item.priority] || priorityMap.normal;
  const audience = audienceMap[item.target_audience] || audienceMap.both;
  return {
    id: item.id,
    subject: item.title || 'Untitled announcement',
    message: item.message || '',
    priority: priority.label,
    priorityCls: priority.cls,
    audience: audience.label,
    audienceCls: audience.cls,
    date: formatDate(item.published_at),
    publishedBy: item.publisher
      ? `${item.publisher.first_name || ''} ${item.publisher.last_name || ''}`.trim() || 'Prism Guard Admin'
      : 'Prism Guard Admin',
    expiresAt: item.expires_at
      ? new Date(item.expires_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'No expiration',
  };
}

function PriorityIcon({ priority }) {
  if (priority === 'Urgent')    return <FaExclamationCircle className="dga-priority-icon dga-priority-icon--urgent" />;
  if (priority === 'Important') return <FaExclamationTriangle className="dga-priority-icon dga-priority-icon--important" />;
  return <FaInfoCircle className="dga-priority-icon dga-priority-icon--normal" />;
}

/* ── Mini announcement detail modal ── */
function AnnouncementMiniModal({ ann, onClose }) {
  if (!ann) return null;
  return (
    <div className="dga-mini-overlay" onClick={onClose}>
      <div className="dga-mini-content" onClick={(e) => e.stopPropagation()}>
        <div className="dga-mini-header">
          <div className="dga-mini-header-left">
            <div className="dga-mini-icon">
              <PriorityIcon priority={ann.priority} />
            </div>
            <div>
              <p className="dga-mini-label">{ann.id}</p>
              <h3 className="dga-mini-title">{ann.subject}</h3>
            </div>
          </div>
          <button className="dga-mini-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="dga-mini-body">
          <div className="dga-mini-meta">
            <div className="dga-mini-meta-item">
              <FaCalendarAlt className="dga-mini-meta-icon" />
              <span className="dga-mini-meta-label">Published</span>
              <span className="dga-mini-meta-value">{ann.date}</span>
            </div>
            <div className="dga-mini-meta-item">
              <FaUser className="dga-mini-meta-icon" />
              <span className="dga-mini-meta-label">By</span>
              <span className="dga-mini-meta-value">{ann.publishedBy}</span>
            </div>
            <div className="dga-mini-meta-item">
              <FaUsers className="dga-mini-meta-icon" />
              <span className="dga-mini-meta-label">Audience</span>
              <span className={ann.audienceCls}>{ann.audience}</span>
            </div>
            <div className="dga-mini-meta-item">
              <FaCalendarAlt className="dga-mini-meta-icon" />
              <span className="dga-mini-meta-label">Expires</span>
              <span className="dga-mini-meta-value">{ann.expiresAt}</span>
            </div>
          </div>

          <div className="dga-mini-badges">
            <span className={ann.priorityCls + ' dga-badge'}>{ann.priority}</span>
          </div>

          <hr className="dga-mini-divider" />

          <div className="dga-mini-msg-wrap">
            <p className="dga-mini-msg-label"><FaBullhorn /> Message</p>
            <p className="dga-mini-msg">{ann.message}</p>
          </div>
        </div>

        <div className="dga-mini-footer">
          <button className="dga-mini-close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

/* ── Main panel ── */
export default function DeployedGuardsAnnouncementsPanel() {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    announcementsService.getAnnouncements({ limit: 3, sort: 'newest' })
      .then((res) => setAnnouncements((res.data || []).map(formatAnnouncement)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="dga-panel">
        <div className="dga-panel-header">
          <div className="dga-panel-title-wrap">
            <FaBullhorn className="dga-panel-icon" />
            <div>
              <h3 className="dga-panel-title">Client Announcements</h3>
              <p className="dga-panel-subtitle">Latest updates from Prism Guard</p>
            </div>
          </div>
          <button
            className="dga-panel-view-all"
            onClick={() => navigate('/cms/announcements')}
          >
            View All <FaChevronRight />
          </button>
        </div>

        <div className="dga-panel-body">
          {loading ? (
            <div className="dga-skeleton-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="dga-skeleton-item">
                  <div className="dga-sk-icon" />
                  <div className="dga-sk-lines">
                    <div className="dga-sk-line dga-sk-line--lg" />
                    <div className="dga-sk-line dga-sk-line--sm" />
                  </div>
                </div>
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="dga-empty">
              <FaBullhorn className="dga-empty-icon" />
              <p className="dga-empty-text">No announcements yet.</p>
            </div>
          ) : (
            <div className="dga-list">
              {announcements.map((ann) => (
                <button
                  key={ann.id}
                  className="dga-item"
                  onClick={() => setSelected(ann)}
                >
                  <div className="dga-item-left">
                    <PriorityIcon priority={ann.priority} />
                  </div>
                  <div className="dga-item-body">
                    <p className="dga-item-subject">{ann.subject}</p>
                    <p className="dga-item-preview">
                      {String(ann.message).slice(0, 80)}{ann.message.length > 80 ? '…' : ''}
                    </p>
                    <div className="dga-item-meta">
                      <span className="dga-item-date">{ann.date}</span>
                      <span className={`dga-badge ${ann.priorityCls}`}>{ann.priority}</span>
                    </div>
                  </div>
                  <FaChevronRight className="dga-item-arrow" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnnouncementMiniModal ann={selected} onClose={() => setSelected(null)} />
    </>
  );
}
