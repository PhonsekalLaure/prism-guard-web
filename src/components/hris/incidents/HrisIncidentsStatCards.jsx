import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';

const CARDS = [
  {
    label: 'High Priority',
    sub: 'Needs immediate review',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    Icon: FaExclamationTriangle,
    key: 'high',
    delay: '0s',
  },
  {
    label: 'Medium Priority',
    sub: 'Supervisor review',
    valueColor: '#d97706',
    borderColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    iconColor: '#d97706',
    Icon: FaExclamationCircle,
    key: 'medium',
    delay: '0.07s',
  },
  {
    label: 'Low Priority',
    sub: 'Routine reports',
    valueColor: '#4b5563',
    borderColor: '#6b7280',
    iconBg: 'rgba(107, 114, 128, 0.12)',
    iconColor: '#4b5563',
    Icon: FaInfoCircle,
    key: 'low',
    delay: '0.14s',
  },
  {
    label: 'Resolved',
    sub: null, // derived from stats.pending
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    Icon: FaCheckCircle,
    key: 'resolved',
    delay: '0.21s',
  },
];

export default function HrisIncidentsStatCards({ stats = {}, loading = false }) {
  if (loading) {
    return (
      <div className="ir-stat-grid">
        {CARDS.map((_, i) => (
          <div
            key={i}
            className="ir-stat-card ir-stat-card-skeleton"
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            <div className="ir-stat-left">
              <div className="ir-skeleton" style={{ height: '0.7rem', width: '70%', marginBottom: '0.55rem' }} />
              <div className="ir-skeleton" style={{ height: '2rem', width: '45%', marginBottom: '0.4rem' }} />
              <div className="ir-skeleton" style={{ height: '0.6rem', width: '85%' }} />
            </div>
            <div className="ir-skeleton ir-stat-icon-wrap" style={{ background: '#e9ecef', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="ir-stat-grid">
      {CARDS.map((s, i) => (
        <div
          key={i}
          className="ir-stat-card"
          style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
        >
          <div className="ir-stat-left">
            <p className="ir-stat-label">{s.label}</p>
            <p className="ir-stat-value" style={{ color: s.valueColor }}>
              {stats[s.key] ?? 0}
            </p>
            <p className="ir-stat-sub">
              {s.key === 'resolved'
                ? `${stats.pending ?? 0} pending review`
                : s.sub}
            </p>
          </div>
          <div
            className="ir-stat-icon-wrap"
            style={{ background: s.iconBg, color: s.iconColor }}
          >
            <s.Icon />
          </div>
        </div>
      ))}
    </div>
  );
}
