import { FaPlus } from 'react-icons/fa';

export default function ServiceRequestsTopbar({ onNewRequest }) {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div>
          <h2>Service Requests</h2>
          <p className="subtitle">Submit and track your service inquiries</p>
        </div>
        <div className="sr-topbar-actions">
          <button className="sr-btn-new" onClick={onNewRequest}>
            <FaPlus />
            New Request
          </button>
        </div>
      </div>
    </header>
  );
}