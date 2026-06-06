import {
  FaEye,
  FaFileInvoice,
} from 'react-icons/fa';
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

function formatPeriod(invoice) {
  return `${formatDate(invoice.period_start)} - ${formatDate(invoice.period_end)}`;
}

const statusConfig = {
  unpaid: { label: 'Unpaid', className: 'cms-inv-badge cms-inv-badge--unpaid' },
  partial: { label: 'Partial', className: 'cms-inv-badge cms-inv-badge--verifying' },
  overdue: { label: 'Overdue', className: 'cms-inv-badge cms-inv-badge--overdue' },
  verifying: { label: 'Verifying', className: 'cms-inv-badge cms-inv-badge--verifying' },
  paid: { label: 'Paid', className: 'cms-inv-badge cms-inv-badge--paid' },
};

function InvoiceActions({ invoice, onViewInvoice }) {
  return (
    <div className="cms-inv-actions">
    <button className="cms-inv-btn cms-inv-btn--view" type="button" onClick={() => onViewInvoice?.(invoice)}>
      <FaEye /> View
    </button>
    </div>
  );
}

function InvoiceRowsSkeleton() {
  return (
    <SkeletonList count={4}>{(index) => (
      <tr key={index} className="cms-inv-row">
        <td><SkeletonBlock height={16} width="80%" /></td>
        <td><SkeletonBlock height={16} width="70%" /></td>
        <td><SkeletonBlock height={16} width="60%" /></td>
        <td><SkeletonBlock height={16} width="60%" /></td>
        <td><SkeletonBlock height={24} width={82} radius="999px" /></td>
        <td><SkeletonBlock height={32} width="90%" /></td>
      </tr>
    )}</SkeletonList>
  );
}

export default function InvoicesTable({
  invoices = [],
  metadata,
  filters = { status: '', periodStart: '', periodEnd: '' },
  loading = false,
  onPageChange,
  onFilterChange,
  onViewInvoice,
}) {
  const startIndex = invoices.length > 0 ? ((metadata.page - 1) * metadata.limit) + 1 : 0;
  const endIndex = ((metadata.page - 1) * metadata.limit) + invoices.length;

  return (
    <div>
      <div className="cms-inv-filters">
        <label>
          <span>Status</span>
          <select
            value={filters.status || ''}
            onChange={(event) => onFilterChange?.({ ...filters, status: event.target.value })}
          >
            <option value="">All statuses</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
            <option value="verifying">Verifying</option>
            <option value="paid">Paid</option>
          </select>
        </label>
        <label>
          <span>Period Start</span>
          <input
            type="date"
            value={filters.periodStart || ''}
            onChange={(event) => onFilterChange?.({ ...filters, periodStart: event.target.value })}
          />
        </label>
        <label>
          <span>Period End</span>
          <input
            type="date"
            value={filters.periodEnd || ''}
            onChange={(event) => onFilterChange?.({ ...filters, periodEnd: event.target.value })}
          />
        </label>
        {(filters.status || filters.periodStart || filters.periodEnd) && (
          <button
            className="cms-inv-filter-clear"
            type="button"
            onClick={() => onFilterChange?.({ status: '', periodStart: '', periodEnd: '' })}
          >
            Clear
          </button>
        )}
      </div>

      <div className="cms-inv-table-wrapper">
        <table className="cms-inv-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Period</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <InvoiceRowsSkeleton />}
            {!loading && invoices.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                  <FaFileInvoice style={{ marginRight: '0.5rem' }} />
                  No billing statements found.
                </td>
              </tr>
            )}
            {!loading && invoices.map((invoice) => {
              const badge = statusConfig[invoice.status] || statusConfig.unpaid;
              return (
                <tr key={invoice.id} className="cms-inv-row">
                  <td className="cms-inv-id">{invoice.invoice_number || invoice.statement_no || 'Statement pending'}</td>
                  <td className="cms-inv-muted">{formatPeriod(invoice)}</td>
                  <td className="cms-inv-amount">{formatCurrency(invoice.total_amount)}</td>
                  <td className="cms-inv-muted">{formatDate(invoice.due_date)}</td>
                  <td>
                    <span className={badge.className}>{badge.label}</span>
                  </td>
                  <td>
                    <InvoiceActions
                      invoice={invoice}
                      onViewInvoice={onViewInvoice}
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
        label="invoices"
      />
    </div>
  );
}
