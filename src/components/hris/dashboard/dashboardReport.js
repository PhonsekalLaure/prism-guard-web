const REPORT_HEADERS = [
  'Section',
  'Entry',
  'Primary Detail',
  'Secondary Detail',
  'Status',
  'Value',
];

function csvValue(value) {
  const rawText = String(value ?? '');
  const text = /^[\t\r]|^\s*[=+\-@]/.test(rawText) ? `'${rawText}` : rawText;
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function addSectionSummary(rows, section, total, displayed) {
  rows.push([
    section,
    'Summary',
    `${total ?? displayed} total`,
    `${displayed} displayed`,
    '',
    '',
  ]);
}

function addAttendanceRows(rows, stats) {
  rows.push(
    ['Attendance', 'Total Clock-ins', stats.date || '', '', '', stats.totalClockIns ?? 0],
    ['Attendance', 'Overtime Logs', stats.date || '', '', '', stats.overtimeLogs ?? 0],
    ['Attendance', 'Total Absences', stats.date || '', '', '', stats.totalAbsences ?? 0],
  );
}

function addIncidentRows(rows, incidents) {
  const entries = incidents?.data || [];
  addSectionSummary(rows, 'Critical Incidents', incidents?.total, entries.length);
  entries.forEach((incident) => {
    rows.push([
      'Critical Incidents',
      incident.site || 'Unknown site',
      incident.summary || '',
      incident.relativeTime || '',
      incident.severity || '',
      '',
    ]);
  });
}

function addLeaveRows(rows, leaveRequests) {
  const entries = leaveRequests?.data || [];
  addSectionSummary(rows, 'Pending Leave Requests', leaveRequests?.total, entries.length);
  entries.forEach((request) => {
    rows.push([
      'Pending Leave Requests',
      request.name || '',
      request.type || '',
      request.dateRange || request.statusMeta || '',
      request.status || 'pending',
      request.daysRequested ?? '',
    ]);
  });
}

function addCashAdvanceRows(rows, cashAdvances) {
  const entries = cashAdvances?.data || [];
  addSectionSummary(rows, 'Pending Cash Advances', cashAdvances?.total, entries.length);
  entries.forEach((advance) => {
    rows.push([
      'Pending Cash Advances',
      advance.name || '',
      advance.reason || '',
      advance.statusMeta || '',
      advance.status || 'pending',
      advance.amountRequestedLabel || (advance.amountRequested ?? ''),
    ]);
  });
}

function addManpowerRows(rows, manpower) {
  const entries = manpower?.data || [];
  addSectionSummary(rows, 'Manpower Distribution', manpower?.total, entries.length);
  entries.forEach((client) => {
    rows.push([
      'Manpower Distribution',
      client.company || '',
      client.address || '',
      `${client.activeGuards ?? 0} active guards`,
      client.status || '',
      client.activeGuards ?? 0,
    ]);
  });
}

export function buildDashboardReportRows(summary, generatedAt = new Date()) {
  const access = summary?.access || {};
  const errors = summary?.errors || {};
  const rows = [
    REPORT_HEADERS,
    ['Report Metadata', 'Generated At', generatedAt.toISOString(), '', '', ''],
  ];

  if (access.attendance !== false && summary?.stats) {
    addAttendanceRows(rows, summary.stats);
  }
  if (access.incidents !== false && summary?.incidents) {
    addIncidentRows(rows, summary.incidents);
  }
  if (access.leaves !== false && summary?.leaveRequests) {
    addLeaveRows(rows, summary.leaveRequests);
  }
  if (access.manpower !== false && summary?.manpower) {
    addManpowerRows(rows, summary.manpower);
  }
  if (access.cashAdvances !== false && summary?.cashAdvances) {
    addCashAdvanceRows(rows, summary.cashAdvances);
  }

  Object.entries(errors).forEach(([section, message]) => {
    if (message && access[section] !== false) {
      rows.push(['Widget Error', section, message, '', 'Failed to load', '']);
    }
  });

  return rows;
}

export function buildDashboardReportCsv(summary, generatedAt = new Date()) {
  return buildDashboardReportRows(summary, generatedAt)
    .map((row) => row.map(csvValue).join(','))
    .join('\n');
}

export function buildDashboardReportFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `hris-dashboard-report-${year}-${month}-${day}.csv`;
}
