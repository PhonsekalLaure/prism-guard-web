import { useState } from 'react';
import {
  FaBullhorn,
  FaCalendarAlt,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaPaperPlane,
  FaShieldAlt,
  FaTimes,
} from 'react-icons/fa';

const MAX_TITLE   = 160;
const MAX_MESSAGE = 5000;

const URGENCY_OPTIONS = [
  { value: 'normal',    label: 'Normal',    Icon: FaInfoCircle,        desc: 'Routine update' },
  { value: 'important', label: 'Important', Icon: FaExclamationTriangle, desc: 'Needs attention' },
  { value: 'urgent',    label: 'Urgent',    Icon: FaExclamationCircle,  desc: 'Immediate action' },
];

function getDatetimeLocalMin() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset() + 1);
  return now.toISOString().slice(0, 16);
}

export default function CreateAnnouncementModal({ isOpen, onClose, onSubmit }) {
  const [title,      setTitle]      = useState('');
  const [message,    setMessage]    = useState('');
  const [priority,   setPriority]   = useState('normal');
  const [expiresAt,  setExpiresAt]  = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState(null);

  if (!isOpen) return null;

  const titleCount   = title.length;
  const messageCount = message.length;
  const isValid      = title.trim().length > 0 && message.trim().length > 0;

  const handleClose = () => {
    if (submitting) return;
    setTitle(''); setMessage(''); setPriority('normal'); setExpiresAt(''); setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    // Validate expiry
    if (expiresAt) {
      const expDate = new Date(expiresAt);
      if (Number.isNaN(expDate.getTime()) || expDate <= new Date()) {
        setError('Expiration must be a future date and time.');
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        title:      title.trim(),
        message:    message.trim(),
        priority,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      setTitle(''); setMessage(''); setPriority('normal'); setExpiresAt('');
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Failed to publish announcement.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="create-ann-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ann-title"
      onClick={handleClose}
    >
      <div className="create-ann-modal" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="create-ann-header">
          <div className="create-ann-header-left">
            <div className="create-ann-header-icon">
              <FaBullhorn />
            </div>
            <div>
              <h3 id="create-ann-title" className="create-ann-title">Create Announcement</h3>
              <p className="create-ann-subtitle">Broadcast a message to your deployed security guards</p>
            </div>
          </div>
          <button className="create-ann-close" onClick={handleClose} disabled={submitting} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* ── Scope Notice ── */}
        <div className="create-ann-scope-notice">
          <FaShieldAlt className="create-ann-scope-icon" />
          <p>
            <strong>Auto-scoped to your deployed guards.</strong> This announcement will be
            instantly delivered to all security guards currently active under your account.
          </p>
        </div>

        {/* ── Form ── */}
        <form className="create-ann-form" onSubmit={handleSubmit} noValidate>

          {/* Urgency Level */}
          <div className="create-ann-field">
            <label className="create-ann-label">
              Urgency Level <span className="create-ann-required">*</span>
            </label>
            <div className="create-ann-urgency-group" role="group" aria-label="Urgency level">
              {URGENCY_OPTIONS.map((option) => {
                const UrgencyIcon = option.Icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`create-ann-urgency-btn create-ann-urgency-btn--${option.value}${priority === option.value ? ' active' : ''}`}
                    onClick={() => { setPriority(option.value); setError(null); }}
                    disabled={submitting}
                    aria-pressed={priority === option.value}
                  >
                    <UrgencyIcon className="create-ann-urgency-icon" />
                    <span className="create-ann-urgency-label">{option.label}</span>
                    <span className="create-ann-urgency-desc">{option.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgent caution banner */}
          {priority === 'urgent' && (
            <div className="create-ann-urgent-banner" role="alert">
              <FaExclamationCircle />
              <span>
                <strong>Urgent announcements</strong> trigger an immediate push notification to all
                recipients regardless of their device notification preference.
              </span>
            </div>
          )}

          {/* Title */}
          <div className="create-ann-field">
            <label htmlFor="ann-title" className="create-ann-label">
              Title <span className="create-ann-required">*</span>
            </label>
            <div className="create-ann-input-wrap">
              <input
                id="ann-title"
                type="text"
                className="create-ann-input"
                placeholder="e.g. Shift change notice for Friday"
                value={title}
                maxLength={MAX_TITLE}
                onChange={(e) => setTitle(e.target.value)}
                disabled={submitting}
                autoFocus
              />
              <span className={`create-ann-char-count ${titleCount > MAX_TITLE * 0.9 ? 'create-ann-char-count--warn' : ''}`}>
                {titleCount}/{MAX_TITLE}
              </span>
            </div>
          </div>

          {/* Message */}
          <div className="create-ann-field">
            <label htmlFor="ann-message" className="create-ann-label">
              Message <span className="create-ann-required">*</span>
            </label>
            <div className="create-ann-input-wrap">
              <textarea
                id="ann-message"
                className="create-ann-textarea"
                placeholder="Write your announcement here. Be clear and concise — guards will be notified immediately."
                value={message}
                maxLength={MAX_MESSAGE}
                rows={5}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
              />
              <span className={`create-ann-char-count ${messageCount > MAX_MESSAGE * 0.9 ? 'create-ann-char-count--warn' : ''}`}>
                {messageCount}/{MAX_MESSAGE}
              </span>
            </div>
          </div>

          {/* Expiry Date */}
          <div className="create-ann-field">
            <label htmlFor="ann-expires" className="create-ann-label">
              <FaCalendarAlt style={{ marginRight: '0.35rem', verticalAlign: 'middle' }} />
              Expiry Date <span className="create-ann-optional">(optional)</span>
            </label>
            <input
              id="ann-expires"
              type="datetime-local"
              className="create-ann-input"
              min={getDatetimeLocalMin()}
              value={expiresAt}
              onChange={(e) => { setExpiresAt(e.target.value); setError(null); }}
              disabled={submitting}
            />
            <p className="create-ann-hint">
              Leave blank to keep the announcement visible until manually removed. When set, it will
              automatically disappear from the guard feed after this date and time.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="create-ann-error" role="alert">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          {/* Footer actions */}
          <div className="create-ann-footer">
            <button
              type="button"
              className="create-ann-btn-cancel"
              onClick={handleClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              id="publish-announcement-btn"
              type="submit"
              className={`create-ann-btn-publish create-ann-btn-publish--${priority}`}
              disabled={!isValid || submitting}
            >
              {submitting ? (
                <>
                  <span className="create-ann-spinner" aria-hidden="true" />
                  Publishing…
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Publish to Guards
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
