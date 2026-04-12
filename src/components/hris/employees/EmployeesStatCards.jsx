const stats = [
  {
    label: 'Total Employees',
    value: '126',
    valueColor: '#093269',
    borderColor: '#093269',
  },
  {
    label: 'On Leave',
    value: '5',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
  },
  {
    label: 'Absent Today',
    value: '3',
    valueColor: '#ef4444',
    borderColor: '#ef4444',
  },
  {
    label: 'Active On Duty',
    value: '118',
    valueColor: '#16a34a',
    borderColor: '#16a34a',
  },
];

export default function EmployeesStatCards() {
  return (
    <div className="stat-grid">
      {stats.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
