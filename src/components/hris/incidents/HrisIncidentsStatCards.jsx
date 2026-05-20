export default function HrisIncidentsStatCards({ stats = {}, loading = false }) {
  const cards = [
    {
      label: 'High Priority',
      value: stats.high ?? 0,
      sub: 'Needs immediate review',
      subClass: 'red',
      valueColor: '#dc2626',
      borderColor: '#ef4444',
      delay: '0s',
    },
    {
      label: 'Medium Priority',
      value: stats.medium ?? 0,
      sub: 'Supervisor review',
      subClass: '',
      valueColor: '#d97706',
      borderColor: '#f59e0b',
      delay: '0.05s',
    },
    {
      label: 'Low Priority',
      value: stats.low ?? 0,
      sub: 'Routine reports',
      subClass: '',
      valueColor: '#4b5563',
      borderColor: '#6b7280',
      delay: '0.1s',
    },
    {
      label: 'Resolved',
      value: stats.resolved ?? 0,
      sub: `${stats.pending ?? 0} pending review`,
      subClass: '',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
      delay: '0.15s',
    },
  ];

  return (
    <div className="ir-stat-grid">
      {cards.map((s, i) => (
        <div
          key={i}
          className="ir-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <p className="ir-stat-label">{s.label}</p>
          <p className="ir-stat-value" style={{ color: s.valueColor }}>
            {loading ? '...' : s.value}
          </p>
          <p className={`ir-stat-sub ${s.subClass}`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
