import { FaFileInvoice } from 'react-icons/fa';
import InvoicesTable from './InvoicesTable';

const TABS = [
  { key: 'invoices', label: 'Invoices', icon: FaFileInvoice },
];

export default function BillingTabs({
  invoices,
  metadata,
  loading,
  filters,
  onFilterChange,
  onPageChange,
  onViewInvoice,
  onPayInvoice,
}) {
  return (
    <div className="cms-btabs-panel">
      <div className="cms-btabs-bar">
        <div className="cms-btabs-left">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                className="cms-btab-btn active"
              >
                <Icon className="cms-btab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="cms-btabs-filters">
          <label className="cms-btab-filter-label">
            <span>Status</span>
            <select
              value={filters?.status || ''}
              onChange={(e) => onFilterChange?.({ ...filters, status: e.target.value })}
            >
              <option value="">All statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
              <option value="verifying">Verifying</option>
              <option value="paid">Paid</option>
            </select>
          </label>
          {filters?.status && (
            <button
              className="cms-inv-filter-clear"
              type="button"
              onClick={() => onFilterChange?.({ ...filters, status: '' })}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="cms-btabs-content">
        <InvoicesTable
          invoices={invoices}
          metadata={metadata}
          loading={loading}
          onPageChange={onPageChange}
          onViewInvoice={onViewInvoice}
          onPayInvoice={onPayInvoice}
        />
      </div>
    </div>
  );
}
