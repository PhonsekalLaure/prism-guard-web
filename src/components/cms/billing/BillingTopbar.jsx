import { FaDownload } from 'react-icons/fa';

export default function BillingTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div>
          <h2>Billing &amp; Payments</h2>
          <p className="subtitle">Manage invoices, payments, and billing history</p>
        </div>
      </div>
    </header>
  );
}