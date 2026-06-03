import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import HrisPayrollTopbar from '@hris-components/payroll/HrisPayrollTopbar';
import HrisPayrollStatCards from '@hris-components/payroll/HrisPayrollStatCards';
import HrisPayrollOngoingAlert from '@hris-components/payroll/HrisPayrollOngoingAlert';
import HrisPayrollFilterBar from '@hris-components/payroll/HrisPayrollFilterBar';
import HrisPayrollTable from '@hris-components/payroll/HrisPayrollTable';
import {
  csvValue,
  getDefaultPayrollPeriod,
  getPayrollCutoffOptions,
  getPayrollErrorMessage,
} from '@hris-components/payroll/payrollPageUtils';
import { getDisplayNetPay } from '@hris-components/payroll/payrollFormatters';
import payrollService from '@services/hris/payrollService';
import '../../styles/hris/HrisPayroll.css';
import '@styles/components/Notification.css';

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
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handlePayrollError = useCallback((err, fallback) => {
    const msg = getPayrollErrorMessage(err, fallback);
    if (msg === 'A payroll run already exists for this period') {
      setToast({
        type: 'error',
        title: 'Duplicate Payroll Run',
        message: msg,
      });
      setError('');
    } else {
      setError(msg);
    }
  }, []);

  const loadRuns = useCallback(async (preferredRunId = selectedRunId) => {
    setLoadingRuns(true);
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
      setLoadingRuns(false);
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
  const statusLabel = preview
    ? 'Preview only'
    : selectedRun
      ? String(selectedRun.status || 'draft').toUpperCase()
      : loadingRuns
        ? 'Loading runs'
        : 'No run selected';

  const handleSelectRun = (runId) => {
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
  };

  const handlePreview = async () => {
    setActionLoading('preview');
    try {
      const nextPreview = await payrollService.previewPayrollRun({
        period_start: periodStart,
        period_end: periodEnd,
      });
      setPreview(nextPreview);
      setSelectedRun(null);
      setSelectedRunId('');
      setError('');
    } catch (err) {
      handlePayrollError(err, 'Failed to preview payroll.');
    } finally {
      setActionLoading('');
    }
  };

  const handleCreate = async () => {
    setActionLoading('create');
    try {
      const run = await payrollService.createPayrollRun({
        period_start: periodStart,
        period_end: periodEnd,
      });
      setPreview(null);
      setSelectedRun(run);
      setSelectedRunId(run.id);
      await loadRuns(run.id);
      setError('');
    } catch (err) {
      handlePayrollError(err, 'Failed to create payroll run.');
    } finally {
      setActionLoading('');
    }
  };

  const runAction = async (action, serviceCall, successRunId = selectedRunId) => {
    if (!successRunId) return;
    setActionLoading(action);
    try {
      const run = await serviceCall(successRunId);
      setSelectedRun(run);
      setSelectedRunId(run.id);
      await loadRuns(run.id);
      setError('');
    } catch (err) {
      handlePayrollError(err, 'Failed to update payroll run.');
    } finally {
      setActionLoading('');
    }
  };

  const handleExport = () => {
    const rows = [
      ['Employee', 'Employee ID', 'Status', 'Gross Pay', 'Deductions', 'Net Pay'],
      ...records.map((record) => [
        record.employee_name || '',
        record.employee_number || '',
        record.status || selectedRun?.status || 'draft',
        record.gross_pay || 0,
        record.total_deductions || 0,
        getDisplayNetPay(record),
      ]),
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
      <HrisPayrollTopbar
        actionLoading={actionLoading}
        onApprove={() => runAction('approve', payrollService.approvePayrollRun)}
        onCreate={handleCreate}
        onExport={handleExport}
        onMarkPaid={() => runAction('markPaid', payrollService.markPayrollRunPaid)}
        onPreview={handlePreview}
        onRecalculate={() => runAction('recalculate', payrollService.recalculatePayrollRun)}
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
        <HrisPayrollFilterBar filters={filters} onChange={setFilters} />
        <HrisPayrollTable
          loading={loadingRuns || loadingRecords}
          preview={preview}
          records={records}
          run={selectedRun}
        />
      </div>

      {toast && (
        <div className="notif-stack" aria-live="polite" aria-label="Notifications">
          <div className={`notif notif-${toast.type} notif-enter`}>
            <FaExclamationTriangle className="notif-icon" />
            <div className="notif-body">
              <span className="notif-title">{toast.title}</span>
              <span className="notif-message">{toast.message}</span>
            </div>
            <button
              className="notif-close"
              type="button"
              onClick={() => setToast(null)}
              aria-label="Close notification"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
