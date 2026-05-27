import { useState, useEffect } from 'react';
import { FaBuilding, FaCheckCircle, FaFileContract } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';
import clientService from '@services/hris/clientService';

export default function ClientsStatCards({ refreshKey = 0 }) {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeContracts: 0,
    expiringContracts: 0
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
      key: 'totalClients',
      label: 'Total Clients',
      valueColor: '#093269',
      borderColor: '#093269',
      icon: FaBuilding,
      iconBg: 'rgba(9, 50, 105, 0.1)',
      iconColor: '#093269',
    },
    {
      key: 'activeContracts',
      label: 'Active Contracts',
      valueColor: '#e6b215',
      borderColor: '#e6b215',
      icon: FaCheckCircle,
      iconBg: 'rgba(230, 178, 21, 0.12)',
      iconColor: '#b45309',
    },
    {
      key: 'expiringContracts',
      label: 'Expiring Contracts',
      valueColor: '#f97316',
      borderColor: '#f97316',
      icon: FaFileContract,
      iconBg: 'rgba(249, 115, 22, 0.12)',
      iconColor: '#f97316',
    },
  ];

  return (
    <StatCards cards={statConfig} stats={stats} loading={loading} columns={3} />
  );
}
