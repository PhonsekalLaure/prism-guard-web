import { useState } from 'react';
import ClientsTopbar from '@hris-components/clients/ClientsTopbar';
import ClientsFilterBar from '@hris-components/clients/ClientsFilterBar';
import ClientsGrid from '@hris-components/clients/ClientsGrid';
import AddClientModal from '@hris-components/clients/AddClientModal';
import '@styles/hris/StatCard.css';


export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  return (
    <>
      <ClientsTopbar onAddClient={() => setIsAddClientOpen(true)} />

      <div className="dashboard-content">
        {/* Summary stats */}
        <div className="stat-grid two-cols">
          <div className="stat-card" style={{ borderLeftColor: '#093269' }}>
            <div>
              <p className="stat-label">Total Clients</p>
              <h3 className="stat-value" style={{ color: '#093269' }}>126</h3>
              <p className="stat-sub" style={{ opacity: 0 }}>Spacer</p>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#e6b215' }}>
            <div>
              <p className="stat-label">Total Guards Deployed</p>
              <h3 className="stat-value" style={{ color: '#e6b215' }}>118</h3>
              <p className="stat-sub" style={{ opacity: 0 }}>Spacer</p>
            </div>
          </div>
        </div>

        <ClientsFilterBar />
        <ClientsGrid />
      </div>

      <AddClientModal 
        isOpen={isAddClientOpen} 
        onClose={() => setIsAddClientOpen(false)} 
      />
    </>
  );
}
