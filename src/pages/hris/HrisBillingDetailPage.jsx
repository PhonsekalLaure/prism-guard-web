import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import { SkeletonBlock } from '@components/ui/Skeleton';
import useNotification from '@hooks/useNotification';
import authService from '@services/authService';
import billingService from '@services/hris/billingService';
import { hasPermission } from '@utils/adminPermissions';
import { getSafeDocumentUrl, isSafePreviewMimeType } from '@utils/security';
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
  if (status === 'voided') return 'VOIDED';
  return String(status || 'unpaid').replace(/_/g, ' ').toUpperCase();
}

function formatReviewer(receipt) {
  if (!receipt?.reviewed_at && !receipt?.reviewer_name) return '';
  const reviewer = receipt.reviewer_name || 'HRIS reviewer';
  if (!receipt.reviewed_at) return `Reviewed by ${reviewer}`;
  return `Reviewed by ${reviewer} on ${formatDateTime(receipt.reviewed_at)}`;
}

function formatPaymentMethod(receipt) {
  if (receipt?.payment_method === 'Other' && receipt.payment_method_other) {
    return `Other - ${receipt.payment_method_other}`;
  }
  return receipt?.payment_method || '-';
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
  const safeUrl = getSafeDocumentUrl(url);
  if (safeUrl) window.open(safeUrl, '_blank', 'noopener,noreferrer');
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

function formatGuardCount(value) {
  return Number(value || 0).toLocaleString('en-PH');
}

function downloadBlob(blob, filename = 'download') {
  if (!blob) return;
  const resolvedUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = resolvedUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 1000);
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
              {[0, 1, 2, 3, 4].map((item) => (
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
  const [statementPreview, setStatementPreview] = useState(null);
  const [voidTarget, setVoidTarget] = useState(null);
  const [voidNotes, setVoidNotes] = useState('');
  const billingRequestRef = useRef(0);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadBilling = useCallback(async () => {
    const requestId = billingRequestRef.current + 1;
    billingRequestRef.current = requestId;
    try {
      setLoading(true);
      setBilling(null);
      const data = await billingService.getBilling(id);
      if (requestId !== billingRequestRef.current) return;
      setBilling(data);
    } catch (error) {
      if (requestId !== billingRequestRef.current) return;
      showNotification(getErrorMessage(error, 'Failed to load billing statement.'), 'error');
    } finally {
      if (requestId === billingRequestRef.current) setLoading(false);
    }
  }, [id, showNotification]);

  useEffect(() => {
    loadBilling();
  }, [loadBilling]);

  const receipts = billing?.receipts || [];
  const pendingReceipt = receipts.find((receipt) => receipt.status === 'pending_review');
  const reviewReceipt = pendingReceipt || receipts[0] || null;
  const lineItems = billing?.line_items || [];
  const isBusy = Boolean(busyAction);
  const canRecalculateStatement = canReviewReceipts && ['paid', 'partial', 'unpaid', 'overdue'].includes(billing?.status);

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
      if (download) {
        const { blob, filename } = await billingService.downloadStatement(current.id);
        downloadBlob(blob, filename || buildStatementFallbackFilename(current));
      } else {
        const { url } = await billingService.getStatementUrl(current.id, false);
        openExternal(url);
      }
    } catch (error) {
      showNotification(getErrorMessage(error, download ? 'Failed to download billing statement.' : 'Failed to open billing statement.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handlePreviewRecalculate = async () => {
    if (!billing?.id) return;
    try {
      setBusyAction('previewRecalculate');
      const preview = await billingService.previewStatement(billing.id);
      setStatementPreview(preview);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to preview statement recalculation.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handleApplyRecalculate = async () => {
    if (!billing?.id) return;
    try {
      setBusyAction('applyRecalculate');
      const updated = await billingService.generateStatement(billing.id);
      setBilling(updated);
      setStatementPreview(null);
      showNotification('Billing statement recalculated.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to recalculate billing statement.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handleReceiptDownload = async (receipt) => {
    if (!billing?.id || !receipt?.id) return;
    try {
      setBusyAction(`downloadReceipt:${receipt.id}`);
      const { blob, filename } = await billingService.downloadReceipt(billing.id, receipt.id);
      downloadBlob(blob, filename || buildReceiptFilename(receipt));
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to download payment receipt.'), 'error');
    } finally {
      setBusyAction('');
    }
  };

  const handleReceiptView = async (receipt) => {
    if (!billing?.id || !receipt?.id) return;
    try {
      setBusyAction(`viewReceipt:${receipt.id}`);
      const { blob } = await billingService.downloadReceipt(billing.id, receipt.id);
      if (!isSafePreviewMimeType(blob?.type)) {
        throw new Error('This receipt type cannot be previewed safely.');
      }
      const resolvedUrl = URL.createObjectURL(blob);
      window.open(resolvedUrl, '_blank', 'noopener,noreferrer');
      window.setTimeout(() => URL.revokeObjectURL(resolvedUrl), 60000);
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to open payment receipt.'), 'error');
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

  const handleVoidReceipt = async (event) => {
    event.preventDefault();
    if (!billing?.id || !voidTarget?.id) return;
    try {
      setBusyAction(`voidReceipt:${voidTarget.id}`);
      const updated = await billingService.voidReceipt(billing.id, voidTarget.id, { voidNotes });
      setBilling(updated);
      setVoidTarget(null);
      setVoidNotes('');
      showNotification('Payment receipt voided.', 'success');
    } catch (error) {
      showNotification(getErrorMessage(error, 'Failed to void payment receipt.'), 'error');
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
                  {/* Primary row — dominant financial figures */}
                  <div className="bp-summary-item bp-summary-item--primary">
                    <p className="bp-summary-label">Total Amount</p>
                    <p className="bp-summary-value bp-summary-value--primary bp-summary-value--blue">
                      {formatCurrency(billing.total_amount)}
                    </p>
                  </div>
                  <div className="bp-summary-item bp-summary-item--primary">
                    <p className="bp-summary-label">Balance Due</p>
                    <p className={`bp-summary-value bp-summary-value--primary ${billing.status === 'paid' ? 'bp-summary-value--green' : 'bp-summary-value--red'}`}>
                      {formatCurrency(billing.balance_due)}
                    </p>
                  </div>

                  {/* Secondary row — supporting context */}
                  <div className="bp-summary-item bp-summary-item--secondary">
                    <p className="bp-summary-label">Rate per Guard</p>
                    <p className="bp-summary-value">{formatCurrency(billing.rate_per_guard)}</p>
                  </div>
                  <div className="bp-summary-item bp-summary-item--secondary">
                    <p className="bp-summary-label">No. of Guards</p>
                    <p className="bp-summary-value">{formatGuardCount(billing.guard_count)}</p>
                  </div>
                  <div className="bp-summary-item bp-summary-item--secondary">
                    <p className="bp-summary-label">Due Date</p>
                    <p className="bp-summary-value">{formatDate(billing.due_date)}</p>
                  </div>
                </div>
                <div className="billing-line-items">
                  <div className="billing-line-items-header">
                    <span>Invoice Breakdown</span>
                    <span>Amount</span>
                  </div>
                  {lineItems.length === 0 && (
                    <p className="billing-detail-muted">No line items are saved for this statement yet.</p>
                  )}
                  {lineItems.map((item) => (
                    <div className="billing-line-item" key={item.id || `${item.description}-${item.sort_order}`}>
                      <div>
                        <p className="billing-line-item-title">{item.description}</p>
                        {item.detail && <p className="billing-line-item-detail">{item.detail}</p>}
                      </div>
                      <strong>{formatCurrency(item.amount)}</strong>
                    </div>
                  ))}
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
                  {canRecalculateStatement && (
                    <ReportActionButton
                      className="billing-file-action"
                      label="Recalculate Statement"
                      loadingLabel="Checking..."
                      icon={FaFileInvoiceDollar}
                      loading={busyAction === 'previewRecalculate'}
                      disabled={isBusy}
                      variant="secondary"
                      onClick={handlePreviewRecalculate}
                    />
                  )}
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
                      <p>{formatPaymentMethod(reviewReceipt)} - {reviewReceipt.reference_number}</p>
                      <p>Paid {formatDate(reviewReceipt.payment_date)}</p>
                      <p>Status: {formatStatus(reviewReceipt.status)}</p>
                      {reviewReceipt.payer_notes && (
                        <p>Client notes: {reviewReceipt.payer_notes}</p>
                      )}
                      {formatReviewer(reviewReceipt) && (
                        <p className="billing-review-audit">{formatReviewer(reviewReceipt)}</p>
                      )}
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
                        loading={busyAction === `viewReceipt:${reviewReceipt.id}`}
                        loadingLabel="Opening..."
                        onClick={() => handleReceiptView(reviewReceipt)}
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
                      <th>Review</th>
                      <th>Receipt</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center' }}>No payment receipts submitted yet.</td>
                      </tr>
                    )}
                    {receipts.map((receipt) => (
                      <tr key={receipt.id}>
                        <td>{formatDateTime(receipt.submitted_at)}</td>
                        <td>{formatDate(receipt.payment_date)}</td>
                        <td className="bp-history-amount">{formatCurrency(receipt.amount)}</td>
                        <td>{formatPaymentMethod(receipt)}</td>
                        <td className="bp-history-ref">{receipt.reference_number}</td>
                        <td>{formatStatus(receipt.status)}</td>
                        <td className="bp-history-review">
                          {formatReviewer(receipt) || '-'}
                          {receipt.payer_notes && <span>Client: {receipt.payer_notes}</span>}
                          {receipt.review_notes && <span>{receipt.review_notes}</span>}
                        </td>
                        <td>
                          {receipt.receipt_url ? (
                            <div className="billing-history-actions">
                              <button
                                className="billing-link-button billing-link-button--view"
                                type="button"
                                onClick={() => handleReceiptView(receipt)}
                                disabled={isBusy}
                              >
                                {busyAction === `viewReceipt:${receipt.id}` ? <FaSpinner className="billing-spin" /> : <FaEye />}
                                View
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
                        <td>
                          {canReviewReceipts && receipt.status === 'approved' ? (
                            <button
                              className="billing-link-button billing-link-button--download"
                              type="button"
                              disabled={isBusy}
                              onClick={() => {
                                setVoidTarget(receipt);
                                setVoidNotes('');
                              }}
                            >
                              <FaTimes /> Void
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
      </div>

      <ReportConfirmDialog
        open={Boolean(statementPreview)}
        title="Recalculate Statement?"
        description={statementPreview ? `Recalculation preview for ${billing?.company || 'this client'}.` : ''}
        confirmLabel="Save Recalculation"
        loading={busyAction === 'applyRecalculate'}
        tone={Number(statementPreview?.proposed_balance_due || 0) > 0 ? 'warning' : 'info'}
        width="min(500px, 100%)"
        onCancel={() => setStatementPreview(null)}
        onConfirm={handleApplyRecalculate}
      >
        {statementPreview && (
          <div className="billing-recalc-preview-container">
            <div className="billing-recalc-grid">
              {/* Total Amount comparison */}
              <div className="billing-recalc-item">
                <span className="recalc-label">Total Amount</span>
                <div className="recalc-comparison">
                  <span className="recalc-val recalc-val--old">{formatCurrency(statementPreview.current_total)}</span>
                  <span className="recalc-arrow">-&gt;</span>
                  <span className="recalc-val recalc-val--new recalc-val--bold">{formatCurrency(statementPreview.proposed_total)}</span>
                </div>
              </div>

              {/* Balance Due comparison */}
              <div className="billing-recalc-item">
                <span className="recalc-label">Balance Due</span>
                <div className="recalc-comparison">
                  <span className="recalc-val recalc-val--old">{formatCurrency(statementPreview.current_balance_due)}</span>
                  <span className="recalc-arrow">-&gt;</span>
                  <span className={`recalc-val recalc-val--new recalc-val--bold ${Number(statementPreview.proposed_balance_due) > 0 ? 'recalc-val--warning' : 'recalc-val--success'}`}>
                    {formatCurrency(statementPreview.proposed_balance_due)}
                  </span>
                </div>
              </div>

              {/* Status comparison */}
              <div className="billing-recalc-item">
                <span className="recalc-label">Statement Status</span>
                <div className="recalc-comparison">
                  <span className="recalc-val recalc-val--old">{formatStatus(statementPreview.status)}</span>
                  <span className="recalc-arrow">-&gt;</span>
                  <span className={`recalc-val recalc-val--new recalc-val--bold status-${statementPreview.target_status}`}>
                    {formatStatus(statementPreview.target_status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Approved receipts info notice */}
            <div className="billing-recalc-receipts-notice">
              <span>Paid Amount (Approved Receipts): <strong>{formatCurrency(statementPreview.amount_paid)}</strong> (remains unchanged)</span>
            </div>
          </div>
        )}
      </ReportConfirmDialog>

      {voidTarget && (
        <div className="report-confirm-overlay" onClick={() => !isBusy && setVoidTarget(null)}>
          <section
            className="report-confirm-card report-confirm-card--danger"
            role="dialog"
            aria-modal="true"
            aria-labelledby="billing-void-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="report-confirm-header">
              <span className="report-confirm-icon"><FaTimes /></span>
              <div>
                <h2 id="billing-void-title">Void Payment Receipt?</h2>
                <p>{formatCurrency(voidTarget.amount)} from reference {voidTarget.reference_number || '-'} will no longer count toward this billing statement.</p>
              </div>
              <button className="report-confirm-close" type="button" aria-label="Close" onClick={() => setVoidTarget(null)} disabled={isBusy}>
                <FaTimes />
              </button>
            </header>
            <form className="billing-review-form" onSubmit={handleVoidReceipt} style={{ marginTop: 0 }}>
              <div className="report-confirm-body" style={{ paddingBottom: '0.5rem' }}>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#475569' }}>Void Reason</label>
                <textarea
                  className="bp-input"
                  rows={3}
                  value={voidNotes}
                  onChange={(event) => setVoidNotes(event.target.value)}
                  required
                  placeholder="Explain why this approved payment is being voided"
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
              <footer className="report-confirm-actions">
                <button className="report-confirm-cancel" type="button" onClick={() => setVoidTarget(null)} disabled={isBusy}>
                  Cancel
                </button>
                <ReportActionButton
                  label="Void Payment"
                  loadingLabel="Voiding..."
                  icon={FaTimes}
                  loading={busyAction === `voidReceipt:${voidTarget.id}`}
                  disabled={isBusy}
                  variant="danger"
                  type="submit"
                />
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
