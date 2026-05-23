const stats = [
  {
    label: 'Total Employees',
    value: '126',
    sub: 'Active payroll',
    subClass: '',
    valueColor: '#093269',
    borderColor: '#093269',
    delay: '0s',
  },
  {
    label: 'Total Payroll',
    value: '₱452,100',
    sub: 'Gross amount',
    subClass: 'green',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    delay: '0.05s',
  },
  {
    label: 'Total Deductions',
    value: '₱78,450',
    sub: 'Tax + Contributions',
    subClass: '',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.1s',
  },
  {
    label: 'Net Payout',
    value: '₱373,650',
    sub: 'Next pay: Feb 25',
    subClass: '',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    delay: '0.15s',
  },
];

export default function HrisPayrollStatCards() {
  return (
    <div className="pr-stat-grid">
      {stats.map((s, i) => (
        <div
          key={i}
          className="pr-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <p className="pr-stat-label">{s.label}</p>
          <p className="pr-stat-value" style={{ color: s.valueColor }}>{s.value}</p>
          <p className={`pr-stat-sub ${s.subClass}`}>{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
