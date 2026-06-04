import { FaCheckCircle, FaHandHoldingUsd, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const cards = [
  {
    label: 'Total Disbursed',
    key: 'totalDisbursed',
    format: (value) => new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      maximumFractionDigits: 0,
    }).format(value || 0),
    sub: 'This month',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    icon: FaHandHoldingUsd,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
  },
  {
    label: 'Pending Requests',
    key: 'pending',
    sub: 'Awaiting review',
    valueColor: '#e6b215',
    borderColor: '#eab308',
    icon: FaHourglassHalf,
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
  },
  {
    label: 'Rejected',
    key: 'rejected',
    sub: 'This month',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaTimesCircle,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
  },
  {
    label: 'Approved',
    key: 'approved',
    sub: 'Ready for release',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    icon: FaCheckCircle,
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconColor: '#2563eb',
  },
];

export default function HrisCashAdvanceStatCards({ data, loading = false }) {
  return <StatCards cards={cards} stats={data} loading={loading} />;
}
