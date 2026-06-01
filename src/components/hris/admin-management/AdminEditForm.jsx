import { FaInfoCircle, FaUser, FaEnvelope, FaPhone, FaShieldAlt } from 'react-icons/fa';

const ROLE_OPTIONS = [
  { value: 'president', label: 'President' },
  { value: 'operations_manager', label: 'Operations Manager' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'secretary', label: 'Secretary' },
];

const ROLE_DESCRIPTIONS = {
  president: 'Full system access — manages all admins, clients, and employees.',
  operations_manager: 'Oversees operational workflows, client and employee management.',
  finance_manager: 'Handles billing, payroll visibility, and financial records.',
  secretary: 'Manages scheduling, communications, and administrative records.',
};

function AefInput({ label, value, onChange, placeholder, type = 'text', required }) {
  return (
    <div className="aef-field">
      <label className="aef-label">
        {label}{required && <span className="aef-required">*</span>}
      </label>
      <input
        type={type}
        className="aef-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

function AefSelect({ label, value, onChange, options, required }) {
  return (
    <div className="aef-field">
      <label className="aef-label">
        {label}{required && <span className="aef-required">*</span>}
      </label>
      <select
        className="aef-input aef-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function AdminEditForm({ editForm, onField }) {
  return (
    <div className="aef-form">

      {/* Personal Information */}
      <div className="aef-section">
        <h3 className="aef-section-title">
          <span className="aef-section-icon"><FaUser /></span>
          Personal Information
        </h3>
        <div className="aef-grid cols-2">
          <AefInput
            label="First Name" value={editForm.firstName}
            onChange={(v) => onField('firstName', v)}
            placeholder="e.g. Juan" required
          />
          <AefInput
            label="Middle Name" value={editForm.middleName}
            onChange={(v) => onField('middleName', v)}
            placeholder="e.g. Santos"
          />
          <AefInput
            label="Last Name" value={editForm.lastName}
            onChange={(v) => onField('lastName', v)}
            placeholder="e.g. Dela Cruz" required
          />
          <AefInput
            label="Suffix" value={editForm.suffix}
            onChange={(v) => onField('suffix', v)}
            placeholder="e.g. Jr., Sr., III"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="aef-section">
        <h3 className="aef-section-title">
          <span className="aef-section-icon"><FaEnvelope /></span>
          Contact Information
        </h3>
        <div className="aef-grid cols-2">
          <AefInput
            label="Email Address" type="email" value={editForm.email}
            onChange={(v) => onField('email', v)}
            placeholder="e.g. juan@prismguard.com" required
          />
          <div className="aef-field">
            <label className="aef-label">
              Mobile Number<span className="aef-required">*</span>
            </label>
            <div className="aef-mobile-wrap">
              <span className="aef-mobile-prefix">
                <FaPhone style={{ fontSize: '0.65rem', marginRight: '0.3rem' }} />+63
              </span>
              <input
                type="tel"
                className="aef-input aef-mobile-input"
                value={editForm.mobile}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  onField('mobile', val);
                }}
                placeholder="917 123 4567"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Role & Access */}
      <div className="aef-section">
        <h3 className="aef-section-title">
          <span className="aef-section-icon"><FaShieldAlt /></span>
          Role &amp; Access
        </h3>
        <div className="aef-grid cols-1">
          <AefSelect
            label="Administrator Role" value={editForm.adminRole}
            onChange={(v) => onField('adminRole', v)}
            options={ROLE_OPTIONS} required
          />
          {editForm.adminRole && ROLE_DESCRIPTIONS[editForm.adminRole] && (
            <div className="aef-role-hint">
              <FaInfoCircle className="aef-hint-icon" />
              <p className="aef-hint-text">{ROLE_DESCRIPTIONS[editForm.adminRole]}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
