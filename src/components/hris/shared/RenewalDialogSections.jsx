import { FaCalendarAlt, FaFileUpload } from 'react-icons/fa';

export function PanelHeader({ icon: Icon, children }) {
  const RenderedIcon = Icon;
  return (
    <div className="gds-panel-header">
      <div className="gds-panel-icon"><RenderedIcon /></div>
      <p className="gds-panel-title">{children}</p>
    </div>
  );
}

export function RenewalPeriodPanel({
  form,
  onFieldChange,
  minStartDate,
  maxStartDate,
  minEndDate,
  maxEndDate,
}) {
  return (
    <div className="gds-panel">
      <PanelHeader icon={FaCalendarAlt}>Contract Period</PanelHeader>
      <div className="gds-panel-body">
        <div className="dep-grid-2">
          <div>
            <label className="dep-field-label">Renewal Start Date <span className="req">*</span></label>
            <input
              type="date"
              className="dep-input"
              value={form.contractStartDate}
              min={minStartDate}
              max={maxStartDate || undefined}
              onChange={(e) => onFieldChange('contractStartDate', e.target.value)}
            />
            {minStartDate && (
              <p className="ae-hint">Must be on or after: {minStartDate}</p>
            )}
          </div>
          <div>
            <label className="dep-field-label">Renewal End Date <span className="req">*</span></label>
            <input
              type="date"
              className="dep-input"
              value={form.contractEndDate}
              min={minEndDate || form.contractStartDate || minStartDate}
              max={maxEndDate}
              onChange={(e) => onFieldChange('contractEndDate', e.target.value)}
            />
            {minEndDate && maxEndDate && (
              <p className="ae-hint">Must be between {minEndDate} and {maxEndDate}.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RenewalDocumentPanel({
  file,
  onFileChange,
  emptyLabel = 'Upload renewed contract',
}) {
  return (
    <div className="gds-panel">
      <PanelHeader icon={FaFileUpload}>
        Renewed Contract Document <span style={{ color: '#ef4444' }}>*</span>
      </PanelHeader>
      <div className="gds-panel-body">
        <label className={`dep-file-zone${file ? ' has-file' : ' required-file'}`}>
          <FaFileUpload className="dep-file-icon" />
          <div className="dep-file-info">
            {file ? (
              <>
                <p className="dep-file-name">{file.name}</p>
                <p className="dep-file-hint">Click to replace file</p>
              </>
            ) : (
              <>
                <p className="dep-file-name" style={{ color: '#64748b' }}>{emptyLabel}</p>
                <p className="dep-file-hint">Required - Image or PDF accepted</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          />
        </label>
      </div>
    </div>
  );
}
