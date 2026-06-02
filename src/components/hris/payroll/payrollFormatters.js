const currency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  minimumFractionDigits: 2,
});

const wholeCurrency = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});

export function money(value) {
  return currency.format(Number(value || 0));
}

export function wholeMoney(value) {
  return wholeCurrency.format(Number(value || 0));
}

export function numeric(value) {
  return Number(value || 0);
}

export function formatHours(value) {
  const hours = numeric(value);
  return Number.isInteger(hours) ? String(hours) : hours.toFixed(2);
}

export function formatDate(value) {
  if (!value) return 'Not set';
  return new Date(value).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getInitials(name = '') {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'PG';
}

export function getStatusClass(status) {
  switch (status) {
    case 'paid':
      return 'paid';
    case 'approved':
      return 'ready';
    case 'cancelled':
      return 'cancelled';
    case 'draft':
    default:
      return 'processing';
  }
}

export function buildEarnings(row) {
  return [
    { label: `Regular Pay (${formatHours(row.regular_hours)} hrs)`, amount: row.regular_pay ?? row.basic_pay },
    numeric(row.overtime_pay) > 0 && { label: `Overtime Pay (${formatHours(row.overtime_hours)} hrs)`, amount: row.overtime_pay },
    numeric(row.night_differential_pay) > 0 && {
      label: `Night Differential (${formatHours(numeric(row.night_diff_hours) + numeric(row.night_diff_overtime_hours))} hrs)`,
      amount: row.night_differential_pay,
    },
    numeric(row.holiday_pay) > 0 && { label: 'Holiday Pay', amount: row.holiday_pay },
  ].filter(Boolean);
}

export function buildDeductions(row) {
  return [
    numeric(row.sss_employee) > 0 && { label: 'SSS', amount: row.sss_employee },
    numeric(row.philhealth_employee) > 0 && { label: 'PhilHealth', amount: row.philhealth_employee },
    numeric(row.pagibig_employee) > 0 && { label: 'Pag-IBIG', amount: row.pagibig_employee },
    numeric(row.withholding_tax) > 0 && { label: 'Withholding Tax', amount: row.withholding_tax },
    numeric(row.cash_advance_deduction) > 0 && { label: 'Cash Advance', amount: row.cash_advance_deduction },
    numeric(row.leave_deduction) > 0 && { label: 'Unpaid Leave', amount: row.leave_deduction },
    numeric(row.awol_deduction) > 0 && { label: 'AWOL', amount: row.awol_deduction },
    numeric(row.late_undertime_deduction) > 0 && { label: 'Late / Undertime', amount: row.late_undertime_deduction },
    numeric(row.absences_deduction) > 0 && { label: 'Absences', amount: row.absences_deduction },
  ].filter(Boolean);
}
