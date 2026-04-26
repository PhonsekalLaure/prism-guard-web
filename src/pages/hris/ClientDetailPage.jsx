import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import ViewClientDetail from '@hris-components/clients/ViewClientDetail';

export default function ClientDetailPage() {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const { toggleSidebar } = useOutletContext();

  return (
    <>
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/clients')}>
              <FaArrowLeft /> Back to Clients
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ep-page-body">
        <ViewClientDetail
          isOpen={true}
          client={{ id }}
          onClose={() => navigate('/clients')}
          onUpdated={() => {}}
          pageMode
        />
      </div>
    </>
  );
}
