import { FaPlus } from 'react-icons/fa';
import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

export default function ServiceRequestsTopbar({ onNewRequest }) {
  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div className="cms-topbar-title-row">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Service Requests</h2>
            <p className="subtitle">Submit and track your service inquiries</p>
          </div>
        </div>
        <div className="topbar-actions">
          <button className="sr-btn-new" onClick={onNewRequest}>
            <FaPlus />
            New Request
          </button>
        </div>
      </div>
    </header>
  );
}
