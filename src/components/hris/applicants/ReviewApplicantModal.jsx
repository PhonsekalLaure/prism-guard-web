import { FaTimes, FaUserCheck, FaCalendarCheck, FaTimesCircle, FaCheck } from 'react-icons/fa';

const qualChecks = [
  'Filipino Citizenship',
  'Age Requirement (18-45)',
  "Height Requirement (5'4\" min)",
  'Valid PNP-SOSIA License',
];

export default function ReviewApplicantModal({ isOpen, applicant, onClose }) {
  if (!isOpen || !applicant) return null;

  return (
    <div className="ar-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ar-modal-content">
        {/* Header */}
        <div className="ar-modal-header">
          <div>
            <h2>Application Review</h2>
            <p>Applicant ID: {applicant.id}</p>
          </div>
          <button className="ar-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="ar-modal-body">
          {/* Profile strip */}
          <div className="ar-profile-strip">
            <div className="ar-profile-avatar">{applicant.initials}</div>
            <div>
              <p className="ar-profile-name">{applicant.name}</p>
              <p className="ar-profile-sub">{applicant.position} Position</p>
              <p className="ar-profile-sub">Applied: February 07, 2026</p>
            </div>
            <div className="ar-profile-badge-wrap">
              <span className={`applicant-status-badge status-${applicant.status}`} style={{ fontSize: '0.75rem', padding: '0.35rem 1rem' }}>
                {applicant.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Personal details */}
          <div className="ar-detail-grid">
            <div className="ar-detail-cell">
              <p className="ar-detail-label">Age</p>
              <p className="ar-detail-value">{applicant.physical.split('Age: ')[1] ? applicant.physical.split('Age: ')[1] + ' years old' : '—'}</p>
            </div>
            <div className="ar-detail-cell">
              <p className="ar-detail-label">Height</p>
              <p className="ar-detail-value">{applicant.physical.split(' •')[0].replace('Height: ', '')}</p>
            </div>
            <div className="ar-detail-cell">
              <p className="ar-detail-label">Contact Number</p>
              <p className="ar-detail-value">{applicant.phone}</p>
            </div>
            <div className="ar-detail-cell">
              <p className="ar-detail-label">Email</p>
              <p className="ar-detail-value">{applicant.initials.toLowerCase().replace('', '.') + '@email.com'}</p>
            </div>
          </div>

          {/* Credentials */}
          <div>
            <p className="ar-section-title">Security Credentials</p>
            <div className="ar-credentials-box">
              <div className="ar-credential-row">
                <div>
                  <p className="ar-credential-name">Security License</p>
                  <p className="ar-credential-sub">{applicant.license}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="ar-credential-badge"><FaCheck /> VALID</span>
                  <p className="ar-credential-expires">Expires: Dec 2026</p>
                </div>
              </div>
              <div className="ar-credential-row">
                <div>
                  <p className="ar-credential-name">NBI Clearance</p>
                  <p className="ar-credential-sub">Attached &amp; Verified</p>
                </div>
                <span className="ar-credential-badge"><FaCheck /> CLEAR</span>
              </div>
            </div>
          </div>

          {/* Qualification checks */}
          <div>
            <p className="ar-section-title">Qualification Check</p>
            <div className="ar-qual-list">
              {qualChecks.map((q) => (
                <div key={q} className="ar-qual-row">
                  <span className="ar-qual-label">{q}</span>
                  <FaCheck className="ar-qual-icon" />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <p className="ar-notes-label">Admin Notes</p>
            <textarea
              className="ar-notes-textarea"
              rows={3}
              placeholder="Add notes about this applicant..."
            />
          </div>

          {/* Actions */}
          <div className="ar-modal-actions">
            <button className="ar-btn ar-btn-green">
              <FaUserCheck /> Hire Applicant
            </button>
            <button className="ar-btn ar-btn-blue">
              <FaCalendarCheck /> Schedule Interview
            </button>
            <button className="ar-btn ar-btn-red">
              <FaTimesCircle /> Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
