import ClientsTopbar from '@/components/hris/clients/ClientsTopbar';
import ClientsFilterBar from '@/components/hris/clients/ClientsFilterBar';
import ClientsGrid from '@/components/hris/clients/ClientsGrid';
import '@styles/Clients.css';

export default function ClientsPage() {
  return (
    <>
      <ClientsTopbar />

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
    </>
  );
}
