import SiteSelect from '@hris-components/shared/SiteSelect';
import {
  getDeploymentStartDateMinimum,
  getHireDateBounds,
} from '@utils/hrisDateRules';
import {
  MINIMUM_MONTHLY_BASE_PAY,
  MINIMUM_MONTHLY_BASE_PAY_HINT,
} from '@constants/payrollRules';
import FormField from './FormField';

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export default function Step2Employment({ data, onChange, sites, onSiteChange, toggleScheduleDay, canAssignInitialDeployment = true }) {
  const handleSelectSite = (site) => {
    if (!canAssignInitialDeployment) return;
    onSiteChange(site ? site.id : '');
  };

  const isFloating = !data.initialSiteId;
  const selectedSite = sites.find((site) => site.id === data.initialSiteId);
  const clientContractStartDate = selectedSite?.client_contract_start_date || null;
  const clientContractEndDate = selectedSite?.client_contract_end_date || null;
  const minDeploymentStartDate = getDeploymentStartDateMinimum({
    hireDate: data.hireDate,
    clientContractStartDate,
  });
  const { min: minHireDate, max: maxHireDate } = getHireDateBounds();

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Employment Details</h3>
      <div className="ae-form-grid">
        <FormField label="Employee ID *"    type="text"   value={data.employeeId}     readOnly />
        <FormField
          label="Date Hired *"
          type="date"
          required
          value={data.hireDate}
          onChange={(e) => onChange('hireDate', e.target.value)}
          min={minHireDate}
          max={maxHireDate}
        />
        <FormField
          label="Position/Rank *"
          type="text"
          readOnly
          value={data.position || 'Security Guard'}
        />
        <FormField label="Employment Status *" type="select" required value={data.employmentType} onChange={(e) => onChange('employmentType', e.target.value)}
          options={[{ label: 'Regular', value: 'regular' }, { label: 'Reliever', value: 'reliever' }]} />
        <div className="ae-form-group span-2">
          <label>Initial Assignment</label>
          <SiteSelect
            sites={sites}
            selectedSiteId={data.initialSiteId}
            onSelect={handleSelectSite}
            emptyLabel="Floating Status (No Assignment)"
            disabled={!canAssignInitialDeployment}
          />
        </div>
        <FormField
          label="Basic Rate (Monthly)"
          type="number"
          prefix="₱"
          value={data.basicRate}
          onChange={(e) => onChange('basicRate', e.target.value)}
          disabled={isFloating}
          min={MINIMUM_MONTHLY_BASE_PAY}
          placeholder={isFloating ? 'Select an initial site to enable base pay' : String(MINIMUM_MONTHLY_BASE_PAY)}
          hint={!isFloating ? MINIMUM_MONTHLY_BASE_PAY_HINT : undefined}
        />
        <FormField label="Pay Frequency" type="text" value="Semi-monthly" readOnly />

        {!isFloating && (
          <>
            <div className="ae-form-group span-2 mt-2">
              <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Initial Deployment</h4>
            </div>
            <FormField
              label="Deployment Start Date *"
              type="date"
              required
              value={data.deploymentStartDate}
              onChange={(e) => onChange('deploymentStartDate', e.target.value)}
              min={minDeploymentStartDate}
              max={clientContractEndDate || undefined}
              hint={`Must be on or after ${minDeploymentStartDate}${clientContractEndDate ? ` and on or before ${clientContractEndDate}` : ''}.`}
            />
            <FormField
              label="Deployment End Date *"
              type="date"
              required
              value={data.deploymentEndDate}
              onChange={(e) => onChange('deploymentEndDate', e.target.value)}
              min={data.deploymentStartDate || data.hireDate || undefined}
              max={clientContractEndDate || undefined}
              hint={clientContractEndDate ? `Must be on or before client contract end date: ${clientContractEndDate}` : undefined}
            />
            <div className="ae-form-group span-2">
              <label>Schedule Days *</label>
              <div className="dep-days-grid">
                {DAY_OPTIONS.map((day) => {
                  const active = data.daysOfWeek.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      className={`dep-day-pill${active ? ' active' : ''}`}
                      onClick={() => toggleScheduleDay(day.value)}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <FormField
              label="Shift Start *"
              type="time"
              required
              value={data.shiftStart}
              onChange={(e) => {
                const start = e.target.value;
                onChange('shiftStart', start);
                if (start) {
                  const [h, m] = start.split(':').map(Number);
                  const endH = (h + 12) % 24;
                  onChange('shiftEnd', `${String(endH).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
                }
              }}
            />
            <FormField
              label="Shift End *"
              type="time"
              required
              value={data.shiftEnd}
              onChange={(e) => onChange('shiftEnd', e.target.value)}
            />
          </>
        )}

        <div className="ae-form-group span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Government IDs</h4>
        </div>
        <FormField label="TIN Number *"     required type="text" value={data.tinNumber}      onChange={(e) => onChange('tinNumber',      e.target.value)} placeholder="000-000-000-000" />
        <FormField label="SSS Number *"     required type="text" value={data.sssNumber}      onChange={(e) => onChange('sssNumber',      e.target.value)} placeholder="00-0000000-0" />
        <FormField label="Pag-IBIG Number *" required type="text" value={data.pagibigNumber} onChange={(e) => onChange('pagibigNumber',  e.target.value)} placeholder="0000-0000-0000" />
        <FormField label="PhilHealth Number *" required type="text" value={data.philhealthNumber} onChange={(e) => onChange('philhealthNumber', e.target.value)} placeholder="00-000000000-0" />

        <div className="ae-form-group span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2">License &amp; Credentials</h4>
        </div>
        <FormField label="License Number *"    required type="text" value={data.licenseNumber}     onChange={(e) => onChange('licenseNumber',     e.target.value)} placeholder="e.g., SG-12345678" />
        <FormField label="Badge Number (Optional)" type="text" value={data.badgeNumber} onChange={(e) => onChange('badgeNumber',       e.target.value)} placeholder="Leave blank if not assigned yet" />
        <FormField
          label="License Expiry Date *"
          type="date"
          required
          value={data.licenseExpiryDate}
          onChange={(e) => onChange('licenseExpiryDate', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
}
