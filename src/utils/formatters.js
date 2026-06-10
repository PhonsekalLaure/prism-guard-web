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

export function getShiftLabel(start, end) {
  if (typeof start !== 'string' || typeof end !== 'string') return 'Custom Shift';

  const startHour = Number.parseInt(start.split(':')[0], 10);
  if (Number.isNaN(startHour)) return 'Custom Shift';

  return startHour >= 4 && startHour < 16 ? 'Day Shift' : 'Night Shift';
}

export function getShiftLabelColor(label) {
  return label === 'Day Shift' ? '#f59e0b' : '#3b82f6';
}
