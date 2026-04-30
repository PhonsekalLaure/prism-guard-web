import { FaDownload } from 'react-icons/fa';

export default function HrisIncidentsTopbar() {
  return (
    <header className="ir-topbar">
      <div className="ir-title-group">
        <h2>Incident Report Management</h2>
        <p>NLP-Enhanced incident monitoring and analysis</p>
      </div>
      <button className="ir-export-btn">
        <FaDownload /> Export Report
      </button>
    </header>
  );
}
