const stats = [
  {
    label: 'Total Due',
    value: '₱125,500',
    sub: '2 invoices overdue',
    valueColor: '#dc2626',
    subColor: '#dc2626',
    borderColor: '#ef4444',
  },
  {
    label: 'Paid This Month',
    value: '₱82,500',
    sub: 'Feb 2026',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
  },
  {
    label: 'Pending Verification',
    value: '₱43,000',
    sub: '1 payment reviewing',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
  },
  {
    label: 'Total Paid (2026)',
    value: '₱330,000',
    sub: 'Year to date',
    valueColor: '#093269',
    borderColor: '#093269',
  },
];

export default function BillingStatCards() {
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