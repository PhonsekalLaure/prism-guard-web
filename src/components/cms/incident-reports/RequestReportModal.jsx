import { FaFileAlt, FaCheck } from 'react-icons/fa';

export default function RequestReportModal({
  isOpen,
  onClose,
  onConfirm,
  incident,
  requestNotes = '',
  onRequestNotesChange,
  submitting = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="ir-modal-overlay" onClick={onClose}>
      <div
        className="ir-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ir-modal-body">
          <div className="ir-modal-icon">
            <FaFileAlt />
          </div>

          <h3 className="ir-modal-title">Request Full Report?</h3>
          <p className="ir-modal-desc">
            The operations team will review your request and prepare the full incident report.
          </p>

          <div className="ir-modal-details">
            <div className="ir-modal-details__row">
              <span className="ir-modal-details__label">Incident ID:</span>
              <span className="ir-modal-details__value">{incident?.reportId ?? 'N/A'}</span>
            </div>
            <div className="ir-modal-details__row">
              <span className="ir-modal-details__label">Site:</span>
              <span className="ir-modal-details__value--muted">{incident?.siteName ?? 'N/A'}</span>
            </div>
          </div>

          <label className="ir-request-notes-label" htmlFor="incident-request-notes">
            Request Notes
          </label>
          <textarea
            id="incident-request-notes"
            className="ir-request-notes-input"
            value={requestNotes}
            onChange={(e) => onRequestNotesChange?.(e.target.value)}
            placeholder="Add context for the operations team..."
            rows={4}
            disabled={submitting}
          />

          <div className="ir-modal-actions">
            <button className="ir-btn-confirm" onClick={onConfirm} disabled={submitting}>
              <FaCheck />
              {submitting ? 'Submitting...' : 'Confirm Request'}
            </button>
            <button className="ir-btn-cancel" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
