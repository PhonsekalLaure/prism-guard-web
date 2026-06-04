import { FaFileAlt, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';

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
    <div className="cir-modal-overlay" onClick={(e) => e.target === e.currentTarget && !submitting && onClose()}>
      <div className="cir-request-modal" onClick={(e) => e.stopPropagation()}>
        {/* Icon header area */}
        <div className="cir-request-modal__header">
          <div className="cir-request-modal__icon">
            <FaFileAlt />
          </div>
          <h3 className="cir-request-modal__title">Request Full Report?</h3>
          <p className="cir-request-modal__desc">
            The operations team will review your request and prepare the complete incident documentation.
          </p>
        </div>

        {/* Details */}
        <div className="cir-request-modal__details">
          <div className="cir-request-detail-row">
            <span className="cir-request-detail-label">Incident ID</span>
            <span className="cir-request-detail-value">{incident?.reportId ?? 'N/A'}</span>
          </div>
          <div className="cir-request-detail-row">
            <span className="cir-request-detail-label"><FaMapMarkerAlt /> Site</span>
            <span className="cir-request-detail-value cir-request-detail-muted">{incident?.siteName ?? 'N/A'}</span>
          </div>
        </div>

        {/* Notes textarea */}
        <div className="cir-request-modal__body">
          <label className="cir-request-notes-label" htmlFor="incident-request-notes">
            Request Notes
          </label>
          <textarea
            id="incident-request-notes"
            className="cir-request-notes-input"
            value={requestNotes}
            onChange={(e) => onRequestNotesChange?.(e.target.value)}
            placeholder="Add context or special instructions for the operations team..."
            rows={4}
            disabled={submitting}
          />

          <div className="cir-modal-actions">
            <button
              className="cir-modal-btn cir-modal-btn-confirm"
              onClick={onConfirm}
              disabled={submitting}
            >
              <FaCheck />
              {submitting ? 'Submitting...' : 'Confirm Request'}
            </button>
            <button
              className="cir-modal-btn cir-modal-btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
