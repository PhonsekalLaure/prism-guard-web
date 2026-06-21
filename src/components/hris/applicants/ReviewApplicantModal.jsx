import { useState } from 'react';
import { FaBriefcase, FaCalendarCheck, FaCheck, FaExternalLinkAlt, FaTimes, FaTimesCircle } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import { getSafeDocumentUrl } from '@utils/security';

const INTERVIEW_MINUTES = ['00', '15', '30'];
const INTERVIEW_TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => (
  INTERVIEW_MINUTES.map((minute) => `${String(hour).padStart(2, '0')}:${minute}`)
)).flat();
const DEFAULT_INTERVIEW_TIME = '08:00';

function DetailCell({ label, value }) {
  return (
    <div className="ar-detail-cell">
      <p className="ar-detail-label">{label}</p>
      <p className="ar-detail-value">{value || '-'}</p>
    </div>
  );
}

function formatDateTimeLocal(value) {
  if (!value) return '';
  const date = new Date(value);
  const offsetMs = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function getDatePart(value) {
  return value ? value.slice(0, 10) : '';
}

function getTimePart(value) {
  const time = value ? value.slice(11, 16) : '';
  return INTERVIEW_TIME_OPTIONS.includes(time) ? time : '';
}

function buildDateTimeLocal(datePart, timePart) {
  if (!datePart) return '';
  return `${datePart}T${timePart || DEFAULT_INTERVIEW_TIME}`;
}

function getManilaDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function addDaysToDateKey(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00+08:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
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
  const safeLicensePhotoUrl = getSafeDocumentUrl(applicant?.license_photo_url);
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
  const minInterviewDateKey = addDaysToDateKey(getManilaDateKey(), 1);
  const isScheduledForInterview = applicant.status === 'interview';
  const interviewDate = getDatePart(interviewScheduledAt);
  const interviewTime = getTimePart(interviewScheduledAt);
  const hasAllowedInterviewDate = Boolean(interviewDate && interviewDate >= minInterviewDateKey && interviewTime);

  const updateInterviewDate = (datePart) => {
    setInterviewScheduledAt(buildDateTimeLocal(datePart, interviewTime));
  };

  const updateInterviewTime = (timePart) => {
    setInterviewScheduledAt(buildDateTimeLocal(interviewDate || minInterviewDateKey, timePart));
  };

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
                  {safeLicensePhotoUrl && (
                    <a className="ar-credential-link" href={safeLicensePhotoUrl} target="_blank" rel="noopener noreferrer">
                      View license photo <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="ar-credential-badge"><FaCheck /> DECLARED</span>
                  <p className="ar-credential-expires">Expires: {applicant.license_expiry_date || '-'}</p>
                </div>
              </div>
              <div className="ar-credential-row">
                <div>
                  <p className="ar-credential-name">Badge Number</p>
                  <p className="ar-credential-sub">{applicant.badge_number || '-'}</p>
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
                  type="date"
                  value={interviewDate}
                  min={minInterviewDateKey}
                  disabled={!canSchedule || isSubmitting}
                  onChange={(event) => updateInterviewDate(event.target.value)}
                />
                <select
                  className="ar-inline-input ar-inline-select"
                  value={interviewTime}
                  disabled={!canSchedule || isSubmitting}
                  onChange={(event) => updateInterviewTime(event.target.value)}
                >
                  <option value="">Select time</option>
                  {INTERVIEW_TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div className="ar-detail-cell">
                <p className="ar-detail-label">Residential Address</p>
                <p className="ar-detail-value">{applicant.residential_address}</p>
              </div>
            </div>
          </div>

          {isScheduledForInterview && (
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
          )}

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
              disabled={!canSchedule || isSubmitting || !hasAllowedInterviewDate}
              onClick={() => onScheduleInterview(applicant.id, {
                interviewScheduledAt,
                interviewNotes: isScheduledForInterview ? interviewNotes : '',
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
