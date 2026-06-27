import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '@components/ui/Notification';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import HrisPayrollTopbar from '@hris-components/payroll/HrisPayrollTopbar';
import HrisPayrollStatCards from '@hris-components/payroll/HrisPayrollStatCards';
import HrisPayrollOngoingAlert from '@hris-components/payroll/HrisPayrollOngoingAlert';
import HrisPayrollFilterBar from '@hris-components/payroll/HrisPayrollFilterBar';
import HrisPayrollTable from '@hris-components/payroll/HrisPayrollTable';
import PayrollGovernmentRemittances from '@hris-components/payroll/PayrollGovernmentRemittances';
import PayrollHolidayManager from '@hris-components/payroll/PayrollHolidayManager';
import useNotification from '@hooks/useNotification';
import useReportAction from '@hooks/useReportAction';
import {
  csvValue,
  getDefaultPayrollPeriod,
  getPayrollCutoffOptions,
  getPayrollErrorMessage,
} from '@hris-components/payroll/payrollPageUtils';
import {
  buildPayrollExportRow,
  PAYROLL_EXPORT_HEADERS,
} from '@hris-components/payroll/payrollExport';
import payrollService from '@services/hris/payrollService';
import '../../styles/hris/HrisPayroll.css';

const PAYROLL_PAGE_LIMIT = 10;
const ATTENDANCE_BLOCKERS_PENDING = 'ATTENDANCE_PAYROLL_BLOCKERS_PENDING';
const LEGACY_MISSED_CLOCK_OUT_BLOCKERS_PENDING = 'MISSED_CLOCK_OUT_REVIEWS_PENDING';
const PAYROLL_RECALCULATION_REQUIRED = 'PAYROLL_RECALCULATION_REQUIRED';

function comparePayrollRecords(first, second) {
  const firstName = String(first.employee_name || '').toLowerCase();
  const secondName = String(second.employee_name || '').toLowerCase();
  if (firstName !== secondName) return firstName.localeCompare(secondName);

  const firstNumber = String(first.employee_number || first.employee_id || '').toLowerCase();
  const secondNumber = String(second.employee_number || second.employee_id || '').toLowerCase();
  return firstNumber.localeCompare(secondNumber);
}

function findActiveRunForCutoff(runs, cutoff) {
  if (!cutoff) return null;
  return runs.find((run) => (
    run.status !== 'cancelled'
    && run.period_start === cutoff.periodStart
    && run.period_end === cutoff.periodEnd
  )) || null;
}

function formatAttendanceBlockerDate(value) {
  if (!value) return 'Unknown date';
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function buildAttendanceReviewPath(review) {
  const status = review.type === 'attendance_contest' ? 'attendance_contest' : 'missed_clock_out';
  const params = new URLSearchParams({
    date: review.date || '',
    status,
  });

  if (status === 'attendance_contest') {
    if (!review.contestId) return '';
    params.set('contestId', review.contestId);
  } else {
    if (!review.attendanceLogId) return '';
    params.set('attendanceLogId', review.attendanceLogId);
  }

  return `/attendance?${params.toString()}`;
}

function normalizeAttendanceBlockers(details) {
  const missedClockOutReviews = (details?.missedClockOutReviews || details?.attendanceReviews || []).map((review) => ({
    ...review,
    type: 'missed_clock_out',
    typeLabel: 'Missed clock-out',
  }));
  const attendanceContests = (details?.attendanceContests || []).map((contest) => ({
    ...contest,
    type: 'attendance_contest',
    typeLabel: 'Attendance contest',
  }));
  const blockers = [...missedClockOutReviews, ...attendanceContests].sort((first, second) => {
    const dateCompare = String(first.date || '').localeCompare(String(second.date || ''));
    if (dateCompare !== 0) return dateCompare;
    return String(first.employeeName || '').localeCompare(String(second.employeeName || ''));
  });

  return {
    ...details,
    blockers,
    missedClockOutReviews,
    attendanceContests,
    count: details?.count ?? blockers.length,
    missedClockOutCount: details?.missedClockOutCount ?? missedClockOutReviews.length,
    attendanceContestCount: details?.attendanceContestCount ?? attendanceContests.length,
  };
}

export default function HrisPayrollPage() {
  const navigate = useNavigate();
  const defaultPeriod = useMemo(getDefaultPayrollPeriod, []);
  const cutoffOptions = useMemo(() => getPayrollCutoffOptions(), []);
  const [selectedCutoffKey, setSelectedCutoffKey] = useState(defaultPeriod.key);
  const [periodStart, setPeriodStart] = useState(defaultPeriod.start);
  const [periodEnd, setPeriodEnd] = useState(defaultPeriod.end);
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);
  const [paymentTarget, setPaymentTarget] = useState(null);
  const [attendanceBlockers, setAttendanceBlockers] = useState(null);
  const [recalculationPromptOpen, setRecalculationPromptOpen] = useState(false);
  const [holidayModalOpen, setHolidayModalOpen] = useState(false);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [recordsPage, setRecordsPage] = useState(1);
  const { notification, showNotification, closeNotification } = useNotification();

  const handlePayrollError = useCallback((err, fallback) => {
    setError(getPayrollErrorMessage(err, fallback));
  }, []);

  const loadRuns = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoadingRuns(true);
    try {
      const result = await payrollService.listPayrollRuns({ page: 1, limit: 25 });
      const nextRuns = result.data || [];
      setRuns(nextRuns);
      return nextRuns;
    } catch (err) {
      handlePayrollError(err, 'Failed to load payroll runs.');
      return [];
    } finally {
      if (!silent) setLoadingRuns(false);
    }
  }, [handlePayrollError]);

  const loadRunDetail = useCallback(async (runId) => {
    if (!runId) {
      setSelectedRun(null);
      return;
    }
    setLoadingRecords(true);
    try {
      const run = await payrollService.getPayrollRunById(runId);
      setSelectedRun(run);
      setPeriodStart(run.period_start);
      setPeriodEnd(run.period_end);
      const matchingCutoff = cutoffOptions.find((option) => (
        option.periodStart === run.period_start && option.periodEnd === run.period_end
      ));
      if (matchingCutoff) setSelectedCutoffKey(matchingCutoff.key);
      setError('');
    } catch (err) {
      handlePayrollError(err, 'Failed to load payroll run.');
    } finally {
      setLoadingRecords(false);
    }
  }, [cutoffOptions, handlePayrollError]);

  useEffect(() => {
    let cancelled = false;
    const selectedCutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);
    loadRuns().then((nextRuns) => {
      if (cancelled) return;
      const activeRun = findActiveRunForCutoff(nextRuns, selectedCutoff);
      if (activeRun) {
        setSelectedRunId(activeRun.id);
        loadRunDetail(activeRun.id);
      } else {
        setSelectedRunId('');
        setSelectedRun(null);
      }
    });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const records = useMemo(() => {
    const sourceRecords = selectedRun?.payroll_records || [];
    const search = filters.search.trim().toLowerCase();
    return sourceRecords.filter((record) => {
      const matchesStatus = !filters.status || String(record.status || selectedRun?.status || 'draft') === filters.status;
      const haystack = `${record.employee_name || ''} ${record.employee_number || ''}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesStatus && matchesSearch;
    }).slice().sort(comparePayrollRecords);
  }, [filters.search, filters.status, selectedRun]);

  const activeSummary = selectedRun?.summary || {};
  const totalRecordPages = Math.max(1, Math.ceil(records.length / PAYROLL_PAGE_LIMIT));
  const pagedRecords = useMemo(() => {
    const safePage = Math.min(recordsPage, totalRecordPages);
    const start = (safePage - 1) * PAYROLL_PAGE_LIMIT;
    return records.slice(start, start + PAYROLL_PAGE_LIMIT);
  }, [records, recordsPage, totalRecordPages]);
  const statusLabel = selectedRun
    ? String(selectedRun.status || 'draft').toUpperCase()
    : loadingRuns
      ? 'Loading runs'
      : 'No run selected';
  const selectedCutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);

  useEffect(() => {
    if (recordsPage > totalRecordPages) setRecordsPage(totalRecordPages);
  }, [recordsPage, totalRecordPages]);

  const updateRunAfterSuccess = useCallback(async (run) => {
    if (!run) return;
    setSelectedRun(run);
    setSelectedRunId(run.id);
    await loadRuns({ silent: true });
    setError('');
  }, [loadRuns]);

  const createAction = useReportAction({
    successMessage: 'Payroll draft created.',
    errorFallback: 'Failed to create payroll run.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.createPayrollRun({
      period_start: periodStart,
      period_end: periodEnd,
    }),
    afterSuccess: async (run) => {
      setRecordsPage(1);
      await updateRunAfterSuccess(run);
    },
  });

  const recalculateAction = useReportAction({
    successMessage: 'Payroll recalculated.',
    errorFallback: 'Failed to recalculate payroll.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.recalculatePayrollRun(selectedRunId),
    afterSuccess: async (run) => {
      setRecalculationPromptOpen(false);
      await updateRunAfterSuccess(run);
    },
  });

  const approveAction = useReportAction({
    loadingMessage: 'Approving payroll...',
    successMessage: 'Payroll run approved.',
    errorFallback: 'Failed to approve payroll run.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.approvePayrollRun(selectedRunId),
    onError: (error) => {
      const details = error?.response?.data?.details;
      if (
        details?.code === ATTENDANCE_BLOCKERS_PENDING
        || details?.code === LEGACY_MISSED_CLOCK_OUT_BLOCKERS_PENDING
      ) {
        setRecalculationPromptOpen(false);
        setAttendanceBlockers(normalizeAttendanceBlockers(details));
        return;
      }
      if (details?.code === PAYROLL_RECALCULATION_REQUIRED) {
        setAttendanceBlockers(null);
        setRecalculationPromptOpen(true);
      }
    },
    afterSuccess: updateRunAfterSuccess,
  });

  const markRecordPaidAction = useReportAction({
    loadingMessage: 'Marking guard as paid...',
    successMessage: 'Guard payroll record marked as paid.',
    errorFallback: 'Failed to mark guard payroll record as paid.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: ({ runId, recordId }) => payrollService.markPayrollRecordPaid(runId, recordId),
    afterSuccess: updateRunAfterSuccess,
  });

  const actionLoading = createAction.loading
    ? 'create'
    : recalculateAction.loading
      ? 'recalculate'
      : approveAction.loading
        ? 'approve'
        : markRecordPaidAction.loading
          ? 'markRecordPaid'
          : '';

  const handleSelectCutoff = (cutoffKey) => {
    const cutoff = cutoffOptions.find((option) => option.key === cutoffKey);
    if (!cutoff || cutoff.disabled) return;
    setSelectedCutoffKey(cutoff.key);
    setPeriodStart(cutoff.periodStart);
    setPeriodEnd(cutoff.periodEnd);
    setRecordsPage(1);
    const activeRun = findActiveRunForCutoff(runs, cutoff);
    if (activeRun) {
      setSelectedRunId(activeRun.id);
      loadRunDetail(activeRun.id);
    } else {
      setSelectedRun(null);
      setSelectedRunId('');
      setError('');
    }
  };

  const handleConfirmRecordPaid = async () => {
    if (!selectedRunId || !paymentTarget?.id) return;
    const result = await markRecordPaidAction.execute({
      runId: selectedRunId,
      recordId: paymentTarget.id,
    });
    if (result) setPaymentTarget(null);
  };

  const closeAttendanceBlockers = () => setAttendanceBlockers(null);

  const handleCheckAttendanceBlockers = async () => {
    const result = await approveAction.execute();
    if (result) setAttendanceBlockers(null);
  };

  const handleConfirmRecalculation = async () => {
    const result = await recalculateAction.execute();
    if (result) setRecalculationPromptOpen(false);
  };

  const handleOpenAttendanceBlocker = (review) => {
    const path = buildAttendanceReviewPath(review);
    if (!path) return;
    setAttendanceBlockers(null);
    navigate(path);
  };

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    setRecordsPage(1);
  };

  const handleExport = () => {
    const fallbackStatus = selectedRun?.status || 'draft';
    const rows = [
      PAYROLL_EXPORT_HEADERS,
      ...records.map((record) => buildPayrollExportRow(record, fallbackStatus)),
    ];
    const csv = rows.map((row) => row.map(csvValue).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const source = selectedRun;
    link.href = url;
    link.download = `payroll-${source?.period_start || periodStart}-${source?.period_end || periodEnd}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <HrisPayrollTopbar
        actionLoading={actionLoading}
        onAddHoliday={() => selectedCutoff && setHolidayModalOpen(true)}
        onApprove={approveAction.execute}
        onCreate={createAction.execute}
        onExport={handleExport}
        onRecalculate={recalculateAction.execute}
        onSelectCutoff={handleSelectCutoff}
        cutoffOptions={cutoffOptions}
        selectedCutoffKey={selectedCutoffKey}
        selectedRun={selectedRun}
      />

      <div className="dashboard-content">
        {error && <div className="pr-error-banner">{error}</div>}
        <HrisPayrollStatCards summary={activeSummary} statusLabel={statusLabel} />
        <HrisPayrollOngoingAlert run={selectedRun} />
        <PayrollGovernmentRemittances
          loading={loadingRuns || loadingRecords}
          run={selectedRun}
          showNotification={showNotification}
        />
        <HrisPayrollFilterBar filters={filters} onChange={handleFilterChange} />
        <HrisPayrollTable
          currentPage={recordsPage}
          loading={loadingRuns || loadingRecords}
          markingRecordId={markRecordPaidAction.loading ? paymentTarget?.id : ''}
          onMarkPaid={setPaymentTarget}
          onPageChange={setRecordsPage}
          pageLimit={PAYROLL_PAGE_LIMIT}
          records={pagedRecords}
          run={selectedRun}
          totalRecords={records.length}
        />
      </div>

      <ReportConfirmDialog
        open={Boolean(paymentTarget)}
        title="Mark Guard as Paid?"
        description={paymentTarget
          ? `${paymentTarget.employee_name || 'This guard'} will be marked paid for the selected cutoff. Any included cash advance deduction will be applied.`
          : ''}
        confirmLabel="Mark Paid"
        loading={markRecordPaidAction.loading}
        tone="warning"
        onCancel={() => setPaymentTarget(null)}
        onConfirm={handleConfirmRecordPaid}
      />
      <ReportConfirmDialog
        open={Boolean(attendanceBlockers)}
        title="Resolve Attendance Reviews"
        description={attendanceBlockers ? `${attendanceBlockers.count || 0} pending attendance review(s) must be resolved before this payroll can be approved.` : ''}
        confirmLabel="Check Again"
        cancelLabel="Close"
        loading={approveAction.loading}
        tone="warning"
        width="780px"
        onCancel={closeAttendanceBlockers}
        onConfirm={handleCheckAttendanceBlockers}
      >
        <div className="pr-attendance-blockers">
          <p className="pr-attendance-blockers-help">
            Open each review or contest, resolve the attendance decision, then check again. If all blockers are resolved, payroll will ask for recalculation before approval.
          </p>
          {(attendanceBlockers?.blockers || []).map((review) => (
            <div className="pr-attendance-blocker" key={`${review.type}:${review.attendanceLogId || review.contestId}`}>
              <div>
                <span className={`pr-attendance-blocker-type is-${review.type}`}>{review.typeLabel}</span>
                <strong>{review.employeeName}</strong>
                <span>{review.employeeNumber} - {formatAttendanceBlockerDate(review.date)}</span>
                <small>{review.clientName} / {review.siteName} / {review.shift}</small>
                {review.clockIn && <small>Clock-in: {review.clockIn}</small>}
                {review.reasonText && <small>Reason: {review.reasonText}</small>}
              </div>
              <button
                type="button"
                className="pr-attendance-blocker-action"
                onClick={() => handleOpenAttendanceBlocker(review)}
              >
                Review
              </button>
            </div>
          ))}
        </div>
      </ReportConfirmDialog>

      <ReportConfirmDialog
        open={recalculationPromptOpen}
        title="Recalculate Payroll Draft"
        description="Attendance reviews or contests were resolved after this payroll draft was calculated. Recalculate the draft first, then approve payroll again."
        confirmLabel="Recalculate"
        cancelLabel="Close"
        loading={recalculateAction.loading}
        tone="warning"
        onCancel={() => setRecalculationPromptOpen(false)}
        onConfirm={handleConfirmRecalculation}
      />
      <PayrollHolidayManager
        cutoff={selectedCutoff}
        isOpen={holidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        showNotification={showNotification}
      />
    </>
  );
}
