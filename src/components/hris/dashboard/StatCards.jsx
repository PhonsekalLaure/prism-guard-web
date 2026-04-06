import { FaFingerprint, FaClock, FaUserTimes } from 'react-icons/fa';

const stats = [
  {
    label: 'Total Clock-ins',
    value: '126',
    sub: "Today's count",
    valueColor: '#093269',
    icon: FaFingerprint,
    iconColor: '#093269',
    borderColor: '#093269',
  },
  {
    label: 'Overtime Logs',
    value: '25',
    sub: "Today's count",
    valueColor: '#e6b215',
    icon: FaClock,
    iconColor: '#e6b215',
    borderColor: '#e6b215',
  },
  {
    label: 'Total Absences',
    value: '3',
    sub: "Today's count",
    valueColor: '#ef4444',
    icon: FaUserTimes,
    iconColor: '#ef4444',
    borderColor: '#ef4444',
  },
];

export default function StatCards() {
  return (
    <div className="stat-grid three-cols">
      {stats.map((s) => (
        <div
          key={s.label}
          className="stat-card"
          style={{ borderLeftColor: s.borderColor }}
        >
          <div>
            <p className="stat-label">{s.label}</p>
            <h3 className="stat-value" style={{ color: s.valueColor }}>{s.value}</h3>
            <p className="stat-sub" style={{ color: '#7f8c8d' }}>{s.sub}</p>
          </div>
          <div
            className="stat-icon"
            style={{ background: `${s.iconColor}15`, color: s.iconColor }}
          >
            <s.icon />
          </div>
        </div>
      ))}
    </div>
  );
}
