import { useState, useEffect } from 'react';
import clientService from '@services/hris/clientService';

export default function ClientsStatCards({ refreshKey = 0 }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeContracts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await clientService.getClientStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch client stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [refreshKey]);

  const statConfig = [
    {
      label: 'Total Clients',
      value: stats.totalClients,
      valueColor: '#093269',
      borderColor: '#093269',
    },
    {
      label: 'Active Contracts',
      value: stats.activeContracts,
      valueColor: '#e6b215',
      borderColor: '#e6b215',
    },
  ];

  return (
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
      {statConfig.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          {loading ? (
            <div className="animate-pulse h-16 bg-gray-100 rounded"></div>
          ) : (
            <div>
              <p className="stat-label">{s.label}</p>
              <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
