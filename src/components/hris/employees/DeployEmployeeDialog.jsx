import { FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaBuilding, FaFileUpload, FaCheck } from 'react-icons/fa';

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function SectionLabel({ icon: Icon, children }) {
  return (
    <div className="dep-section-label">
      <Icon />
      <span>{children}</span>
    </div>
  );
}

export default function DeployEmployeeDialog({
  isOpen, employeeName, sitesList, deployForm, setDeployForm,
  isDeploying, onCancel, onDeploy, toggleScheduleDay,
}) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dep-card" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="dep-header">
          <div className="dep-header-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="dep-header-text">
            <h3>Assign to Client Site</h3>
            <p>Deploying <strong>{employeeName}</strong></p>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="dep-body">

          {/* Site */}
          <div>
            <SectionLabel icon={FaBuilding}>Client Site</SectionLabel>
            <label className="dep-field-label">Select Site <span className="req">*</span></label>
            <select
              className="dep-input"
              value={deployForm.siteId}
              onChange={(e) => setDeployForm((f) => ({ ...f, siteId: e.target.value }))}
            >
              <option value="">— Select a site —</option>
              {sitesList.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.site_name} — {site.clients?.company || 'Unknown Client'}
                </option>
              ))}
            </select>
          </div>

          {/* Contract period */}
          <div>
            <SectionLabel icon={FaCalendarAlt}>Contract Period</SectionLabel>
            <div className="dep-grid-2">
              <div>
                <label className="dep-field-label">Start Date</label>
                <input
                  type="date"
                  className="dep-input"
                  value={deployForm.contractStartDate}
                  onChange={(e) => setDeployForm((f) => ({ ...f, contractStartDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="dep-field-label">End Date</label>
                <input
                  type="date"
                  className="dep-input"
                  value={deployForm.contractEndDate}
                  onChange={(e) => setDeployForm((f) => ({ ...f, contractEndDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Schedule days */}
          <div>
            <SectionLabel icon={FaCalendarAlt}>
              Schedule Days <span style={{ color: '#ef4444' }}>*</span>
            </SectionLabel>
            <div className="dep-days-grid">
              {DAY_OPTIONS.map((day) => {
                const active = deployForm.daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    className={`dep-day-pill${active ? ' active' : ''}`}
                    onClick={() => toggleScheduleDay(day.value)}
                  >
                    {active && <FaCheck className="dep-day-check" />}
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Shift times */}
          <div>
            <SectionLabel icon={FaClock}>
              Shift Hours <span style={{ color: '#ef4444' }}>*</span>
            </SectionLabel>
            <div className="dep-grid-2">
              <div>
                <label className="dep-field-label">Shift Start <span className="req">*</span></label>
                <input
                  type="time"
                  className="dep-input"
                  value={deployForm.shiftStart}
                  onChange={(e) => setDeployForm((f) => ({ ...f, shiftStart: e.target.value }))}
                />
              </div>
              <div>
                <label className="dep-field-label">Shift End <span className="req">*</span></label>
                <input
                  type="time"
                  className="dep-input"
                  value={deployForm.shiftEnd}
                  onChange={(e) => setDeployForm((f) => ({ ...f, shiftEnd: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Deployment order */}
          <div>
            <SectionLabel icon={FaFileUpload}>Deployment Order</SectionLabel>
            <label className={`dep-file-zone${deployForm.deploymentOrderFile ? ' has-file' : ''}`}>
              <FaFileUpload className="dep-file-icon" />
              <div className="dep-file-info">
                {deployForm.deploymentOrderFile ? (
                  <>
                    <p className="dep-file-name">{deployForm.deploymentOrderFile.name}</p>
                    <p className="dep-file-hint">Click to replace file</p>
                  </>
                ) : (
                  <>
                    <p className="dep-file-name" style={{ color: '#64748b' }}>Upload deployment order</p>
                    <p className="dep-file-hint">Image or PDF accepted</p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*,application/pdf"
                onChange={(e) => setDeployForm((f) => ({ ...f, deploymentOrderFile: e.target.files?.[0] || null }))}
              />
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isDeploying}>
            Cancel
          </button>
          <button
            className="dlg-btn dlg-btn-deploy"
            onClick={onDeploy}
            disabled={isDeploying || !deployForm.siteId}
          >
            {isDeploying ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
            {isDeploying ? 'Deploying…' : 'Deploy Employee'}
          </button>
        </div>

      </div>
    </div>
  );
}
