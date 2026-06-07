import {
  FaCalculator,
  FaCheck,
  FaDownload,
  FaMoneyBillWave,
  FaRedo,
} from 'react-icons/fa';

import ReportActionButton from '@components/ui/ReportActionButton';
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

        <ReportActionButton
          className="pr-export-btn"
          label="Export"
          icon={FaDownload}
          disabled={isBusy}
          variant="secondary"
          onClick={onExport}
        />

        {showGenerationActions && (
          <>
            <ReportActionButton
              className="pr-export-btn"
              label="Preview"
              loadingLabel="Previewing..."
              icon={FaCalculator}
              loading={actionLoading === 'preview'}
              disabled={cutoffActionDisabled}
              variant="secondary"
              onClick={onPreview}
            />

            <ReportActionButton
              className="pr-process-btn"
              label="Create Draft"
              loadingLabel="Creating..."
              icon={FaMoneyBillWave}
              loading={actionLoading === 'create'}
              disabled={cutoffActionDisabled}
              variant="primary"
              onClick={onCreate}
            />
          </>
        )}

        {canRecalculate && (
          <ReportActionButton
            className="pr-export-btn"
            label="Recalculate"
            loadingLabel="Recalculating..."
            icon={FaRedo}
            loading={actionLoading === 'recalculate'}
            disabled={isBusy}
            variant="secondary"
            onClick={onRecalculate}
          />
        )}

        {canApprove && (
          <ReportActionButton
            className="pr-process-btn"
            label="Approve"
            loadingLabel="Approving..."
            icon={FaCheck}
            loading={actionLoading === 'approve'}
            disabled={isBusy}
            variant="primary"
            onClick={onApprove}
          />
        )}

        {canMarkPaid && (
          <ReportActionButton
            className="pr-process-btn success"
            label="Mark Paid"
            loadingLabel="Saving..."
            icon={FaCheck}
            loading={actionLoading === 'markPaid'}
            disabled={isBusy}
            variant="success"
            onClick={onMarkPaid}
          />
        )}
      </div>
    </header>
  );
}
