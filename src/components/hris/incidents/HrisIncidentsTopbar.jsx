import { FaBars, FaDownload, FaExclamationTriangle } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisIncidentsTopbar() {
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <header className="ir-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="ir-title-group">
          <div className="ir-title-icon-wrap">
            <FaExclamationTriangle />
          </div>
          <div className="ir-title-text">
            <h2>Incident Report Management</h2>
            <p>NLP-Enhanced incident monitoring and analysis</p>
          </div>
        </div>
      </div>
      <button className="ir-export-btn">
        <FaDownload /> Export Report
      </button>
    </header>
  );
}
