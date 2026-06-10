import { FaFingerprint, FaClock, FaUserTimes } from 'react-icons/fa';
import SharedStatCards from '@components/ui/StatCards';

const cards = [
  {
    key: 'totalClockIns',
    label: 'Total Clock-ins',
    sub: "Today's count",
    valueColor: '#093269',
    icon: FaFingerprint,
    iconColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    borderColor: '#093269',
  },
  {
    key: 'overtimeLogs',
    label: 'Overtime Logs',
    sub: "Today's count",
    valueColor: '#e6b215',
    icon: FaClock,
    iconColor: '#e6b215',
    iconBg: 'rgba(230, 178, 21, 0.12)',
    borderColor: '#e6b215',
  },
  {
    key: 'totalAbsences',
    label: 'Total Absences',
    sub: "Today's count",
    valueColor: '#ef4444',
    icon: FaUserTimes,
    iconColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#ef4444',
  },
];

export default function StatCards({ stats, loading }) {
  return <SharedStatCards cards={cards} stats={stats} loading={loading} columns={3} />;
}
