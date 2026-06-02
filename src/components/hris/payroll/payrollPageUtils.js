export function getDefaultPayrollPeriod() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const start = new Date(year, month, day <= 15 ? 1 : 16);
  const end = day <= 15 ? new Date(year, month, 15) : new Date(year, month + 1, 0);
  const toIsoDate = (date) => date.toISOString().slice(0, 10);
  return { start: toIsoDate(start), end: toIsoDate(end) };
}

export function getPayrollErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.response?.data?.message || error?.message || fallback;
}

export function csvValue(value) {
  const text = String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
