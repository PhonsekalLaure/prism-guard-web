import { FaBars, FaFileInvoice } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function BillingTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar billing-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Billing &amp; Payments</h2>
            <p className="subtitle">Track client payment statuses and billing records</p>
          </div>
        </div>

        <div className="billing-topbar-actions">
          <select className="billing-period-select">
            <option>Current Period: Feb 1-15, 2026</option>
            <option>Jan 1-31, 2026</option>
            <option>Dec 1-31, 2025</option>
            <option>Nov 1-30, 2025</option>
          </select>
          <button className="btn-generate-soa">
            <FaFileInvoice />
            Generate all Invoice
          </button>
        </div>
      </div>
    </header>
  );
}
