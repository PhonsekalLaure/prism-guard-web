import {
  FaCalculator,
  FaCheck,
  FaDownload,
  FaMoneyBillWave,
  FaRedo,
  FaSpinner,
} from 'react-icons/fa';

function formatRunLabel(run) {
  if (!run) return 'Select payroll run';
  return `${run.period_start} to ${run.period_end} - ${String(run.status || '').toUpperCase()}`;
}

export default function HrisPayrollTopbar({
  actionLoading,
  onApprove,
  onCreate,
  onExport,
  onMarkPaid,
  onPreview,
  onRecalculate,
  onSelectRun,
  periodEnd,
  periodStart,
  runs,
  selectedRun,
  selectedRunId,
  setPeriodEnd,
  setPeriodStart,
}) {
  const isBusy = Boolean(actionLoading);
  const canRecalculate = selectedRun?.status === 'draft';
  const canApprove = selectedRun?.status === 'draft';
  const canMarkPaid = selectedRun?.status === 'approved';

  return (
    <header className="pr-topbar">
      <div className="pr-title-group">
        <h2>Payroll Management</h2>
        <p>Calculate, review, approve, and mark cash-released salaries as paid</p>
      </div>

      <div className="pr-topbar-right pr-topbar-right--payroll">
        <div className="pr-period-inputs">
          <input
            type="date"
            className="pr-period-select"
            value={periodStart}
            onChange={(event) => setPeriodStart(event.target.value)}
            aria-label="Payroll period start"
          />
          <input
            type="date"
            className="pr-period-select"
            value={periodEnd}
            onChange={(event) => setPeriodEnd(event.target.value)}
            aria-label="Payroll period end"
          />
        </div>

        <select
          className="pr-period-select pr-run-select"
          value={selectedRunId || ''}
          onChange={(event) => onSelectRun(event.target.value)}
        >
          <option value="">No saved run selected</option>
          {runs.map((run) => (
            <option key={run.id} value={run.id}>{formatRunLabel(run)}</option>
          ))}
        </select>

        <button className="pr-export-btn" type="button" onClick={onExport} disabled={isBusy}>
          <FaDownload /> Export
        </button>

        <button className="pr-export-btn" type="button" onClick={onPreview} disabled={isBusy}>
          {actionLoading === 'preview' ? <FaSpinner className="pr-spin" /> : <FaCalculator />}
          Preview
        </button>

        <button className="pr-process-btn" type="button" onClick={onCreate} disabled={isBusy}>
          {actionLoading === 'create' ? <FaSpinner className="pr-spin" /> : <FaMoneyBillWave />}
          Create Draft
        </button>

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
