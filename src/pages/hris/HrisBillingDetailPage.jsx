import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaCheckCircle,
  FaDownload,
  FaEye,
  FaFileInvoiceDollar,
  FaReceipt,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import Notification from '@components/ui/Notification';
import ReportActionButton from '@components/ui/ReportActionButton';
import { SkeletonBlock } from '@components/ui/Skeleton';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import billingService from '@services/hris/billingService';
import { hasPermission } from '@utils/adminPermissions';
import '../../styles/hris/Employees.css';
import '../../styles/hris/Billing.css';

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

function sanitizeFilenamePart(value, fallback = 'file') {
  const normalized = String(value || fallback)
    .trim()
    .replace(/[^a-z0-9-_]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return normalized || fallback;
}

function getUrlExtension(url, fallback = '') {
  try {
    const { pathname } = new URL(url);
    const match = pathname.match(/\.([a-z0-9]{2,5})$/i);
    return match ? match[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
}

function ensureFilenameExtension(filename, url, fallbackExtension = 'pdf') {
  if (/\.[a-z0-9]{2,5}$/i.test(filename)) return filename;
  const extension = getUrlExtension(url, fallbackExtension);
  return extension ? `${filename}.${extension}` : filename;
}

function buildStatementFallbackFilename(billing) {
  const invoiceKey = sanitizeFilenamePart(billing?.invoice_number || billing?.statement_no || billing?.id, 'invoice');
  const companyKey = sanitizeFilenamePart(billing?.company, 'client');
  return `prism-guard-invoice-${invoiceKey}-${companyKey}.pdf`;
}

function buildReceiptFilename(receipt) {
  const refKey = sanitizeFilenamePart(receipt?.reference_number || receipt?.id, 'receipt');
  return ensureFilenameExtension(`payment-receipt-${refKey}`, receipt?.receipt_url, 'jpg');
}

async function downloadExternal(url, filename = 'download') {
  if (!url) return;
  const resolvedUrl = await authService.getFileObjectUrl(url);
  const anchor = document.createElement('a');
  anchor.href = resolvedUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  if (resolvedUrl.startsWith('blob:')) {
    window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 1000);
  }
}

function BillingDetailSkeleton() {
  return (
    <>
      <section className="billing-detail-hero billing-detail-hero--skeleton">
        <SkeletonBlock width={54} height={54} radius={12} className="billing-detail-skeleton-light" />
        <div className="billing-detail-title">
          <SkeletonBlock width={150} height={13} className="billing-detail-skeleton-light" />
          <SkeletonBlock width="34%" height={24} className="billing-detail-skeleton-light" style={{ marginTop: 10 }} />
          <SkeletonBlock width={190} height={14} className="billing-detail-skeleton-light" style={{ marginTop: 10 }} />
        </div>
        <SkeletonBlock width={92} height={26} radius={999} className="billing-detail-skeleton-light" />
      </section>

      <section className="billing-detail-grid">
        {[0, 1].map((panel) => (
          <div className="billing-detail-panel" key={panel}>
            <SkeletonBlock width={170} height={20} style={{ marginBottom: 18 }} />
            <div className="bp-summary-grid">
              {[0, 1, 2, 3].map((item) => (
                <div className="bp-summary-item" key={item}>
                  <SkeletonBlock width="45%" height={12} />
                  <SkeletonBlock width="62%" height={18} style={{ marginTop: 10 }} />
                </div>
              ))}
            </div>
            <div className="billing-detail-actions">
              <SkeletonBlock width={150} height={40} radius={8} />
              <SkeletonBlock width={150} height={40} radius={8} />
            </div>
          </div>
        ))}
      </section>

      <section className="billing-detail-panel">
        <SkeletonBlock width={150} height={20} style={{ marginBottom: 18 }} />
        <SkeletonBlock width="100%" height={86} radius={8} />
      </section>
    </>
  );
}

export default function HrisBillingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useOutletContext();
  const returnTo = location.state?.returnTo || '/billing';
  const profile = useMemo(() => authService.getProfile() || {}, []);
  const canReviewReceipts = hasPermission(profile, 'billing.write');
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState('');
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
  const reviewReceipt = pendingReceipt || receipts[0] || null;
  const isBusy = Boolean(busyAction);

  const handleStatement = async (download = false) => {
    if (!billing) return;
    try {
      setBusyAction(download ? 'downloadInvoice' : 'viewInvoice');
      let current = billing;
      if (!current.has_statement) {
        current = await billingService.generateStatement(current.id);
        setBilling(current);
        showNotification('Billing statement generated.', 'success');
      }
      const { url, filename } = await billingService.getStatementUrl(current.id, download);
      if (download) {
        await downloadExternal(url, filename || buildStatementFallbackFilename(current));
      } else {
        openExternal(url);
      }
    } catch (error) {
      showNotification(getErrorMessage(error, download ? 'Failed to download billing statement.' : 'Failed to open billing statement.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handleReceiptDownload = async (receipt) => {
    if (!receipt?.receipt_url) return;
    try {
      setBusyAction(`downloadReceipt:${receipt.id}`);
      await downloadExternal(receipt.receipt_url, buildReceiptFilename(receipt));
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to download payment receipt.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handleReview = async (event) => {
    event.preventDefault();
    if (!billing || !pendingReceipt || !reviewAction) return;
    try {
      setBusyAction(reviewAction === 'approve' ? 'approveReceipt' : 'rejectReceipt');
      if (reviewAction === 'approve') {
        const updated = await billingService.approveReceipt(billing.id, pendingReceipt.id, { reviewNotes });
        setBilling(updated);
        showNotification('Payment approved.', 'success');
      } else {
        const updated = await billingService.rejectReceipt(billing.id, pendingReceipt.id, { reviewNotes });
        setBilling(updated);
        showNotification('Payment rejected.', 'success');
      }
      setReviewAction(null);
      setReviewNotes('');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to review receipt.'), 'error');
    } finally {
      setBusyAction('');
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

      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" type="button" onClick={() => navigate(returnTo)}>
              <FaArrowLeft /> Back to Billing
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ep-page-body">
      <div className="billing-detail-page ep-detail-container">
        {loading && <BillingDetailSkeleton />}

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
                  <ReportActionButton
                    className="billing-file-action"
                    label={billing.has_statement ? 'View Invoice' : 'Generate Invoice'}
                    loadingLabel={billing.has_statement ? 'Opening...' : 'Generating...'}
                    icon={billing.has_statement ? FaEye : FaFileInvoiceDollar}
                    loading={busyAction === 'viewInvoice'}
                    disabled={isBusy}
                    variant="primary"
                    onClick={() => handleStatement(false)}
                  />
                  <ReportActionButton
                    className="billing-file-action"
                    label="Download Invoice"
                    loadingLabel="Downloading..."
                    icon={FaDownload}
                    loading={busyAction === 'downloadInvoice'}
                    disabled={isBusy}
                    variant="secondary"
                    onClick={() => handleStatement(true)}
                  />
                </div>
              </div>

              <div className="billing-detail-panel">
                <h2><FaReceipt /> Payment Review</h2>
                {!reviewReceipt && (
                  <p className="billing-detail-muted">
                    No payment receipt has been submitted yet.
                  </p>
                )}
                {reviewReceipt && (
                  <>
                    <div className="billing-receipt-card">
                      <p><strong>{formatCurrency(reviewReceipt.amount)}</strong></p>
                      <p>{reviewReceipt.payment_method} - {reviewReceipt.reference_number}</p>
                      <p>Paid {formatDate(reviewReceipt.payment_date)}</p>
                      <p>Status: {formatStatus(reviewReceipt.status)}</p>
                      {reviewReceipt.review_notes && (
                        <p>Notes: {reviewReceipt.review_notes}</p>
                      )}
                    </div>
                    <div className="billing-detail-actions">
                      <ReportActionButton
                        className="billing-file-action"
                        label="View Receipt"
                        icon={FaEye}
                        disabled={isBusy}
                        variant="primary"
                        onClick={() => openExternal(reviewReceipt.receipt_url)}
                      />
                      <ReportActionButton
                        className="billing-file-action"
                        label="Download Receipt"
                        loadingLabel="Downloading..."
                        icon={FaDownload}
                        loading={busyAction === `downloadReceipt:${reviewReceipt.id}`}
                        disabled={isBusy}
                        variant="secondary"
                        onClick={() => handleReceiptDownload(reviewReceipt)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            {canReviewReceipts && pendingReceipt && (
              <section className={`billing-detail-panel ${reviewAction ? '' : 'billing-decision-panel'}`}>
                {!reviewAction ? (
                  <>
                    <div className="billing-decision-left">
                      <p className="billing-payment-review-title">Payment Decision</p>
                      <p className="billing-payment-review-copy">Approve or reject this submitted payment after checking the receipt.</p>
                    </div>
                    <div className="billing-decision-right">
                      <div className="billing-review-actions">
                        <ReportActionButton
                          label="Approve Payment"
                          icon={FaCheckCircle}
                          disabled={isBusy}
                          variant="success"
                          onClick={() => setReviewAction('approve')}
                        />
                        <ReportActionButton
                          label="Reject Payment"
                          icon={FaTimes}
                          disabled={isBusy}
                          variant="danger"
                          onClick={() => setReviewAction('reject')}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="billing-payment-review-title">
                      {reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    </p>
                    <p className="billing-payment-review-copy" style={{ marginBottom: '0.75rem' }}>
                      {reviewAction === 'approve'
                        ? 'Add an optional note before approving this payment.'
                        : 'Explain why this receipt is being rejected.'}
                    </p>
                    <form className="billing-review-form" onSubmit={handleReview}>
                      <label>{reviewAction === 'approve' ? 'Approval Notes' : 'Rejection Reason'}</label>
                      <textarea
                        className="bp-input"
                        rows={3}
                        value={reviewNotes}
                        onChange={(event) => setReviewNotes(event.target.value)}
                        required={reviewAction === 'reject'}
                        placeholder={reviewAction === 'approve' ? 'Optional note for the payment record' : 'Explain why this receipt is rejected'}
                      />
                      <div className="billing-detail-actions">
                        <button className="bp-btn-secondary" type="button" onClick={() => setReviewAction(null)} disabled={isBusy}>
                          Cancel
                        </button>
                        <ReportActionButton
                          label={reviewAction === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                          loadingLabel="Saving..."
                          icon={reviewAction === 'approve' ? FaCheckCircle : FaTimes}
                          loading={busyAction === 'approveReceipt' || busyAction === 'rejectReceipt'}
                          disabled={isBusy}
                          variant={reviewAction === 'approve' ? 'success' : 'danger'}
                          type="submit"
                        />
                      </div>
                    </form>
                  </>
                )}
              </section>
            )}

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
                            <div className="billing-history-actions">
                              <button className="billing-link-button billing-link-button--view" type="button" onClick={() => openExternal(receipt.receipt_url)}>
                                <FaEye /> View
                              </button>
                              <button
                                className="billing-link-button billing-link-button--download"
                                type="button"
                                onClick={() => handleReceiptDownload(receipt)}
                                disabled={isBusy}
                              >
                                {busyAction === `downloadReceipt:${receipt.id}` ? <FaSpinner className="billing-spin" /> : <FaDownload />}
                                Download
                              </button>
                            </div>
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
      </div>
    </>
  );
}
