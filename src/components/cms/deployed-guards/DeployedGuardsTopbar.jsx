import { FaFilePdf, FaPrint } from 'react-icons/fa';

export default function DeployedGuardsTopbar() {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div>
          <h2>Deployed Guards</h2>
          <p className="subtitle">View and manage your assigned security personnel</p>
        </div>
        <div className="dg-topbar-actions">
          <button className="dg-btn-export">
            <FaFilePdf />
            Export PDF
          </button>
          <button className="dg-btn-print">
            <FaPrint />
            Print View
          </button>
        </div>
      </div>
    </header>
  );
}