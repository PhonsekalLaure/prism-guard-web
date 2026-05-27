import { FaFileInvoiceDollar, FaCoins, FaExclamationTriangle } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Billed',
    value: '₱245,000',
    sub: '8 active clients',
    valueColor: '#093269',
    icon: FaFileInvoiceDollar,
    iconColor: '#093269',
    iconBg: 'rgba(9, 50, 105, 0.1)',
    borderColor: '#093269',
  },
  {
    label: 'Total Collected',
    value: '₱201,000',
    sub: '4 clients paid',
    subColor: '#16a34a',
    valueColor: '#16a34a',
    icon: FaCoins,
    iconColor: '#16a34a',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    borderColor: '#16a34a',
  },
  {
    label: 'Total Unpaid',
    value: '₱44,000',
    sub: '2 clients unpaid',
    subColor: '#dc2626',
    valueColor: '#dc2626',
    icon: FaExclamationTriangle,
    iconColor: '#dc2626',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    borderColor: '#dc2626',
  },
];

export default function BillingStatCards() {
  return <StatCards cards={stats} columns={3} />;
}
