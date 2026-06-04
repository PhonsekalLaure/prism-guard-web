import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaSpinner,
  FaTimes,
} from 'react-icons/fa';
import PasswordRequirements from '@components/auth/PasswordRequirements';
import profileService from '@services/profileService';
import authService from '@services/authService';
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

export default function ChangePasswordModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [show, setShow] = useState(hiddenFields);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const passwordPolicy = validatePassword(form.newPassword);
  const strength = getPasswordStrength(form.newPassword);
  const passwordsMatch = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;

  const resetState = () => {
    setForm(emptyForm);
    setShow(hiddenFields);
    setError(null);
  };

  const handleClose = () => {
    if (saving) return;
    resetState();
    onClose();
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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

      authService.clearTokens();
      resetState();
      onClose();
      navigate('/login', {
        state: { message: 'Password changed successfully. Please log in again.', type: 'success' }
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  /* ── Unified premium modal (HRIS & CMS) — chpw-* ─────────────── */
  return (
    <div className="chpw-overlay" onClick={handleClose}>
      <div className="chpw-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header — gradient with key icon, dot-grid texture */}
        <div className="chpw-modal__header">
          <div className="chpw-modal__header-bg" aria-hidden="true" />
          <div className="chpw-modal__header-dots" aria-hidden="true" />

          <div className="chpw-modal__icon">
            <FaKey />
          </div>
          <h2 className="chpw-modal__title">
            Change Password
          </h2>
          <p className="chpw-modal__subtitle">
            Secure your account credentials
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
            toggleShow={toggleShow}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Shared PasswordForm sub-component (unified HRIS + CMS) ──────── */
function PasswordForm({
  error,
  form,
  onChange,
  onClose,
  onSubmit,
  canSubmit,
  password,
  passwordsMatch,
  strength,
  saving,
  show,
  toggleShow,
}) {
  /* Premium auth-style form — used by both HRIS and CMS */
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

