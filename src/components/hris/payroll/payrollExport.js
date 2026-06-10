import {
  getDeductionExcess,
  getDisplayNetPay,
  numeric,
} from './payrollFormatters';

function count(value) {
  return Array.isArray(value) ? value.length : numeric(value);
}

function dateList(items = []) {
  return Array.isArray(items)
    ? items.map((item) => item.date).filter(Boolean).join('; ')
    : '';
}

function getSnapshot(record) {
  return record.calculation_snapshot || {};
}

function getWorkedDays(snapshot) {
  return Math.max(
    numeric(snapshot.scheduled_days)
      - numeric(snapshot.paid_leave_days)
      - numeric(snapshot.unpaid_leave_days)
      - numeric(snapshot.awol_days),
    0
  );
}

export const PAYROLL_EXPORT_HEADERS = [
  'Employee',
  'Employee ID',
  'Position',
  'Status',
  'Period Start',
  'Period End',
  'Scheduled Days',
  'Days Worked',
  'Paid SIL Days',
  'Unpaid Leave Days',
  'Absence Days',
  'AWOL Days',
  'Regular Hours',
  'Overtime Hours',
  'Night Differential Hours',
  'Night OT Hours',
  'Total Worked Hours',
  'Late Minutes',
  'Undertime Minutes',
  'Contractual Monthly Salary',
  'Effective Monthly Salary',
  'Contractual Daily Rate',
  'Daily Rate',
  'Minimum Daily Rate',
  'Daily Rate Floor Applied',
  'Daily Rate Divisor',
  'Divisor Source',
  'Regular Hourly Rate',
  'Deduction Hourly Rate',
  'Night Premium Start',
  'Night Premium End',
  'Night Premium Daily Rate Percent',
  'Regular Pay',
  'Overtime Pay',
  'Night Differential Pay',
  'Holiday Pay',
  'Gross Pay',
  'SSS Employee',
  'PhilHealth Employee',
  'Pag-IBIG Employee',
  'Withholding Tax',
  'Statutory Deductions',
  'Cash Advance Deduction',
  'Leave Deduction',
  'AWOL Deduction',
  'Late/Undertime Deduction',
  'Absences Deduction',
  'Total Deductions',
  'Deduction Excess',
  'Net Pay',
  'Paid Leave Dates',
  'Unpaid Leave Dates',
  'AWOL Dates',
  'Cash Advance Count',
];

export function buildPayrollExportRow(record, fallbackStatus = 'draft') {
  const snapshot = getSnapshot(record);
  const paidLeaves = snapshot.paid_leaves || snapshot.paid_service_incentive_leaves || [];
  const unpaidLeaves = snapshot.unpaid_leaves || [];
  const absences = snapshot.absences || [];

  return [
    record.employee_name || '',
    record.employee_number || '',
    record.employee_position || '',
    record.status || fallbackStatus,
    record.period_start || '',
    record.period_end || '',
    snapshot.scheduled_days ?? '',
    getWorkedDays(snapshot),
    snapshot.paid_leave_days ?? count(snapshot.paid_service_incentive_leaves),
    snapshot.unpaid_leave_days ?? count(unpaidLeaves),
    snapshot.absence_days ?? count(absences),
    snapshot.awol_days ?? '',
    record.regular_hours ?? '',
    record.overtime_hours ?? '',
    record.night_diff_hours ?? '',
    record.night_diff_overtime_hours ?? '',
    numeric(record.regular_hours) + numeric(record.overtime_hours),
    snapshot.late_minutes ?? '',
    snapshot.undertime_minutes ?? '',
    snapshot.monthly_base_salary ?? '',
    snapshot.effective_monthly_salary ?? '',
    snapshot.contractual_daily_rate ?? '',
    snapshot.daily_rate ?? '',
    snapshot.minimum_daily_rate ?? '',
    snapshot.daily_rate_floor_applied ? 'Yes' : 'No',
    snapshot.daily_rate_divisor ?? '',
    snapshot.daily_rate_divisor_source ?? '',
    snapshot.hourly_rate ?? '',
    snapshot.deduction_hourly_rate ?? '',
    snapshot.night_premium_start ?? '',
    snapshot.night_premium_end ?? '',
    snapshot.night_premium_daily_rate_percent ?? '',
    record.regular_pay ?? record.basic_pay ?? 0,
    record.overtime_pay ?? 0,
    record.night_differential_pay ?? 0,
    record.holiday_pay ?? 0,
    record.gross_pay ?? 0,
    record.sss_employee ?? 0,
    record.philhealth_employee ?? 0,
    record.pagibig_employee ?? 0,
    record.withholding_tax ?? 0,
    record.statutory_deductions ?? 0,
    record.cash_advance_deduction ?? 0,
    record.leave_deduction ?? 0,
    record.awol_deduction ?? 0,
    record.late_undertime_deduction ?? 0,
    record.absences_deduction ?? 0,
    record.total_deductions ?? 0,
    getDeductionExcess(record),
    getDisplayNetPay(record),
    dateList(paidLeaves),
    dateList(unpaidLeaves),
    dateList(absences),
    count(snapshot.cash_advance_deductions),
  ];
}
