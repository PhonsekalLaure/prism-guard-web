import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function AnnouncementsTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div className="ann-topbar-left">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Announcements</h2>
            <p className="subtitle">Stay updated with the latest announcements from Prism Guard</p>
          </div>
        </div>
      </div>
    </header>
  );
}
