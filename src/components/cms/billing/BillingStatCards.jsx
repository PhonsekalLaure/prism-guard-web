import { FaCheckCircle, FaClock, FaExclamationTriangle, FaReceipt } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Due',
    value: '₱125,500',
    sub: '2 invoices overdue',
    valueColor: '#dc2626',
    subColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaExclamationTriangle,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
  },
  {
    label: 'Paid This Month',
    value: '₱82,500',
    sub: 'Feb 2026',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    icon: FaCheckCircle,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
  },
  {
    label: 'Pending Verification',
    value: '₱43,000',
    sub: '1 payment reviewing',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    icon: FaClock,
    iconBg: 'rgba(230, 178, 21, 0.12)',
    iconColor: '#b45309',
  },
  {
    label: 'Total Paid (2026)',
    value: '₱330,000',
    sub: 'Year to date',
    valueColor: '#093269',
    borderColor: '#093269',
    icon: FaReceipt,
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
  },
];

export default function BillingStatCards() {
  return <StatCards cards={stats} />;
}
