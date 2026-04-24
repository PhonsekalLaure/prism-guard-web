import '../../../../styles/components/StatCard.css';

export default function HrisLeaveRequestsStatCards() {
  const stats = [
    { label: 'Pending Requests', value: '12', borderColor: '#eab308' }, // yellow-500
    { label: 'Approved This Month', value: '28', borderColor: '#22c55e' }, // green-500
    { label: 'Rejected', value: '3', borderColor: '#ef4444' }, // red-500
    { label: 'Needs Revision', value: '2', borderColor: '#3b82f6' } // blue-500
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
      {stats.map((stat, i) => (
        <div key={i} className="stat-card" style={{ borderLeft: `4px solid ${stat.borderColor}` }}>
          <div className="stat-info">
            <span className="stat-label" style={{ fontSize: '0.75rem' }}>{stat.label}</span>
            <span className="stat-value" style={{ color: stat.borderColor }}>{stat.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
