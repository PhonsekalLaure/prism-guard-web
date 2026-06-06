import {
  FaCreditCard,
  FaDownload,
  FaEye,
  FaFileInvoice,
  FaReceipt,
  FaTimes,
} from 'react-icons/fa';
import ReportActionButton from '@components/ui/ReportActionButton';
import { SkeletonBlock } from '@components/ui/Skeleton';

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
  if (status === 'verifying') return 'For Review';
  if (status === 'pending_review') return 'Pending Review';
  return String(status || 'unpaid')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatReviewer(receipt) {
  if (!receipt?.reviewed_at && !receipt?.reviewer_name) return '';
  const reviewer = receipt.reviewer_name || 'HRIS reviewer';
  if (!receipt.reviewed_at) return `Reviewed by ${reviewer}`;
  return `Reviewed by ${reviewer} on ${formatDateTime(receipt.reviewed_at)}`;
}

function getStatusClass(status) {
  if (status === 'paid' || status === 'approved') return 'cms-inv-badge cms-inv-badge--paid';
  if (status === 'verifying' || status === 'pending_review' || status === 'partial') {
    return 'cms-inv-badge cms-inv-badge--verifying';
  }
  return 'cms-inv-badge cms-inv-badge--unpaid';
}

function DetailSkeleton() {
  return (
    <div className="cms-bdetail-body">
      <SkeletonBlock height={86} width="100%" radius={8} />
      <div className="cms-bdetail-grid">
        {[0, 1, 2, 3].map((item) => (
          <SkeletonBlock key={item} height={64} width="100%" radius={8} />
        ))}
      </div>
      <SkeletonBlock height={108} width="100%" radius={8} />
    </div>
  );
}

export default function BillingDetailModal({
  invoice,
  loading = false,
  onClose,
  onViewPdf,
  onViewReceipt,
  onDownloadReceipt,
  onPay,
}) {
  if (!invoice && !loading) return null;

  const latestReceipt = invoice?.latest_receipt || invoice?.receipts?.[0] || null;
  const invoiceLabel = invoice?.invoice_number || invoice?.statement_no || 'Statement pending';
  const canPay = ['unpaid', 'partial', 'overdue'].includes(invoice?.status);
  const amountPaidLabel = invoice?.status === 'verifying' && latestReceipt ? 'Submitted Amount' : 'Amount Paid';
  const amountPaidValue = invoice?.status === 'verifying' && latestReceipt ? latestReceipt.amount : invoice?.amount_paid;
  const lineItems = invoice?.line_items || [];
  const baseItem = lineItems[0] || null;
  const holidayItems = lineItems.slice(1);
  const baseAmount = baseItem?.amount ?? Number(invoice?.guard_count || 0) * Number(invoice?.rate_per_guard || 0);
  const holidayTotal = holidayItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="cms-bdetail-overlay" role="presentation" onClick={onClose}>
      <div className="cms-bdetail-modal" role="dialog" aria-modal="true" aria-label="Billing details" onClick={(event) => event.stopPropagation()}>
        <div className="cms-bdetail-header">
          <div className="cms-bdetail-header-content">
            <p className="cms-bdetail-eyebrow">Billing Statement</p>
            <h2>{loading ? 'Loading statement...' : invoiceLabel}</h2>
            {!loading && invoice?.period_start && (
              <p className="cms-bdetail-header-sub">
                Period: {formatDate(invoice.period_start)} — {formatDate(invoice.period_end)}
              </p>
            )}
          </div>
          <button className="cms-bdetail-close" type="button" onClick={onClose} aria-label="Close billing details">
            <FaTimes />
          </button>
        </div>

        {loading ? (
          <DetailSkeleton />
        ) : (
          <>
            <div className="cms-bdetail-body">
              <section className="cms-bdetail-summary">
                <div className="cms-bdetail-summary-identity">
                  <div className="cms-bdetail-company-row">
                    <h3>{invoice.company || 'Billing Statement'}</h3>
                    <span className={getStatusClass(invoice.status)}>{formatStatus(invoice.status)}</span>
                  </div>
                  <p>{invoice.billing_address || 'No billing address provided'}</p>
                </div>
                <div className="cms-bdetail-actions">
                  <ReportActionButton
                    className="cms-bdetail-action"
                    label="View Invoice"
                    icon={FaFileInvoice}
                    disabled={!invoice.has_statement}
                    variant="primary"
                    onClick={() => onViewPdf?.(invoice, false)}
                  />
                  <ReportActionButton
                    className="cms-bdetail-action"
                    label="Download Invoice"
                    icon={FaDownload}
                    disabled={!invoice.has_statement}
                    variant="secondary"
                    onClick={() => onViewPdf?.(invoice, true)}
                  />
                  {canPay && (
                    <ReportActionButton
                      className="cms-bdetail-action"
                      label="Pay Now"
                      icon={FaCreditCard}
                      variant="success"
                      onClick={() => onPay?.(invoice)}
                    />
                  )}
                </div>
              </section>

              <section className="cms-bdetail-stats">
                <div className="cms-bdetail-stat cms-bdetail-stat--primary">
                  <p>Total Amount</p>
                  <strong>{formatCurrency(invoice.total_amount)}</strong>
                </div>
                <div className="cms-bdetail-stat">
                  <p>{amountPaidLabel}</p>
                  <strong>{formatCurrency(amountPaidValue)}</strong>
                </div>
                <div className={`cms-bdetail-stat${Number(invoice.balance_due) > 0 ? ' cms-bdetail-stat--danger' : ' cms-bdetail-stat--success'}`}>
                  <p>Balance Due</p>
                  <strong>{formatCurrency(invoice.balance_due)}</strong>
                </div>
                <div className="cms-bdetail-stat">
                  <p>Due Date</p>
                  <strong>{formatDate(invoice.due_date)}</strong>
                </div>
              </section>

              <section className={`cms-bdetail-section cms-bdetail-receipt-section--${latestReceipt?.status || 'none'}`}>
                <h3><FaReceipt /> Latest Payment Receipt</h3>
                {latestReceipt ? (
                  <div className="cms-bdetail-receipt">
                    <div>
                      <p className="cms-bdetail-receipt-main">{formatCurrency(latestReceipt.amount)}</p>
                      <p>{latestReceipt.payment_method || '-'} - Ref: {latestReceipt.reference_number || '-'}</p>
                      <p>Paid {formatDate(latestReceipt.payment_date)} | Submitted {formatDateTime(latestReceipt.submitted_at)}</p>
                      {formatReviewer(latestReceipt) && (
                        <p className="cms-bdetail-review-audit">{formatReviewer(latestReceipt)}</p>
                      )}
                      {latestReceipt.review_notes && <p>Review notes: {latestReceipt.review_notes}</p>}
                    </div>
                    <div className="cms-bdetail-receipt-actions">
                      <div className="cms-bdetail-badge-wrap">
                        <span className={getStatusClass(latestReceipt.status)}>{formatStatus(latestReceipt.status)}</span>
                      </div>
                      <ReportActionButton
                        className="cms-bdetail-action"
                        label="View Receipt"
                        icon={FaEye}
                        disabled={!latestReceipt.receipt_url}
                        variant="primary"
                        onClick={() => onViewReceipt?.({ latest_receipt: latestReceipt })}
                      />
                      <ReportActionButton
                        className="cms-bdetail-action"
                        label="Download Receipt"
                        icon={FaDownload}
                        disabled={!latestReceipt.receipt_url}
                        variant="secondary"
                        onClick={() => onDownloadReceipt?.(latestReceipt)}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="cms-bdetail-muted">No payment receipt has been submitted for this statement.</p>
                )}
              </section>

              <section className="cms-bdetail-section">
                <h3><FaFileInvoice /> Billing Breakdown</h3>
                <div className="cms-bbreakdown">
                  <div className="cms-bbreakdown-metrics">
                    <div>
                      <span>Agreed Rate per Guard</span>
                      <strong>{formatCurrency(invoice.rate_per_guard)}</strong>
                    </div>
                    <div>
                      <span>No. of Guards</span>
                      <strong>{Number(invoice.guard_count || 0).toLocaleString('en-PH')}</strong>
                    </div>
                    <div>
                      <span>Base Service Total</span>
                      <strong>{formatCurrency(baseAmount)}</strong>
                    </div>
                    <div>
                      <span>Holiday Total</span>
                      <strong>{formatCurrency(holidayTotal)}</strong>
                    </div>
                  </div>

                  <div className="cms-bdetail-lines">
                    {baseItem && (
                      <div className="cms-bdetail-line">
                        <div>
                          <p>Base security services</p>
                          <span>{baseItem.detail || baseItem.description}</span>
                        </div>
                        <strong>{formatCurrency(baseItem.amount)}</strong>
                      </div>
                    )}
                    {holidayItems.length > 0 ? holidayItems.map((item) => (
                      <div className="cms-bdetail-line" key={item.id}>
                        <div>
                          <p>{item.description}</p>
                          <span>Holiday charge</span>
                        </div>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </div>
                    )) : (
                      <div className="cms-bdetail-line cms-bdetail-line--muted">
                        <div>
                          <p>No holidays added for this billing period.</p>
                          <span>Holiday charges are shown here when applicable.</span>
                        </div>
                        <strong>{formatCurrency(0)}</strong>
                      </div>
                    )}
                    <div className="cms-bdetail-line cms-bdetail-line--total">
                      <div>
                        <p>Total Billing Amount</p>
                        <span>{formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}</span>
                      </div>
                      <strong>{formatCurrency(invoice.total_amount)}</strong>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
