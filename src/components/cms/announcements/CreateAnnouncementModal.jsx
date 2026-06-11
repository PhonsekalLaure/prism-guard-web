import { useState } from 'react';
import { FaBullhorn, FaShieldAlt, FaTimes, FaPaperPlane, FaExclamationTriangle } from 'react-icons/fa';

const MAX_TITLE = 160;
const MAX_MESSAGE = 5000;

export default function CreateAnnouncementModal({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const titleCount = title.length;
  const messageCount = message.length;
  const isValid = title.trim().length > 0 && message.trim().length > 0;

  const handleClose = () => {
    if (submitting) return;
    setTitle('');
    setMessage('');
    setError(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({ title: title.trim(), message: message.trim() });
      setTitle('');
      setMessage('');
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
              <h3 id="create-ann-title" className="create-ann-title">
                Create Announcement
              </h3>
              <p className="create-ann-subtitle">
                Broadcast a message to your deployed security guards
              </p>
            </div>
          </div>
          <button
            className="create-ann-close"
            onClick={handleClose}
            disabled={submitting}
            aria-label="Close"
          >
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
              <span
                className={`create-ann-char-count ${titleCount > MAX_TITLE * 0.9 ? 'create-ann-char-count--warn' : ''}`}
              >
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
                rows={6}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting}
              />
              <span
                className={`create-ann-char-count ${messageCount > MAX_MESSAGE * 0.9 ? 'create-ann-char-count--warn' : ''}`}
              >
                {messageCount}/{MAX_MESSAGE}
              </span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="create-ann-error" role="alert">
              <FaExclamationTriangle />
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
              className="create-ann-btn-publish"
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
