import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaExclamationTriangle, FaHeadset, FaUsers } from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

function formatCurrency(amount) {
  if (amount == null) return '-';
  return `\u20b1${Number(amount).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const CARD_CONFIGS = [
  {
    key: 'deployed_guards',
    label: 'Deployed Guards',
    borderColor: '#093269',
    valueColor: '#093269',
    iconBg: 'rgba(9,50,105,0.1)',
    iconColor: '#093269',
    icon: FaUsers,
    to: '/cms/deployed-guards',
    format: (v) => v ?? '-',
    fallbackValue: '-',
  },
  {
    key: 'pending_requests',
    label: 'Pending Requests',
    borderColor: '#e6b215',
    valueColor: '#e6b215',
    iconBg: 'rgba(230,178,21,0.1)',
    iconColor: '#e6b215',
    icon: FaHeadset,
    to: '/cms/service-requests',
    format: (v) => v ?? '-',
    fallbackValue: '-',
  },
  {
    key: 'today_incidents',
    label: 'Incident Reports',
    sub: "Today's count",
    borderColor: '#ef4444',
    valueColor: '#ef4444',
    iconBg: 'rgba(239,68,68,0.1)',
    iconColor: '#ef4444',
    icon: FaExclamationTriangle,
    to: '/cms/incident-reports',
    format: (v) => v ?? '-',
    fallbackValue: '-',
  },
  {
    key: 'outstanding_payments',
    label: 'Outstanding Payments',
    borderColor: '#10b981',
    valueColor: '#10b981',
    iconBg: 'rgba(16,185,129,0.1)',
    iconColor: '#10b981',
    icon: FaCreditCard,
    to: '/cms/billing',
    format: (v) => formatCurrency(v),
    fallbackValue: null,
  },
];

export default function CmsStatCards({ stats, loading }) {
  const navigate = useNavigate();

  return (
    <StatCards
      cards={CARD_CONFIGS}
      stats={stats}
      loading={loading}
      onCardClick={(card) => navigate(card.to)}
    />
  );
}
