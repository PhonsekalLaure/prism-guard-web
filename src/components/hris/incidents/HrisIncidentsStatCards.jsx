import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
} from 'react-icons/fa';
import StatCards from '@components/ui/StatCards';

const CARDS = [
  {
    label: 'High Priority',
    sub: 'Needs immediate review',
    valueColor: '#dc2626',
    borderColor: '#ef4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#dc2626',
    Icon: FaExclamationTriangle,
    key: 'high',
    delay: '0s',
  },
  {
    label: 'Medium Priority',
    sub: 'Supervisor review',
    valueColor: '#d97706',
    borderColor: '#f59e0b',
    iconBg: 'rgba(245, 158, 11, 0.12)',
    iconColor: '#d97706',
    Icon: FaExclamationCircle,
    key: 'medium',
    delay: '0.07s',
  },
  {
    label: 'Low Priority',
    sub: 'Routine reports',
    valueColor: '#4b5563',
    borderColor: '#6b7280',
    iconBg: 'rgba(107, 114, 128, 0.12)',
    iconColor: '#4b5563',
    Icon: FaInfoCircle,
    key: 'low',
    delay: '0.14s',
  },
  {
    label: 'Resolved',
    sub: null, // derived from stats.pending
    valueColor: '#16a34a',
    borderColor: '#22c55e',
    iconBg: 'rgba(34, 197, 94, 0.12)',
    iconColor: '#16a34a',
    Icon: FaCheckCircle,
    key: 'resolved',
    delay: '0.21s',
  },
];

export default function HrisIncidentsStatCards({ stats = {}, loading = false }) {
  const cards = CARDS.map((card) => ({
    ...card,
    sub: card.key === 'resolved'
      ? (currentStats) => `${currentStats?.pending ?? 0} pending review`
      : card.sub,
  }));

  return <StatCards cards={cards} stats={stats} loading={loading} />;
}
