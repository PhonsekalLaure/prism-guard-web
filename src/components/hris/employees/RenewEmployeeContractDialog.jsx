export default function RenewEmployeeContractDialog({
  isOpen,
  employeeName,
  form,
  isSaving = false,
  onFieldChange,
  onFileChange,
  onCancel,
  onSave,
}) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dlg-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-text">
            <h3>Renew Employment Contract</h3>
            <p>Upload the renewed employment contract and define the new contract period for {employeeName}.</p>
          </div>
        </div>

        <div className="dep-body">
          <div className="ae-form-grid">
            <div className="ae-form-group">
              <label>Renewal Start Date</label>
              <input
                type="date"
                className="ae-input"
                value={form.contractStartDate}
                onChange={(e) => onFieldChange('contractStartDate', e.target.value)}
              />
            </div>

            <div className="ae-form-group">
              <label>Renewal End Date</label>
              <input
                type="date"
                className="ae-input"
                value={form.contractEndDate}
                min={form.contractStartDate || undefined}
                onChange={(e) => onFieldChange('contractEndDate', e.target.value)}
              />
            </div>

            <div className="ae-form-group span-2">
              <label>Renewed Contract Document</label>
              <input
                type="file"
                className="ae-input"
                accept="image/*,application/pdf"
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
              />
              <p className="ae-hint">
                {form.contractFile ? `Selected: ${form.contractFile.name}` : 'Upload the newly signed employment contract.'}
              </p>
            </div>
          </div>
        </div>

        <div className="dlg-footer">
          <button type="button" className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button type="button" className="dlg-btn dlg-btn-deploy" onClick={onSave} disabled={isSaving}>
            {isSaving ? 'Renewing...' : 'Renew Contract'}
          </button>
        </div>
      </div>
    </div>
  );
}
