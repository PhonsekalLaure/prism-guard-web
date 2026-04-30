import { FaBars, FaUserPlus } from 'react-icons/fa';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function EmployeesTopbar({ canAddEmployee = true }) {
  const { toggleSidebar } = useOutletContext();
  const navigate = useNavigate();

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
        {canAddEmployee && (
          <button className="btn-add-employee" onClick={() => navigate('/employees/new')}>
            <FaUserPlus />
            Add New Employee
          </button>
        )}
      </div>
    </header>
  );
}
