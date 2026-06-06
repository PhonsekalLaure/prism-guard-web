import {
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
}) {
  if (!invoice && !loading) return null;

  const latestReceipt = invoice?.latest_receipt || invoice?.receipts?.[0] || null;
  const invoiceLabel = invoice?.invoice_number || invoice?.statement_no || 'Statement pending';

  return (
    <div className="cms-bdetail-overlay" role="presentation" onClick={onClose}>
      <div className="cms-bdetail-modal" role="dialog" aria-modal="true" aria-label="Billing details" onClick={(event) => event.stopPropagation()}>
        <div className="cms-bdetail-header">
          <div>
            <p className="cms-bdetail-eyebrow">Billing Statement</p>
            <h2>{loading ? 'Loading statement...' : invoiceLabel}</h2>
            {!loading && (
              <p>{formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}</p>
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
                <div>
                  <span className={getStatusClass(invoice.status)}>{formatStatus(invoice.status)}</span>
                  <h3>{invoice.company || 'Billing Statement'}</h3>
                  <p>{invoice.billing_address || 'No billing address provided'}</p>
                </div>
                <div className="cms-bdetail-actions">
                  <ReportActionButton
                    className="cms-bdetail-action"
                    label="View PDF"
                    icon={FaFileInvoice}
                    disabled={!invoice.has_statement}
                    variant="primary"
                    onClick={() => onViewPdf?.(invoice, false)}
                  />
                  <ReportActionButton
                    className="cms-bdetail-action"
                    label="Download PDF"
                    icon={FaDownload}
                    disabled={!invoice.has_statement}
                    variant="secondary"
                    onClick={() => onViewPdf?.(invoice, true)}
                  />
                </div>
              </section>

              <section className="cms-bdetail-grid">
                <div className="cms-bdetail-item">
                  <p>Total Amount</p>
                  <strong>{formatCurrency(invoice.total_amount)}</strong>
                </div>
                <div className="cms-bdetail-item">
                  <p>Amount Paid</p>
                  <strong>{formatCurrency(invoice.amount_paid)}</strong>
                </div>
                <div className="cms-bdetail-item">
                  <p>Balance Due</p>
                  <strong>{formatCurrency(invoice.balance_due)}</strong>
                </div>
                <div className="cms-bdetail-item">
                  <p>Due Date</p>
                  <strong>{formatDate(invoice.due_date)}</strong>
                </div>
              </section>

              <section className="cms-bdetail-section">
                <h3><FaReceipt /> Latest Payment Receipt</h3>
                {latestReceipt ? (
                  <div className="cms-bdetail-receipt">
                    <div>
                      <p className="cms-bdetail-receipt-main">{formatCurrency(latestReceipt.amount)}</p>
                      <p>{latestReceipt.payment_method || '-'} - Ref: {latestReceipt.reference_number || '-'}</p>
                      <p>Paid {formatDate(latestReceipt.payment_date)} | Submitted {formatDateTime(latestReceipt.submitted_at)}</p>
                      {latestReceipt.review_notes && <p>Review notes: {latestReceipt.review_notes}</p>}
                    </div>
                    <div className="cms-bdetail-receipt-actions">
                      <span className={getStatusClass(latestReceipt.status)}>{formatStatus(latestReceipt.status)}</span>
                      <ReportActionButton
                        className="cms-bdetail-action"
                        label="View Receipt"
                        icon={FaEye}
                        disabled={!latestReceipt.receipt_url}
                        variant="secondary"
                        onClick={() => onViewReceipt?.({ latest_receipt: latestReceipt })}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="cms-bdetail-muted">No payment receipt has been submitted for this statement.</p>
                )}
              </section>

              {invoice.line_items?.length > 0 && (
                <section className="cms-bdetail-section">
                  <h3><FaFileInvoice /> Statement Items</h3>
                  <div className="cms-bdetail-lines">
                    {invoice.line_items.map((item) => (
                      <div className="cms-bdetail-line" key={item.id}>
                        <div>
                          <p>{item.description}</p>
                          <span>{item.detail}</span>
                        </div>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
