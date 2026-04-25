import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function CmsProfileTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar profile-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Company Profile</h2>
            <p className="subtitle">View and manage your company information</p>
          </div>
        </div>
      </div>
    </header>
  );
}