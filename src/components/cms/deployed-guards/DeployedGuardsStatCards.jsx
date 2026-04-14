const stats = [
  {
    label: 'Total Deployed',
    value: '24',
    sub: 'Across All Sites',
    valueColor: '#093269',
    borderColor: '#093269',
  },
  {
    label: 'On Duty',
    value: '20',
    sub: 'Active Now',
    valueColor: '#16a34a',
    subColor: '#16a34a',
    borderColor: '#16a34a',
  },
  {
    label: 'On Leave',
    value: '3',
    sub: 'Returning soon',
    valueColor: '#ca8a04',
    borderColor: '#ca8a04',
  },
  {
    label: 'Temporarily Replaced',
    value: '1',
    sub: 'Replacement assigned',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
  },
];

export default function DeployedGuardsStatCards() {
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
            <p className="stat-sub" style={{ color: s.subColor || '#7f8c8d' }}>{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}