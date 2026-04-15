import { FaTimes, FaHistory, FaPaperPlane, FaEye, FaCheck, FaReply, FaDownload } from 'react-icons/fa';

const timeline = [
  {
    icon: <FaPaperPlane />,
    bg: '#3b82f6',
    title: 'Request Submitted',
    time: 'February 16, 2026 at 10:30 AM',
    faded: false,
  },
  {
    icon: <FaEye />,
    bg: '#e6b215',
    title: 'Under Review by Admin',
    time: 'February 16, 2026 at 11:00 AM',
    faded: false,
  },
  {
    icon: <FaCheck />,
    bg: '#9ca3af',
    title: 'Awaiting Resolution...',
    time: null,
    faded: true,
  },
];

export default function RequestDetailModal({ isOpen, onClose, request }) {
  if (!isOpen || !request) return null;

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div
        className="sr-modal-content sr-modal-content--wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sr-modal-header">
          <div>
            <h2>Service Request Details</h2>
            <p>{request.id}</p>
          </div>
          <button className="sr-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">
          {/* Badges */}
          <div className="sr-detail-badges">
            <span className={request.statusClass}>{request.status}</span>
            <span className={request.urgencyClass}>{request.urgency}</span>
            <span className="sr-type-pill">{request.type}</span>
          </div>

          {/* Timeline */}
          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaHistory /> Request Timeline
            </h4>
            <div className="sr-timeline">
              {timeline.map((item, i) => (
                <div key={i} className={`sr-timeline-item${item.faded ? ' sr-timeline-item--faded' : ''}`}>
                  <div
                    className="sr-timeline-dot"
                    style={{ background: item.bg }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <p className="sr-timeline-title">{item.title}</p>
                    {item.time && <p className="sr-timeline-time">{item.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="sr-detail-grid">
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Contract</p>
              <p className="sr-detail-info-value">CTR-2024-001</p>
            </div>
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Site / Location</p>
              <p className="sr-detail-info-value">{request.site}</p>
            </div>
          </div>

          {/* Description */}
          <div className="sr-detail-desc-box">
            <p className="sr-detail-info-label">Description</p>
            <p className="sr-detail-desc-text">
              Need one additional guard for the Main Gate due to increased foot traffic from upcoming
              university enrollment period. Preferably assigned starting Feb 18, 2026 for the day
              shift (6AM-6PM).
            </p>
          </div>

          {/* Communication Thread */}
          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaReply /> Communication Thread
            </h4>
            <div className="sr-thread-message">
              <div className="sr-thread-meta">
                <div className="sr-thread-avatar">AD</div>
                <div>
                  <p className="sr-thread-name">Admin</p>
                  <p className="sr-thread-time">Feb 16 at 11:15 AM</p>
                </div>
              </div>
              <p className="sr-thread-text">
                We have received your request. We are currently checking available personnel.
                Will update within 24 hours.
              </p>
            </div>
            <div className="sr-thread-reply">
              <input
                type="text"
                placeholder="Type a reply..."
                className="sr-input sr-reply-input"
              />
              <button className="sr-reply-btn">
                <FaReply /> Reply
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="sr-modal-actions sr-detail-actions">
            <button className="sr-btn-download">
              <FaDownload /> Download
            </button>
            <button className="sr-btn-cancel-req">
              <FaTimes /> Cancel Request
            </button>
            <button className="sr-btn-back" onClick={onClose}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}