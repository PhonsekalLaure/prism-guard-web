const statConfig = [
  {
    key: 'totalDeployed',
    label: 'Total Deployed',
    sub: 'Across All Sites',
    valueColor: '#093269',
    borderColor: '#093269',
  },
  {
    key: 'onDuty',
    label: 'On Duty',
    sub: 'Active Now',
    valueColor: '#16a34a',
    subColor: '#16a34a',
    borderColor: '#16a34a',
  },
  {
    key: 'onLeave',
    label: 'On Leave',
    sub: 'Returning soon',
    valueColor: '#ca8a04',
    borderColor: '#ca8a04',
  },
  {
    key: 'tempReplaced',
    label: 'Temporarily Replaced',
    sub: 'Replacement assigned',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
  },
];

export default function DeployedGuardsStatCards({ stats, loading }) {
  return (
    <div className="stat-grid">
      {statConfig.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>
              {loading || stats === null ? '—' : (stats[s.key] ?? '—')}
            </h3>
            <p className="stat-sub" style={{ color: s.subColor || '#7f8c8d' }}>{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}