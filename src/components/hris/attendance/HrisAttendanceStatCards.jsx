import { FaClock, FaSignInAlt, FaSignOutAlt, FaUserTimes } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Clock-ins',
    key: 'totalClockIns',
    icon: FaSignInAlt,
    iconBg: '#dbeafe',
    iconColor: '#2563eb',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    delay: '0s',
  },
  {
    label: 'Late Clock-ins',
    key: 'lateClockIns',
    icon: FaClock,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    delay: '0.05s',
  },
  {
    label: 'Total Absences',
    key: 'totalAbsences',
    icon: FaUserTimes,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.1s',
  },
  {
    label: 'No Clock-out',
    key: 'noClockOut',
    icon: FaSignOutAlt,
    iconBg: '#f3e8ff',
    iconColor: '#9333ea',
    valueColor: '#9333ea',
    borderColor: '#a855f7',
    delay: '0.15s',
  },
];

export default function HrisAttendanceStatCards({ stats: attendanceStats, loading = false }) {
  return <StatCards cards={stats} stats={attendanceStats} loading={loading} />;
}
