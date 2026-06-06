import { FaCheck, FaClock, FaDownload, FaEye, FaHourglassHalf } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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

function formatReviewer(receipt) {
  if (!receipt?.reviewed_at && !receipt?.reviewer_name) return '';
  const reviewer = receipt.reviewer_name || 'HRIS reviewer';
  if (!receipt.reviewed_at) return `Reviewed by ${reviewer}`;
  return `Reviewed by ${reviewer} on ${formatDateTime(receipt.reviewed_at)}`;
}

function buildHistoryItems(history = []) {
  return history
    .map((receipt) => {
      const invoiceLabel = receipt.invoice_number || receipt.statement_no || receipt.billing_id;
      const rejected = receipt.status === 'rejected';
      const approved = receipt.status === 'approved' || receipt.billing?.status === 'paid';
      return {
        icon: approved ? FaCheck : FaHourglassHalf,
        iconBg: approved ? '#16a34a' : rejected ? '#dc2626' : '#e6b215',
        title: `${approved ? 'Payment Confirmed' : rejected ? 'Payment Rejected' : 'Payment Under Verification'} - ${invoiceLabel}`,
        ref: `${receipt.payment_method} - Ref: ${receipt.reference_number}`,
        amount: formatCurrency(receipt.amount),
        amountColor: approved ? '#16a34a' : rejected ? '#dc2626' : '#e6b215',
        time: formatDateTime(receipt.submitted_at),
        review: formatReviewer(receipt),
        reviewNotes: receipt.review_notes || '',
        receipt,
        rowBg: approved ? '#f9fafb' : rejected ? '#fef2f2' : '#fefce8',
        rowBorder: approved ? '#e5e7eb' : rejected ? '#fecaca' : '#fde68a',
      };
    });
}

function HistorySkeleton() {
  return (
    <SkeletonList count={3}>{(index) => (
      <div className="cms-ph-item" key={index}>
        <SkeletonBlock height={42} width={42} radius="50%" />
        <div className="cms-ph-body">
          <SkeletonBlock height={16} width="45%" />
          <SkeletonBlock height={14} width="32%" />
          <SkeletonBlock height={12} width="24%" />
        </div>
      </div>
    )}</SkeletonList>
  );
}

export default function PaymentHistory({
  history = [],
  metadata,
  loading = false,
  onPageChange,
  onViewReceipt,
  onDownloadReceipt,
}) {
  const historyItems = buildHistoryItems(history);
  const startIndex = history.length > 0 ? ((metadata.page - 1) * metadata.limit) + 1 : 0;
  const endIndex = ((metadata.page - 1) * metadata.limit) + history.length;

  return (
    <>
      <div className="cms-ph-list">
        {loading && <HistorySkeleton />}
        {!loading && historyItems.length === 0 && (
        <div className="cms-ph-item" style={{ background: '#f9fafb', borderColor: '#e5e7eb' }}>
          <div className="cms-ph-body">
            <p className="cms-ph-title">No payment receipts submitted yet.</p>
          </div>
        </div>
        )}
        {!loading && historyItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.title}-${index}`}
              className="cms-ph-item"
              style={{ background: item.rowBg, borderColor: item.rowBorder }}
            >
              <div className="cms-ph-icon" style={{ background: item.iconBg }}>
                <Icon />
              </div>
              <div className="cms-ph-body">
                <div className="cms-ph-header-row">
                  <div>
                    <p className="cms-ph-title">{item.title}</p>
                    <p className="cms-ph-ref">{item.ref}</p>
                  </div>
                  <p className="cms-ph-amount" style={{ color: item.amountColor }}>
                    {item.amount}
                  </p>
                </div>
                <p className="cms-ph-time">
                  <FaClock className="cms-ph-clock" />
                  {item.time}
                </p>
                {(item.review || item.reviewNotes) && (
                  <p className="cms-ph-review">
                    {item.review || 'Review completed'}
                    {item.reviewNotes && <span>{item.reviewNotes}</span>}
                  </p>
                )}
                {item.receipt?.receipt_url && (
                  <div className="cms-ph-actions">
                    <button type="button" onClick={() => onViewReceipt?.({ latest_receipt: item.receipt })}>
                      <FaEye /> View Receipt
                    </button>
                    <button type="button" onClick={() => onDownloadReceipt?.(item.receipt)}>
                      <FaDownload /> Download Receipt
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <Pagination
        currentPage={metadata.page}
        totalPages={metadata.totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={metadata.total}
        label="payment receipts"
      />
    </>
  );
}
