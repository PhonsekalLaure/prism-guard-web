import { useState } from 'react';
import { FaBriefcase, FaCalendarCheck, FaCheck, FaExternalLinkAlt, FaTimes, FaTimesCircle } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';

function DetailCell({ label, value }) {
  return (
    <div className="ar-detail-cell">
      <p className="ar-detail-label">{label}</p>
      <p className="ar-detail-value">{value || 'N/A'}</p>
    </div>
  );
}

function formatDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export default function ReviewApplicantModal({
  isOpen,
  applicant,
  onClose,
  onScheduleInterview,
  onReject,
  onHire,
  isSubmitting,
  actionError = '',
}) {
  const [interviewScheduledAt, setInterviewScheduledAt] = useState(() =>
    formatDateTimeLocal(applicant?.interview_scheduled_at)
  );
  const [interviewNotes, setInterviewNotes] = useState(() =>
    applicant?.interview_notes || ''
  );
  const [notes, setNotes] = useState(() =>
    applicant?.notes || ''
  );
  const [passedInterview, setPassedInterview] = useState(() =>
    applicant?.notes_payload?.interview?.passed === true
  );

  if (!isOpen || !applicant) return null;

  const canSchedule = applicant.status !== 'rejected' && applicant.status !== 'hired';
  const canStartHiring = applicant.status === 'interview' && passedInterview;

  return (
    <div className="ar-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="ar-modal-content">
        <div className="ar-modal-header">
          <div>
            <h2>Application Tracking</h2>
            <p>Applicant ID: {applicant.id}</p>
          </div>
          <button className="ar-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ar-modal-body">
          {actionError && <div className="ar-error-banner">{actionError}</div>}

          <div className="ar-profile-strip">
            <EntityAvatar
              avatarUrl={applicant.avatarUrl || applicant.avatar_url}
              initials={applicant.initials}
              className="ar-profile-avatar"
              alt={applicant.name || applicant.initials}
            />
            <div>
              <p className="ar-profile-name">{applicant.name}</p>
              <p className="ar-profile-sub">{applicant.position} Position</p>
              <p className="ar-profile-sub">Applied: {applicant.appliedDate}</p>
            </div>
            <div className="ar-profile-badge-wrap">
              <span className={`applicant-status-badge status-${applicant.status}`} style={{ fontSize: '0.75rem', padding: '0.35rem 1rem' }}>
                {applicant.status.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="ar-detail-grid">
            <DetailCell label="Age" value={applicant.age ? `${applicant.age} years old` : null} />
            <DetailCell label="Height" value={applicant.height} />
            <DetailCell label="Contact Number" value={applicant.phone} />
            <DetailCell label="Email" value={applicant.email} />
            <DetailCell label="Education" value={applicant.educational_level} />
            <DetailCell label="Civil Status" value={applicant.civil_status} />
            <DetailCell label="Experience" value={applicant.years_experience != null ? `${applicant.years_experience} year(s)` : 'No prior experience'} />
            <DetailCell label="Employment Type" value={applicant.employmentType || applicant.employment_type} />
          </div>

          <div>
            <p className="ar-section-title">Declared Security Credentials</p>
            <div className="ar-credentials-box">
              <div className="ar-credential-row">
                <div>
                  <p className="ar-credential-name">Security License</p>
                  <p className="ar-credential-sub">{applicant.license}</p>
                  {applicant.license_photo_url && (
                    <a className="ar-credential-link" href={applicant.license_photo_url} target="_blank" rel="noreferrer">
                      View license photo <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="ar-credential-badge"><FaCheck /> DECLARED</span>
                  <p className="ar-credential-expires">Expires: {applicant.license_expiry_date || 'N/A'}</p>
                </div>
              </div>
              <div className="ar-credential-row">
                <div>
                  <p className="ar-credential-name">Badge Number</p>
                  <p className="ar-credential-sub">{applicant.badge_number || 'Not declared'}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="ar-section-title">Interview Plan</p>
            <div className="ar-detail-grid">
              <div className="ar-detail-cell">
                <p className="ar-detail-label">Interview Schedule</p>
                <input
                  className="ar-inline-input"
                  type="datetime-local"
                  value={interviewScheduledAt}
                  disabled={!canSchedule || isSubmitting}
                  onChange={(event) => setInterviewScheduledAt(event.target.value)}
                />
              </div>
              <div className="ar-detail-cell">
                <p className="ar-detail-label">Residential Address</p>
                <p className="ar-detail-value">{applicant.residential_address}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="ar-notes-label">Interview Notes</p>
            <textarea
              className="ar-notes-textarea"
              rows={2}
              value={interviewNotes}
              disabled={!canSchedule || isSubmitting}
              onChange={(event) => setInterviewNotes(event.target.value)}
              placeholder="Add interview schedule instructions or reminders..."
            />
          </div>

          {applicant.status === 'interview' && (
            <label className="ar-pass-toggle">
              <input
                type="checkbox"
                checked={passedInterview}
                disabled={isSubmitting}
                onChange={(event) => setPassedInterview(event.target.checked)}
              />
              Passed the interview
            </label>
          )}

          <div>
            <p className="ar-notes-label">Admin Notes</p>
            <textarea
              className="ar-notes-textarea"
              rows={3}
              value={notes}
              disabled={isSubmitting}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add notes about this applicant..."
            />
          </div>

          <div className="ar-modal-actions">
            <button
              className="ar-btn ar-btn-blue"
              disabled={!canSchedule || isSubmitting}
              onClick={() => onScheduleInterview(applicant.id, {
                interviewScheduledAt,
                interviewNotes,
                passedInterview,
                notes,
              })}
            >
              <FaCalendarCheck /> Schedule Interview
            </button>
            <button
              className="ar-btn ar-btn-red"
              disabled={isSubmitting || applicant.status === 'rejected'}
              onClick={() => onReject(applicant.id, { notes })}
            >
              <FaTimesCircle /> Reject
            </button>
            {canStartHiring && (
              <button
                className="ar-btn ar-btn-green"
                disabled={isSubmitting}
                onClick={() => onHire(applicant)}
              >
                <FaBriefcase /> Hire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
