import { useState } from 'react';
import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaMobileAlt,
  FaUserPlus,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import {
  getAdminRoleLabel,
  getAdminRolePermissions,
} from '@utils/adminPermissions';

const INITIAL_FORM = {
  firstName: '',
  middleName: '',
  lastName: '',
  suffix: '',
  email: '',
  mobile: '',
  adminRole: '',
};

const ROLE_DESCRIPTIONS = {
  president: 'Full system access — manages all admins, clients, and employees.',
  operations_manager: 'Oversees operational workflows, client and employee management.',
  finance_manager: 'Handles billing, payroll visibility, and financial records.',
  secretary: 'Manages scheduling, communications, and administrative records.',
};

function buildFormState(initialData = null) {
  if (!initialData) {
    return INITIAL_FORM;
  }

  return {
    firstName: initialData.first_name || '',
    middleName: initialData.middle_name || '',
    lastName: initialData.last_name || '',
    suffix: initialData.suffix || '',
    email: initialData.contact_email || '',
    mobile: initialData.phone_number
      ? String(initialData.phone_number).replace(/^\+63/, '')
      : '',
    adminRole: initialData.admin_role || '',
  };
}

function formatPermissionLabel(permission) {
  return permission
    .replace(/\./g, ' › ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function CreateAdminModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  initialData = null,
  submitLabel = 'Create Admin Account',
  submittingLabel = 'Creating Admin...',
  title = 'Create New Administrator',
  description = 'Send a president-approved invitation to the admin&apos;s email to set up their account.',
}) {
  const [form, setForm] = useState(() => buildFormState(initialData));
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const permissions = getAdminRolePermissions(form.adminRole);
  const roleDesc = ROLE_DESCRIPTIONS[form.adminRole] || null;

  function handleField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm() {
    if (!form.firstName || !form.lastName || !form.email || !form.mobile || !form.adminRole) {
      return 'First name, last name, email, mobile number, and admin role are required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      return 'Please enter a valid email address.';
    }

    if (!/^\d{10}$/.test(form.mobile)) {
      return 'Mobile number must be exactly 10 digits, excluding +63.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextError = validateForm();
    if (nextError) {
      setError(nextError);
      return;
    }

    try {
      setError('');
      await onSubmit?.(form);
    } catch (submitError) {
      setError(submitError.message || 'Failed to create admin account.');
    }
  }

  return (
    <div className="ca-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
      <div className="ca-modal-content">

        {/* Header */}
        <div className="ca-modal-header">
          <div className="ca-header-icon-wrap">
            <FaUserPlus className="ca-header-icon" />
          </div>
          <div className="ca-header-text">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
          <button className="ca-close-btn" onClick={onClose} disabled={isSubmitting} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form className="ca-modal-body" onSubmit={handleSubmit}>

          {/* Personal Information */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <span className="ca-section-badge">
                <FaUser />
              </span>
              Personal Information
            </h3>
            <div className="ca-form-grid cols-2">
              <div className="ca-form-group">
                <label className="ca-form-label">First Name <span className="ca-required">*</span></label>
                <input
                  type="text"
                  className="ca-form-input"
                  value={form.firstName}
                  onChange={(event) => handleField('firstName', event.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Middle Name</label>
                <input
                  type="text"
                  className="ca-form-input"
                  value={form.middleName}
                  onChange={(event) => handleField('middleName', event.target.value)}
                  placeholder="Enter middle name"
                />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Last Name <span className="ca-required">*</span></label>
                <input
                  type="text"
                  className="ca-form-input"
                  value={form.lastName}
                  onChange={(event) => handleField('lastName', event.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Suffix</label>
                <input
                  type="text"
                  className="ca-form-input"
                  value={form.suffix}
                  onChange={(event) => handleField('suffix', event.target.value)}
                  placeholder="Jr., Sr., III"
                />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <span className="ca-section-badge">
                <FaEnvelope />
              </span>
              Account Information
            </h3>
            <div className="ca-form-grid cols-2">
              <div className="ca-form-group">
                <label className="ca-form-label">Email Address <span className="ca-required">*</span></label>
                <input
                  type="email"
                  className="ca-form-input"
                  value={form.email}
                  onChange={(event) => handleField('email', event.target.value)}
                  placeholder="admin@prismguard.com"
                />
                <p className="ca-form-hint">
                  <FaInfoCircle style={{ marginRight: '0.3rem' }} />
                  Invite link and login credentials will be sent here.
                </p>
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Mobile Number <span className="ca-required">*</span></label>
                <div className="ca-input-prefix-wrap">
                  <span className="ca-input-prefix">
                    <FaMobileAlt /> +63
                  </span>
                  <input
                    type="text"
                    className="ca-form-input ca-input-prefixed"
                    value={form.mobile}
                    onChange={(event) => handleField('mobile', event.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9XXXXXXXXX"
                  />
                </div>
                <p className="ca-form-hint">Enter 10 digits without the +63 prefix.</p>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <span className="ca-section-badge">
                <FaShieldAlt />
              </span>
              Role &amp; Permissions
            </h3>
            <div className="ca-role-layout">
              <div className="ca-form-group">
                <label className="ca-form-label">Admin Role <span className="ca-required">*</span></label>
                <select
                  className="ca-form-select"
                  value={form.adminRole}
                  onChange={(event) => handleField('adminRole', event.target.value)}
                >
                  <option value="">Select a role...</option>
                  <option value="president">President</option>
                  <option value="operations_manager">Operations Manager</option>
                  <option value="finance_manager">Finance Manager</option>
                  <option value="secretary">Secretary</option>
                </select>
                {roleDesc && (
                  <p className="ca-form-hint ca-role-desc-hint">
                    <FaInfoCircle style={{ marginRight: '0.3rem', flexShrink: 0 }} />
                    {roleDesc}
                  </p>
                )}
              </div>

              <div className="ca-permissions-box">
                <p className="ca-permissions-title">
                  <FaShieldAlt style={{ marginRight: '0.4rem', opacity: 0.7 }} />
                  {form.adminRole
                    ? `${getAdminRoleLabel(form.adminRole)} Permissions`
                    : 'Role Permissions Preview'}
                </p>
                <div className="ca-checkbox-grid">
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <label key={permission} className="ca-checkbox-label">
                        <FaCheckCircle className="ca-perm-check-icon" />
                        {formatPermissionLabel(permission)}
                      </label>
                    ))
                  ) : (
                    <p className="ca-form-hint">Select an admin role to preview the granted permissions.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="ca-error-box">
              <FaInfoCircle className="ca-error-icon" />
              <p>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="ca-modal-actions">
            <button type="submit" className="ca-btn ca-btn-gold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="ca-spinner" />
                  {submittingLabel}
                </>
              ) : (
                <>
                  <FaUserPlus />
                  {submitLabel}
                </>
              )}
            </button>
            <button type="button" className="ca-btn ca-btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
