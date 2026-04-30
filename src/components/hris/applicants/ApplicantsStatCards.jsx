const stats = [
  { label: 'Total Applicants', value: '47', valueColor: '#093269', borderColor: '#093269' },
  { label: 'Pending Review',   value: '18', valueColor: '#d97706', borderColor: '#eab308' },
  { label: 'Rejected',         value: '9',  valueColor: '#ef4444', borderColor: '#ef4444' },
  { label: 'Hired',            value: '8',  valueColor: '#16a34a', borderColor: '#16a34a' },
  { label: 'For Interview',    value: '8',  valueColor: '#2563eb', borderColor: '#3b82f6' },
];

export default function ApplicantsStatCards() {
  return (
    <div className="stat-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
      {stats.map((s) => (
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
