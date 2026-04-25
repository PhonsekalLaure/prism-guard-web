import {
  FaTimes, FaIdCard, FaBriefcase, FaCertificate,
  FaMapMarkedAlt, FaDownload, FaCommentAlt, FaArrowLeft, FaCheckCircle,
} from 'react-icons/fa';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

export default function GuardDetailModal({ isOpen, onClose, guard, loading }) {
  if (!isOpen) return null;

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
            <p>{loading ? '...' : (guard?.employee_id_number || 'N/A')}</p>
          </div>
          <button className="dg-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="dg-modal-body">
          {loading || !guard ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
              {loading ? 'Loading guard profile...' : 'No data available.'}
            </div>
          ) : (
            <>
              {/* Guard Identity */}
              <div className="dg-guard-identity">
                {guard.avatar_url ? (
                  <img
                    src={guard.avatar_url}
                    alt={guard.name}
                    className="dg-guard-avatar"
                    style={{ objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  <div className="dg-guard-avatar">
                    {guard.initials}
                  </div>
                )}
                <div className="dg-guard-identity-info">
                  <h3>{guard.full_name || guard.name}</h3>
                  <p>{guard.position || 'Security Officer'}</p>
                  <div className="dg-guard-badges">
                    <span className="dg-badge dg-badge--active">{guard.status || 'Active'}</span>
                    {guard.deployment_type === 'reliever' && (
                      <span className="dg-badge dg-badge--armed">Reliever</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="dg-info-grid">
                <div className="dg-info-cell">
                  <p className="dg-info-label">Age</p>
                  <p className="dg-info-value">{guard.age ?? 'N/A'}</p>
                </div>
                <div className="dg-info-cell">
                  <p className="dg-info-label">Gender</p>
                  <p className="dg-info-value">{guard.gender || 'N/A'}</p>
                </div>
                <div className="dg-info-cell">
                  <p className="dg-info-label">Contact</p>
                  <p className="dg-info-value dg-info-value--blue">{guard.phone_number || 'N/A'}</p>
                </div>
                <div className="dg-info-cell">
                  <p className="dg-info-label">Civil Status</p>
                  <p className="dg-info-value">{guard.civil_status || 'N/A'}</p>
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
                    <p className="dg-info-value">{formatDate(guard.hire_date)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Employment Type</p>
                    <p className="dg-info-value" style={{ textTransform: 'capitalize' }}>
                      {guard.employment_type || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Certifications / Clearances */}
              <div className="dg-modal-section">
                <h4 className="dg-section-heading">
                  <FaCertificate /> Certifications &amp; Licenses
                </h4>
                {guard.clearances && guard.clearances.length > 0 ? (
                  <div className="dg-info-grid">
                    {guard.clearances.map((cert) => (
                      <div key={cert.id} className="dg-info-cell">
                        <p className="dg-info-label" style={{ textTransform: 'capitalize' }}>
                          {cert.clearance_type?.replace(/_/g, ' ') || 'Document'}
                        </p>
                        {cert.document_url ? (
                          <a
                            href={cert.document_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="dg-info-value dg-info-value--blue"
                          >
                            View Document
                          </a>
                        ) : (
                          <p className="dg-info-value">N/A</p>
                        )}
                        {cert.expiry_date && (
                          <p className="dg-cert-valid">
                            <FaCheckCircle /> Valid until {formatDate(cert.expiry_date)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#7f8c8d', fontSize: '0.875rem' }}>
                    No clearance documents on file.
                  </p>
                )}
              </div>

              {/* Deployment Details */}
              <div className="dg-modal-section">
                <h4 className="dg-section-heading">
                  <FaMapMarkedAlt /> Current Deployment
                </h4>
                <div className="dg-info-grid">
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Assigned Site</p>
                    <p className="dg-info-value">{guard.site_name || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Shift Schedule</p>
                    <p className="dg-info-value">{guard.shift || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Deployment Start</p>
                    <p className="dg-info-value">{formatDate(guard.start_date)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Contract End</p>
                    <p className="dg-info-value">{formatDate(guard.end_date)}</p>
                  </div>
                </div>
                {guard.site_address && (
                  <div className="dg-duties-box">
                    <p className="dg-duties-label">Site Address</p>
                    <p className="dg-duties-text">{guard.site_address}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="dg-modal-actions">
            <button className="dg-modal-btn dg-modal-btn--primary" disabled={loading || !guard}>
              <FaDownload /> Download Profile
            </button>
            <button className="dg-modal-btn dg-modal-btn--gold" disabled={loading || !guard}>
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