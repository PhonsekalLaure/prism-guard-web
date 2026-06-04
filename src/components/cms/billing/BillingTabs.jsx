import { useState } from 'react';
import { FaFileInvoice, FaHistory, FaUpload } from 'react-icons/fa';
import InvoicesTable from './InvoicesTable';
import PaymentHistory from './PaymentHistory';
import SubmitPaymentForm from './SubmitPaymentForm';

const TABS = [
  { key: 'invoices', label: 'Invoices', icon: FaFileInvoice },
  { key: 'history', label: 'Payment History', icon: FaHistory },
  { key: 'submit', label: 'Submit Payment', icon: FaUpload },
];

export default function BillingTabs() {
  const [activeTab, setActiveTab] = useState('invoices');

  return (
    <div className="cms-btabs-panel">
      {/* Tab Bar */}
      <div className="cms-btabs-bar">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={`cms-btab-btn${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon className="cms-btab-icon" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="cms-btabs-content">
        {activeTab === 'invoices' && (
          <InvoicesTable onSwitchToSubmit={() => setActiveTab('submit')} />
        )}
        {activeTab === 'history' && <PaymentHistory />}
        {activeTab === 'submit' && (
          <SubmitPaymentForm onCancel={() => setActiveTab('invoices')} />
        )}
      </div>
    </div>
  );
}