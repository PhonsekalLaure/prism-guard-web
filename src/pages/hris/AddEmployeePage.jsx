import { useNavigate, useOutletContext } from 'react-router-dom';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import AddEmployeeModal from '@hris-components/employees/AddEmployeeModal';

export default function AddEmployeePage() {
  const navigate          = useNavigate();
  const { toggleSidebar } = useOutletContext();

  return (
    <>
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/employees')}>
              <FaArrowLeft /> Back to Employees
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ep-page-body">
        <AddEmployeeModal
          isOpen={true}
          onClose={() => navigate('/employees')}
          onSaved={() => navigate('/employees')}
          pageMode
        />
      </div>
    </>
  );
}
