import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function ApplicantsTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar applicants-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Applicant Tracking</h2>
            <p className="subtitle">Manage recruitment and hiring workflow</p>
          </div>
        </div>
      </div>
    </header>
  );
}
