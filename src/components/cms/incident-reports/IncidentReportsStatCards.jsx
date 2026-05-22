import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaHourglass,
  FaFileAlt,
} from 'react-icons/fa';

const CARDS = [
  {
    label: 'Total Incidents',
    sub: 'Reviewed reports',
    valueColor: '#093269',
    borderColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
    Icon: FaExclamationTriangle,
    key: 'total',
    delay: '0s',
  },
  {
    label: 'High Priority',
    sub: 'Approved for client view',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    Icon: FaExclamationCircle,
    key: 'high',
    delay: '0.07s',
  },
  {
    label: 'Pending Requests',
    sub: 'Awaiting operations review',
    valueColor: '#ca8a04',
    borderColor: '#eab308',
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
    Icon: FaHourglass,
    key: 'pendingRequests',
    delay: '0.14s',
  },
  {
    label: 'Released Reports',
    sub: 'Full reports completed',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    Icon: FaFileAlt,
    key: 'sentRequests',
    delay: '0.21s',
  },
];

export default function IncidentReportsStatCards({ stats = {}, loading = false }) {
  if (loading) {
    return (
      <div className="cir-stat-grid">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="cir-stat-card cir-stat-card-skeleton"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="cir-stat-left">
              <div className="cir-skeleton" style={{ height: '0.7rem', width: '70%', marginBottom: '0.55rem' }} />
              <div className="cir-skeleton" style={{ height: '2rem', width: '45%', marginBottom: '0.4rem' }} />
              <div className="cir-skeleton" style={{ height: '0.6rem', width: '85%' }} />
            </div>
            <div className="cir-skeleton cir-stat-icon-wrap" style={{ background: '#e9ecef', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="cir-stat-grid">
      {CARDS.map((s, i) => (
        <div
          key={i}
          className="cir-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <div className="cir-stat-left">
            <p className="cir-stat-label">{s.label}</p>
            <p className="cir-stat-value" style={{ color: s.valueColor }}>
              {stats[s.key] ?? 0}
            </p>
            <p className="cir-stat-sub">{s.sub}</p>
          </div>
          <div
            className="cir-stat-icon-wrap"
            style={{ background: s.iconBg, color: s.iconColor }}
          >
            <s.Icon />
          </div>
        </div>
      ))}
    </div>
  );
}
