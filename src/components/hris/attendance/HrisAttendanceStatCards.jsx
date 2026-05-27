import { FaClock, FaUserTimes, FaHourglassEnd, FaSignOutAlt } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Late Clock-ins',
    key: 'lateClockIns',
    icon: FaClock,
    iconBg: '#fef9c3',
    iconColor: '#ca8a04',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    delay: '0s',
  },
  {
    label: 'Total Absences',
    key: 'totalAbsences',
    icon: FaUserTimes,
    iconBg: '#fee2e2',
    iconColor: '#dc2626',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    delay: '0.05s',
  },
  {
    label: 'Overtime Count',
    key: 'overtimeCount',
    icon: FaHourglassEnd,
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
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
