const stats = [
  {
    label: 'Total Disbursed',
    value: '₱52,500',
    sub: 'This month',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    delay: '0s',
  },
  {
    label: 'Pending Requests',
    value: '8',
    sub: 'Awaiting review',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    delay: '0.05s',
  },
  {
    label: 'Rejected',
    value: '2',
    sub: 'This month',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.1s',
  },
  {
    label: 'Approved',
    value: '3',
    sub: 'This month',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    delay: '0.15s',
  },
];

export default function HrisCashAdvanceStatCards() {
  return (
    <div className="ca-stat-grid">
      {stats.map((s, i) => (
        <div
          key={i}
          className="ca-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <p className="ca-stat-label">{s.label}</p>
          <p className="ca-stat-value" style={{ color: s.valueColor }}>{s.value}</p>
          <p className="ca-stat-sub">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
