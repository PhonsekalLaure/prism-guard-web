import {
  FaBars,
  FaCalendarDay,
  FaCheck,
  FaDownload,
  FaRedo,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

import ReportActionButton from '@components/ui/ReportActionButton';
export default function HrisPayrollTopbar({
  actionLoading,
  cutoffOptions,
  onApprove,
  onAddHoliday,
  onCreate,
  onExport,
  createDisabled = false,
  createLoading = false,
  createLoadingLabel = 'Creating...',
  onRecalculate,
  onSelectCutoff,
  selectedCutoffKey,
  selectedRun,
}) {
  const { toggleSidebar } = useOutletContext() || {};
  const isBusy = Boolean(actionLoading);
  const selectedCutoff = cutoffOptions.find((option) => option.key === selectedCutoffKey);
  const cutoffActionDisabled = isBusy || !selectedCutoff || selectedCutoff.disabled;
  const createActionDisabled = cutoffActionDisabled || createDisabled;
  const canRecalculate = selectedRun?.status === 'draft';
  const canApprove = selectedRun?.status === 'draft';
  const showGenerationActions = !selectedRun;

  return (
    <header className="pr-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="pr-title-group">
          <h2>Payroll Management</h2>
          <p>Calculate, review, approve, and mark cash-released salaries as paid</p>
        </div>
      </div>

      <div className="pr-topbar-right pr-topbar-right--payroll">
        <label className="pr-selector-field pr-selector-field--cutoff">
          <span className="pr-selector-label">Payroll Cutoff</span>
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

        <ReportActionButton
          className="pr-export-btn"
          label="Add Holiday"
          icon={FaCalendarDay}
          disabled={cutoffActionDisabled}
          variant="secondary"
          onClick={onAddHoliday}
        />

        <ReportActionButton
          className="pr-export-btn"
          label="Export"
          icon={FaDownload}
          disabled={isBusy}
          variant="secondary"
          onClick={onExport}
        />

        {showGenerationActions && (
          <ReportActionButton
            className="pr-process-btn pr-create-draft-btn"
            label="Create Draft"
            loadingLabel={createLoadingLabel}
            icon={FaMoneyBillWave}
            loading={actionLoading === 'create' || createLoading}
            disabled={createActionDisabled}
            variant="primary"
            onClick={onCreate}
          />
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

      </div>
    </header>
  );
}
