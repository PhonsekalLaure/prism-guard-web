import assert from 'node:assert/strict';
import test from 'node:test';

import {
  titleCase,
  formatDateTime,
  formatDate,
  formatWorkDays,
  formatShiftTime,
  getShiftType,
  getShiftLabel,
  getShiftLabelColor
} from './formatters.js';

test('titleCase converts text properly', () => {
  assert.equal(titleCase('hello_world'), 'Hello World');
  assert.equal(titleCase('SECURITY_GUARD'), 'SECURITY GUARD');
  assert.equal(titleCase(null), '');
});

test('formatDateTime formats dates correctly', () => {
  const dateStr = '2026-06-12T08:00:00Z';
  const result = formatDateTime(dateStr, { locale: 'en-US', formatOptions: { timeZone: 'UTC' } });
  assert.equal(result, 'Jun 12, 2026, 8:00 AM');
  assert.equal(formatDateTime(null), 'N/A');
  assert.equal(formatDateTime('invalid'), 'N/A');
});

test('formatDate formats dates correctly', () => {
  const dateStr = '2026-06-12T08:00:00Z';
  const result = formatDate(dateStr, { locale: 'en-US', formatOptions: { timeZone: 'UTC' } });
  assert.equal(result, 'Jun 12, 2026');
  assert.equal(formatDate(null), 'N/A');
});

test('formatWorkDays formats day arrays', () => {
  assert.equal(formatWorkDays([1, 2, 3]), 'Mon, Tue, Wed');
  assert.equal(formatWorkDays([]), 'N/A');
  assert.equal(formatWorkDays(null), 'N/A');
});

test('formatShiftTime formats time correctly', () => {
  const result = formatShiftTime('08:30');
  assert.ok(result.includes('8:30'));
  assert.ok(result.toLowerCase().includes('am'));
  assert.equal(formatShiftTime(null), '');
});

test('getShiftType calculates shift types', () => {
  assert.equal(getShiftType('08:00', '17:00'), 'day');
  assert.equal(getShiftType('20:00', '05:00'), 'night');
  assert.equal(getShiftType('08:00', '08:00'), '24hr');
  assert.equal(getShiftType(null, null), 'custom');
});

test('getShiftLabel maps types to labels', () => {
  assert.equal(getShiftLabel('08:00', '17:00'), 'Day Shift');
  assert.equal(getShiftLabel('20:00', '05:00'), 'Night Shift');
  assert.equal(getShiftLabel('08:00', '08:00'), '24-Hour Shift');
  assert.equal(getShiftLabel(null, null), 'Custom Shift');
});

test('getShiftLabelColor returns correct hex codes', () => {
  assert.equal(getShiftLabelColor('Day Shift'), '#f59e0b');
  assert.equal(getShiftLabelColor('Night Shift'), '#3b82f6');
  assert.equal(getShiftLabelColor('24-Hour Shift'), '#8b5cf6');
  assert.equal(getShiftLabelColor('Custom Shift'), '#6b7280');
});
