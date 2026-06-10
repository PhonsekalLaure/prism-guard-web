export const MINIMUM_DAILY_RATE = 695;
export const PAYROLL_DAILY_RATE_DIVISOR = 26;
export const MINIMUM_MONTHLY_BASE_PAY = MINIMUM_DAILY_RATE * PAYROLL_DAILY_RATE_DIVISOR;

export function isBelowMinimumMonthlyBasePay(value) {
  const amount = Number(value);
  return !Number.isFinite(amount) || amount < MINIMUM_MONTHLY_BASE_PAY;
}

export const MINIMUM_MONTHLY_BASE_PAY_MESSAGE =
  `Monthly base pay must be at least PHP ${MINIMUM_MONTHLY_BASE_PAY.toLocaleString()}.`;

export const MINIMUM_MONTHLY_BASE_PAY_HINT =
  `Minimum monthly base pay: PHP ${MINIMUM_MONTHLY_BASE_PAY.toLocaleString()} `
  + `(PHP ${MINIMUM_DAILY_RATE.toLocaleString()} x ${PAYROLL_DAILY_RATE_DIVISOR} days).`;
