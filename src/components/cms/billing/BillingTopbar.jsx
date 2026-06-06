import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function BillingTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div className="cms-topbar-title-row">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Billing &amp; Payments</h2>
            <p className="subtitle">Manage invoices and payment receipts</p>
          </div>
        </div>
      </div>
    </header>
  );
}
