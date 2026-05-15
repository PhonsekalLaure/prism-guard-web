import { FaBullhorn } from 'react-icons/fa';

export default function AnnouncementsTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div className="ann-topbar-left">
          <div className="ann-topbar-icon">
            <FaBullhorn />
          </div>
          <div>
            <h2>Announcements</h2>
            <p className="subtitle">Stay updated with the latest announcements from Prism Guard</p>
          </div>
        </div>
      </div>
    </header>
  );
}
