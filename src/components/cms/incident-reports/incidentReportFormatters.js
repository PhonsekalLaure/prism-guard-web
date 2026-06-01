import { formatDateTime, titleCase } from '@utils/formatters';

export { titleCase };

export function formatIncidentDate(value, options = {}) {
  return formatDateTime(value, {
    defaultFormatOptions: {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    },
    formatOptions: {
      ...options,
    },
  });
}
