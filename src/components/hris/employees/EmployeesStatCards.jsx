import { useState, useEffect } from 'react';
import { FaFileContract, FaUserCheck, FaUserShield, FaUserTimes } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';
import employeeService from '@services/hris/employeeService';

export default function EmployeesStatCards({ refreshKey = 0 }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    inactive: 0,
    activeOnDuty: 0,
    expiringContracts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await employeeService.getEmployeeStats();
        setStats(data || {
          totalEmployees: 0,
          inactive: 0,
          activeOnDuty: 0,
          expiringContracts: 0
        });

      } catch (err) {
        console.error("Failed to fetch employee stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [refreshKey]);

  const statConfig = [
    {
      key: 'totalEmployees',
      label: 'Total Employees',
      valueColor: '#093269',
      borderColor: '#093269',
      icon: FaUserShield,
      iconBg: 'rgba(9, 50, 105, 0.1)',
      iconColor: '#093269',
    },
    {
      key: 'inactive',
      label: 'Inactive',
      valueColor: '#e6b215',
      borderColor: '#e6b215',
      icon: FaUserTimes,
      iconBg: 'rgba(230, 178, 21, 0.12)',
      iconColor: '#b45309',
    },
    {
      key: 'activeOnDuty',
      label: 'Active On Duty',
      valueColor: '#16a34a',
      borderColor: '#16a34a',
      icon: FaUserCheck,
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#16a34a',
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
    <StatCards cards={statConfig} stats={stats} loading={loading} />
  );
}
