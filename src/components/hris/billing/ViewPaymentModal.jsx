import { FaTimes, FaReceipt, FaHistory, FaDownload, FaCheckCircle } from 'react-icons/fa';

export default function ViewPaymentModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const isPaid = record.status === 'paid';

  return (
    <div className="bp-modal-overlay" onClick={onClose}>
      <div
        className="bp-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bp-modal-header">
          <div>
            <h2>Payment Details</h2>
            <p>{record.company}</p>
          </div>
          <button className="bp-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bp-modal-body">
          {/* Client Info */}
          <div className="bp-client-info">
            <div
              className="bp-client-initials"
              style={{ background: record.bgColor }}
            >
              {record.initials}
            </div>
            <div className="bp-client-details">
              <h3>{record.company}</h3>
              <p>Contract #: FEU-2024-001 · 24 Guards</p>
            </div>
            <span className={`billing-badge ${isPaid ? 'billing-badge--paid' : 'billing-badge--unpaid'}`}>
              {isPaid ? 'PAID' : record.status.toUpperCase()}
            </span>
          </div>

          {/* Billing Summary */}
          <div className="bp-section">
            <h4 className="bp-section-title">
              <FaReceipt />
              Billing Summary
            </h4>
            <div className="bp-summary-grid">
              <div className="bp-summary-item">
                <p className="bp-summary-label">Billing Period</p>
                <p className="bp-summary-value">{record.period}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Due Date</p>
                <p className="bp-summary-value">{record.dueDate}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Amount Due</p>
                <p className="bp-summary-value bp-summary-value--blue">{record.amountDue}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Amount Paid</p>
                <p className={`bp-summary-value ${isPaid ? 'bp-summary-value--green' : 'bp-summary-value--red'}`}>
                  {record.amountPaid}
                </p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bp-section">
            <h4 className="bp-section-title">
              <FaHistory />
              Payment History
            </h4>
            <div className="bp-history-table-wrapper">
              <table className="bp-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {isPaid ? (
                    <tr>
                      <td>Feb 10, 2026</td>
                      <td className="bp-history-amount">{record.amountPaid}</td>
                      <td>Bank Transfer</td>
                      <td className="bp-history-ref">BDO-2026-021001</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>
                        No payment records yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="bp-modal-actions">
            <button className="bp-btn-secondary" onClick={onClose}>Close</button>
            <button className="bp-btn-primary">
              <FaDownload />
              Download SOA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
