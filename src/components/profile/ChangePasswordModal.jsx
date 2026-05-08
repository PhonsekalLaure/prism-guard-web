import { useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaLock,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import PasswordRequirements from '@components/auth/PasswordRequirements';
import profileService from '@services/profileService';
import {
  getPasswordPolicyError,
  getPasswordStrength,
  validatePassword,
} from '@utils/passwordPolicy';
import '@styles/Auth.css';
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

export default function ChangePasswordModal({ isOpen, onClose, variant = 'hris' }) {
  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState(hiddenFields);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const passwordPolicy = validatePassword(form.newPassword);
  const strength = getPasswordStrength(form.newPassword);
  const passwordsMatch = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;
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

    if (!passwordPolicy.isValid) {
      setError(getPasswordPolicyError(form.newPassword));
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
              password={form.newPassword}
              passwordsMatch={passwordsMatch}
              strength={strength}
              canSubmit={Boolean(form.currentPassword) && passwordPolicy.isValid && passwordsMatch}
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

  /* ── HRIS variant — premium auth-card modal ───────────────────── */
  return (
    <div className="chpw-overlay" onClick={handleClose}>
      <div className="chpw-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header — matches auth-card-header from ResetPasswordPage */}
        <div className="chpw-modal__header">
          <div className="chpw-modal__header-bg" aria-hidden="true" />
          <div className="chpw-modal__header-dots" aria-hidden="true" />

          <div className={`chpw-modal__icon ${success ? 'success' : ''}`}>
            {success ? <FaCheckCircle /> : <FaKey />}
          </div>
          <h2 className="chpw-modal__title">
            {success ? 'Password Updated!' : 'Change Password'}
          </h2>
          <p className="chpw-modal__subtitle">
            {success ? 'Your credentials have been secured' : 'Secure your account credentials'}
          </p>

          <button
            className="chpw-modal__close-btn"
            onClick={handleClose}
            disabled={saving}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="chpw-modal__body">
          <PasswordForm
            error={error}
            form={form}
            onChange={handleChange}
            onClose={handleClose}
            onSubmit={handleSubmit}
            password={form.newPassword}
            passwordsMatch={passwordsMatch}
            strength={strength}
            canSubmit={Boolean(form.currentPassword) && passwordPolicy.isValid && passwordsMatch}
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

/* ── Shared PasswordForm sub-component ───────────────────────────── */
function PasswordForm({
  error,
  form,
  isCms = false,
  onChange,
  onClose,
  onSubmit,
  canSubmit,
  password,
  passwordsMatch,
  strength,
  saving,
  show,
  success,
  toggleShow,
}) {
  if (isCms) {
    /* CMS keeps its own class names */
    return (
      <form onSubmit={onSubmit} className="cms-profile-modal__form">
        {cmsFields.map(({ name, label, placeholder }) => (
          <div key={name} className="cms-profile-form__field">
            <label htmlFor={name} className="cms-profile-form__label">{label}</label>
            <div className="cms-profile-modal__password-wrap">
              <FaLock className="shared-password-lock-icon" />
              <input
                id={name}
                name={name}
                type={show[name] ? 'text' : 'password'}
                value={form[name]}
                onChange={onChange}
                className="cms-profile-form__input"
                placeholder={placeholder}
                disabled={saving}
              />
              <button
                type="button"
                className="cms-profile-modal__toggle-show"
                onClick={() => toggleShow(name)}
                aria-label={show[name] ? 'Hide password' : 'Show password'}
                disabled={saving}
              >
                {show[name] ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        ))}

        {/* Strength bar on new-password */}
        <div className="chpw-strength-bar">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={`chpw-strength-segment ${strength.score >= seg ? strength.cls : ''}`}
            />
          ))}
        </div>
        <p className={`chpw-strength-label ${strength.cls}`}>{strength.label}</p>

        <PasswordRequirements
          password={password}
          passwordsMatch={passwordsMatch}
          variant="cms"
        />

        {error && (
          <div className="chpw-notification error">
            <FaExclamationCircle /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="chpw-notification success">
            <FaCheckCircle /><span>Password updated successfully.</span>
          </div>
        )}

        <div className="cms-profile-modal__actions">
          <button type="button" className="cms-profile-modal__cancel-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="cms-profile-modal__submit-btn" disabled={saving || !canSubmit}>
            {saving ? <FaSpinner className="shared-password-spinner" /> : <FaKey />}
            {saving ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    );
  }

  /* HRIS — premium auth-style form */
  return (
    <form onSubmit={onSubmit} className="chpw-form">

      {/* Current Password */}
      <div className="auth-form-group">
        <label htmlFor="currentPassword">Current Password</label>
        <div className="auth-password-wrapper">
          <input
            id="currentPassword"
            name="currentPassword"
            type={show.currentPassword ? 'text' : 'password'}
            value={form.currentPassword}
            onChange={onChange}
            className="auth-input"
            placeholder="Enter current password"
            disabled={saving}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => toggleShow('currentPassword')}
            aria-label={show.currentPassword ? 'Hide password' : 'Show password'}
            disabled={saving}
          >
            {show.currentPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* New Password + strength bar */}
      <div className="auth-form-group">
        <label htmlFor="newPassword">New Password</label>
        <div className="auth-password-wrapper">
          <input
            id="newPassword"
            name="newPassword"
            type={show.newPassword ? 'text' : 'password'}
            value={form.newPassword}
            onChange={onChange}
            className="auth-input"
            placeholder="Enter new password"
            disabled={saving}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => toggleShow('newPassword')}
            aria-label={show.newPassword ? 'Hide password' : 'Show password'}
            disabled={saving}
          >
            {show.newPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Strength meter — same markup as ResetPasswordPage */}
        <div className="auth-strength-bar">
          {[1, 2, 3, 4].map((seg) => (
            <div
              key={seg}
              className={`auth-strength-segment ${strength.score >= seg ? strength.cls : ''}`}
            />
          ))}
        </div>
        <p className={`auth-strength-label ${strength.cls}`}>{strength.label}</p>
      </div>

      {/* Password requirements checklist — reset variant (same as ResetPasswordPage) */}
      <PasswordRequirements
        password={password}
        passwordsMatch={passwordsMatch}
        variant="reset"
      />

      {/* Confirm Password */}
      <div className="auth-form-group">
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <div className="auth-password-wrapper">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={show.confirmPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={onChange}
            className="auth-input"
            placeholder="Re-enter new password"
            disabled={saving}
          />
          <button
            type="button"
            className="auth-password-toggle"
            onClick={() => toggleShow('confirmPassword')}
            aria-label={show.confirmPassword ? 'Hide password' : 'Show password'}
            disabled={saving}
          >
            {show.confirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      {/* Notification banners */}
      {error && (
        <div className="chpw-notification error">
          <FaExclamationCircle /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="chpw-notification success">
          <FaCheckCircle /><span>Password updated successfully.</span>
        </div>
      )}

      {/* Actions */}
      <div className="chpw-actions">
        <button
          type="button"
          className="chpw-cancel-btn"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="auth-btn chpw-submit-btn"
          disabled={saving || !canSubmit}
        >
          {saving ? <FaSpinner className="shared-password-spinner" /> : <FaKey />}
          <span>{saving ? 'Updating...' : 'Update Password'}</span>
        </button>
      </div>
    </form>
  );
}

const cmsFields = [
  { name: 'currentPassword', label: 'Current Password', placeholder: 'Enter current password' },
  { name: 'newPassword',     label: 'New Password',     placeholder: 'Enter new password' },
  { name: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Re-type new password' },
];
