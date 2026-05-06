const STAT_CONFIGS = [
  {
    key: 'open',
    label: 'Open',
    sub: 'Awaiting response',
    valueColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    sub: 'Being processed',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    sub: 'This month',
    valueColor: '#16a34a',
    borderColor: '#16a34a',
  },
];

export default function ServiceRequestsStatCards({ stats, loading }) {
  return (
    <div className="stat-grid three-cols">
      {STAT_CONFIGS.map((s) => (
        <div
          key={s.key}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor, opacity: loading ? 0.6 : 1, transition: 'opacity 0.3s' }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>
              {loading ? '…' : (stats?.[s.key] ?? 0)}
            </h3>
            <p className="stat-sub">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}