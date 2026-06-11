import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildDashboardReportCsv,
  buildDashboardReportFilename,
  buildDashboardReportRows,
} from './dashboardReport.js';

const GENERATED_AT = new Date('2026-06-11T04:05:06.000Z');

function createSummary() {
  return {
    access: {
      attendance: true,
      incidents: true,
      leaves: false,
      manpower: true,
      cashAdvances: true,
    },
    errors: {
      attendance: null,
      incidents: null,
      leaves: null,
      manpower: 'Failed to load manpower distribution.',
      cashAdvances: null,
    },
    stats: {
      totalClockIns: 4,
      overtimeLogs: 1,
      totalAbsences: 2,
      date: '2026-06-11',
    },
    incidents: {
      total: 3,
      data: [{
        site: 'Main, Gate',
        summary: 'Line one\nLine two',
        relativeTime: 'Reported now',
        severity: 'high',
      }],
    },
    leaveRequests: {
      total: 1,
      data: [{ name: 'Must not export' }],
    },
    manpower: null,
    cashAdvances: {
      total: 1,
      data: [{
        name: 'Alex',
        reason: 'Medical',
        status: 'pending',
        amountRequestedLabel: 'PHP 1,000.00',
      }],
    },
  };
}

test('builds a dated permission-filtered dashboard report', () => {
  const summary = createSummary();
  const rows = buildDashboardReportRows(summary, GENERATED_AT);
  const csv = buildDashboardReportCsv(summary, GENERATED_AT);

  assert.equal(
    buildDashboardReportFilename(GENERATED_AT),
    'hris-dashboard-report-2026-06-11.csv',
  );
  assert.equal(rows.some((row) => row.includes('Must not export')), false);
  assert.match(csv, /Critical Incidents,Summary,3 total,1 displayed/);
  assert.match(csv, /"Main, Gate"/);
  assert.match(csv, /"Line one\nLine two"/);
  assert.match(csv, /Widget Error,manpower/);
});

test('neutralizes spreadsheet formulas in exported text cells', () => {
  const summary = createSummary();
  summary.incidents.data[0] = {
    site: '=HYPERLINK("https://example.com")',
    summary: '  +SUM(1,2)',
    relativeTime: '\t@unsafe',
    severity: '-1+1',
  };

  const csv = buildDashboardReportCsv(summary, GENERATED_AT);

  assert.match(csv, /"'=HYPERLINK\(""https:\/\/example.com""\)"/);
  assert.ok(csv.includes('"\'  +SUM(1,2)"'));
  assert.ok(csv.includes('\'\t@unsafe'));
  assert.match(csv, /'-1\+1/);
});

test('preserves zero values in report rows', () => {
  const summary = createSummary();
  summary.cashAdvances.data[0].amountRequestedLabel = '';
  summary.cashAdvances.data[0].amountRequested = 0;

  const rows = buildDashboardReportRows(summary, GENERATED_AT);
  const cashAdvanceRow = rows.find((row) => row[0] === 'Pending Cash Advances'
    && row[1] === 'Alex');

  assert.equal(cashAdvanceRow[5], 0);
});
