import { FaSpinner, FaBan } from 'react-icons/fa';

export default function CancelServiceRequestDialog({ isOpen, requestId, isSaving, onCancel, onConfirm }) {
  if (!isOpen) return null;

  const displayId = requestId ? `#${String(requestId).substring(0, 8).toUpperCase()}` : '';

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaBan />
          </div>
          <div>
            <h3 className="term-title">Cancel Service Request</h3>
            <p className="term-subtitle">This action cannot be undone</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to cancel service request{' '}
              {displayId && <strong>{displayId}</strong>}. The request status will be changed to{' '}
              <strong>Cancelled</strong> and no further actions can be taken on it.
            </p>
          </div>
          <p className="term-note">
            Cancellation is permanent. If you still need assistance, you will need to submit a new
            service request.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Request
          </button>
          <button className="dlg-btn dlg-btn-danger" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaBan />}
            {isSaving ? 'Cancelling...' : 'Yes, Cancel Request'}
          </button>
        </div>
      </div>
    </div>
  );
}
