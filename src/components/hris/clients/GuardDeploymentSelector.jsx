import { FaBuilding, FaCheck, FaClock, FaMapMarkerAlt, FaMoneyCheckAlt, FaRulerVertical, FaUserTie } from 'react-icons/fa';

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

function formatDistance(distanceKm) {
  if (distanceKm == null) return 'Distance unavailable';
  return `${distanceKm.toFixed(2)} km away`;
}

function formatExperience(years) {
  if (!years) return 'Newly hired';
  return `${years.toFixed(1)} years experience`;
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
    <div className="space-y-5">
      <div>
        <SectionLabel icon={FaBuilding}>Client Site</SectionLabel>
        <label className="dep-field-label">Select Site <span className="req">*</span></label>
        <select
          className="dep-input"
          value={siteValue}
          onChange={(e) => onSiteChange(e.target.value)}
        >
          <option value="">Select site</option>
          {siteOptions.map((site) => (
            <option key={site.value} value={site.value}>
              {site.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <SectionLabel icon={FaMapMarkerAlt}>Guard Filters</SectionLabel>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filters.tallOnly}
              onChange={(e) => onFilterChange('tallOnly', e.target.checked)}
            />
            <span>Tall guards (170 cm and above)</span>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filters.experiencedOnly}
              onChange={(e) => onFilterChange('experiencedOnly', e.target.checked)}
            />
            <span>Experienced guards (2+ years)</span>
          </label>
        </div>
      </div>

      <div>
        <SectionLabel icon={FaUserTie}>Recommended Guards</SectionLabel>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
            <p className="font-semibold text-slate-900">Closest guards appear first.</p>
            <p className="text-sm text-slate-600">
              {isMultiSelect
                ? 'Select one or more guards, then configure each selected guard below.'
                : 'Select one guard to configure the initial assignment.'}
            </p>
          </div>
          <div className="max-h-[320px] overflow-y-auto">
            {loadingEmployees ? (
              <div className="px-4 py-8 text-center text-slate-600">Loading available guards...</div>
            ) : employees.length === 0 ? (
              <div className="px-4 py-8 text-center text-slate-600">{emptyMessage}</div>
            ) : (
              employees.map((employee) => {
                const isSelected = selectedEmployeeIds.includes(employee.id);
                return (
                  <label
                    key={employee.id}
                    className={`flex gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50 ${isSelected ? 'bg-blue-50' : ''}`}
                  >
                    <input
                      type={isMultiSelect ? 'checkbox' : 'radio'}
                      name={isMultiSelect ? `selectedGuard-${employee.id}` : 'selectedGuard'}
                      className="mt-1"
                      checked={isSelected}
                      onChange={() => onToggleEmployee(employee)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900">{employee.name}</p>
                        <span className="text-sm font-semibold text-brand-blue" title={employee.distance_km == null ? 'This guard does not have saved residential coordinates yet.' : undefined}>
                          {formatDistance(employee.distance_km)}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{employee.employee_id_number} | {employee.position}</p>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-600">
                        <span className="inline-flex items-center gap-1"><FaRulerVertical /> {employee.height_cm ? `${employee.height_cm} cm` : 'Height unavailable'}</span>
                        <span className="inline-flex items-center gap-1"><FaCheck /> {formatExperience(employee.years_experience)}</span>
                        <span className="inline-flex items-center gap-1"><FaMoneyCheckAlt /> {employee.base_salary ? `PHP ${Number(employee.base_salary).toLocaleString()}` : 'Base pay unset'}</span>
                      </div>
                    </div>
                  </label>
                );
              })
            )}
          </div>
        </div>
      </div>

      {!isMultiSelect && (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <SectionLabel icon={FaMoneyCheckAlt}>Base Pay</SectionLabel>
              <label className="dep-field-label">Base Pay <span className="req">*</span></label>
              <input
                type="number"
                min="0"
                className="dep-input"
                value={deploymentForm.baseSalary}
                onChange={(e) => onFieldChange('baseSalary', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <SectionLabel icon={FaClock}>Contract Period</SectionLabel>
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

          <div>
            <SectionLabel icon={FaClock}>Schedule Days <span style={{ color: '#ef4444' }}>*</span></SectionLabel>
            <div className="dep-days-grid">
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
          </div>

          <div>
            <SectionLabel icon={FaClock}>Shift Hours <span style={{ color: '#ef4444' }}>*</span></SectionLabel>
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
        </>
      )}
    </div>
  );
}
