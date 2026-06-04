import { FaBars } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

export default function HrisServiceReviewsTopbar() {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="dashboard-topbar">
      <div className="topbar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button className="mobile-toggle" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div>
            <h2>Service Reviews</h2>
            <p className="subtitle">Review and moderate client feedback submissions</p>
          </div>
        </div>
      </div>
    </header>
  );
}
