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
