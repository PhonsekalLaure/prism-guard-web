import { FaCheckCircle, FaTimes } from 'react-icons/fa';

export default function MarkPaidModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle payment submission
    onClose();
  };

  return (
    <div className="bp-modal-overlay" onClick={onClose}>
      <div
        className="bp-modal-content bp-modal-content--sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bp-markpaid-header">
          <button className="bp-close-btn" onClick={onClose} style={{ marginLeft: 'auto' }}>
            <FaTimes />
          </button>
        </div>

        <div className="bp-modal-body">
          {/* Icon + Title */}
          <div className="bp-markpaid-hero">
            <div className="bp-markpaid-icon">
              <FaCheckCircle />
            </div>
            <h3>Confirm Payment</h3>
            <p>Record a payment for <strong>{record.company}</strong>'s billing period.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bp-markpaid-form">
            <div className="bp-form-group">
              <label>Payment Amount</label>
              <div className="bp-input-prefix-wrapper">
                <span className="bp-input-prefix">₱</span>
                <input type="text" placeholder="0.00" className="bp-input bp-input--prefixed" required />
              </div>
            </div>

            <div className="bp-form-group">
              <label>Payment Method</label>
              <select className="bp-select" required>
                <option>Bank Transfer</option>
                <option>Check</option>
                <option>Cash</option>
                <option>GCash</option>
              </select>
            </div>

            <div className="bp-form-group">
              <label>Reference Number</label>
              <input
                type="text"
                placeholder="Enter reference number"
                className="bp-input"
                required
              />
            </div>

            <div className="bp-form-group">
              <label>Date of Payment</label>
              <input type="date" className="bp-input" required />
            </div>

            <div className="bp-markpaid-actions">
              <button type="button" className="bp-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="bp-btn-confirm">
                <FaCheckCircle />
                Confirm Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
