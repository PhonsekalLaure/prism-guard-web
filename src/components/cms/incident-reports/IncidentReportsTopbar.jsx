import { FaExclamationTriangle } from 'react-icons/fa';

export default function IncidentReportsTopbar() {
  return (
    <header className="cir-topbar">
      <div className="cir-topbar-inner">
        <div className="cir-title-group">
          <div className="cir-title-icon-wrap">
            <FaExclamationTriangle />
          </div>
          <div className="cir-title-text">
            <h2>Incident Reports</h2>
            <p>View reported incidents across your assigned sites</p>
          </div>
        </div>
      </div>
    </header>
  );
}