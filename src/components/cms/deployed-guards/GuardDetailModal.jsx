import {
  FaTimes, FaIdCard, FaBriefcase, FaCertificate,
  FaMapMarkedAlt, FaStar, FaStarHalfAlt, FaRegStar,
  FaDownload, FaCommentAlt, FaArrowLeft, FaCheckCircle,
} from 'react-icons/fa';

const ratings = [
  { label: 'Overall', score: 4.5, display: '4.5/5' },
  { label: 'Punctuality', score: 5.0, display: '5.0/5' },
  { label: 'Reliability', score: 4.0, display: '4.0/5' },
  { label: 'Professionalism', score: 5.0, display: '5.0/5' },
];

function StarRating({ score }) {
  const full = Math.floor(score);
  const half = score % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="dg-star-row">
      {Array.from({ length: full }).map((_, i) => <FaStar key={`f${i}`} />)}
      {half && <FaStarHalfAlt />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar key={`e${i}`} />)}
    </div>
  );
}

export default function GuardDetailModal({ isOpen, onClose, guard }) {
  if (!isOpen || !guard) return null;

  return (
    <div className="dg-modal-overlay" onClick={onClose}>
      <div
        className="dg-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="dg-modal-header">
          <div>
            <h2>Guard Profile</h2>
            <p>{guard.employeeId}</p>
          </div>
          <button className="dg-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="dg-modal-body">
          {/* Guard Identity */}
          <div className="dg-guard-identity">
            <div className="dg-guard-avatar" style={{ background: guard.avatarColor }}>
              {guard.initials}
            </div>
            <div className="dg-guard-identity-info">
              <h3>{guard.name}</h3>
              <p>Security Officer I</p>
              <div className="dg-guard-badges">
                <span className="dg-badge dg-badge--active">Active</span>
                <span className="dg-badge dg-badge--armed">Armed Guard</span>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="dg-info-grid">
            <div className="dg-info-cell">
              <p className="dg-info-label">Age</p>
              <p className="dg-info-value">32</p>
            </div>
            <div className="dg-info-cell">
              <p className="dg-info-label">Gender</p>
              <p className="dg-info-value">Male</p>
            </div>
            <div className="dg-info-cell">
              <p className="dg-info-label">Contact</p>
              <p className="dg-info-value dg-info-value--blue">+63 917 555 1234</p>
            </div>
            <div className="dg-info-cell">
              <p className="dg-info-label">Blood Type</p>
              <p className="dg-info-value dg-info-value--red">O+</p>
            </div>
          </div>

          {/* Employment Info */}
          <div className="dg-modal-section">
            <h4 className="dg-section-heading">
              <FaBriefcase /> Employment Information
            </h4>
            <div className="dg-info-grid">
              <div className="dg-info-cell">
                <p className="dg-info-label">Date Hired</p>
                <p className="dg-info-value">January 15, 2024</p>
              </div>
              <div className="dg-info-cell">
                <p className="dg-info-label">Years of Experience</p>
                <p className="dg-info-value">8 years</p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="dg-modal-section">
            <h4 className="dg-section-heading">
              <FaCertificate /> Certifications &amp; Licenses
            </h4>
            <div className="dg-info-grid">
              {[
                { label: 'Security Guard License', value: 'SGL-2024-78945', validity: 'Valid until Dec 2026' },
                { label: 'Firearms License', value: 'FL-2024-12345', validity: 'Valid until Jun 2026' },
                { label: 'First Aid Certification', value: 'FA-RC-2025-001', validity: 'Valid until Mar 2027' },
                { label: 'Other Certifications', value: 'BOSH, Crowd Control', validity: null },
              ].map((cert) => (
                <div key={cert.label} className="dg-info-cell">
                  <p className="dg-info-label">{cert.label}</p>
                  <p className="dg-info-value">{cert.value}</p>
                  {cert.validity && (
                    <p className="dg-cert-valid">
                      <FaCheckCircle /> {cert.validity}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deployment Details */}
          <div className="dg-modal-section">
            <h4 className="dg-section-heading">
              <FaMapMarkedAlt /> Current Deployment
            </h4>
            <div className="dg-info-grid">
              <div className="dg-info-cell">
                <p className="dg-info-label">Assigned Site</p>
                <p className="dg-info-value">FEU Institute of Tech — Main Gate</p>
              </div>
              <div className="dg-info-cell">
                <p className="dg-info-label">Shift Schedule</p>
                <p className="dg-info-value">Mon-Sat, 6:00 AM - 6:00 PM</p>
              </div>
              <div className="dg-info-cell">
                <p className="dg-info-label">Deployment Start</p>
                <p className="dg-info-value">January 15, 2024</p>
              </div>
              <div className="dg-info-cell">
                <p className="dg-info-label">Contract End</p>
                <p className="dg-info-value">December 31, 2026</p>
              </div>
            </div>
            <div className="dg-duties-box">
              <p className="dg-duties-label">Duties &amp; Responsibilities</p>
              <p className="dg-duties-text">
                Main gate access control, visitor log management, vehicle entry/exit monitoring,
                perimeter patrol during shift.
              </p>
            </div>
          </div>

          {/* Performance Ratings */}
          <div className="dg-modal-section">
            <h4 className="dg-section-heading">
              <FaStar /> Performance Ratings
            </h4>
            <div className="dg-ratings-grid">
              {ratings.map((r) => (
                <div key={r.label} className="dg-rating-card">
                  <p className="dg-info-label">{r.label}</p>
                  <StarRating score={r.score} />
                  <p className="dg-rating-score">{r.display}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="dg-modal-actions">
            <button className="dg-modal-btn dg-modal-btn--primary">
              <FaDownload /> Download Profile
            </button>
            <button className="dg-modal-btn dg-modal-btn--gold">
              <FaCommentAlt /> Submit Feedback
            </button>
            <button className="dg-modal-btn dg-modal-btn--secondary" onClick={onClose}>
              <FaArrowLeft /> Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}