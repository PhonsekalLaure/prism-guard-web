import { FaCalendarAlt, FaDownload } from 'react-icons/fa';

export default function HrisLeaveRequestsTopbar() {
  return (
    <header className="hlr-topbar">
      <div className="hlr-title-group">
        <div className="hlr-title-icon-wrap">
          <FaCalendarAlt />
        </div>
        <div className="hlr-title-text">
          <h2>Leave Request Management</h2>
          <p>Review and process employee leave applications</p>
        </div>
      </div>
      <div>
        <button className="hlr-export-btn" type="button">
          <FaDownload /> Export Report
        </button>
      </div>
    </header>
  );
}
