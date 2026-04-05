import { FaDownload } from 'react-icons/fa';

export default function Topbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div>
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
