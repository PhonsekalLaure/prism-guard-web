import { useState, useEffect } from 'react';
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
      label: 'Total Employees',
      value: stats.totalEmployees,
      valueColor: '#093269',
      borderColor: '#093269',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      valueColor: '#e6b215',
      borderColor: '#e6b215',
    },
    {
      label: 'Active On Duty',
      value: stats.activeOnDuty,
      valueColor: '#16a34a',
      borderColor: '#16a34a',
    },
    {
      label: 'Expiring Contracts',
      value: stats.expiringContracts,
      valueColor: '#f97316',
      borderColor: '#f97316',
    },
  ];

  return (
    <div className="stat-grid">
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
