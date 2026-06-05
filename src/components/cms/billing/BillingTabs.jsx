import { useState } from 'react';
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
  selectedInvoice,
  submitting,
  onPageChange,
  onHistoryPageChange,
  onSelectInvoice,
  onSubmitReceipt,
  onViewReceipt,
  onViewPdf,
}) {
  const [activeTab, setActiveTab] = useState('invoices');

  const handlePay = (invoice) => {
    onSelectInvoice?.(invoice);
    setActiveTab('submit');
  };

  const handleCancelSubmit = () => {
    onSelectInvoice?.(null);
    setActiveTab('invoices');
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
              onClick={() => setActiveTab(tab.key)}
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
            loading={loading}
            onPageChange={onPageChange}
            onPay={handlePay}
            onViewReceipt={onViewReceipt}
            onViewPdf={onViewPdf}
          />
        )}
        {activeTab === 'history' && (
          <PaymentHistory
            history={paymentHistory}
            metadata={historyMetadata}
            loading={historyLoading}
            onPageChange={onHistoryPageChange}
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
