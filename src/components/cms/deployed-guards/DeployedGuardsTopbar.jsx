import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function DeployedGuardsTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div className="cms-topbar-title-row">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Deployed Guards</h2>
            <p className="subtitle">View and manage your assigned security personnel</p>
          </div>
        </div>
      </div>
    </header>
  );
}
