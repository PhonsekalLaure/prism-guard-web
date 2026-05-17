import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaUsers,
} from 'react-icons/fa';

function PriorityIcon({ priority }) {
  if (priority === 'Urgent')    return <FaExclamationCircle />;
  if (priority === 'Important') return <FaExclamationTriangle />;
  return <FaInfoCircle />;
}

export default function AnnouncementDetailModal({ isOpen, announcement, onClose }) {
  if (!isOpen || !announcement) return null;

  return (
    <div className="ann-modal-overlay" onClick={onClose}>
      <div
        className="ann-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cms-announcement-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`ann-modal-header ann-modal-header--${announcement.priority.toLowerCase()}`}>
          <div className="ann-modal-header-left">
            <div className="ann-modal-icon">
              <PriorityIcon priority={announcement.priority} />
            </div>
            <div>
              <p className="ann-modal-id">{announcement.id}</p>
              <h3 id="cms-announcement-title" className="ann-modal-title">{announcement.subject}</h3>
            </div>
          </div>
          <button className="ann-modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="ann-modal-body">
          {/* Meta row */}
          <div className="ann-modal-meta">
            <div className="ann-modal-meta-item">
              <FaCalendarAlt className="ann-modal-meta-icon" />
              <span className="ann-modal-meta-label">Published</span>
              <span className="ann-modal-meta-value">{announcement.date}</span>
            </div>
            <div className="ann-modal-meta-item">
              <FaUser className="ann-modal-meta-icon" />
              <span className="ann-modal-meta-label">By</span>
              <span className="ann-modal-meta-value">{announcement.publishedBy}</span>
            </div>
            <div className="ann-modal-meta-item">
              <FaUsers className="ann-modal-meta-icon" />
              <span className="ann-modal-meta-label">Audience</span>
              <span className={`${announcement.audienceClass} ann-modal-meta-badge`}>
                {announcement.audience}
              </span>
            </div>
            <div className="ann-modal-meta-item">
              <FaCalendarAlt className="ann-modal-meta-icon" />
              <span className="ann-modal-meta-label">Expires</span>
              <span className="ann-modal-meta-value">{announcement.expiresAtDisplay}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="ann-modal-badges">
            <span className={announcement.priorityClass}>{announcement.priority}</span>
          </div>

          {/* Divider */}
          <hr className="ann-modal-divider" />

          {/* Message */}
          <div className="ann-modal-message-wrap">
            <p className="ann-modal-message-label">
              <FaBullhorn /> Message
            </p>
            <p className="ann-modal-message">{announcement.message}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="ann-modal-footer">
          <button className="ann-modal-close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
