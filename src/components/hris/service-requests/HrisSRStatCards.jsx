const stats = [
  { label: 'Open',        value: '12', valueColor: '#2563eb', borderColor: '#3b82f6', sub: 'Awaiting response' },
  { label: 'In Progress', value: '8',  valueColor: '#e6b215', borderColor: '#e6b215', sub: 'Being processed' },
  { label: 'Resolved',    value: '94', valueColor: '#16a34a', borderColor: '#16a34a', sub: 'This month' },
  { label: 'Emergency',   value: '3',  valueColor: '#ef4444', borderColor: '#ef4444', sub: 'Immediate action' },
  { label: 'Total',       value: '117',valueColor: '#4b5563', borderColor: '#9ca3af', sub: 'All time' },
];

export default function HrisSRStatCards() {
  return (
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {stats.map((s) => (
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
