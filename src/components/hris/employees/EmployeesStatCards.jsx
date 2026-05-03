import { useState, useEffect } from 'react';
import employeeService from '@services/employeeService';

export default function EmployeesStatCards({ refreshKey = 0 }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    inactive: 0,
    absentToday: 0,
    activeOnDuty: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await employeeService.getEmployeeStats();
        setStats(data || {
          totalEmployees: 0,
          inactive: 0,
          absentToday: 0,
          activeOnDuty: 0
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
      label: 'Absent Today',
      value: stats.absentToday,
      valueColor: '#ef4444',
      borderColor: '#ef4444',
    },
    {
      label: 'Active On Duty',
      value: stats.activeOnDuty,
      valueColor: '#16a34a',
      borderColor: '#16a34a',
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
