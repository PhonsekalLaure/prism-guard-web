import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisAnnouncementsTopbar() {
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <header className="an-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="an-title-group">
          <div>
            <h2>Announcements</h2>
            <p>Broadcast one-way updates to clients and guards</p>
          </div>
        </div>
      </div>
    </header>
  );
}
