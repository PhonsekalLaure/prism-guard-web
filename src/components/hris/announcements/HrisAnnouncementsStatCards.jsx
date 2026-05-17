import { FaBullhorn, FaCheckCircle, FaBuilding, FaShieldAlt } from 'react-icons/fa';

const CARD_META = [
  {
    label: 'Total',
    sub: 'All announcements',
    valueColor: '#093269',
    borderColor: '#093269',
    iconBg: 'rgba(9,50,105,0.1)',
    iconColor: '#093269',
    Icon: FaBullhorn,
    delay: '0s',
    statKey: 'total',
  },
  {
    label: 'Active',
    sub: 'Currently visible',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    iconBg: 'rgba(34,197,94,0.1)',
    iconColor: '#16a34a',
    Icon: FaCheckCircle,
    delay: '0.06s',
    statKey: 'active',
  },
  {
    label: 'Client-Targeted',
    sub: 'All client broadcasts',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    iconBg: 'rgba(59,130,246,0.1)',
    iconColor: '#2563eb',
    Icon: FaBuilding,
    delay: '0.12s',
    statKey: 'clients',
  },
  {
    label: 'Guard-Targeted',
    sub: 'All guard broadcasts',
    valueColor: '#b45309',
    borderColor: '#e6b215',
    iconBg: 'rgba(230,178,21,0.12)',
    iconColor: '#b45309',
    Icon: FaShieldAlt,
    delay: '0.18s',
    statKey: 'employees',
  },
];

function SkeletonCard({ delay }) {
  return (
    <div className="an-stat-card an-stat-skeleton" style={{ animationDelay: delay }}>
      <div className="an-stat-left">
        <div className="an-skel an-skel-label" />
        <div className="an-skel an-skel-value" />
        <div className="an-skel an-skel-sub" />
      </div>
      <div className="an-skel an-skel-icon" />
    </div>
  );
}

export default function HrisAnnouncementsStatCards({ stats, loading }) {
  if (loading || !stats) {
    return (
      <div className="an-stat-grid">
        {CARD_META.map((s) => (
          <SkeletonCard key={s.label} delay={s.delay} />
        ))}
      </div>
    );
  }

  return (
    <div className="an-stat-grid">
      {CARD_META.map((s) => {
        const { Icon } = s;
        const value = stats[s.statKey] ?? 0;
        return (
          <div
            key={s.label}
            className="an-stat-card"
            style={{ borderLeftColor: s.borderColor, animationDelay: s.delay }}
          >
            <div className="an-stat-left">
              <p className="an-stat-label">{s.label}</p>
              <p className="an-stat-value" style={{ color: s.valueColor }}>{value}</p>
              <p className="an-stat-sub">{s.sub}</p>
            </div>
            <div
              className="an-stat-icon-wrap"
              style={{ background: s.iconBg, color: s.iconColor }}
            >
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
}
