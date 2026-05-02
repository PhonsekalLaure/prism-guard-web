import { FaBriefcase } from 'react-icons/fa';
import { EditInput, EditSelect, InfoCell } from './EmployeeEditFields';

const POSITIONS = [
  'Security Guard', 'Security Officer', 'Team Leader', 'Shift Supervisor',
  'Operations Manager', 'Administrative Officer', 'HR Officer', 'Utility Personnel',
];

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function EmploymentTab({ employee, isEditing, editForm, onField }) {
  let tenureStr = 'N/A';
  if (employee.hire_date) {
    const diff = new Date() - new Date(employee.hire_date);
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    if (years >= 1) {
      tenureStr = `${Math.floor(years)} year(s)`;
      const months = Math.floor((years - Math.floor(years)) * 12);
      if (months > 0) tenureStr += `, ${months} month(s)`;
    } else {
      tenureStr = `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} month(s)`;
    }
  }

  const hireDateStr = employee.hire_date
    ? new Date(employee.hire_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title"><FaBriefcase className="ve-section-icon" /> Employment Details</h3>

        {/* Always-read-only core fields */}
        <div className="ve-info-grid cols-3" style={{ marginBottom: '1rem' }}>
          <InfoCell label="Employee ID"     value={employee.employee_id_number}                                               variant="blue" />
          <InfoCell label="Date Started"    value={hireDateStr}                                                               variant="blue" />
          <InfoCell label="Tenure"          value={tenureStr}                                                                 variant="blue" />
          <InfoCell label="Status"          value={employee.status?.toUpperCase()}                                            valueColor={employee.status === 'active' ? '#16a34a' : '#d97706'} />
          <InfoCell
            label="Employment Contract"
            value={(employee.employment_contract_status || 'unknown').replace(/_/g, ' ').toUpperCase()}
            valueColor={employee.employment_contract_valid === false ? '#dc2626' : '#16a34a'}
          />
          <InfoCell label="Assigned Company" value={`${employee.current_company} - ${employee.current_site}`}                span2 />
        </div>

        {/* Editable fields */}
        {!isEditing ? (
          <div className="ve-info-grid cols-3">
            <InfoCell label="Position"        value={employee.position || 'N/A'} />
            <InfoCell label="Employment Type" value={toProperCase(employee.employment_type)} />
            <InfoCell label="Badge Number"    value={employee.badge_number || 'N/A'} />
            <InfoCell label="License Number"  value={employee.license_number || 'N/A'} />
            <InfoCell label="License Expiry"  value={employee.license_expiry_date || 'N/A'} />
          </div>
        ) : (
          <div className="ve-edit-grid cols-2">
            <EditSelect label="Position" value={editForm.position} onChange={v => onField('position', v)} options={POSITIONS} />
            <EditSelect label="Employment Type" value={editForm.employment_type} onChange={v => onField('employment_type', v)}
              options={[{ value: 'regular', label: 'Regular' }, { value: 'reliever', label: 'Reliever' }]} />
            <EditInput label="Badge Number"    value={editForm.badge_number}        onChange={v => onField('badge_number', v)} />
            <EditInput label="License Number"  value={editForm.license_number}      onChange={v => onField('license_number', v)} />
            <EditInput
              label="License Expiry"
              type="date"
              value={editForm.license_expiry_date}
              onChange={v => onField('license_expiry_date', v)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        )}
      </div>
    </div>
  );
}
