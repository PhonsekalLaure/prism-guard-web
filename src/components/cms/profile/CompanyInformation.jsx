import { FaBuilding } from 'react-icons/fa';

const readonlyFields = [
  {
    id: 'companyName',
    label: 'Company Name',
    value: 'FEU Institute of Technology',
    colSpan: 'half',
  },
  {
    id: 'industry',
    label: 'Industry',
    value: 'Education',
    colSpan: 'half',
  },
  {
    id: 'address',
    label: 'Business Address',
    value: 'P. Paredes St., Sampaloc, Manila, NCR 1008',
    colSpan: 'full',
  },
  {
    id: 'tin',
    label: 'TIN',
    value: '000-123-456-789',
    colSpan: 'half',
  },
  {
    id: 'clientId',
    label: 'Client ID',
    value: 'CLI-2024-001',
    colSpan: 'half',
  },
];

function ReadonlyField({ label, value }) {
  return (
    <div className="cms-profile-field">
      <label className="cms-profile-field__label">{label}</label>
      <div className="cms-profile-field__value">{value}</div>
    </div>
  );
}

export default function CompanyInformation() {
  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <h3 className="cms-profile-section__title">
          <FaBuilding className="cms-profile-section__icon" /> Company Information
        </h3>
        <div className="cms-profile-field-grid">
          {readonlyFields.map(({ id, label, value, colSpan }) => (
            <div
              key={id}
              className={colSpan === 'full' ? 'cms-profile-field-grid__full' : ''}
            >
              <ReadonlyField label={label} value={value} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}