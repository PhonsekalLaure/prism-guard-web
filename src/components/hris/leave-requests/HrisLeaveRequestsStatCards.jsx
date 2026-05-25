import { FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

function buildStats() {
  return [
    {
      key: 'pending',
      label: 'Pending Requests',
      icon: FaHourglassHalf,
      iconBg: '#fef9c3',
      iconColor: '#ca8a04',
      valueColor: '#e6b215',
      borderColor: '#eab308',
      delay: '0s',
    },
    {
      key: 'approvedThisMonth',
      label: 'Approved This Month',
      icon: FaCheckCircle,
      iconBg: '#dcfce7',
      iconColor: '#16a34a',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
      delay: '0.05s',
    },
    {
      key: 'rejected',
      label: 'Rejected',
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
  const items = buildStats();

  return <StatCards cards={items} stats={stats} columns={3} />;
}
