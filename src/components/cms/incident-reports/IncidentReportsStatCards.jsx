export default function IncidentReportsStatCards({ stats = {}, loading = false }) {
  const cards = [
    {
      label: 'Total Incidents',
      value: stats.total ?? 0,
      sub: 'Reviewed reports',
      valueColor: '#093269',
      borderColor: '#093269',
    },
    {
      label: 'High Priority',
      value: stats.high ?? 0,
      sub: 'Approved for client view',
      valueColor: '#dc2626',
      borderColor: '#ef4444',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingRequests ?? 0,
      sub: 'Awaiting operations review',
      valueColor: '#ca8a04',
      borderColor: '#eab308',
    },
    {
      label: 'Released Reports',
      value: stats.sentRequests ?? 0,
      sub: 'Full reports completed',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>
              {loading ? '...' : s.value}
            </h3>
            <p className="stat-sub">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
