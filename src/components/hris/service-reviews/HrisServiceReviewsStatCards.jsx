import { FaComments, FaHourglassHalf, FaCheckCircle, FaStar } from 'react-icons/fa';

const stats = [
  { label: 'Total Reviews', value: '12', icon: FaComments, iconBg: '#dbeafe', iconColor: '#2563eb', valueColor: '#093269', delay: '0s', borderColor: '#2563eb' },
  { label: 'Pending Review', value: '3', icon: FaHourglassHalf, iconBg: '#fef9c3', iconColor: '#ca8a04', valueColor: '#e6b215', delay: '0.05s', borderColor: '#eab308' },
  { label: 'Published', value: '8', icon: FaCheckCircle, iconBg: '#dcfce7', iconColor: '#16a34a', valueColor: '#16a34a', delay: '0.1s', borderColor: '#16a34a' },
  { label: 'Avg. Rating', value: '4.4', icon: FaStar, iconBg: '#ffedd5', iconColor: '#f97316', valueColor: '#f97316', delay: '0.15s', borderColor: '#f97316' },
];

export default function HrisServiceReviewsStatCards() {
  return (
    <div className="sr-review-stat-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {stats.map((s, index) => {
        const Icon = s.icon;
        return (
          <div key={index} className="sr-review-stat-card" style={{ animationDelay: s.delay, borderLeftColor: s.borderColor }}>
            <div className="sr-review-stat-icon-wrapper" style={{ backgroundColor: s.iconBg, color: s.iconColor }}>
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
