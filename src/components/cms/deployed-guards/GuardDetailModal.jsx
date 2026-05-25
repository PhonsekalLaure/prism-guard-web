import {
  FaTimes, FaIdCard, FaBriefcase, FaCertificate,
  FaMapMarkedAlt, FaDownload, FaCommentAlt, FaArrowLeft, FaCheckCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'dg-badge dg-badge--active' },
  inactive: { label: 'Inactive', className: 'dg-badge dg-badge--inactive' },
  terminated: { label: 'Terminated', className: 'dg-badge dg-badge--terminated' },
  archived: { label: 'Archived', className: 'dg-badge dg-badge--archived' },
  unknown: { label: 'Unknown', className: 'dg-badge dg-badge--unknown' },
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  });
}

function formatTime(time = '') {
  return time.slice(0, 5) || 'N/A';
}

function formatSchedule(schedule) {
  const days = Array.isArray(schedule.days_of_week)
    ? schedule.days_of_week.map((day) => DAY_LABELS[day] || day).join(', ')
    : 'N/A';

  return `${days} | ${formatTime(schedule.shift_start)}-${formatTime(schedule.shift_end)}`;
}

function formatHeight(height) {
  return height ? `${height} cm` : 'N/A';
}

function formatStatus(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
}

function buildProfileText(guard) {
  const lines = [
    'PRISM Guard Profile',
    '',
    `Name: ${guard.full_name || guard.name || 'N/A'}`,
    `Employee ID: ${guard.employee_id_number || 'N/A'}`,
    `Status: ${formatStatus(guard.status).label}`,
    `Position: ${guard.position || 'N/A'}`,
    `Employment Type: ${guard.employment_type || 'N/A'}`,
    `Date Hired: ${formatDate(guard.hire_date)}`,
    '',
    'Contact',
    `Phone: ${guard.phone_number || 'N/A'}`,
    `Email: ${guard.contact_email || 'N/A'}`,
    `Residential Address: ${guard.residential_address || 'N/A'}`,
    `Emergency Contact: ${guard.emergency_contact_name || 'N/A'} (${guard.emergency_contact_number || 'N/A'})`,
    '',
    'Personal',
    `Date of Birth: ${formatDate(guard.date_of_birth)}`,
    `Age: ${guard.age ?? 'N/A'}`,
    `Gender: ${guard.gender || 'N/A'}`,
    `Civil Status: ${guard.civil_status || 'N/A'}`,
    `Citizenship: ${guard.citizenship || 'N/A'}`,
    `Height: ${formatHeight(guard.height_cm)}`,
    `Education: ${guard.educational_level || 'N/A'}`,
    '',
    'Deployment',
    `Company: ${guard.company || 'N/A'}`,
    `Site: ${guard.site_name || 'N/A'}`,
    `Site Address: ${guard.site_address || 'N/A'}`,
    `Shift: ${guard.shift || 'N/A'}`,
    `Deployment Type: ${guard.deployment_type || 'N/A'}`,
    `Deployment Start: ${formatDate(guard.start_date)}`,
    `Deployment End: ${formatDate(guard.end_date)}`,
  ];

  if (Array.isArray(guard.schedules) && guard.schedules.length > 0) {
    lines.push('', 'Schedules');
    guard.schedules.forEach((schedule) => lines.push(formatSchedule(schedule)));
  }

  if (Array.isArray(guard.clearances) && guard.clearances.length > 0) {
    lines.push('', 'Clearances');
    guard.clearances.forEach((cert) => {
      lines.push(`${cert.clearance_type || 'Document'}: ${cert.status || 'N/A'} | expires ${formatDate(cert.expiry_date)}`);
    });
  }

  return lines.join('\n');
}

function downloadProfile(guard) {
  const fileName = `${guard.employee_id_number || 'guard'}-profile.txt`;
  const blob = new Blob([buildProfileText(guard)], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function GuardProfileSkeleton() {
  return (
    <div className="detail-skeleton">
      <div className="dg-guard-identity">
        <SkeletonBlock className="entity-card-skeleton__avatar" />
        <div className="entity-card-skeleton__lines">
          <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long" />
          <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short" />
          <div className="entity-card-skeleton__tag-row">
            <SkeletonBlock className="entity-card-skeleton__tag" />
            <SkeletonBlock className="entity-card-skeleton__tag" />
          </div>
        </div>
      </div>

      {[4, 6, 3].map((count, sectionIndex) => (
        <div key={sectionIndex} className="dg-modal-section">
          <SkeletonBlock
            height="0.85rem"
            width={sectionIndex === 0 ? 140 : 180}
            style={{ marginBottom: '0.75rem' }}
          />
          <div className="dg-info-grid">
            <SkeletonList count={count}>{(index) => (
              <div key={index} className="dg-info-cell">
                <SkeletonBlock height="0.65rem" width="46%" style={{ marginBottom: '0.45rem' }} />
                <SkeletonBlock height="0.9rem" width="72%" />
              </div>
            )}</SkeletonList>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GuardDetailModal({ isOpen, onClose, guard, loading }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const status = guard ? formatStatus(guard.status) : STATUS_CONFIG.unknown;

  const handleFeedback = () => {
    navigate('/cms/reviews', {
      state: {
        guardId: guard?.employee_id,
        deploymentId: guard?.deployment_id,
        guardName: guard?.full_name || guard?.name,
      },
    });
  };

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
          {loading ? (
            <GuardProfileSkeleton />
          ) : !guard ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
              No data available.
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
                    <span className={status.className}>{status.label}</span>
                    {guard.deployment_type === 'reliever' && (
                      <span className="dg-badge dg-badge--armed">Temporary Reliever</span>
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

              {/* Personal & Contact Details */}
              <div className="dg-modal-section">
                <h4 className="dg-section-heading">
                  <FaIdCard /> Personal &amp; Contact Details
                </h4>
                <div className="dg-info-grid">
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Email</p>
                    <p className="dg-info-value dg-info-value--blue">{guard.contact_email || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Date of Birth</p>
                    <p className="dg-info-value">{formatDate(guard.date_of_birth)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Citizenship</p>
                    <p className="dg-info-value">{guard.citizenship || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Height</p>
                    <p className="dg-info-value">{formatHeight(guard.height_cm)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Education</p>
                    <p className="dg-info-value">{guard.educational_level || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Emergency Contact</p>
                    <p className="dg-info-value">
                      {guard.emergency_contact_name || 'N/A'}
                      {guard.emergency_contact_number ? ` (${guard.emergency_contact_number})` : ''}
                    </p>
                  </div>
                </div>
                <div className="dg-duties-box">
                  <p className="dg-duties-label">Residential Address</p>
                  <p className="dg-duties-text">{guard.residential_address || 'N/A'}</p>
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
                    <p className="dg-info-label">Employee ID</p>
                    <p className="dg-info-value">{guard.employee_id_number || 'N/A'}</p>
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
                    <p className="dg-info-label">Company</p>
                    <p className="dg-info-value">{guard.company || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Assigned Site</p>
                    <p className="dg-info-value">{guard.site_name || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Shift Schedule</p>
                    <p className="dg-info-value">{guard.shift || 'N/A'}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Deployment Type</p>
                    <p className="dg-info-value" style={{ textTransform: 'capitalize' }}>
                      {guard.deployment_type || 'N/A'}
                    </p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Deployment Start</p>
                    <p className="dg-info-value">{formatDate(guard.start_date)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Contract End</p>
                    <p className="dg-info-value">{formatDate(guard.end_date)}</p>
                  </div>
                  <div className="dg-info-cell">
                    <p className="dg-info-label">Deployment Order</p>
                    {guard.deployment_order_url ? (
                      <a
                        href={guard.deployment_order_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="dg-info-value dg-info-value--blue"
                      >
                        View Document
                      </a>
                    ) : (
                      <p className="dg-info-value">N/A</p>
                    )}
                  </div>
                </div>
                {guard.site_address && (
                  <div className="dg-duties-box">
                    <p className="dg-duties-label">Site Address</p>
                    <p className="dg-duties-text">{guard.site_address}</p>
                  </div>
                )}
                {guard.schedules?.length > 0 && (
                  <div className="dg-duties-box">
                    <p className="dg-duties-label">Active Schedules</p>
                    {guard.schedules.map((schedule) => (
                      <p key={schedule.id} className="dg-duties-text">
                        {formatSchedule(schedule)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="dg-modal-actions">
            <button
              className="dg-modal-btn dg-modal-btn--primary"
              disabled={loading || !guard}
              onClick={() => downloadProfile(guard)}
            >
              <FaDownload /> Download Profile
            </button>
            <button
              className="dg-modal-btn dg-modal-btn--gold"
              disabled={loading || !guard}
              onClick={handleFeedback}
            >
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
