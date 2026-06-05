import { FaDownload, FaHistory, FaReceipt, FaTimes } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatStatus(status) {
  if (status === 'verifying') return 'FOR REVIEW';
  return String(status || 'unpaid').toUpperCase();
}

function getBillingBadgeClass(status) {
  if (status === 'paid') return 'billing-badge--paid';
  if (status === 'verifying' || status === 'partial') return 'billing-badge--partial';
  if (status === 'overdue') return 'billing-badge--overdue';
  return 'billing-badge--unpaid';
}

export default function ViewPaymentModal({ isOpen, onClose, record, onDownload, onReview }) {
  if (!isOpen || !record) return null;

  const isPaid = record.status === 'paid';
  const pendingReceipt = record.latest_receipt?.status === 'pending_review';

  return (
    <div className="bp-modal-overlay" onClick={onClose}>
      <div className="bp-modal-content" onClick={(event) => event.stopPropagation()}>
        <div className="bp-modal-header">
          <div>
            <h2>Billing Statement</h2>
            <p>{record.company}</p>
          </div>
          <button className="bp-close-btn" type="button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="bp-modal-body">
          <div className="bp-client-info">
            <EntityAvatar
              avatarUrl={record.avatar_url}
              initials={record.initials}
              alt={record.company}
              className="bp-client-initials"
            />
            <div className="bp-client-details">
              <h3>{record.company}</h3>
              <p>{record.invoice_number || `Statement ${record.statement_no || '-'}`} · {record.guard_count} guards</p>
            </div>
            <span className={`billing-badge ${getBillingBadgeClass(record.status)}`}>
              {formatStatus(record.status)}
            </span>
          </div>

          <div className="bp-section">
            <h4 className="bp-section-title">
              <FaReceipt />
              Billing Summary
            </h4>
            <div className="bp-summary-grid">
              <div className="bp-summary-item">
                <p className="bp-summary-label">Billing Period</p>
                <p className="bp-summary-value">{formatDate(record.period_start)} - {formatDate(record.period_end)}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Due Date</p>
                <p className="bp-summary-value">{formatDate(record.due_date)}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Rate per Guard</p>
                <p className="bp-summary-value bp-summary-value--blue">{formatCurrency(record.rate_per_guard)}</p>
              </div>
              <div className="bp-summary-item">
                <p className="bp-summary-label">Balance Due</p>
                <p className={`bp-summary-value ${isPaid ? 'bp-summary-value--green' : 'bp-summary-value--red'}`}>
                  {formatCurrency(record.balance_due)}
                </p>
              </div>
            </div>
          </div>

          <div className="bp-section">
            <h4 className="bp-section-title">
              <FaHistory />
              Receipt History
            </h4>
            <div className="bp-history-table-wrapper">
              <table className="bp-history-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Reference</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {record.latest_receipt ? (
                    <tr>
                      <td>{formatDate(record.latest_receipt.payment_date)}</td>
                      <td className="bp-history-amount">{formatCurrency(record.latest_receipt.amount)}</td>
                      <td>{record.latest_receipt.payment_method}</td>
                      <td className="bp-history-ref">{record.latest_receipt.reference_number}</td>
                      <td>{record.latest_receipt.status.replace(/_/g, ' ')}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem' }}>
                        No payment receipts submitted yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bp-modal-actions">
            <button className="bp-btn-secondary" type="button" onClick={onClose}>Close</button>
            {pendingReceipt && (
              <button className="bp-btn-secondary" type="button" onClick={() => onReview?.(record)}>
                <FaReceipt />
                View Receipt
              </button>
            )}
            <button className="bp-btn-primary" type="button" onClick={() => onDownload?.(record)}>
              <FaDownload />
              Download Statement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
