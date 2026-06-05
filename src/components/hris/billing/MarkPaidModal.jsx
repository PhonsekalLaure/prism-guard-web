import { useState } from 'react';
import { FaCheckCircle, FaReceipt, FaTimes } from 'react-icons/fa';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MarkPaidModal({
  isOpen,
  onClose,
  record,
  action = 'approve',
  onConfirm,
  busy = false,
}) {
  const [reviewNotes, setReviewNotes] = useState('');

  if (!isOpen || !record) return null;

  const receipt = record.latest_receipt;
  const isApprove = action === 'approve';

  const handleSubmit = (event) => {
    event.preventDefault();
    onConfirm?.(record, reviewNotes);
  };

  return (
    <div className="bp-modal-overlay" onClick={onClose}>
      <div className="bp-modal-content bp-modal-content--sm" onClick={(event) => event.stopPropagation()}>
        <div className="bp-markpaid-header">
          <button className="bp-close-btn" type="button" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <FaTimes />
          </button>
        </div>

        <div className="bp-modal-body">
          <div className="bp-markpaid-hero">
            <div className="bp-markpaid-icon">
              {isApprove ? <FaCheckCircle /> : <FaTimes />}
            </div>
            <h3>{isApprove ? 'Approve Receipt' : 'Reject Receipt'}</h3>
            <p>
              Review <strong>{record.company}</strong>'s submitted payment receipt.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bp-markpaid-form">
            <div className="bp-form-group">
              <label>Submitted Amount</label>
              <input className="bp-input" value={formatCurrency(receipt?.amount)} readOnly />
            </div>

            <div className="bp-form-group">
              <label>Payment Method</label>
              <input className="bp-input" value={receipt?.payment_method || ''} readOnly />
            </div>

            <div className="bp-form-group">
              <label>Reference Number</label>
              <input className="bp-input" value={receipt?.reference_number || ''} readOnly />
            </div>

            {receipt?.receipt_url && (
              <a className="bp-btn-secondary" href={receipt.receipt_url} target="_blank" rel="noreferrer">
                <FaReceipt />
                Open Uploaded Receipt
              </a>
            )}

            <div className="bp-form-group">
              <label>{isApprove ? 'Review Notes' : 'Rejection Reason'}</label>
              <textarea
                className="bp-input"
                rows={3}
                value={reviewNotes}
                onChange={(event) => setReviewNotes(event.target.value)}
                placeholder={isApprove ? 'Optional note for the payment record' : 'Explain why this receipt is rejected'}
                required={!isApprove}
              />
            </div>

            <div className="bp-markpaid-actions">
              <button type="button" className="bp-btn-secondary" onClick={onClose} disabled={busy}>
                Cancel
              </button>
              <button type="submit" className={isApprove ? 'bp-btn-confirm' : 'bp-btn-secondary'} disabled={busy}>
                {isApprove ? <FaCheckCircle /> : <FaTimes />}
                {busy ? 'Saving...' : isApprove ? 'Approve Receipt' : 'Reject Receipt'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
