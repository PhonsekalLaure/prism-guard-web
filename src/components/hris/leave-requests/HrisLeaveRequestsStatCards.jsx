import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import '@styles/hris/HrisServiceReviews.css';

const stats = [
  {
    label: 'Pending Requests',
    value: '12',
    icon: FaHourglassHalf,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    delay: '0s',
  },
  {
    label: 'Approved This Month',
    value: '28',
    icon: FaCheckCircle,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    delay: '0.05s',
  },
  {
    label: 'Rejected',
    value: '3',
    icon: FaTimesCircle,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.1s',
  },
];

export default function HrisLeaveRequestsStatCards() {
  return (
    <div className="sr-review-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div
            key={i}
            className="sr-review-stat-card"
            style={{ animationDelay: s.delay, borderLeftColor: s.borderColor }}
          >
            <div
              className="sr-review-stat-icon-wrapper"
              style={{ backgroundColor: s.iconBg, color: s.iconColor }}
            >
              <Icon />
            </div>
            <div>
              <p className="sr-review-stat-value" style={{ color: s.valueColor }}>{s.value}</p>
              <p className="sr-review-stat-label">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
