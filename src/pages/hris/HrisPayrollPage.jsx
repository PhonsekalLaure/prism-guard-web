import { useCallback, useEffect, useMemo, useState } from 'react';
import HrisPayrollTopbar from '@hris-components/payroll/HrisPayrollTopbar';
import HrisPayrollStatCards from '@hris-components/payroll/HrisPayrollStatCards';
import HrisPayrollOngoingAlert from '@hris-components/payroll/HrisPayrollOngoingAlert';
import HrisPayrollFilterBar from '@hris-components/payroll/HrisPayrollFilterBar';
import HrisPayrollTable from '@hris-components/payroll/HrisPayrollTable';
import {
  csvValue,
  getDefaultPayrollPeriod,
  getPayrollErrorMessage,
} from '@hris-components/payroll/payrollPageUtils';
import payrollService from '@services/hris/payrollService';
import '../../styles/hris/HrisPayroll.css';

export default function HrisPayrollPage() {
  const defaultPeriod = useMemo(getDefaultPayrollPeriod, []);
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
      setError(getPayrollErrorMessage(err, 'Failed to load payroll runs.'));
      return '';
    } finally {
      setLoadingRuns(false);
    }
  }, [selectedRunId]);

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
      setError('');
    } catch (err) {
      setError(getPayrollErrorMessage(err, 'Failed to load payroll run.'));
    } finally {
      setLoadingRecords(false);
    }
  }, []);

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
    });
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
      setError(getPayrollErrorMessage(err, 'Failed to preview payroll.'));
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
      setError(getPayrollErrorMessage(err, 'Failed to create payroll run.'));
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
      setError(getPayrollErrorMessage(err, 'Failed to update payroll run.'));
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
        record.net_pay || 0,
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
        onSelectRun={handleSelectRun}
        periodEnd={periodEnd}
        periodStart={periodStart}
        runs={runs}
        selectedRun={selectedRun}
        selectedRunId={selectedRunId}
        setPeriodEnd={setPeriodEnd}
        setPeriodStart={setPeriodStart}
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
    </>
  );
}
