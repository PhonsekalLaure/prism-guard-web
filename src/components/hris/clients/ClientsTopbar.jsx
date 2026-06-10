import { FaBars, FaBuilding } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function ClientsTopbar({ onAddClient, canAddClient = true }) {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar clients-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Client Management</h2>
            <p className="subtitle">Manage client accounts and service contracts</p>
          </div>
        </div>
        {canAddClient && (
          <button className="btn-add-client" onClick={onAddClient}>
            <FaBuilding />
            Add New Client
          </button>
        )}
      </div>
    </header>
  );
}
