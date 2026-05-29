import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaHourglass,
  FaFileAlt,
} from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const CARDS = [
  {
    label: 'Total Incidents',
    sub: 'Reviewed reports',
    valueColor: '#093269',
    borderColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
    Icon: FaExclamationTriangle,
    key: 'total',
    delay: '0s',
  },
  {
    label: 'High Priority',
    sub: 'Approved for client view',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    Icon: FaExclamationCircle,
    key: 'high',
    delay: '0.07s',
  },
  {
    label: 'Pending Requests',
    sub: 'Awaiting operations review',
    valueColor: '#ca8a04',
    borderColor: '#eab308',
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
    Icon: FaHourglass,
    key: 'pendingRequests',
    delay: '0.14s',
  },
  {
    label: 'Released Reports',
    sub: 'Full reports completed',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    Icon: FaFileAlt,
    key: 'sentRequests',
    delay: '0.21s',
  },
];

export default function IncidentReportsStatCards({ stats = {}, loading = false }) {
  return <StatCards cards={CARDS} stats={stats} loading={loading} />;
}
