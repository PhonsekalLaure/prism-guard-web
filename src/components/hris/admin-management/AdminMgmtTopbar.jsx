import { FaBars, FaUserPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function AdminMgmtTopbar({ onCreateAdmin }) {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar admin-mgmt-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Admin &amp; User Management</h2>
            <p className="subtitle">Manage system administrators and access control</p>
          </div>
        </div>
        <button className="btn-create-admin" onClick={onCreateAdmin}>
          <FaUserPlus />
          Create New Admin
        </button>
      </div>
    </header>
  );
}
