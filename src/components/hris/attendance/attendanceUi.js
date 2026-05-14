import { FaCheckCircle, FaCircle, FaMinusCircle, FaTimesCircle } from 'react-icons/fa';

export const STATUS_META = {
  active: { label: 'ACTIVE', className: 'active', icon: FaCircle, rowClass: '' },
  late: { label: 'LATE', className: 'late', icon: null, rowClass: '' },
  absent: { label: 'ABSENT', className: 'absent', icon: null, rowClass: 'ha-row-absent' },
  off_duty: { label: 'OFF DUTY', className: 'off-duty', icon: null, rowClass: 'ha-row-completed' },
  on_leave: { label: 'ON LEAVE', className: 'on-leave', icon: null, rowClass: 'ha-row-leave' },
};

export const GPS_ICONS = {
  verified: FaCheckCircle,
  'no-gps': FaTimesCircle,
  na: FaMinusCircle,
};

export function getClockInClass(row) {
  if (!row.clockIn) return 'dash';
  return row.status === 'late' ? 'late' : '';
}

export function getClockInNoteClass(row) {
  if (row.status === 'late') return 'late';
  if (row.status === 'absent') return 'no-clock';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

export function getClockOutNoteClass(row) {
  if (row.clockOut) return 'completed';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

export function getHoursNoteClass(row) {
  if (row.status === 'absent') return 'no-activity';
  if (row.status === 'on_leave') return 'leave';
  if (row.hoursNote === 'Overtime shift') return 'overtime';
  return 'on-time';
}

export function formatCoordinate(coordinate) {
  if (!coordinate) return 'N/A';

  const latitude = Number(coordinate.latitude);
  const longitude = Number(coordinate.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return 'N/A';
  }

  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
}

export function formatBoolean(value) {
  if (value === true) return 'Inside geofence';
  if (value === false) return 'Outside geofence';
  return 'N/A';
}

export function formatRawStatus(value) {
  return value ? value.replace(/_/g, ' ') : 'N/A';
}
