import { FaCheckCircle, FaHandHoldingUsd, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Disbursed',
    value: '₱52,500',
    sub: 'This month',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    icon: FaHandHoldingUsd,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    delay: '0s',
  },
  {
    label: 'Pending Requests',
    value: '8',
    sub: 'Awaiting review',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    icon: FaHourglassHalf,
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
    delay: '0.05s',
  },
  {
    label: 'Rejected',
    value: '2',
    sub: 'This month',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaTimesCircle,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    delay: '0.1s',
  },
  {
    label: 'Approved',
    value: '3',
    sub: 'This month',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    icon: FaCheckCircle,
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#2563eb',
    delay: '0.15s',
  },
];

export default function HrisCashAdvanceStatCards() {
  return <StatCards cards={stats} />;
}
