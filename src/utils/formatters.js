export function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDateTime(value, options = {}) {
  const {
    fallback = 'N/A',
    locale = 'en-US',
    defaultFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    },
    formatOptions = {},
  } = options;

  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleString(locale, {
    ...defaultFormatOptions,
    ...formatOptions,
  });
}

export function formatDate(value, options = {}) {
  const {
    fallback = 'N/A',
    locale = 'en-US',
    formatOptions = {},
  } = options;

  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...formatOptions,
  });
}

export const DAY_LABELS = {
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
};

export function formatWorkDays(days, fallback = 'N/A') {
  if (!Array.isArray(days) || days.length === 0) return fallback;
  return days.map((day) => DAY_LABELS[day] || day).join(', ');
}

export function formatShiftTime(time, fallback = '') {
  if (typeof time !== 'string' || !time) return fallback;

  const [hours, minutes] = time.split(':');
  if (hours == null || minutes == null) return time;

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(date.getTime())) return String(time);

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getShiftType(start, end) {
  if (typeof start !== 'string' || typeof end !== 'string') return 'custom';

  const toMinutes = (timeStr) => {
    const parts = timeStr.split(':');
    const hours = Number.parseInt(parts[0], 10);
    const minutes = Number.parseInt(parts[1] || '0', 10);
    if (Number.isNaN(hours)) return null;
    return (hours * 60) + (Number.isNaN(minutes) ? 0 : minutes);
  };

  const startMin = toMinutes(start);
  const endMin = toMinutes(end);

  if (startMin === null || endMin === null) return 'custom';

  // If start and end are the same, it's a 24-Hour shift
  if (startMin === endMin) return '24hr';

  const totalMinutes = startMin < endMin 
    ? endMin - startMin 
    : (1440 - startMin) + endMin;

  const dayStart = 6 * 60; // 06:00
  const dayEnd = 18 * 60;  // 18:00

  const getIntervalOverlap = (s, e) => {
    return Math.max(0, Math.min(e, dayEnd) - Math.max(s, dayStart));
  };

  let dayMinutes = 0;
  if (startMin < endMin) {
    dayMinutes = getIntervalOverlap(startMin, endMin);
  } else {
    dayMinutes = getIntervalOverlap(startMin, 1440) + getIntervalOverlap(0, endMin);
  }

  const nightMinutes = totalMinutes - dayMinutes;

  // Exact ties default to day shift (as per user instruction)
  return nightMinutes > dayMinutes ? 'night' : 'day';
}

export function getShiftLabel(start, end) {
  const type = getShiftType(start, end);
  if (type === 'day') return 'Day Shift';
  if (type === 'night') return 'Night Shift';
  if (type === '24hr') return '24-Hour Shift';
  return 'Custom Shift';
}

export function getShiftLabelColor(label) {
  if (label === 'Day Shift') return '#f59e0b';
  if (label === 'Night Shift') return '#3b82f6';
  if (label === '24-Hour Shift') return '#8b5cf6';
  return '#6b7280';
}

