import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function buildStats(stats = {}) {
  return [
    {
      label: 'Pending Requests',
      value: stats.pending || 0,
      icon: FaHourglassHalf,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      valueColor: '#e6b215',
      borderColor: '#eab308',
      delay: '0s',
    },
    {
      label: 'Approved This Month',
      value: stats.approvedThisMonth || 0,
      icon: FaCheckCircle,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
      delay: '0.05s',
    },
    {
      label: 'Rejected',
      value: stats.rejected || 0,
      icon: FaTimesCircle,
      iconBg: '#fee2e2',
      iconColor: '#dc2626',
      valueColor: '#dc2626',
      borderColor: '#ef4444',
      delay: '0.1s',
    },
  ];
}

export default function HrisLeaveRequestsStatCards({ stats }) {
  const items = buildStats(stats);

  return (
    <div className="hlr-stat-grid">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="hlr-stat-card"
            style={{ animationDelay: item.delay, borderLeftColor: item.borderColor }}
          >
            <div
              className="hlr-stat-icon-wrapper"
              style={{ backgroundColor: item.iconBg, color: item.iconColor }}
            >
              <Icon />
            </div>
            <div>
              <p className="hlr-stat-value" style={{ color: item.valueColor }}>{item.value}</p>
              <p className="hlr-stat-label">{item.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
