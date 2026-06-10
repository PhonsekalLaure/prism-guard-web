function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCutoffDate(date) {
  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
  });
}

function formatCutoffLabel(start, end) {
  const sameYear = start.getFullYear() === end.getFullYear();
  const range = `${formatCutoffDate(start)}-${formatCutoffDate(end)}`;
  return `${range}, ${sameYear ? end.getFullYear() : `${start.getFullYear()}-${end.getFullYear()}`}`;
}

function buildCutoff(start, end, { isCurrent = false, disabled = false } = {}) {
  const periodStart = toIsoDate(start);
  const periodEnd = toIsoDate(end);
  return {
    disabled,
    isCurrent,
    key: `${periodStart}:${periodEnd}`,
    label: `${isCurrent ? 'Current cutoff: ' : ''}${formatCutoffLabel(start, end)}${disabled ? ' - incomplete' : ''}`,
    periodEnd,
    periodStart,
  };
}

function getCutoffForDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const isFirstHalf = day <= 15;
  const start = new Date(year, month, isFirstHalf ? 1 : 16);
  const end = isFirstHalf ? new Date(year, month, 15) : new Date(year, month + 1, 0);
  return { start, end };
}

function getPreviousCutoff(start) {
  if (start.getDate() === 16) {
    const year = start.getFullYear();
    const month = start.getMonth();
    return {
      start: new Date(year, month, 1),
      end: new Date(year, month, 15),
    };
  }

  const year = start.getFullYear();
  const month = start.getMonth() - 1;
  return {
    start: new Date(year, month, 16),
    end: new Date(year, month + 1, 0),
  };
}

export function getPayrollCutoffOptions(referenceDate = new Date()) {
  const current = getCutoffForDate(referenceDate);
  const options = [buildCutoff(current.start, current.end, { isCurrent: true, disabled: true })];
  let cursor = current;

  for (let index = 0; index < 5; index += 1) {
    cursor = getPreviousCutoff(cursor.start);
    options.push(buildCutoff(cursor.start, cursor.end));
  }

  return options;
}

export function getDefaultPayrollPeriod() {
  const firstSelectable = getPayrollCutoffOptions().find((option) => !option.disabled);
  return {
    end: firstSelectable?.periodEnd || '',
    key: firstSelectable?.key || '',
    start: firstSelectable?.periodStart || '',
  };
}

export function getPayrollErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
}

export function csvValue(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
