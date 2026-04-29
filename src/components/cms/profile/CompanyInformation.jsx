import { FaBuilding } from 'react-icons/fa';

function formatBillingType(billingType) {
  if (!billingType) return '—';
  return billingType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatClientId(id) {
  if (!id) return '—';
  // Show last 8 characters of UUID prefixed with "CLI-"
  return `CLI-${id.slice(-8).toUpperCase()}`;
}

function ReadonlyField({ label, value }) {
  return (
    <div className="cms-profile-field">
      <label className="cms-profile-field__label">{label}</label>
      <div className="cms-profile-field__value">{value}</div>
    </div>
  );
}

export default function CompanyInformation({ profile }) {
  const fields = [
    {
      id: 'companyName',
      label: 'Company Name',
      value: profile?.company || '—',
      colSpan: 'half',
    },
    {
      id: 'billingType',
      label: 'Billing Type',
      value: formatBillingType(profile?.billing_type),
      colSpan: 'half',
    },
    {
      id: 'address',
      label: 'Business Address',
      value: profile?.billing_address || '—',
      colSpan: 'full',
    },
    {
      id: 'clientSince',
      label: 'Client Since',
      value: formatDate(profile?.client_since),
      colSpan: 'half',
    },
    {
      id: 'clientId',
      label: 'Client ID',
      value: formatClientId(profile?.id),
      colSpan: 'half',
    },
  ];

  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <h3 className="cms-profile-section__title">
          <FaBuilding className="cms-profile-section__icon" /> Company Information
        </h3>
        <div className="cms-profile-field-grid">
          {fields.map(({ id, label, value, colSpan }) => (
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