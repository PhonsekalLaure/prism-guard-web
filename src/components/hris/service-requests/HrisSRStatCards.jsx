export default function HrisSRStatCards({ stats }) {
  const cards = [
    { label: 'Open',        value: stats?.open ?? 0,        valueColor: '#2563eb', borderColor: '#3b82f6', sub: 'Awaiting response' },
    { label: 'In Progress', value: stats?.in_progress ?? 0, valueColor: '#e6b215', borderColor: '#e6b215', sub: 'Being processed' },
    { label: 'Resolved',    value: stats?.resolved ?? 0,    valueColor: '#16a34a', borderColor: '#16a34a', sub: 'Completed requests' },
    { label: 'Emergency',   value: stats?.emergency ?? 0,   valueColor: '#ef4444', borderColor: '#ef4444', sub: 'Immediate action' },
    { label: 'Total',       value: stats?.total ?? 0,       valueColor: '#4b5563', borderColor: '#9ca3af', sub: 'All time' },
  ];

  return (
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {cards.map((s) => (
        <div key={s.label} className="stat-card" style={{ borderLeftColor: s.borderColor }}>
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
            <p style={{ fontSize: '0.72rem', color: '#9ca3af', margin: '0.2rem 0 0' }}>{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
