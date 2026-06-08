import { FaBars, FaDownload } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisCashAdvanceTopbar() {
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <header className="ca-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="ca-title-group">
          <h2>Cash Advance Requests (Bale)</h2>
          <p>Receive and review employee cash advance request applications</p>
        </div>
      </div>
      <button className="ca-export-btn">
        <FaDownload /> Export Report
      </button>
    </header>
  );
}
