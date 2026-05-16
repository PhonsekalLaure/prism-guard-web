import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisSRTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Client Service Requests</h2>
            <p className="subtitle">Manage and respond to client service inquiries</p>
          </div>
        </div>
      </div>
    </header>
  );
}
