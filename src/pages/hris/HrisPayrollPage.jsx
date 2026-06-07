import { useCallback, useEffect, useMemo, useState } from 'react';
import Notification from '@components/ui/Notification';
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

export default function HrisPayrollPage() {
  const defaultPeriod = useMemo(getDefaultPayrollPeriod, []);
  const cutoffOptions = useMemo(() => getPayrollCutoffOptions(), []);
  const [selectedCutoffKey, setSelectedCutoffKey] = useState(defaultPeriod.key);
  const [periodStart, setPeriodStart] = useState(defaultPeriod.start);
  const [periodEnd, setPeriodEnd] = useState(defaultPeriod.end);
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState('');
  const [selectedRun, setSelectedRun] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loadingRuns, setLoadingRuns] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [recordsPage, setRecordsPage] = useState(1);
  const { notification, showNotification, closeNotification } = useNotification();

  const handlePayrollError = useCallback((err, fallback) => {
    setError(getPayrollErrorMessage(err, fallback));
  }, []);

  const loadRuns = useCallback(async (preferredRunId = selectedRunId, { silent = false } = {}) => {
    if (!silent) setLoadingRuns(true);
    try {
      const result = await payrollService.listPayrollRuns({ page: 1, limit: 25 });
      const nextRuns = result.data || [];
      setRuns(nextRuns);
      const nextSelected = preferredRunId || nextRuns[0]?.id || '';
      setSelectedRunId(nextSelected);
      return nextSelected;
    } catch (err) {
      handlePayrollError(err, 'Failed to load payroll runs.');
      return '';
    } finally {
      if (!silent) setLoadingRuns(false);
    }
  }, [selectedRunId, handlePayrollError]);

  const loadRunDetail = useCallback(async (runId) => {
    if (!runId) {
      setSelectedRun(null);
      return;
    }
    setLoadingRecords(true);
    try {
      const run = await payrollService.getPayrollRunById(runId);
      setSelectedRun(run);
      setPreview(null);
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
    loadRuns().then((runId) => {
      if (!cancelled && runId) loadRunDetail(runId);
    });
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const records = useMemo(() => {
    const sourceRecords = preview?.records || selectedRun?.payroll_records || [];
    const search = filters.search.trim().toLowerCase();
    return sourceRecords.filter((record) => {
      const matchesStatus = !filters.status || String(record.status || selectedRun?.status || 'draft') === filters.status;
      const haystack = `${record.employee_name || ''} ${record.employee_number || ''}`.toLowerCase();
      const matchesSearch = !search || haystack.includes(search);
      return matchesStatus && matchesSearch;
    }).slice().sort(comparePayrollRecords);
  }, [filters.search, filters.status, preview, selectedRun]);

  const activeSummary = preview?.summary || selectedRun?.summary || {};
  const totalRecordPages = Math.max(1, Math.ceil(records.length / PAYROLL_PAGE_LIMIT));
  const pagedRecords = useMemo(() => {
    const safePage = Math.min(recordsPage, totalRecordPages);
    const start = (safePage - 1) * PAYROLL_PAGE_LIMIT;
    return records.slice(start, start + PAYROLL_PAGE_LIMIT);
  }, [records, recordsPage, totalRecordPages]);
  const statusLabel = preview
    ? 'Preview only'
    : selectedRun
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
    await loadRuns(run.id, { silent: true });
    setError('');
  }, [loadRuns]);

  const previewAction = useReportAction({
    successMessage: 'Payroll preview ready.',
    errorFallback: 'Failed to preview payroll.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.previewPayrollRun({
      period_start: periodStart,
      period_end: periodEnd,
    }),
    afterSuccess: async (nextPreview) => {
      setPreview(nextPreview);
      setSelectedRun(null);
      setSelectedRunId('');
      setRecordsPage(1);
      setError('');
    },
  });

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
      setPreview(null);
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

  const markPaidAction = useReportAction({
    loadingMessage: 'Marking payroll as paid...',
    successMessage: 'Payroll run marked as paid.',
    errorFallback: 'Failed to mark payroll run as paid.',
    showNotification,
    getErrorMessage: getPayrollErrorMessage,
    run: () => payrollService.markPayrollRunPaid(selectedRunId),
    afterSuccess: updateRunAfterSuccess,
  });

  const actionLoading = previewAction.loading
    ? 'preview'
    : createAction.loading
      ? 'create'
      : recalculateAction.loading
        ? 'recalculate'
        : approveAction.loading
          ? 'approve'
          : markPaidAction.loading
            ? 'markPaid'
            : '';

  const handleSelectRun = (runId) => {
    setRecordsPage(1);
    setSelectedRunId(runId);
    if (runId) {
      loadRunDetail(runId);
    } else {
      setSelectedRun(null);
      setPreview(null);
    }
  };

  const handleSelectCutoff = (cutoffKey) => {
    const cutoff = cutoffOptions.find((option) => option.key === cutoffKey);
    if (!cutoff || cutoff.disabled) return;
    setSelectedCutoffKey(cutoff.key);
    setPeriodStart(cutoff.periodStart);
    setPeriodEnd(cutoff.periodEnd);
    setSelectedRun(null);
    setSelectedRunId('');
    setPreview(null);
    setRecordsPage(1);
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
    const source = preview || selectedRun;
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
        onMarkPaid={markPaidAction.execute}
        onPreview={previewAction.execute}
        onRecalculate={recalculateAction.execute}
        onSelectCutoff={handleSelectCutoff}
        onSelectRun={handleSelectRun}
        cutoffOptions={cutoffOptions}
        runs={runs}
        selectedCutoffKey={selectedCutoffKey}
        selectedRun={selectedRun}
        selectedRunId={selectedRunId}
      />

      <div className="dashboard-content">
        {error && <div className="pr-error-banner">{error}</div>}
        <HrisPayrollStatCards summary={activeSummary} statusLabel={statusLabel} />
        <HrisPayrollOngoingAlert run={selectedRun} preview={preview} />
        <HrisPayrollFilterBar filters={filters} onChange={handleFilterChange} />
        <HrisPayrollTable
          currentPage={recordsPage}
          loading={loadingRuns || loadingRecords}
          onPageChange={setRecordsPage}
          pageLimit={PAYROLL_PAGE_LIMIT}
          preview={preview}
          records={pagedRecords}
          run={selectedRun}
          totalRecords={records.length}
        />
      </div>

    </>
  );
}
