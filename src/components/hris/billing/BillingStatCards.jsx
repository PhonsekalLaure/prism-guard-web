import {
  FaCoins,
  FaExclamationTriangle,
  FaFileInvoiceDollar,
  FaHourglassHalf,
} from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

function formatCurrency(value) {
  return `PHP ${Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

const cards = [
  {
    label: 'Total Billed',
    statKey: 'total_amount',
    format: formatCurrency,
    sub: (stats) => `${stats?.total || 0} statements`,
    valueColor: '#093269',
    icon: FaFileInvoiceDollar,
    iconColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    borderColor: '#093269',
  },
  {
    label: 'Outstanding',
    statKey: 'outstanding',
    format: formatCurrency,
    sub: (stats) => `${(stats?.unpaid || 0) + (stats?.partial || 0) + (stats?.overdue || 0)} awaiting payment`,
    subColor: '#16a34a',
    valueColor: '#16a34a',
    icon: FaCoins,
    iconColor: '#16a34a',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    borderColor: '#16a34a',
  },
  {
    label: 'Overdue',
    statKey: 'overdue',
    sub: 'Past due statements',
    subColor: '#dc2626',
    valueColor: '#dc2626',
    icon: FaExclamationTriangle,
    iconColor: '#dc2626',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#dc2626',
  },
  {
    label: 'For Review',
    statKey: 'verifying',
    sub: 'Receipts submitted',
    subColor: '#ca8a04',
    valueColor: '#ca8a04',
    icon: FaHourglassHalf,
    iconColor: '#ca8a04',
    iconBg: 'rgba(202, 138, 4, 0.12)',
    borderColor: '#ca8a04',
  },
];

export default function BillingStatCards({ stats, loading = false }) {
  return <StatCards cards={cards} stats={stats} loading={loading} columns={4} />;
}
