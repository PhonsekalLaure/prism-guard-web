import { FaTimes, FaFileContract } from 'react-icons/fa';
import { RenewalDocumentPanel, RenewalPeriodPanel } from '@hris-components/shared/RenewalDialogSections';

export default function RenewEmployeeContractDialog({
  isOpen,
  employeeName,
  form,
  isSaving = false,
  onFieldChange,
  onFileChange,
  onCancel,
  onSave,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
}) {
  if (!isOpen) return null;

  const hasValidRenewalPeriod = Boolean(
    form.contractStartDate
    && form.contractEndDate
    && (!minStartDate || form.contractStartDate >= minStartDate)
    && (!maxStartDate || form.contractStartDate <= maxStartDate)
    && (!minEndDate || form.contractEndDate >= minEndDate)
    && (!maxEndDate || form.contractEndDate <= maxEndDate)
    && form.contractEndDate >= form.contractStartDate
  );
  const isSaveDisabled =
    isSaving
    || !hasValidRenewalPeriod
    || !form.contractFile;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dlg-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-icon">
            <FaFileContract />
          </div>
          <div className="dep-header-text">
            <h3>Renew Security Service Agreement</h3>
            <p>Upload the renewed security service agreement and define the new agreement period for <strong>{employeeName}</strong>.</p>
          </div>
          <button className="dep-close-btn" onClick={onCancel} disabled={isSaving}>
            <FaTimes />
          </button>
        </div>

        <div className="dep-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <RenewalPeriodPanel
            form={form}
            onFieldChange={onFieldChange}
            minStartDate={minStartDate}
            maxStartDate={maxStartDate}
            minEndDate={minEndDate}
            maxEndDate={maxEndDate}
          />
          <RenewalDocumentPanel file={form.contractFile} onFileChange={onFileChange} />
        </div>

        <div className="dlg-footer">
          <button type="button" className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button type="button" className="dlg-btn dlg-btn-deploy" onClick={onSave} disabled={isSaveDisabled}>
            {isSaving ? 'Renewing...' : 'Renew Contract'}
          </button>
        </div>
      </div>
    </div>
  );
}
