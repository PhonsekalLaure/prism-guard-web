import { FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaBuilding, FaFileUpload, FaCheck, FaMoneyCheckAlt } from 'react-icons/fa';

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
  const RenderedIcon = Icon;
  return (
    <div className="dep-section-label">
      <RenderedIcon />
      <span>{children}</span>
    </div>
  );
}

export default function DeployEmployeeDialog({
  isOpen, employeeName, sitesList, deployForm, setDeployForm,
  isDeploying, onCancel, onDeploy, toggleScheduleDay, isTransfer = false,
}) {
  if (!isOpen) return null;

  const formatSiteLabel = (site) => {
    const baseLabel = `${site.site_name} - ${site.clients?.company || 'Unknown Client'}`;
    return site.distance_km != null
      ? `${baseLabel} (${site.distance_km.toFixed(2)} km)`
      : baseLabel;
  };

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dep-card" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="dep-header-text">
            <h3>{isTransfer ? 'Transfer Assignment' : 'Assign to Client Site'}</h3>
            <p>Deploying <strong>{employeeName}</strong></p>
          </div>
        </div>

        <div className="dep-body">
          <div>
            <SectionLabel icon={FaBuilding}>Client Site</SectionLabel>
            <label className="dep-field-label">Select Site <span className="req">*</span></label>
            <select
              className="dep-input"
              value={deployForm.siteId}
              onChange={(e) => setDeployForm((f) => ({ ...f, siteId: e.target.value }))}
            >
              <option value="">- Select a site -</option>
              {sitesList.map((site) => (
                <option key={site.id} value={site.id}>
                  {formatSiteLabel(site)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <SectionLabel icon={FaMoneyCheckAlt}>Guard Salary</SectionLabel>
            <label className="dep-field-label">Monthly Base Pay <span className="req">*</span></label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="dep-input"
              value={deployForm.baseSalary}
              onChange={(e) => setDeployForm((f) => ({ ...f, baseSalary: e.target.value }))}
              placeholder="0.00"
            />
          </div>

          <div>
            <SectionLabel icon={FaCalendarAlt}>Deployment Contract Period</SectionLabel>
            <div className="dep-grid-2">
              <div>
                <label className="dep-field-label">Deployment Contract Start Date</label>
                <input
                  type="date"
                  className="dep-input"
                  value={deployForm.contractStartDate}
                  onChange={(e) => setDeployForm((f) => ({ ...f, contractStartDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="dep-field-label">Deployment Contract End Date</label>
                <input
                  type="date"
                  className="dep-input"
                  value={deployForm.contractEndDate}
                  onChange={(e) => setDeployForm((f) => ({ ...f, contractEndDate: e.target.value }))}
                  min={deployForm.contractStartDate || undefined}
                />
              </div>
            </div>
          </div>

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
                  onChange={(e) => {
                    const start = e.target.value;
                    setDeployForm((f) => {
                      const next = { ...f, shiftStart: start };
                      if (start) {
                        const [h, m] = start.split(':').map(Number);
                        const endH = (h + 12) % 24;
                        next.shiftEnd = `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                      }
                      return next;
                    });
                  }}
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

          <div>
            <SectionLabel icon={FaFileUpload}>
              Deployment Order <span style={{ color: '#ef4444' }}>*</span>
            </SectionLabel>
            <label className={`dep-file-zone${deployForm.deploymentOrderFile ? ' has-file' : ' required-file'}`}>
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
                    <p className="dep-file-hint">Required — Image or PDF accepted</p>
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
            {isDeploying ? (isTransfer ? 'Transferring...' : 'Deploying...') : (isTransfer ? 'Transfer Employee' : 'Deploy Employee')}
          </button>
        </div>
      </div>
    </div>
  );
}
