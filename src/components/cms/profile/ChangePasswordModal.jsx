import { useState } from 'react';
import { FaTimes, FaLock, FaEye, FaEyeSlash, FaKey, FaSpinner } from 'react-icons/fa';
import profileService from '@services/profileService';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [show, setShow] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleClose = () => {
    // Reset state on close
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShow({ currentPassword: false, newPassword: false, confirmPassword: false });
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.newPassword !== form.confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    if (form.newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
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
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update password. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'currentPassword', label: 'Current Password' },
    { name: 'newPassword', label: 'New Password' },
    { name: 'confirmPassword', label: 'Confirm New Password' },
  ];

  return (
    <div className="cms-profile-modal-overlay" onClick={handleClose}>
      <div
        className="cms-profile-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="cms-profile-modal__header">
          <div>
            <h2>Change Password</h2>
            <p>Update your account password</p>
          </div>
          <button className="cms-profile-modal__close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="cms-profile-modal__body">
          {/* Icon */}
          <div className="cms-profile-modal__icon-wrap">
            <FaLock />
          </div>

          {success ? (
            <div className="cms-profile-modal__success">
              <p>Password updated successfully!</p>
              <button
                type="button"
                className="cms-profile-modal__cancel-btn"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="cms-profile-modal__form">
              {fields.map(({ name, label }) => (
                <div key={name} className="cms-profile-form__field">
                  <label htmlFor={name} className="cms-profile-form__label">
                    {label}
                  </label>
                  <div className="cms-profile-modal__password-wrap">
                    <input
                      id={name}
                      name={name}
                      type={show[name] ? 'text' : 'password'}
                      value={form[name]}
                      onChange={handleChange}
                      className="cms-profile-form__input"
                      placeholder="••••••••"
                      required
                      disabled={saving}
                    />
                    <button
                      type="button"
                      className="cms-profile-modal__toggle-show"
                      onClick={() => toggleShow(name)}
                      aria-label={show[name] ? 'Hide password' : 'Show password'}
                    >
                      {show[name] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              ))}

              {error && (
                <p className="cms-profile-modal__error">{error}</p>
              )}

              <div className="cms-profile-modal__actions">
                <button
                  type="submit"
                  className="cms-profile-modal__submit-btn"
                  disabled={saving}
                >
                  {saving ? (
                    <FaSpinner className="cms-profile-form__spinner" />
                  ) : (
                    <FaKey />
                  )}
                  {saving ? 'Updating…' : 'Update Password'}
                </button>
                <button
                  type="button"
                  className="cms-profile-modal__cancel-btn"
                  onClick={handleClose}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}