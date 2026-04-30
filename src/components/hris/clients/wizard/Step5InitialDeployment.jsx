import { FaClock, FaMoneyCheckAlt, FaCalendarAlt, FaUserShield } from 'react-icons/fa';
import GuardDeploymentSelector from '../GuardDeploymentSelector';

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

function AssignmentSectionLabel({ icon: Icon, children }) {
  return (
    <div className="dep-section-label" style={{ marginBottom: '0.5rem' }}>
      <Icon />
      <span>{children}</span>
    </div>
  );
}

export default function Step5InitialDeployment({
  data,
  deployableEmployees,
  loadingDeployable,
  onDeploymentField,
  onFilterChange,
  onSelectEmployee,
  onAssignmentField,
  onAssignmentScheduleDay,
}) {
  const siteOptions = data.sites.map((site, index) => ({
    value: String(index),
    label: site.siteName || site.siteAddress || `Site ${index + 1}`,
  }));

  if (siteOptions.length === 0) {
    return (
      <div className="ae-step-content">
        <h3 className="ae-step-heading">Initial Guard Deployment</h3>
        <p className="ae-hint">
          Add at least one client site first if you want to assign an initial guard during onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Initial Guard Deployment</h3>
      <p className="ae-hint" style={{ marginBottom: '0.9rem' }}>
        This step is optional. Guards are ranked by proximity to the selected site.
      </p>

      <GuardDeploymentSelector
        siteOptions={siteOptions}
        siteValue={data.initialDeployment.siteIndex}
        onSiteChange={(value) => onDeploymentField('siteIndex', value)}
        employees={deployableEmployees}
        loadingEmployees={loadingDeployable}
        filters={data.initialDeployment.filters}
        onFilterChange={onFilterChange}
        selectedEmployeeIds={data.initialDeployment.assignments.map((assignment) => assignment.employeeId)}
        onToggleEmployee={onSelectEmployee}
        deploymentForm={data.initialDeployment}
        onFieldChange={onDeploymentField}
        toggleScheduleDay={() => {}}
        selectionMode="multiple"
        emptyMessage="No deployable guards match the selected site and filters."
      />

      {data.initialDeployment.assignments.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Section header */}
          <div className="ig-assignments-header">
            <div className="dep-section-label" style={{ margin: 0 }}>
              <FaUserShield />
              <span>Guard Assignment Details</span>
            </div>
            <p className="ae-hint" style={{ margin: '0.25rem 0 0' }}>
              Set individual pay, dates and schedule for each selected guard.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.85rem' }}>
            {data.initialDeployment.assignments.map((assignment, index) => (
              <div key={assignment.employeeId} className="ig-assignment-card">
                {/* Card header */}
                <div className="ig-assignment-card-header">
                  <div className="ig-assignment-avatar">
                    {(assignment.employeeName || 'G').charAt(0).toUpperCase()}
                  </div>
                  <div className="ig-assignment-info">
                    <p className="ig-assignment-name">{assignment.employeeName || `Guard ${index + 1}`}</p>
                    <p className="ig-assignment-id">{assignment.employeeId}</p>
                  </div>
                  <span className="ig-assignment-badge">Guard {index + 1}</span>
                </div>

                {/* Card body */}
                <div className="ig-assignment-card-body">
                  {/* Base Pay */}
                  <div>
                    <AssignmentSectionLabel icon={FaMoneyCheckAlt}>Base Pay</AssignmentSectionLabel>
                    <label className="dep-field-label">
                      Monthly Base Pay <span className="req">*</span>
                    </label>
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
                        value={assignment.baseSalary}
                        onChange={(e) => onAssignmentField(assignment.employeeId, 'baseSalary', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Contract Period */}
                  <div>
                    <AssignmentSectionLabel icon={FaCalendarAlt}>Contract Period</AssignmentSectionLabel>
                    <div className="dep-grid-2">
                      <div>
                        <label className="dep-field-label">Start Date</label>
                        <input
                          type="date"
                          className="dep-input"
                          value={assignment.contractStartDate}
                          onChange={(e) => onAssignmentField(assignment.employeeId, 'contractStartDate', e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="dep-field-label">End Date</label>
                        <input
                          type="date"
                          className="dep-input"
                          value={assignment.contractEndDate}
                          onChange={(e) => onAssignmentField(assignment.employeeId, 'contractEndDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule */}
                  <div>
                    <AssignmentSectionLabel icon={FaClock}>
                      Schedule <span style={{ color: '#ef4444' }}>*</span>
                    </AssignmentSectionLabel>
                    <label className="dep-field-label" style={{ marginBottom: '0.5rem' }}>Work Days</label>
                    <div className="dep-days-grid">
                      {DAY_OPTIONS.map((day) => {
                        const active = assignment.daysOfWeek.includes(day.value);
                        return (
                          <button
                            key={`${assignment.employeeId}-${day.value}`}
                            type="button"
                            className={`dep-day-pill${active ? ' active' : ''}`}
                            onClick={() => onAssignmentScheduleDay(assignment.employeeId, day.value)}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="dep-grid-2" style={{ marginTop: '0.75rem' }}>
                      <div>
                        <label className="dep-field-label">
                          Shift Start <span className="req">*</span>
                        </label>
                        <input
                          type="time"
                          className="dep-input"
                          value={assignment.shiftStart}
                          onChange={(e) => {
                            const start = e.target.value;
                            onAssignmentField(assignment.employeeId, 'shiftStart', start);
                            if (start) {
                              const [h, m] = start.split(':').map(Number);
                              const endH = (h + 12) % 24;
                              onAssignmentField(assignment.employeeId, 'shiftEnd', `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                            }
                          }}
                        />
                      </div>
                      <div>
                        <label className="dep-field-label">
                          Shift End <span className="req">*</span>
                        </label>
                        <input
                          type="time"
                          className="dep-input"
                          value={assignment.shiftEnd}
                          onChange={(e) => onAssignmentField(assignment.employeeId, 'shiftEnd', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
