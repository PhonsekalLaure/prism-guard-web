import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function ProfileTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar profile-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>My Profile</h2>
            <p className="subtitle">Manage your account settings and preferences</p>
          </div>
        </div>
      </div>
    </header>
  );
}
