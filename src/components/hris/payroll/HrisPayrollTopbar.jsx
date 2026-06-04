import {
  FaCalculator,
  FaCheck,
  FaDownload,
  FaMoneyBillWave,
  FaRedo,
  FaSpinner,
} from 'react-icons/fa';

import { formatPayrollPeriodLabel } from './payrollPageUtils';

function formatRunLabel(run) {
  if (!run) return 'Select payroll run';
  return `${formatPayrollPeriodLabel(run.period_start, run.period_end)} - ${String(run.status || '').toUpperCase()}`;
}

export default function HrisPayrollTopbar({
  actionLoading,
  cutoffOptions,
  onApprove,
  onCreate,
  onExport,
  onMarkPaid,
  onPreview,
  onRecalculate,
  onSelectCutoff,
  onSelectRun,
  runs,
  selectedCutoffKey,
  selectedRun,
  selectedRunId,
}) {
  const isBusy = Boolean(actionLoading);
  const selectedCutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);
  const cutoffActionDisabled = isBusy || !selectedCutoff || selectedCutoff.disabled;
  const canRecalculate = selectedRun?.status === 'draft';
  const canApprove = selectedRun?.status === 'draft';
  const canMarkPaid = selectedRun?.status === 'approved';
  const showGenerationActions = !selectedRun && !selectedRunId;

  return (
    <header className="pr-topbar">
      <div className="pr-title-group">
        <h2>Payroll Management</h2>
        <p>Calculate, review, approve, and mark cash-released salaries as paid</p>
      </div>

      <div className="pr-topbar-right pr-topbar-right--payroll">
        <label className="pr-selector-field">
          <span className="pr-selector-label">Cutoff</span>
          <select
            className="pr-period-select pr-cutoff-select"
            value={selectedCutoffKey || ''}
            onChange={(event) => onSelectCutoff(event.target.value)}
            aria-label="Payroll cutoff"
          >
            {cutoffOptions.map((option) => (
              <option key={option.key} value={option.key} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="pr-selector-field">
          <span className="pr-selector-label">Saved run</span>
          <select
            className="pr-period-select pr-run-select"
            value={selectedRunId || ''}
            onChange={(event) => onSelectRun(event.target.value)}
            aria-label="Saved payroll run"
          >
            <option value="">No saved run selected</option>
            {runs.map((run) => (
              <option key={run.id} value={run.id}>{formatRunLabel(run)}</option>
            ))}
          </select>
        </label>

        <button className="pr-export-btn" type="button" onClick={onExport} disabled={isBusy}>
          <FaDownload /> Export
        </button>

        {showGenerationActions && (
          <>
            <button className="pr-export-btn" type="button" onClick={onPreview} disabled={cutoffActionDisabled}>
              {actionLoading === 'preview' ? <FaSpinner className="pr-spin" /> : <FaCalculator />}
              Preview
            </button>

            <button className="pr-process-btn" type="button" onClick={onCreate} disabled={cutoffActionDisabled}>
              {actionLoading === 'create' ? <FaSpinner className="pr-spin" /> : <FaMoneyBillWave />}
              Create Draft
            </button>
          </>
        )}

        {canRecalculate && (
          <button className="pr-export-btn" type="button" onClick={onRecalculate} disabled={isBusy}>
            {actionLoading === 'recalculate' ? <FaSpinner className="pr-spin" /> : <FaRedo />}
            Recalculate
          </button>
        )}

        {canApprove && (
          <button className="pr-process-btn" type="button" onClick={onApprove} disabled={isBusy}>
            {actionLoading === 'approve' ? <FaSpinner className="pr-spin" /> : <FaCheck />}
            Approve
          </button>
        )}

        {canMarkPaid && (
          <button className="pr-process-btn success" type="button" onClick={onMarkPaid} disabled={isBusy}>
            {actionLoading === 'markPaid' ? <FaSpinner className="pr-spin" /> : <FaCheck />}
            Mark Paid
          </button>
        )}
      </div>
    </header>
  );
}
