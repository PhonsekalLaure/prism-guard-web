import {
  FaEye,
  FaFileInvoice,
  FaListUl,
} from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import Pagination from '@components/ui/Pagination';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

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

function formatPeriod(record) {
  return `${formatDate(record.period_start)} - ${formatDate(record.period_end)}`;
}

function getDisplayAmountPaid(record = {}) {
  const amountPaid = Number(record.amount_paid || 0);
  if (amountPaid > 0) return amountPaid;
  if (record.status === 'verifying' && record.latest_receipt?.amount) {
    return Number(record.latest_receipt.amount || 0);
  }
  return amountPaid;
}

const statusConfig = {
  paid: { label: 'PAID', className: 'billing-badge billing-badge--paid' },
  verifying: { label: 'FOR REVIEW', className: 'billing-badge billing-badge--partial' },
  partial: { label: 'PARTIAL', className: 'billing-badge billing-badge--partial' },
  unpaid: { label: 'UNPAID', className: 'billing-badge billing-badge--unpaid' },
  overdue: { label: 'OVERDUE', className: 'billing-badge billing-badge--overdue' },
};

function BillingRowsSkeleton() {
  return (
    <SkeletonList count={5}>{(index) => (
      <tr className="billing-table-row" key={index}>
        <td><SkeletonBlock height={34} width="78%" /></td>
        <td><SkeletonBlock height={16} width="70%" /></td>
        <td><SkeletonBlock height={16} width="60%" /></td>
        <td><SkeletonBlock height={16} width="60%" /></td>
        <td><SkeletonBlock height={16} width="65%" /></td>
        <td><SkeletonBlock height={24} width={82} radius="999px" /></td>
        <td><SkeletonBlock height={32} width="90%" /></td>
      </tr>
    )}</SkeletonList>
  );
}

function ActionButtons({ record, onView }) {
  return (
    <div className="billing-actions">
      <button
        className="billing-action-btn billing-action-btn--view"
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onView(record);
        }}
      >
        <FaEye />
        View
      </button>
    </div>
  );
}

export default function BillingTable({
  records = [],
  metadata,
  loading = false,
  onView,
  onPageChange,
}) {
  const startIndex = records.length > 0 ? ((metadata.page - 1) * metadata.limit) + 1 : 0;
  const endIndex = ((metadata.page - 1) * metadata.limit) + records.length;

  return (
    <div className="billing-table-panel">
      <div className="billing-table-header">
        <h3 className="billing-table-title">
          <FaListUl />
          Client Billing Statements
        </h3>
      </div>

      <div className="billing-table-wrapper">
        <table className="billing-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Billing Period</th>
              <th>Amount Due</th>
              <th>Amount Paid</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <BillingRowsSkeleton />}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <FaFileInvoice style={{ marginRight: '0.5rem' }} />
                  No billing statements found.
                </td>
              </tr>
            )}
            {!loading && records.map((record) => {
              const badge = statusConfig[record.status] || statusConfig.unpaid;
              const displayAmountPaid = getDisplayAmountPaid(record);
              const paidColor = displayAmountPaid <= 0
                ? '#dc2626'
                : record.status === 'verifying' || record.status === 'partial'
                  ? '#ca8a04'
                  : '#16a34a';

              return (
                <tr
                  key={record.id}
                  className={`billing-table-row${record.status === 'overdue' ? ' billing-table-row--overdue' : ''}`}
                  onClick={() => onView(record)}
                >
                  <td>
                    <div className="billing-client-cell">
                      <EntityAvatar
                        avatarUrl={record.avatar_url}
                        initials={record.initials}
                        alt={record.company}
                        className="billing-initials"
                      />
                      <span className="billing-company-name">{record.company}</span>
                    </div>
                  </td>
                  <td className="billing-td-muted">{formatPeriod(record)}</td>
                  <td className="billing-td-bold">{formatCurrency(record.total_amount)}</td>
                  <td className="billing-td-bold" style={{ color: paidColor }}>
                    {formatCurrency(displayAmountPaid)}
                  </td>
                  <td className="billing-td-muted">{formatDate(record.due_date)}</td>
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>
                  <td>
                    <ActionButtons
                      record={record}
                      onView={onView}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={metadata.page}
        totalPages={metadata.totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={metadata.total}
        label="billing statements"
      />
    </div>
  );
}
