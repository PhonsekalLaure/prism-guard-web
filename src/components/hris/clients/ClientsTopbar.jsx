import { FaBuilding } from 'react-icons/fa';

export default function ClientsTopbar({ onAddClient }) {
  return (
    <header className="dashboard-topbar clients-topbar">
      <div className="topbar-inner">
        <div>
          <h2>Client Management</h2>
          <p className="subtitle">Manage client accounts and service contracts</p>
        </div>
        <button className="btn-add-client" onClick={onAddClient}>
          <FaBuilding />
          Add New Client
        </button>
      </div>
    </header>
  );
}
