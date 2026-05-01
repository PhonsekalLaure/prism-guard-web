import {
  FaBuilding, FaCheck, FaClock, FaFilter, FaMapMarkerAlt,
  FaMoneyCheckAlt, FaRulerVertical, FaShieldAlt, FaUserTie,
} from 'react-icons/fa';

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function PanelHeader({ icon: Icon, children }) {
  const RenderedIcon = Icon;
  return (
    <div className="gds-panel-header">
      <div className="gds-panel-icon"><RenderedIcon /></div>
      <p className="gds-panel-title">{children}</p>
    </div>
  );
}

function formatDistance(distanceKm) {
  if (distanceKm == null) return 'No coords';
  return `${distanceKm.toFixed(2)} km`;
}

function formatExperience(years) {
  if (!years) return 'New hire';
  return `${years.toFixed(1)} yrs exp`;
}

export default function GuardDeploymentSelector({
  siteOptions,
  siteValue,
  onSiteChange,
  employees,
  loadingEmployees,
  filters,
  onFilterChange,
  selectedEmployeeIds,
  onToggleEmployee,
  deploymentForm,
  onFieldChange,
  toggleScheduleDay,
  selectionMode = 'single',
  emptyMessage = 'No deployable guards are currently available.',
}) {
  const isMultiSelect = selectionMode === 'multiple';

  return (
    <div className="gds-root">

      {/* ── Site selector ── */}
      <div className="gds-panel">
        <PanelHeader icon={FaBuilding}>Client Site</PanelHeader>
        <div className="gds-panel-body">
          <label className="dep-field-label">Select Site <span className="req">*</span></label>
          <select
            className="dep-input"
            value={siteValue}
            onChange={(e) => onSiteChange(e.target.value)}
          >
            <option value="">— Select a site —</option>
            {siteOptions.map((site) => (
              <option key={site.value} value={site.value}>{site.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Guard filters ── */}
      <div className="gds-panel">
        <PanelHeader icon={FaFilter}>Guard Filters</PanelHeader>
        <div className="gds-panel-body">
          <div className="gds-filter-pills">
            <label className={`gds-filter-pill${filters.tallOnly ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={filters.tallOnly}
                onChange={(e) => onFilterChange('tallOnly', e.target.checked)}
              />
              <FaRulerVertical /> Tall (170 cm+)
            </label>
            <label className={`gds-filter-pill${filters.experiencedOnly ? ' active' : ''}`}>
              <input
                type="checkbox"
                checked={filters.experiencedOnly}
                onChange={(e) => onFilterChange('experiencedOnly', e.target.checked)}
              />
              <FaShieldAlt /> Experienced (2+ yrs)
            </label>
          </div>
        </div>
      </div>

      {/* ── Guard list ── */}
      <div className="gds-panel">
        <PanelHeader icon={FaUserTie}>Available Guards</PanelHeader>
        <div className="gds-guard-list-hint">
          <FaMapMarkerAlt />
          {isMultiSelect
            ? 'Guards ranked by proximity to site. Select one or more.'
            : 'Guards ranked by proximity to site. Select one guard.'}
        </div>
        <div className="gds-guard-list">
          {loadingEmployees ? (
            <div className="gds-loading">
              <div className="gds-loading-dot" />
              <div className="gds-loading-dot" />
              <div className="gds-loading-dot" />
              <span>Loading available guards…</span>
            </div>
          ) : employees.length === 0 ? (
            <div className="gds-empty">
              <div className="gds-empty-icon"><FaUserTie /></div>
              <p className="gds-empty-text">{emptyMessage}</p>
            </div>
          ) : (
            employees.map((employee) => {
              const isSelected = selectedEmployeeIds.includes(employee.id);
              return (
                <label
                  key={employee.id}
                  className={`gds-guard-card${isSelected ? ' selected' : ''}`}
                >
                  <input
                    type={isMultiSelect ? 'checkbox' : 'radio'}
                    name={isMultiSelect ? `selectedGuard-${employee.id}` : 'selectedGuard'}
                    className="gds-guard-radio"
                    checked={isSelected}
                    onChange={() => onToggleEmployee(employee)}
                  />
                  <div className="gds-guard-avatar">
                    {(employee.name || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="gds-guard-info">
                    <div className="gds-guard-row">
                      <p className="gds-guard-name">{employee.name}</p>
                      <span
                        className="gds-guard-distance"
                        title={employee.distance_km == null ? 'No residential coordinates saved yet' : undefined}
                      >
                        {formatDistance(employee.distance_km)}
                      </span>
                    </div>
                    <p className="gds-guard-sub">
                      {employee.employee_id_number} · {employee.position}
                    </p>
                    <div className="gds-guard-chips">
                      <span className="gds-guard-chip">
                        <FaRulerVertical />
                        {employee.height_cm ? `${employee.height_cm} cm` : 'No height'}
                      </span>
                      <span className="gds-guard-chip">
                        <FaShieldAlt />
                        {formatExperience(employee.years_experience)}
                      </span>
                      <span className="gds-guard-chip">
                        <FaMoneyCheckAlt />
                        {employee.base_salary
                          ? `₱${Number(employee.base_salary).toLocaleString()}`
                          : 'No base pay'}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* ── Single-select assignment config ── */}
      {!isMultiSelect && (
        <>
          <div className="gds-panel">
            <PanelHeader icon={FaMoneyCheckAlt}>Base Pay</PanelHeader>
            <div className="gds-panel-body">
              <label className="dep-field-label">Monthly Base Pay <span className="req">*</span></label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '0.85rem', top: '50%',
                  transform: 'translateY(-50%)', fontSize: '0.78rem',
                  fontWeight: 700, color: '#64748b',
                }}>₱</span>
                <input
                  type="number"
                  min="0"
                  className="dep-input"
                  style={{ paddingLeft: '1.75rem' }}
                  value={deploymentForm.baseSalary}
                  onChange={(e) => onFieldChange('baseSalary', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="gds-panel">
            <PanelHeader icon={FaClock}>Contract Period</PanelHeader>
            <div className="gds-panel-body">
              <div className="dep-grid-2">
                <div>
                  <label className="dep-field-label">Start Date</label>
                  <input
                    type="date"
                    className="dep-input"
                    value={deploymentForm.contractStartDate}
                    onChange={(e) => onFieldChange('contractStartDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="dep-field-label">End Date</label>
                  <input
                    type="date"
                    className="dep-input"
                    value={deploymentForm.contractEndDate}
                    onChange={(e) => onFieldChange('contractEndDate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="gds-panel">
            <PanelHeader icon={FaClock}>
              Schedule <span style={{ color: '#ef4444' }}>*</span>
            </PanelHeader>
            <div className="gds-panel-body">
              <label className="dep-field-label" style={{ marginBottom: '0.5rem' }}>
                Work Days <span className="req">*</span>
              </label>
              <div className="dep-days-grid" style={{ marginBottom: '1rem' }}>
                {DAY_OPTIONS.map((day) => {
                  const active = deploymentForm.daysOfWeek.includes(day.value);
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
              <div className="dep-grid-2">
                <div>
                  <label className="dep-field-label">Shift Start <span className="req">*</span></label>
                  <input
                    type="time"
                    className="dep-input"
                    value={deploymentForm.shiftStart}
                    onChange={(e) => {
                      const start = e.target.value;
                      onFieldChange('shiftStart', start);
                      if (start) {
                        const [h, m] = start.split(':').map(Number);
                        const endH = (h + 12) % 24;
                        onFieldChange('shiftEnd', `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="dep-field-label">Shift End <span className="req">*</span></label>
                  <input
                    type="time"
                    className="dep-input"
                    value={deploymentForm.shiftEnd}
                    onChange={(e) => onFieldChange('shiftEnd', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
