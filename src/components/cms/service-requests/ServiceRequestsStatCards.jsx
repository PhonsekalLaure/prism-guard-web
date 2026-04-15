const stats = [
  {
    label: 'Open',
    value: '5',
    sub: 'Awaiting response',
    valueColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  {
    label: 'In Progress',
    value: '3',
    sub: 'Being processed',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
  },
  {
    label: 'Resolved',
    value: '28',
    sub: 'This month',
    valueColor: '#16a34a',
    borderColor: '#16a34a',
  },
];

export default function ServiceRequestsStatCards() {
  return (
    <div className="stat-grid three-cols">
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