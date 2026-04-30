import { FaFileAlt, FaCheck } from 'react-icons/fa';

export default function RequestReportModal({ isOpen, onClose, onConfirm, incident }) {
  if (!isOpen) return null;

  return (
    <div className="ir-modal-overlay" onClick={onClose}>
      <div
        className="ir-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ir-modal-body">
          {/* Icon */}
          <div className="ir-modal-icon">
            <FaFileAlt />
          </div>

          {/* Title */}
          <h3 className="ir-modal-title">Request Full Report?</h3>
          <p className="ir-modal-desc">
            The security team will prepare and send the full incident report to your
            registered email within 24-48 hours.
          </p>

          {/* Details */}
          <div className="ir-modal-details">
            <div className="ir-modal-details__row">
              <span className="ir-modal-details__label">Incident ID:</span>
              <span className="ir-modal-details__value">{incident?.id ?? '—'}</span>
            </div>
            <div className="ir-modal-details__row">
              <span className="ir-modal-details__label">Delivery:</span>
              <span className="ir-modal-details__value--muted">24-48 hours via email</span>
            </div>
          </div>

          {/* Actions */}
          <div className="ir-modal-actions">
            <button className="ir-btn-confirm" onClick={onConfirm}>
              <FaCheck />
              Confirm Request
            </button>
            <button className="ir-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}