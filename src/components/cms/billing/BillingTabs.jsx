import { FaFileInvoice, FaHistory, FaUpload } from 'react-icons/fa';
import InvoicesTable from './InvoicesTable';
import PaymentHistory from './PaymentHistory';
import SubmitPaymentForm from './SubmitPaymentForm';

const TABS = [
  { key: 'invoices', label: 'Invoices', icon: FaFileInvoice },
  { key: 'history', label: 'Payment History', icon: FaHistory },
  { key: 'submit', label: 'Submit Receipt', icon: FaUpload },
];

export default function BillingTabs({
  invoices,
  metadata,
  paymentHistory,
  historyMetadata,
  loading,
  historyLoading,
  activeTab = 'invoices',
  filters,
  selectedInvoice,
  submitting,
  onTabChange,
  onFilterChange,
  onPageChange,
  onHistoryPageChange,
  onSelectInvoice,
  onSubmitReceipt,
  onViewInvoice,
  onViewReceipt,
  onDownloadReceipt,
}) {
  const handleCancelSubmit = () => {
    onSelectInvoice?.(null);
    onTabChange?.('invoices');
  };

  return (
    <div className="cms-btabs-panel">
      <div className="cms-btabs-bar">
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

      <div className="cms-btabs-content">
        {activeTab === 'invoices' && (
          <InvoicesTable
            invoices={invoices}
            metadata={metadata}
            filters={filters}
            loading={loading}
            onPageChange={onPageChange}
            onFilterChange={onFilterChange}
            onViewInvoice={onViewInvoice}
          />
        )}
        {activeTab === 'history' && (
          <PaymentHistory
            history={paymentHistory}
            metadata={historyMetadata}
            loading={historyLoading}
            onPageChange={onHistoryPageChange}
            onViewReceipt={onViewReceipt}
            onDownloadReceipt={onDownloadReceipt}
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
