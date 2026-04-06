import { useState } from 'react';
import ClientsTopbar from '@hris-components/clients/ClientsTopbar';
import ClientsFilterBar from '@hris-components/clients/ClientsFilterBar';
import ClientsGrid from '@hris-components/clients/ClientsGrid';
import AddClientModal from '@hris-components/clients/AddClientModal';


export default function ClientsPage() {
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  return (
    <>
      <ClientsTopbar onAddClient={() => setIsAddClientOpen(true)} />

      <div className="dashboard-content">
        {/* Summary stats */}
        <div className="clients-stats">
          <div className="clients-stat-card" style={{ borderLeftColor: '#093269' }}>
            <p className="cs-label">Total Clients</p>
            <p className="cs-value" style={{ color: '#093269' }}>126</p>
          </div>
          <div className="clients-stat-card" style={{ borderLeftColor: '#e6b215' }}>
            <p className="cs-label">Total Guards Deployed</p>
            <p className="cs-value" style={{ color: '#e6b215' }}>118</p>
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
