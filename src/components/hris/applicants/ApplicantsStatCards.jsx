export default function ApplicantsStatCards({ stats = {} }) {
  const cards = [
    { label: 'Total Applicants', value: stats.total || 0, valueColor: '#093269', borderColor: '#093269' },
    { label: 'Pending Review', value: stats.pending || 0, valueColor: '#d97706', borderColor: '#eab308' },
    { label: 'Rejected', value: stats.rejected || 0, valueColor: '#ef4444', borderColor: '#ef4444' },
    { label: 'Hired', value: stats.hired || 0, valueColor: '#16a34a', borderColor: '#16a34a' },
    { label: 'For Interview', value: stats.interview || 0, valueColor: '#2563eb', borderColor: '#3b82f6' },
  ];

  return (
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {cards.map((s) => (
        <div key={s.label} className="stat-card" style={{ borderLeftColor: s.borderColor }}>
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
