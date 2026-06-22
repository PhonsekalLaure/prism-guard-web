import { FaCheckCircle, FaCircle, FaMinusCircle, FaTimesCircle } from 'react-icons/fa';

export const STATUS_META = {
  active: { label: 'ACTIVE', className: 'active', icon: FaCircle, rowClass: '' },
  attendance_contest: { label: 'CONTESTED', className: 'late', icon: null, rowClass: '' },
  missed_clock_out: { label: 'MISSED CLOCK-OUT', className: 'late', icon: null, rowClass: '' },
  late: { label: 'LATE', className: 'late', icon: null, rowClass: '' },
  absent: { label: 'ABSENT', className: 'absent', icon: null, rowClass: 'ha-row-absent' },
  off_duty: { label: 'OFF DUTY', className: 'off-duty', icon: null, rowClass: 'ha-row-completed' },
  on_leave: { label: 'ON LEAVE', className: 'on-leave', icon: null, rowClass: 'ha-row-leave' },
};

export const GPS_ICONS = {
  verified: FaCheckCircle,
  review: FaTimesCircle,
  'no-gps': FaTimesCircle,
  na: FaMinusCircle,
};

export function getClockInClass(row) {
  if (!row.clockIn) return 'dash';
  return row.status === 'late' ? 'late' : '';
}

export function getClockInNoteClass(row) {
  if (row.status === 'late') return 'late';
  if (row.status === 'attendance_contest') return 'late';
  if (row.status === 'absent') return 'no-clock';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

export function getClockOutNoteClass(row) {
  if (row.status === 'missed_clock_out') return 'early';
  if (row.earlyClockOut) return 'early';
  if (row.clockOut) return 'completed';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

export function getHoursNoteClass(row) {
  if (row.status === 'missed_clock_out') return 'early';
  if (row.status === 'absent') return 'no-activity';
  if (row.status === 'on_leave') return 'leave';
  if (row.hoursNote === 'Early departure') return 'early';
  if (row.hoursNote === 'Overtime shift') return 'overtime';
  return 'on-time';
}

export function formatBoolean(value) {
  if (value === true) return 'Inside geofence';
  if (value === false) return 'Outside geofence';
  return 'N/A';
}

export function formatDistance(value) {
  if (value === null || value === undefined || value === '') {
    return 'Distance unavailable';
  }

  const distance = Number(value);
  return Number.isFinite(distance) ? `${Math.round(distance)}m from site` : 'Distance unavailable';
}

export function formatGeofenceEvidence(evidence) {
  if (!evidence) return 'N/A';
  const result = evidence.result || formatBoolean(evidence.isWithinGeofence);
  const distance = formatDistance(evidence.distanceMeters);
  return result === 'N/A' ? distance : `${result} • ${distance}`;
}

export function formatReasonCode(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}
