import { FaCoins, FaMoneyBillWave, FaReceipt, FaUsers } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const stats = [
  {
    label: 'Total Employees',
    value: '126',
    sub: 'Active payroll',
    subClass: '',
    valueColor: '#093269',
    borderColor: '#093269',
    icon: FaUsers,
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
    delay: '0s',
  },
  {
    label: 'Total Payroll',
    value: '₱452,100',
    sub: 'Gross amount',
    subClass: 'green',
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    icon: FaMoneyBillWave,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    delay: '0.05s',
  },
  {
    label: 'Total Deductions',
    value: '₱78,450',
    sub: 'Tax + Contributions',
    subClass: '',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaReceipt,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    delay: '0.1s',
  },
  {
    label: 'Net Payout',
    value: '₱373,650',
    sub: 'Next pay: Feb 25',
    subClass: '',
    valueColor: '#e6b215',
    borderColor: '#e6b215',
    icon: FaCoins,
    iconBg: 'rgba(230, 178, 21, 0.12)',
    iconColor: '#b45309',
    delay: '0.15s',
  },
];

export default function HrisPayrollStatCards() {
  return <StatCards cards={stats} />;
}
