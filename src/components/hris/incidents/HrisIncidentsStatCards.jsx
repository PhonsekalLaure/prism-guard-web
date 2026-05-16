const stats = [
  {
    label: 'High Priority',
    value: '8',
    sub: 'This month',
    subClass: 'red',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0s',
  },
  {
    label: 'Medium Priority',
    value: '15',
    sub: 'Under review',
    subClass: '',
    valueColor: '#d97706',
    borderColor: '#f59e0b',
    delay: '0.05s',
  },
  {
    label: 'Low Priority',
    value: '23',
    sub: 'Routine reports',
    subClass: '',
    valueColor: '#4b5563',
    borderColor: '#6b7280',
    delay: '0.1s',
  },
  {
    label: 'Resolved',
    value: '143',
    sub: 'This month',
    subClass: '',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    delay: '0.15s',
  },
];

export default function HrisIncidentsStatCards() {
  return (
    <div className="ir-stat-grid">
      {stats.map((s, i) => (
        <div
          key={i}
          className="ir-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <p className="ir-stat-label">{s.label}</p>
          <p className="ir-stat-value" style={{ color: s.valueColor }}>{s.value}</p>
          <p className={`ir-stat-sub ${s.subClass}`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
