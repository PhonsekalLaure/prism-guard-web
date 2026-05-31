import { FaFingerprint, FaClock, FaUserTimes } from 'react-icons/fa';
import SharedStatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Clock-ins',
    value: '126',
    sub: "Today's count",
    valueColor: '#093269',
    icon: FaFingerprint,
    iconColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    borderColor: '#093269',
  },
  {
    label: 'Overtime Logs',
    value: '25',
    sub: "Today's count",
    valueColor: '#e6b215',
    icon: FaClock,
    iconColor: '#e6b215',
    iconBg: 'rgba(230, 178, 21, 0.12)',
    borderColor: '#e6b215',
  },
  {
    label: 'Total Absences',
    value: '3',
    sub: "Today's count",
    valueColor: '#ef4444',
    icon: FaUserTimes,
    iconColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#ef4444',
  },
];

export default function StatCards() {
  return <SharedStatCards cards={stats} columns={3} />;
}
