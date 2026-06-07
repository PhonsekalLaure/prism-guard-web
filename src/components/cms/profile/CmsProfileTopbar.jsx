import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function CmsProfileTopbar() {
  return (
    <header className="dashboard-topbar profile-topbar">
      <div className="topbar-inner">
        <div className="cms-topbar-title-row">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Company Profile</h2>
            <p className="subtitle">View and manage your company information</p>
          </div>
        </div>
      </div>
    </header>
  );
}
