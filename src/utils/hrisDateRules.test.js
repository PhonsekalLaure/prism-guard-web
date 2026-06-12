import assert from 'node:assert/strict';
import test from 'node:test';

import {
  toDateInputValue,
  getBusinessTodayDateInputValue,
  getAgeDateBounds,
  getHireDateBounds,
  getRenewalDateBounds
} from './hrisDateRules.js';

test('toDateInputValue formats date object to YYYY-MM-DD', () => {
  const date = new Date(2026, 5, 12); // Month is 0-indexed, so 5 is June
  assert.equal(toDateInputValue(date), '2026-06-12');
});

test('getBusinessTodayDateInputValue calculates manila timezone correctly', () => {
  const date = new Date('2026-06-12T16:00:00Z');
  // 16:00 UTC is June 13, 00:00 in Asia/Manila (+8)
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

test('getRenewalDateBounds without currentEndDate uses today', () => {
  const bounds = getRenewalDateBounds();
  assert.match(bounds.minStartDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(bounds.maxEndDate, /^\d{4}-\d{2}-\d{2}$/);
});

test('getRenewalDateBounds with currentEndDate offsets by one day', () => {
  // If the previous contract ends on Jun 12, the new one starts on Jun 13
  const bounds = getRenewalDateBounds('2026-06-12');
  assert.equal(bounds.minStartDate, '2026-06-13');
});
