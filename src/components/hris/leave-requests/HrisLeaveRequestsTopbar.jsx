import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisLeaveRequestsTopbar() {
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <header className="hlr-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="hlr-title-group">
          <div className="hlr-title-text">
            <h2>Leave Request Management</h2>
            <p>Review and process employee leave applications</p>
          </div>
        </div>
      </div>
    </header>
  );
}
