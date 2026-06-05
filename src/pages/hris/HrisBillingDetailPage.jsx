import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaCheckCircle,
  FaDownload,
  FaFileInvoiceDollar,
  FaReceipt,
  FaTimes,
} from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import billingService from '@services/hris/billingService';
import { hasPermission } from '@utils/adminPermissions';

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

function formatDateTime(value) {
  if (!value) return '-';
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatStatus(status) {
  if (status === 'verifying') return 'FOR REVIEW';
  return String(status || 'unpaid').replace(/_/g, ' ').toUpperCase();
}

function getBillingBadgeClass(status) {
  if (status === 'paid') return 'billing-badge--paid';
  if (status === 'verifying' || status === 'partial') return 'billing-badge--partial';
  if (status === 'overdue') return 'billing-badge--overdue';
  return 'billing-badge--unpaid';
}

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

function openExternal(url) {
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

function downloadExternal(url, filename = 'payment-receipt') {
  if (!url) return;
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noreferrer';
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export default function HrisBillingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const profile = useMemo(() => authService.getProfile() || {}, []);
  const canReviewReceipts = hasPermission(profile, 'billing.write');
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  const loadBilling = useCallback(async () => {
    try {
      setLoading(true);
      const data = await billingService.getBilling(id);
      setBilling(data);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to load billing statement.'), 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const receipts = billing?.receipts || [];
  const pendingReceipt = receipts.find((receipt) => receipt.status === 'pending_review');

  const handleStatement = async (download = false) => {
    if (!billing) return;
    try {
      setBusy(true);
      let current = billing;
      if (!current.has_statement) {
        current = await billingService.generateStatement(current.id);
        setBilling(current);
        showNotification('Billing statement generated.', 'success');
      }
      const { url } = await billingService.getStatementUrl(current.id, download);
      openExternal(url);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to open billing statement.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();
    if (!billing || !pendingReceipt || !reviewAction) return;
    try {
      setBusy(true);
      if (reviewAction === 'approve') {
        const updated = await billingService.approveReceipt(billing.id, pendingReceipt.id, { reviewNotes });
        setBilling(updated);
        showNotification('Payment receipt approved.', 'success');
      } else {
        const updated = await billingService.rejectReceipt(billing.id, pendingReceipt.id, { reviewNotes });
        setBilling(updated);
        showNotification('Payment receipt rejected.', 'success');
      }
      setReviewAction(null);
      setReviewNotes('');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to review receipt.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className="billing-detail-page">
        <button className="billing-detail-back" type="button" onClick={() => navigate('/billing')}>
          <FaArrowLeft />
          Back to Billing
        </button>

        {loading && (
          <div className="billing-detail-panel">
            <p className="billing-detail-muted">Loading billing statement...</p>
          </div>
        )}

        {!loading && !billing && (
          <div className="billing-detail-panel">
            <p className="billing-detail-muted">Billing statement not found.</p>
          </div>
        )}

        {!loading && billing && (
          <>
            <section className="billing-detail-hero">
              <EntityAvatar
                avatarUrl={billing.avatar_url}
                initials={billing.initials}
                alt={billing.company}
                className="bp-client-initials"
              />
              <div className="billing-detail-title">
                <p className="billing-detail-eyebrow">{billing.invoice_number || `Statement ${billing.statement_no || '-'}`}</p>
                <h1>{billing.company}</h1>
                <p>{formatDate(billing.period_start)} - {formatDate(billing.period_end)}</p>
              </div>
              <span className={`billing-badge ${getBillingBadgeClass(billing.status)}`}>
                {formatStatus(billing.status)}
              </span>
            </section>

            <section className="billing-detail-grid">
              <div className="billing-detail-panel">
                <h2><FaFileInvoiceDollar /> Statement Summary</h2>
                <div className="bp-summary-grid">
                  <div className="bp-summary-item">
                    <p className="bp-summary-label">Total Amount</p>
                    <p className="bp-summary-value bp-summary-value--blue">{formatCurrency(billing.total_amount)}</p>
                  </div>
                  <div className="bp-summary-item">
                    <p className="bp-summary-label">Balance Due</p>
                    <p className={`bp-summary-value ${billing.status === 'paid' ? 'bp-summary-value--green' : 'bp-summary-value--red'}`}>
                      {formatCurrency(billing.balance_due)}
                    </p>
                  </div>
                  <div className="bp-summary-item">
                    <p className="bp-summary-label">Rate per Guard</p>
                    <p className="bp-summary-value">{formatCurrency(billing.rate_per_guard)}</p>
                  </div>
                  <div className="bp-summary-item">
                    <p className="bp-summary-label">Due Date</p>
                    <p className="bp-summary-value">{formatDate(billing.due_date)}</p>
                  </div>
                </div>
                <div className="billing-detail-actions">
                  <button className="bp-btn-secondary" type="button" onClick={() => handleStatement(false)} disabled={busy}>
                    <FaFileInvoiceDollar />
                    {billing.has_statement ? 'View Invoice' : 'Generate Invoice'}
                  </button>
                  <button className="bp-btn-primary" type="button" onClick={() => handleStatement(true)} disabled={busy}>
                    <FaDownload />
                    Download Invoice
                  </button>
                </div>
              </div>

              <div className="billing-detail-panel">
                <h2><FaReceipt /> Receipt Review</h2>
                {!pendingReceipt && (
                  <p className="billing-detail-muted">
                    {receipts.length ? 'No receipt is currently pending review.' : 'No payment receipt has been submitted yet.'}
                  </p>
                )}
                {pendingReceipt && (
                  <>
                    <div className="billing-receipt-card">
                      <p><strong>{formatCurrency(pendingReceipt.amount)}</strong></p>
                      <p>{pendingReceipt.payment_method} - {pendingReceipt.reference_number}</p>
                      <p>Paid {formatDate(pendingReceipt.payment_date)}</p>
                    </div>
                    <div className="billing-detail-actions">
                      <button className="bp-btn-secondary" type="button" onClick={() => openExternal(pendingReceipt.receipt_url)}>
                        <FaReceipt />
                        View Receipt
                      </button>
                      <button className="bp-btn-secondary" type="button" onClick={() => downloadExternal(pendingReceipt.receipt_url, `receipt-${pendingReceipt.reference_number || pendingReceipt.id}`)}>
                        <FaDownload />
                        Download Receipt
                      </button>
                    </div>
                    {canReviewReceipts && (
                      <div className="billing-review-actions">
                        <button className="bp-btn-confirm" type="button" onClick={() => setReviewAction('approve')} disabled={busy}>
                          <FaCheckCircle />
                          Approve Receipt
                        </button>
                        <button className="bp-btn-secondary" type="button" onClick={() => setReviewAction('reject')} disabled={busy}>
                          <FaTimes />
                          Reject Receipt
                        </button>
                      </div>
                    )}
                  </>
                )}
                {reviewAction && (
                  <form className="billing-review-form" onSubmit={handleReview}>
                    <label>{reviewAction === 'approve' ? 'Review Notes' : 'Rejection Reason'}</label>
                    <textarea
                      className="bp-input"
                      rows={3}
                      value={reviewNotes}
                      onChange={(event) => setReviewNotes(event.target.value)}
                      required={reviewAction === 'reject'}
                      placeholder={reviewAction === 'approve' ? 'Optional note for the payment record' : 'Explain why this receipt is rejected'}
                    />
                    <div className="billing-detail-actions">
                      <button className="bp-btn-secondary" type="button" onClick={() => setReviewAction(null)} disabled={busy}>
                        Cancel
                      </button>
                      <button className={reviewAction === 'approve' ? 'bp-btn-confirm' : 'bp-btn-secondary'} type="submit" disabled={busy}>
                        {busy ? 'Saving...' : reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            <section className="billing-detail-panel">
              <h2><FaReceipt /> Receipt History</h2>
              <div className="bp-history-table-wrapper">
                <table className="bp-history-table">
                  <thead>
                    <tr>
                      <th>Submitted</th>
                      <th>Payment Date</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Reference</th>
                      <th>Status</th>
                      <th>Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center' }}>No payment receipts submitted yet.</td>
                      </tr>
                    )}
                    {receipts.map((receipt) => (
                      <tr key={receipt.id}>
                        <td>{formatDateTime(receipt.submitted_at)}</td>
                        <td>{formatDate(receipt.payment_date)}</td>
                        <td className="bp-history-amount">{formatCurrency(receipt.amount)}</td>
                        <td>{receipt.payment_method}</td>
                        <td className="bp-history-ref">{receipt.reference_number}</td>
                        <td>{formatStatus(receipt.status)}</td>
                        <td>
                          {receipt.receipt_url ? (
                            <button className="billing-link-button" type="button" onClick={() => openExternal(receipt.receipt_url)}>
                              View
                            </button>
                          ) : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </>
  );
}
