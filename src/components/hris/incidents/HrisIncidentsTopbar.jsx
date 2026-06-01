import { FaDownload, FaExclamationTriangle } from 'react-icons/fa';

export default function HrisIncidentsTopbar() {
  return (
    <header className="ir-topbar">
      <div className="ir-title-group">
        <div className="ir-title-icon-wrap">
          <FaExclamationTriangle />
        </div>
        <div className="ir-title-text">
          <h2>Incident Report Management</h2>
          <p>NLP-Enhanced incident monitoring and analysis</p>
        </div>
      </div>
      <button className="ir-export-btn">
        <FaDownload /> Export Report
      </button>
    </header>
  );
}
