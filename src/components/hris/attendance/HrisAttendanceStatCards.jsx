import { FaClock, FaUserTimes, FaHourglassEnd, FaSignOutAlt } from 'react-icons/fa';
import '@styles/hris/HrisServiceReviews.css';

const stats = [
  {
    label: 'Late Clock-ins',
    value: '12',
    icon: FaClock,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    delay: '0s',
  },
  {
    label: 'Total Absences',
    value: '5',
    icon: FaUserTimes,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.05s',
  },
  {
    label: 'Overtime Count',
    value: '28',
    icon: FaHourglassEnd,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    delay: '0.1s',
  },
  {
    label: 'No Clock-out',
    value: '3',
    icon: FaSignOutAlt,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    valueColor: '#9333ea',
    borderColor: '#a855f7',
    delay: '0.15s',
  },
];

export default function HrisAttendanceStatCards() {
  return (
    <div className="sr-review-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
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
              <p className="sr-review-stat-value" style={{ color: s.valueColor, fontSize: '1.4rem' }}>{s.value}</p>
              <p className="sr-review-stat-label">{s.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
