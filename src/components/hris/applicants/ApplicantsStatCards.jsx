import { FaCalendarCheck, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUsers } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

export default function ApplicantsStatCards({ stats = {}, loading = false }) {
  const cards = [
    { key: 'total', label: 'Total Applicants', valueColor: '#093269', borderColor: '#093269', icon: FaUsers, iconBg: 'rgba(9, 50, 105, 0.1)', iconColor: '#093269' },
    { key: 'pending', label: 'Pending Review', valueColor: '#d97706', borderColor: '#eab308', icon: FaHourglassHalf, iconBg: 'rgba(234, 179, 8, 0.12)', iconColor: '#d97706' },
    { key: 'rejected', label: 'Rejected', valueColor: '#ef4444', borderColor: '#ef4444', icon: FaTimesCircle, iconBg: 'rgba(239, 68, 68, 0.12)', iconColor: '#ef4444' },
    { key: 'hired', label: 'Hired', valueColor: '#16a34a', borderColor: '#16a34a', icon: FaCheckCircle, iconBg: 'rgba(34, 197, 94, 0.12)', iconColor: '#16a34a' },
    { key: 'interview', label: 'For Interview', valueColor: '#2563eb', borderColor: '#3b82f6', icon: FaCalendarCheck, iconBg: 'rgba(59, 130, 246, 0.12)', iconColor: '#2563eb' },
  ];

  return <StatCards cards={cards} stats={stats} loading={loading} columns={5} />;
}
