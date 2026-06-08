import { useState, useRef, useEffect } from 'react';
import { FaSpinner, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaBuilding, FaFileUpload, FaCheck, FaMoneyCheckAlt, FaChevronDown } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';

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

function formatSiteLabel(site) {
  const baseLabel = `${site.clients?.company || 'Unknown Client'} - ${site.site_name}`;
  return site.distance_km != null
    ? `${baseLabel} (${site.distance_km.toFixed(2)} km)`
    : baseLabel;
}

function SiteOptionContent({ site }) {
  return (
    <>
      <EntityAvatar
        avatarUrl={site?.clients?.avatar_url}
        initials={(site?.clients?.company || 'C').charAt(0).toUpperCase()}
        alt={site?.clients?.company}
        className="dep-site-option-avatar"
      />
      <span>{site ? formatSiteLabel(site) : '- Select a site -'}</span>
    </>
  );
}

function SiteSelect({ sitesList, selectedSiteId, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedSite = sitesList.find((site) => site.id === selectedSiteId);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (site) => {
    onSelect(site);
    setIsOpen(false);
  };

  return (
    <div className="dep-site-select" ref={dropdownRef}>
      <button
        type="button"
        className="dep-input dep-site-select-trigger"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selectedSite ? 'dep-site-select-value' : 'dep-site-select-placeholder'}>
          {selectedSite ? <SiteOptionContent site={selectedSite} /> : '- Select a site -'}
        </span>
        <FaChevronDown className="dep-site-select-chevron" />
      </button>

      {isOpen && (
        <div className="dep-site-select-menu">
          <button
            type="button"
            className="dep-site-select-option placeholder"
            onClick={() => handleSelect(null)}
          >
            - Select a site -
          </button>
          {sitesList.map((site) => (
            <button
              type="button"
              key={site.id}
              className={`dep-site-select-option${selectedSiteId === site.id ? ' selected' : ''}`}
              onClick={() => handleSelect(site)}
            >
              <SiteOptionContent site={site} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DeployEmployeeDialog({
  isOpen, employeeName, sitesList, deployForm, setDeployForm,
  isDeploying, onCancel, onDeploy, toggleScheduleDay, isTransfer = false,
  clientContractEndDate = null,
  title,
  submittingLabel,
  submitLabel,
  deployDisabled = false,
}) {
  if (!isOpen) return null;

  const handleSiteSelect = (site) => {
    setDeployForm((form) => ({
      ...form,
      siteId: site?.id || '',
      contractEndDate: site?.client_contract_end_date && (!form.contractEndDate || form.contractEndDate > site.client_contract_end_date)
        ? site.client_contract_end_date
        : form.contractEndDate,
    }));
  };

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dep-card" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-icon">
            <FaMapMarkerAlt />
          </div>
          <div className="dep-header-text">
            <h3>{title || (isTransfer ? 'Update Assignment / Transfer' : 'Assign to Client Site')}</h3>
            <p>Deploying <strong>{employeeName}</strong></p>
          </div>
        </div>

        <div className="dep-body">
          <div>
            <SectionLabel icon={FaBuilding}>Client Site</SectionLabel>
            <label className="dep-field-label">Select Site <span className="req">*</span></label>
            <SiteSelect
              sitesList={sitesList}
              selectedSiteId={deployForm.siteId}
              onSelect={handleSiteSelect}
            />
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
                  max={clientContractEndDate || undefined}
                />
                {clientContractEndDate && (
                  <p className="ae-hint">Must be on or before client contract end date: {clientContractEndDate}</p>
                )}
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
            disabled={isDeploying || !deployForm.siteId || deployDisabled}
          >
            {isDeploying ? <FaSpinner className="animate-spin" /> : <FaMapMarkerAlt />}
            {isDeploying
              ? (submittingLabel || (isTransfer ? 'Updating...' : 'Deploying...'))
              : (submitLabel || (isTransfer ? 'Update Assignment' : 'Deploy Employee'))}
          </button>
        </div>
      </div>
    </div>
  );
}
