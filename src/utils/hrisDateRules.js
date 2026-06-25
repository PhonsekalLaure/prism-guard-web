export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getBusinessTodayDateInputValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function getDeploymentStartDateMinimum({
  hireDate = null,
  clientContractStartDate = null,
  date = new Date(),
} = {}) {
  return [
    getBusinessTodayDateInputValue(date),
    hireDate,
    clientContractStartDate,
  ]
    .filter(Boolean)
    .sort()
    .at(-1);
}

export function getAgeDateBounds({ minAge = 18, maxAge = 45 } = {}) {
  const today = new Date();
  const oldestAllowedBirthDate = new Date(
    today.getFullYear() - maxAge - 1,
    today.getMonth(),
    today.getDate() + 1
  );
  return {
    min: toDateInputValue(oldestAllowedBirthDate),
    max: toDateInputValue(new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate())),
  };
}

export function getHireDateBounds() {
  const today = new Date();
  return {
    min: toDateInputValue(new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())),
    max: toDateInputValue(new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())),
  };
}

export function addMonthsToDateInputValue(dateValue, months) {
  const [year, month, day] = String(dateValue || '').split('-').map(Number);
  if (!year || !month || !day) return '';

  const targetMonthIndex = month - 1 + months;
  const targetYear = year + Math.floor(targetMonthIndex / 12);
  const normalizedMonthIndex = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonthIndex + 1, 0)).getUTCDate();
  const targetDay = Math.min(day, lastDayOfTargetMonth);
  return toDateInputValue(new Date(targetYear, normalizedMonthIndex, targetDay));
}

export function getEmploymentContractEndDateBounds(startDate) {
  if (!startDate) return { min: '', max: '' };

  return {
    min: addMonthsToDateInputValue(startDate, 6),
    max: addMonthsToDateInputValue(startDate, 12),
  };
}

export function isEmploymentContractEndDateInRange(startDate, endDate) {
  if (!startDate || !endDate) return false;

  const { min, max } = getEmploymentContractEndDateBounds(startDate);
  return Boolean(min && max && endDate >= min && endDate <= max);
}

export function getRenewalDateBounds(currentEndDate) {
  const today = new Date();
  const maxEndDate = toDateInputValue(new Date(today.getFullYear() + 10, today.getMonth(), today.getDate()));

  if (!currentEndDate) {
    return {
      minStartDate: toDateInputValue(today),
      maxEndDate,
    };
  }

  const nextDay = new Date(currentEndDate);
  nextDay.setDate(nextDay.getDate() + 1);

  return {
    minStartDate: toDateInputValue(nextDay),
    maxEndDate,
  };
}
