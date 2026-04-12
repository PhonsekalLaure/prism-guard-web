import { FaBars, FaUserPlus } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function EmployeesTopbar({ onAddEmployee }) {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar employees-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Employee Management</h2>
            <p className="subtitle">Manage security personnel records and information</p>
          </div>
        </div>
        <button className="btn-add-employee" onClick={onAddEmployee}>
          <FaUserPlus />
          Add New Employee
        </button>
      </div>
    </header>
  );
}
