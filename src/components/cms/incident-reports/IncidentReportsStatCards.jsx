const stats = [
  {
    label: 'Total Incidents',
    value: '24',
    sub: 'This quarter',
    valueColor: '#093269',
    borderColor: '#093269',
  },
  {
    label: 'Main Gate',
    value: '5',
    sub: '2 pending review',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
  },
  {
    label: 'Parking Area',
    value: '3',
    sub: '1 under investigation',
    valueColor: '#ca8a04',
    borderColor: '#eab308',
  },
  {
    label: 'Back Gate',
    value: '3',
    sub: 'All resolved',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
  },
];

export default function IncidentReportsStatCards() {
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
            <p className="stat-sub">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}