const stats = [
  {
    label: 'Total',
    value: '24',
    sub: 'All announcements',
    valueColor: '#093269',
    borderColor: '#093269',
    delay: '0s',
  },
  {
    label: 'Active',
    value: '6',
    sub: 'Currently visible',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    delay: '0.05s',
  },
  {
    label: 'Sent to Clients',
    value: '10',
    sub: 'Client-facing',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    delay: '0.1s',
  },
  {
    label: 'Sent to Guards',
    value: '14',
    sub: 'Guard-facing',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    delay: '0.15s',
  },
];

export default function HrisAnnouncementsStatCards() {
  return (
    <div className="an-stat-grid">
      {stats.map((s, i) => (
        <div
          key={i}
          className="an-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <p className="an-stat-label">{s.label}</p>
          <p className="an-stat-value" style={{ color: s.valueColor }}>{s.value}</p>
          <p className="an-stat-sub">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
