import { FaCoins, FaMoneyBillWave, FaReceipt, FaUsers } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';
import { wholeMoney } from './payrollFormatters';

export default function HrisPayrollStatCards({ summary = {}, statusLabel = 'No run selected' }) {
  const stats = [
    {
      label: 'Employees',
      value: String(summary.employee_count || 0),
      sub: statusLabel,
      valueColor: '#093269',
      borderColor: '#093269',
      icon: FaUsers,
      iconBg: 'rgba(9, 50, 105, 0.1)',
      iconColor: '#093269',
      delay: '0s',
    },
    {
      label: 'Gross Pay',
      value: wholeMoney(summary.gross_pay),
      sub: 'Regular, OT, and premiums',
      subClass: 'green',
      valueColor: '#16a34a',
      borderColor: '#22c55e',
      icon: FaMoneyBillWave,
      iconBg: 'rgba(34, 197, 94, 0.12)',
      iconColor: '#16a34a',
      delay: '0.05s',
    },
    {
      label: 'Employee Deductions',
      value: wholeMoney(summary.total_deductions),
      sub: 'Selected cutoff: employee shares, tax, attendance, cash advances',
      valueColor: '#dc2626',
      borderColor: '#ef4444',
      icon: FaReceipt,
      iconBg: 'rgba(239, 68, 68, 0.12)',
      iconColor: '#dc2626',
      delay: '0.1s',
    },
    {
      label: 'Net Payout',
      value: wholeMoney(summary.net_pay),
      sub: 'Cash release amount',
      valueColor: '#e6b215',
      borderColor: '#e6b215',
      icon: FaCoins,
      iconBg: 'rgba(230, 178, 21, 0.12)',
      iconColor: '#b45309',
      delay: '0.15s',
    },
  ];

  return <StatCards cards={stats} />;
}
