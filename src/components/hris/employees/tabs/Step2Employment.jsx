import FormField from './FormField';

export default function Step2Employment({ data, onChange, sites, onSiteChange }) {
  const isFloating = !data.initialSiteId;

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Employment Details</h3>
      <div className="ae-form-grid">
        <FormField label="Employee ID *"    type="text"   value={data.employeeId}     readOnly />
        <FormField label="Date Hired *"     type="date"   required value={data.hireDate}        onChange={(e) => onChange('hireDate',        e.target.value)} />
        <FormField label="Position/Rank *"  type="select" required value={data.position}        onChange={(e) => onChange('position',        e.target.value)}
          options={['Security Guard', 'Lady Guard', 'Security Officer I', 'Security Officer II', 'Detachment Commander']} />
        <FormField label="Employment Status *" type="select" required value={data.employmentType} onChange={(e) => onChange('employmentType', e.target.value)}
          options={[{ label: 'Regular', value: 'regular' }, { label: 'Reliever', value: 'reliever' }]} />
        <FormField
          label="Initial Assignment"
          type="select"
          span2
          value={data.initialSiteId}
          onChange={(e) => onSiteChange(e.target.value)}
          options={[
            { label: 'Floating Status (No Assignment)', value: '' },
            ...sites.map(site => ({
              value: site.id,
              label: `${site.site_name} - ${site.clients?.company || 'Unknown Client'}`,
            })),
          ]}
        />
        <FormField
          label="Basic Rate (Monthly)"
          type="number"
          prefix="₱"
          value={data.basicRate}
          onChange={(e) => onChange('basicRate', e.target.value)}
          disabled={isFloating}
          placeholder={isFloating ? 'Select an initial site to enable base pay' : '0.00'}
        />
        <FormField label="Pay Frequency" type="text" value="Semi-monthly" readOnly />

        <div className="ae-form-group span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Government IDs</h4>
        </div>
        <FormField label="TIN Number"     type="text" value={data.tinNumber}      onChange={(e) => onChange('tinNumber',      e.target.value)} placeholder="000-000-000-000" />
        <FormField label="SSS Number"     type="text" value={data.sssNumber}      onChange={(e) => onChange('sssNumber',      e.target.value)} placeholder="00-0000000-0" />
        <FormField label="Pag-IBIG Number" type="text" value={data.pagibigNumber} onChange={(e) => onChange('pagibigNumber',  e.target.value)} placeholder="0000-0000-0000" />
        <FormField label="PhilHealth Number" type="text" value={data.philhealthNumber} onChange={(e) => onChange('philhealthNumber', e.target.value)} placeholder="00-000000000-0" />

        <div className="ae-form-group span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2">License &amp; Credentials</h4>
        </div>
        <FormField label="License Number"    type="text" value={data.licenseNumber}     onChange={(e) => onChange('licenseNumber',     e.target.value)} placeholder="e.g., SG-12345678" />
        <FormField label="Badge Number"      type="text" value={data.badgeNumber}       onChange={(e) => onChange('badgeNumber',       e.target.value)} placeholder="e.g., B-1234" />
        <FormField label="License Expiry Date" type="date" value={data.licenseExpiryDate} onChange={(e) => onChange('licenseExpiryDate', e.target.value)} />
      </div>
    </div>
  );
}
