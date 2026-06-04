import { FaClock, FaExchangeAlt, FaShieldAlt, FaUserCheck } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const statConfig = [
  {
    key: 'totalDeployed',
    label: 'Total Deployed',
    sub: 'Across All Sites',
    valueColor: '#093269',
    borderColor: '#093269',
    icon: FaShieldAlt,
    iconBg: 'rgba(9, 50, 105, 0.1)',
    iconColor: '#093269',
    fallbackValue: '-',
  },
  {
    key: 'onDuty',
    label: 'On Duty',
    sub: 'Active Now',
    valueColor: '#16a34a',
    subColor: '#16a34a',
    borderColor: '#16a34a',
    icon: FaUserCheck,
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    fallbackValue: '-',
  },
  {
    key: 'offDuty',
    label: 'Off Duty',
    sub: 'No active clock-in',
    valueColor: '#ca8a04',
    borderColor: '#ca8a04',
    icon: FaClock,
    iconBg: 'rgba(234, 179, 8, 0.12)',
    iconColor: '#ca8a04',
    fallbackValue: '-',
  },
  {
    key: 'tempReplaced',
    label: 'Temporarily Replaced',
    sub: 'Replacement assigned',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    icon: FaExchangeAlt,
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    fallbackValue: '-',
  },
];

export default function DeployedGuardsStatCards({ stats, loading }) {
  return <StatCards cards={statConfig} stats={stats} loading={loading || stats === null} />;
}
