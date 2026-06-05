import { FaCheckCircle, FaClock, FaExclamationTriangle, FaReceipt } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const cards = [
  {
    label: 'Total Due',
    statKey: 'outstanding',
    format: formatCurrency,
    sub: (stats) => `${stats?.overdue || 0} overdue`,
    valueColor: '#dc2626',
    subColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaExclamationTriangle,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
  },
  {
    label: 'Paid Statements',
    statKey: 'paid',
    sub: 'Approved receipts',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    icon: FaCheckCircle,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
  },
  {
    label: 'Pending Verification',
    statKey: 'verifying',
    sub: 'Payments reviewing',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    icon: FaClock,
    iconBg: 'rgba(230, 178, 21, 0.12)',
    iconColor: '#b45309',
  },
  {
    label: 'Total Billed',
    statKey: 'total_amount',
    format: formatCurrency,
    sub: (stats) => `${stats?.total || 0} statements`,
    valueColor: '#093269',
    borderColor: '#093269',
    icon: FaReceipt,
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
  },
];

export default function BillingStatCards({ stats, loading = false }) {
  return <StatCards cards={cards} stats={stats} loading={loading} />;
}
