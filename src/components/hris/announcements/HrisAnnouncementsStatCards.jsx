function buildStats(stats) {
  const safeStats = stats || {};

  return [
    {
      label: 'Total',
      value: safeStats.total ?? 0,
      sub: 'All announcements',
      valueColor: '#093269',
      borderColor: '#093269',
      delay: '0s',
    },
    {
      label: 'Active',
      value: safeStats.active ?? 0,
      sub: 'Currently visible',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
      delay: '0.05s',
    },
    {
      label: 'Sent to Clients',
      value: safeStats.clients ?? 0,
      sub: 'Client-facing',
      valueColor: '#2563eb',
      borderColor: '#3b82f6',
      delay: '0.1s',
    },
    {
      label: 'Sent to Guards',
      value: safeStats.employees ?? 0,
      sub: 'Guard-facing',
      valueColor: '#e6b215',
      borderColor: '#e6b215',
      delay: '0.15s',
    },
  ];
}

export default function HrisAnnouncementsStatCards({ stats }) {
  const cards = buildStats(stats);

  return (
    <div className="an-stat-grid">
      {cards.map((s, i) => (
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
