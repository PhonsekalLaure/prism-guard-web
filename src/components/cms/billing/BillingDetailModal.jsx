import { useEffect, useState } from 'react';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import useActionLoading from '@hooks/useActionLoading';
import BillingDetailSkeleton from './BillingDetailSkeleton';
import BillingInvoiceDetail from './BillingInvoiceDetail';
import BillingPaymentForm from './BillingPaymentForm';
import { formatDate } from './billingUi';

export default function BillingDetailModal({
  invoice,
  loading = false,
  initialPayMode = false,
  submitting = false,
  onClose,
  onViewPdf,
  onViewReceipt,
  onDownloadReceipt,
  onSubmitReceipt,
}) {
  const [payMode, setPayMode] = useState(initialPayMode);
  const { isActionLoading, runAction } = useActionLoading();

  useEffect(() => {
    setPayMode(initialPayMode);
  }, [initialPayMode]);

  if (!invoice && !loading) return null;

  const invoiceLabel = invoice?.invoice_number || invoice?.statement_no || 'Statement pending';

  return (
    <div className="cms-bdetail-overlay" role="presentation" onClick={onClose}>
      <div
        className="cms-bdetail-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Billing details"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="cms-bdetail-header">
          <div className="cms-bdetail-header-content">
            <p className="cms-bdetail-eyebrow">
              {payMode ? 'Submit Payment' : 'Billing Statement'}
            </p>
            <h2>{loading ? 'Loading statement...' : invoiceLabel}</h2>
            {!loading && !payMode && invoice?.period_start && (
              <p className="cms-bdetail-header-sub">
                Period: {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
              </p>
            )}
          </div>
          <div className="cms-bdetail-header-btns">
            {payMode && !loading && (
              <button
                className="cms-bdetail-back-btn"
                type="button"
                onClick={() => setPayMode(false)}
                disabled={submitting}
              >
                <FaArrowLeft /> Back
              </button>
            )}
            <button
              className="cms-bdetail-close"
              type="button"
              onClick={onClose}
              aria-label="Close billing details"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {loading ? (
          <BillingDetailSkeleton />
        ) : payMode ? (
          <BillingPaymentForm
            invoice={invoice}
            submitting={submitting}
            onCancel={() => setPayMode(false)}
            onSubmit={onSubmitReceipt}
          />
        ) : (
          <BillingInvoiceDetail
            invoice={invoice}
            isActionLoading={isActionLoading}
            runAction={runAction}
            onDownloadReceipt={onDownloadReceipt}
            onPay={() => setPayMode(true)}
            onViewPdf={onViewPdf}
            onViewReceipt={onViewReceipt}
          />
        )}
      </div>
    </div>
  );
}
