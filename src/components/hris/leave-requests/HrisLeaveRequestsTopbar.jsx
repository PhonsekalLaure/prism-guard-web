import { FaDownload } from 'react-icons/fa';

export default function HrisLeaveRequestsTopbar() {
  return (
    <header className="hlr-topbar">
      <div className="hlr-title-group">
        <h2>Leave Request Management</h2>
        <p>Review and process employee leave applications</p>
      </div>
      <div>
        <button className="hlr-export-btn">
          <FaDownload /> Export Report
        </button>
      </div>
    </header>
  );
}
