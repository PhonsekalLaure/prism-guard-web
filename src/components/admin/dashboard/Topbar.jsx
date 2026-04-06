import { FaDownload, FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function Topbar() {
  const { toggleSidebar } = useOutletContext();
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <h2>Dashboard</h2>
        </div>
        <div className="topbar-actions">
          <button className="btn-export">
            <FaDownload />
            Export Backup
          </button>
        </div>
      </div>
    </header>
  );
}
