import { useState } from 'react';
import {
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLock,
  FaRegCircle,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import profileService from '@services/profileService';
import '@styles/components/ChangePasswordModal.css';

const emptyForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

const hiddenFields = {
  currentPassword: false,
  newPassword: false,
  confirmPassword: false,
};

const fields = [
  { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
  { name: 'newPassword', label: 'New Password', placeholder: 'Enter new password' },
  { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-type new password' },
];

export default function ChangePasswordModal({ isOpen, onClose, variant = 'hris' }) {
  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState(hiddenFields);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const hasUpper = /[A-Z]/.test(form.newPassword);
  const hasLower = /[a-z]/.test(form.newPassword);
  const hasNumber = /[0-9]/.test(form.newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(form.newPassword);
  const hasLength = form.newPassword.length >= 8;
  const passwordsMatch = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;
  const isPasswordValid = hasUpper && hasLower && hasNumber && hasSymbol && hasLength;
  const isCms = variant === 'cms';

  const resetState = () => {
    setForm(emptyForm);
    setShow(hiddenFields);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (saving) return;
    resetState();
    onClose();
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (!isPasswordValid) {
      setError('New password does not meet complexity requirements.');
      return;
    }

    if (!passwordsMatch) {
      setError('New password and confirmation do not match.');
      return;
    }

    setSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      setSuccess(true);
      window.setTimeout(() => {
        resetState();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  if (isCms) {
    return (
      <div className="cms-profile-modal-overlay" onClick={handleClose}>
        <div className="cms-profile-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="cms-profile-modal__header">
            <div>
              <h2>Change Password</h2>
              <p>Secure your account credentials</p>
            </div>
            <button className="cms-profile-modal__close" onClick={handleClose} disabled={saving}>
              <FaTimes />
            </button>
          </div>

          <div className="cms-profile-modal__body">
            <div className="cms-profile-modal__icon-wrap">
              <FaLock />
            </div>

            <PasswordForm
              error={error}
              form={form}
              isCms
              onChange={handleChange}
              onClose={handleClose}
              onSubmit={handleSubmit}
              requirements={{ hasLength, hasUpper, hasLower, hasNumber, hasSymbol, passwordsMatch }}
              saving={saving}
              show={show}
              success={success}
              toggleShow={toggleShow}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dlg-overlay" onClick={handleClose}>
      <div className="dlg-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="term-hero" style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)' }}>
          <div className="term-icon-ring" style={{ color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)' }}>
            <FaKey />
          </div>
          <div>
            <h3 className="term-title" style={{ color: '#fff' }}>Change Password</h3>
            <p className="term-subtitle" style={{ color: '#94a3b8' }}>Secure your account credentials</p>
          </div>
        </div>

        <PasswordForm
          error={error}
          form={form}
          onChange={handleChange}
          onClose={handleClose}
          onSubmit={handleSubmit}
          requirements={{ hasLength, hasUpper, hasLower, hasNumber, hasSymbol, passwordsMatch }}
          saving={saving}
          show={show}
          success={success}
          toggleShow={toggleShow}
        />
      </div>
    </div>
  );
}

function PasswordForm({
  error,
  form,
  isCms = false,
  onChange,
  onClose,
  onSubmit,
  requirements,
  saving,
  show,
  success,
  toggleShow,
}) {
  const formClassName = isCms ? 'cms-profile-modal__form' : 'term-body';
  const fieldClassName = isCms ? 'cms-profile-form__field' : 'pf-field';
  const labelClassName = isCms ? 'cms-profile-form__label' : 'pf-field-label';
  const inputClassName = isCms ? 'cms-profile-form__input' : 'pf-edit-input';
  const wrapperClassName = isCms ? 'cms-profile-modal__password-wrap' : 'shared-password-input-wrap';
  const toggleClassName = isCms ? 'cms-profile-modal__toggle-show' : 'shared-password-toggle';
  const actionsClassName = isCms ? 'cms-profile-modal__actions' : 'dlg-footer shared-password-footer';
  const cancelClassName = isCms ? 'cms-profile-modal__cancel-btn' : 'dlg-btn dlg-btn-ghost';
  const submitClassName = isCms ? 'cms-profile-modal__submit-btn' : 'dlg-btn shared-password-submit';
  const errorClassName = isCms ? 'cms-profile-modal__error' : 'shared-password-error';
  const successClassName = isCms ? 'cms-profile-modal__success-text' : 'shared-password-success';

  return (
    <form onSubmit={onSubmit} className={formClassName}>
      {fields.map(({ name, label, placeholder }) => (
        <div key={name} className={fieldClassName}>
          <label htmlFor={name} className={labelClassName}>
            {label}
          </label>
          <div className={wrapperClassName}>
            <FaLock className="shared-password-lock-icon" />
            <input
              id={name}
              name={name}
              type={show[name] ? 'text' : 'password'}
              value={form[name]}
              onChange={onChange}
              className={inputClassName}
              placeholder={placeholder}
              disabled={saving}
            />
            <button
              type="button"
              className={toggleClassName}
              onClick={() => toggleShow(name)}
              aria-label={show[name] ? 'Hide password' : 'Show password'}
              disabled={saving}
            >
              {show[name] ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      ))}

      <PasswordRequirements isCms={isCms} requirements={requirements} />

      {error && <p className={errorClassName}>{error}</p>}
      {success && <p className={successClassName}>Password updated successfully.</p>}

      <div className={actionsClassName}>
        <button type="button" className={cancelClassName} onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className={submitClassName} disabled={saving}>
          {saving ? <FaSpinner className="shared-password-spinner" /> : <FaKey />}
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  );
}

function PasswordRequirements({ isCms, requirements }) {
  const items = [
    [requirements.hasLength, 'At least 8 chars'],
    [requirements.hasUpper, '1 Uppercase'],
    [requirements.hasLower, '1 Lowercase'],
    [requirements.hasNumber, '1 Number'],
    [requirements.hasSymbol, '1 Symbol'],
    [requirements.passwordsMatch, 'Passwords match'],
  ];

  return (
    <div className={isCms ? 'cms-profile-password-rules' : 'shared-password-rules'}>
      <p>Password Requirements:</p>
      <div className={isCms ? 'cms-profile-password-rules__grid' : 'shared-password-rules__grid'}>
        {items.map(([isMet, text]) => (
          <div
            key={text}
            className={isCms
              ? `cms-profile-password-rule${isMet ? ' is-met' : ''}`
              : `shared-password-rule${isMet ? ' is-met' : ''}`}
          >
            {isMet ? <FaCheckCircle /> : <FaRegCircle />}
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
