import assert from 'node:assert/strict';
import test from 'node:test';

import {
  toDateInputValue,
  getBusinessTodayDateInputValue,
  addMonthsToDateInputValue,
  getAgeDateBounds,
  getDeploymentStartDateMinimum,
  getHireDateBounds,
  getEmploymentContractEndDateBounds,
  getRenewalDateBounds,
  isEmploymentContractEndDateInRange,
} from './hrisDateRules.js';

test('toDateInputValue formats date object to YYYY-MM-DD', () => {
  const date = new Date(2026, 5, 12);
  assert.equal(toDateInputValue(date), '2026-06-12');
});

test('getBusinessTodayDateInputValue calculates manila timezone correctly', () => {
  const date = new Date('2026-06-12T16:00:00Z');
  assert.equal(getBusinessTodayDateInputValue(date), '2026-06-13');
});

test('getAgeDateBounds returns min and max bounds', () => {
  const bounds = getAgeDateBounds({ minAge: 18, maxAge: 65 });
  assert.match(bounds.min, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(bounds.max, /^\d{4}-\d{2}-\d{2}$/);

  const minYear = Number(bounds.min.slice(0, 4));
  const maxYear = Number(bounds.max.slice(0, 4));
  assert.ok(minYear < maxYear);
});

test('getHireDateBounds returns min and max bounds', () => {
  const bounds = getHireDateBounds();
  assert.match(bounds.min, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(bounds.max, /^\d{4}-\d{2}-\d{2}$/);
});

test('addMonthsToDateInputValue preserves dates and clamps month ends', () => {
  assert.equal(addMonthsToDateInputValue('2026-06-12', 6), '2026-12-12');
  assert.equal(addMonthsToDateInputValue('2026-08-31', 6), '2027-02-28');
});

test('getEmploymentContractEndDateBounds returns 6-month and 1-year contract limits', () => {
  assert.deepEqual(getEmploymentContractEndDateBounds('2026-06-12'), {
    min: '2026-12-12',
    max: '2027-06-12',
  });
});

test('isEmploymentContractEndDateInRange validates inclusive security service agreement limits', () => {
  assert.equal(isEmploymentContractEndDateInRange('2026-06-12', '2026-12-12'), true);
  assert.equal(isEmploymentContractEndDateInRange('2026-06-12', '2027-06-12'), true);
  assert.equal(isEmploymentContractEndDateInRange('2026-06-12', '2026-12-11'), false);
  assert.equal(isEmploymentContractEndDateInRange('2026-06-12', '2027-06-13'), false);
});

test('getRenewalDateBounds without currentEndDate uses today', () => {
  const bounds = getRenewalDateBounds();
  assert.match(bounds.minStartDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(bounds.maxEndDate, /^\d{4}-\d{2}-\d{2}$/);
});

test('getRenewalDateBounds with currentEndDate offsets by one day', () => {
  const bounds = getRenewalDateBounds('2026-06-12');
  assert.equal(bounds.minStartDate, '2026-06-13');
});

test('deployment start minimum uses the latest applicable date', () => {
  const date = new Date('2026-06-13T16:30:00.000Z');

  assert.equal(
    getDeploymentStartDateMinimum({
      hireDate: '2026-06-16',
      clientContractStartDate: '2026-06-15',
      date,
    }),
    '2026-06-16'
  );
});

test('deployment start minimum uses the Manila business date', () => {
  const date = new Date('2026-06-13T16:30:00.000Z');

  assert.equal(
    getDeploymentStartDateMinimum({
      hireDate: '2026-06-01',
      clientContractStartDate: '2026-06-01',
      date,
    }),
    '2026-06-14'
  );
});
