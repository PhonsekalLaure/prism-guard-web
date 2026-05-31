import { FaCalendarCheck, FaCalendarTimes, FaComments, FaHourglassHalf, FaCheckCircle, FaStar } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const cards = [
  { label: 'Total Reviews', statKey: 'total', icon: FaComments, iconBg: '#dbeafe', iconColor: '#2563eb', valueColor: '#093269', delay: '0s', borderColor: '#2563eb' },
  { label: 'Pending Review', statKey: 'pending', icon: FaHourglassHalf, iconBg: '#fef9c3', iconColor: '#ca8a04', valueColor: '#e6b215', delay: '0.05s', borderColor: '#eab308' },
  { label: 'Published', statKey: 'published', icon: FaCheckCircle, iconBg: '#dcfce7', iconColor: '#16a34a', valueColor: '#16a34a', delay: '0.1s', borderColor: '#16a34a' },
  { label: 'Avg. Rating', statKey: 'avgRating', icon: FaStar, iconBg: '#ffedd5', iconColor: '#f97316', valueColor: '#f97316', delay: '0.15s', borderColor: '#f97316', format: (value) => Number(value || 0).toFixed(1) },
  { label: 'Monthly Required', statKey: 'monthlyRequired', icon: FaCalendarCheck, iconBg: '#dbeafe', iconColor: '#2563eb', valueColor: '#2563eb', delay: '0.2s', borderColor: '#2563eb' },
  { label: 'Monthly Submitted', statKey: 'monthlySubmitted', icon: FaCheckCircle, iconBg: '#dcfce7', iconColor: '#16a34a', valueColor: '#16a34a', delay: '0.25s', borderColor: '#16a34a' },
  { label: 'Monthly Missing', statKey: 'monthlyMissing', icon: FaCalendarTimes, iconBg: '#fee2e2', iconColor: '#dc2626', valueColor: '#dc2626', delay: '0.3s', borderColor: '#dc2626' },
];

export default function HrisServiceReviewsStatCards({ stats, loading = false }) {
  return <StatCards cards={cards} stats={stats} loading={loading} />;
}
