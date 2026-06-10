import { useCallback, useEffect, useMemo, useState } from 'react';
import Notification from '@components/ui/Notification';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import HrisPayrollTopbar from '@hris-components/payroll/HrisPayrollTopbar';
import HrisPayrollStatCards from '@hris-components/payroll/HrisPayrollStatCards';
import HrisPayrollOngoingAlert from '@hris-components/payroll/HrisPayrollOngoingAlert';
import HrisPayrollFilterBar from '@hris-components/payroll/HrisPayrollFilterBar';
import HrisPayrollTable from '@hris-components/payroll/HrisPayrollTable';
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

export default function HrisPayrollPage() {
  const defaultPeriod = useMemo(getDefaultPayrollPeriod, []);
  const cutoffOptions = useMemo(() => getPayrollCutoffOptions(), []);
  const [selectedCutoffKey, setSelectedCutoffKey] = useState(defaultPeriod.key);
  const [periodStart, setPeriodStart] = useState(defaultPeriod.start);
  const [periodEnd, setPeriodEnd] = useState(defaultPeriod.end);
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);
  const [paymentTarget, setPaymentTarget] = useState(null);
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
    afterSuccess: updateRunAfterSuccess,
  });

  const approveAction = useReportAction({
    loadingMessage: 'Approving payroll...',
    successMessage: 'Payroll run approved.',
    errorFallback: 'Failed to approve payroll run.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.approvePayrollRun(selectedRunId),
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
    </>
  );
}
