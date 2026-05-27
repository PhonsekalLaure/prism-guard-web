import {
  FaClock,
  FaExchangeAlt,
  FaQuestionCircle,
  FaUserPlus,
  FaWrench,
  FaCheckCircle,
  FaExclamationTriangle,
  FaFire,
  FaListAlt,
} from 'react-icons/fa';

export function getServiceRequestTypeIcon(ticketType = '') {
  const type = ticketType.toLowerCase();

  if (type.includes('replacement')) {
    return { Icon: FaExchangeAlt, className: 'yellow sr-type-icon--gold' };
  }

  if (type.includes('additional') || type.includes('guard')) {
    return { Icon: FaUserPlus, className: 'blue sr-type-icon--blue' };
  }

  if (type.includes('schedule')) {
    return { Icon: FaClock, className: 'green sr-type-icon--green' };
  }

  if (type.includes('inquiry') || type.includes('general')) {
    return { Icon: FaQuestionCircle, className: 'purple sr-type-icon--purple' };
  }

  return { Icon: FaWrench, className: 'blue sr-type-icon--blue' };
}

export function getStatusBadgeClass(request = {}) {
  const statusClass = request.statusClass || request.status || 'open';
  return statusClass.startsWith('sr-status-badge')
    ? `sr-status-badge ${statusClass}`
    : `sr-status-badge ${statusClass}`;
}

export function getUrgencyBadgeClass(request = {}) {
  const urgencyClass = request.urgencyClass || request.urgency || request.priority || 'normal';
  return urgencyClass.startsWith('sr-urgency-badge')
    ? `sr-urgency-badge ${urgencyClass}`
    : `sr-urgency-badge ${urgencyClass}`;
}

export const BASE_STATS = [
  {
    key: 'open',
    label: 'Open',
    sub: 'Awaiting response',
    valueColor: '#2563eb',
    borderColor: '#3b82f6',
    icon: FaClock,
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
  },
  {
    key: 'in_progress',
    label: 'In Progress',
    sub: 'Being processed',
    valueColor: '#b45309',
    borderColor: '#e6b215',
    icon: FaExclamationTriangle,
    iconBg: '#fef9c3',
    iconColor: '#e6b215',
  },
  {
    key: 'resolved',
    label: 'Resolved',
    sub: 'Completed requests',
    valueColor: '#15803d',
    borderColor: '#16a34a',
    icon: FaCheckCircle,
    iconBg: '#dcfce7',
    iconColor: '#16a34a',
  },
];

export const HRIS_EXTRA_STATS = [
  {
    key: 'emergency',
    label: 'Emergency',
    sub: 'Immediate action',
    valueColor: '#ef4444',
    borderColor: '#ef4444',
    icon: FaFire,
    iconBg: '#fee2e2',
    iconColor: '#ef4444',
  },
  {
    key: 'total',
    label: 'Total',
    sub: 'All time',
    valueColor: '#4b5563',
    borderColor: '#9ca3af',
    icon: FaListAlt,
    iconBg: '#f3f4f6',
    iconColor: '#9ca3af',
  },
];
