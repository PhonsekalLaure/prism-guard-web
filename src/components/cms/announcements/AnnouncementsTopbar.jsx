import { FaPlus } from 'react-icons/fa';
import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function AnnouncementsTopbar({ onCreateClick }) {
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

        <button
          id="create-announcement-btn"
          className="ann-create-btn"
          onClick={onCreateClick}
          aria-label="Create new announcement"
        >
          <FaPlus />
          Create Announcement
        </button>
      </div>
    </header>
  );
}
