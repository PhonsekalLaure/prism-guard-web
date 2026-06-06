import { FaFileInvoice, FaUpload } from 'react-icons/fa';
import InvoicesTable from './InvoicesTable';
import SubmitPaymentForm from './SubmitPaymentForm';

const TABS = [
  { key: 'invoices', label: 'Invoices', icon: FaFileInvoice },
  { key: 'submit', label: 'Submit Receipt', icon: FaUpload },
];

export default function BillingTabs({
  invoices,
  metadata,
  loading,
  activeTab = 'invoices',
  filters,
  selectedInvoice,
  submitting,
  onTabChange,
  onFilterChange,
  onPageChange,
  onSelectInvoice,
  onSubmitReceipt,
  onViewInvoice,
}) {
  const handleCancelSubmit = () => {
    onSelectInvoice?.(null);
    onTabChange?.('invoices');
  };

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
                className={`cms-btab-btn${activeTab === tab.key ? ' active' : ''}`}
                onClick={() => onTabChange?.(tab.key)}
              >
                <Icon className="cms-btab-icon" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {activeTab === 'invoices' && (
          <div className="cms-btabs-filters">
            <label className="cms-btab-filter-label">
              <span>Status</span>
              <select
                value={filters?.status || ''}
                onChange={(e) => onFilterChange?.({ ...filters, status: e.target.value })}
              >
                <option value="">All statuses</option>
                <option value="unpaid">Unpaid</option>
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
        )}
      </div>

      <div className="cms-btabs-content">
        {activeTab === 'invoices' && (
          <InvoicesTable
            invoices={invoices}
            metadata={metadata}
            loading={loading}
            onPageChange={onPageChange}
            onViewInvoice={onViewInvoice}
          />
        )}
        {activeTab === 'submit' && (
          <SubmitPaymentForm
            key={selectedInvoice?.id || 'no-invoice'}
            invoice={selectedInvoice}
            submitting={submitting}
            onCancel={handleCancelSubmit}
            onSubmit={onSubmitReceipt}
          />
        )}
      </div>
    </div>
  );
}
