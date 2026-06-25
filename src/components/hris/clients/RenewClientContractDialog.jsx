import { FaFileInvoiceDollar, FaTimes, FaFileContract } from 'react-icons/fa';
import { PanelHeader, RenewalDocumentPanel, RenewalPeriodPanel } from '@hris-components/shared/RenewalDialogSections';
import {
  MAX_CLIENT_RATE_PER_GUARD,
  MIN_CLIENT_RATE_PER_GUARD,
} from '@constants/clientContractRules';

export default function RenewClientContractDialog({
  isOpen,
  clientName,
  form,
  isSaving = false,
  onFieldChange,
  onFileChange,
  onCancel,
  onSave,
  minStartDate,
  maxEndDate,
}) {
  if (!isOpen) return null;

  const ratePerGuard = Number(form.ratePerGuard);
  const hasValidRatePerGuard =
    Number.isFinite(ratePerGuard)
    && ratePerGuard >= MIN_CLIENT_RATE_PER_GUARD
    && ratePerGuard <= MAX_CLIENT_RATE_PER_GUARD;
  const hasValidRenewalPeriod = Boolean(
    form.contractStartDate
    && form.contractEndDate
    && (!minStartDate || form.contractStartDate >= minStartDate)
    && (!maxEndDate || form.contractStartDate <= maxEndDate)
    && form.contractEndDate > form.contractStartDate
    && (!maxEndDate || form.contractEndDate <= maxEndDate)
  );
  const isSaveDisabled =
    isSaving
    || !hasValidRenewalPeriod
    || !hasValidRatePerGuard
    || !form.contractFile;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dlg-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-icon">
            <FaFileContract />
          </div>
          <div className="dep-header-text">
            <h3>Renew Client Contract</h3>
            <p>Upload the renewed contract and define the new contract period for <strong>{clientName}</strong>.</p>
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
            maxEndDate={maxEndDate}
          />

          {/* Panel 2: Billing & Rate */}
          <div className="gds-panel">
            <PanelHeader icon={FaFileInvoiceDollar}>Billing & Rate</PanelHeader>
            <div className="gds-panel-body">
              <div>
                <label className="dep-field-label">Rate per Guard <span className="req">*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: '0.85rem', top: '50%',
                    transform: 'translateY(-50%)', fontSize: '0.78rem',
                    fontWeight: 700, color: '#64748b',
                  }}>₱</span>
                  <input
                    type="number"
                    className="dep-input"
                    style={{ paddingLeft: '1.75rem' }}
                    value={form.ratePerGuard}
                    min={MIN_CLIENT_RATE_PER_GUARD}
                    max={MAX_CLIENT_RATE_PER_GUARD}
                    step="0.01"
                    placeholder="0.00"
                    onChange={(e) => onFieldChange('ratePerGuard', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

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
