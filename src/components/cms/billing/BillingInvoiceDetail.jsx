import {
  FaCreditCard,
  FaDownload,
  FaEye,
  FaFileInvoice,
  FaReceipt,
} from 'react-icons/fa';
import ReportActionButton from '@components/ui/ReportActionButton';
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatPaymentMethod,
  formatReviewer,
  formatStatus,
  getStatusClass,
} from './billingUi';

const PAYABLE_STATUSES = new Set(['unpaid', 'partial', 'overdue']);

export default function BillingInvoiceDetail({
  invoice,
  isActionLoading,
  runAction,
  onDownloadReceipt,
  onPay,
  onViewPdf,
  onViewReceipt,
}) {
  const latestReceipt = invoice?.latest_receipt || invoice?.receipts?.[0] || null;
  const canPay = PAYABLE_STATUSES.has(invoice?.status);
  const amountPaidLabel = invoice?.status === 'verifying' && latestReceipt ? 'Submitted Amount' : 'Amount Paid';
  const amountPaidValue = invoice?.status === 'verifying' && latestReceipt ? latestReceipt.amount : invoice?.amount_paid;
  const lineItems = invoice?.line_items || [];
  const baseItem = lineItems[0] || null;
  const holidayItems = lineItems.slice(1);
  const baseAmount = baseItem?.amount ?? Number(invoice?.guard_count || 0) * Number(invoice?.rate_per_guard || 0);
  const holidayTotal = holidayItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
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
            loading={isActionLoading('view-invoice')}
            loadingLabel="Opening..."
            onClick={() => runAction('view-invoice', () => onViewPdf?.(invoice, false))}
          />
          <ReportActionButton
            className="cms-bdetail-action"
            label="Download Invoice"
            icon={FaDownload}
            disabled={!invoice.has_statement}
            variant="secondary"
            loading={isActionLoading('download-invoice')}
            loadingLabel="Downloading..."
            onClick={() => runAction('download-invoice', () => onViewPdf?.(invoice, true))}
          />
          {canPay && (
            <ReportActionButton
              className="cms-bdetail-action"
              label="Pay Now"
              icon={FaCreditCard}
              variant="success"
              onClick={onPay}
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
              <p>{formatPaymentMethod(latestReceipt)} - Ref: {latestReceipt.reference_number || '-'}</p>
              <p>Paid {formatDate(latestReceipt.payment_date)} | Submitted {formatDateTime(latestReceipt.submitted_at)}</p>
              {latestReceipt.payer_notes && <p>Client notes: {latestReceipt.payer_notes}</p>}
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
                loading={isActionLoading('download-receipt')}
                loadingLabel="Downloading..."
                onClick={() => runAction('download-receipt', () => onDownloadReceipt?.(latestReceipt))}
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
  );
}
