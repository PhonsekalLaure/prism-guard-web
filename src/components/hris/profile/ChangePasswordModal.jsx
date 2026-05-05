import { useState } from 'react';
import { FaSpinner, FaKey, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import profileService from '@services/profileService';

export default function ChangePasswordModal({ isOpen, onCancel }) {
  const { notification, showNotification, closeNotification } = useNotification();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Password visibility states
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validation Checks
  const hasUpper = /[A-Z]/.test(form.newPassword);
  const hasLower = /[a-z]/.test(form.newPassword);
  const hasNumber = /[0-9]/.test(form.newPassword);
  const hasSymbol = /[^A-Za-z0-9]/.test(form.newPassword);
  const hasLength = form.newPassword.length >= 8;
  const passwordsMatch = form.newPassword.length > 0 && form.newPassword === form.confirmPassword;

  const isPasswordValid = hasUpper && hasLower && hasNumber && hasSymbol && hasLength;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showNotification('All fields are required.', 'error');
      return;
    }

    if (!isPasswordValid) {
      showNotification('New password does not meet complexity requirements.', 'error');
      return;
    }

    if (!passwordsMatch) {
      showNotification('New password and confirmation do not match.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });

      showNotification('Password updated successfully.', 'success');
      setTimeout(() => {
        onCancel();
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      }, 1500);
    } catch (err) {
      showNotification(err?.response?.data?.error || 'Failed to change password.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const renderRequirement = (isMet, text) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: isMet ? '#10b981' : '#94a3b8', transition: 'color 0.2s' }}>
      {isMet ? <FaCheckCircle /> : <FaRegCircle />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="dlg-overlay" onClick={onCancel}>
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

        {notification && (
          <div style={{ padding: '0 1.5rem', marginTop: '1rem' }}>
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={closeNotification}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="term-body" style={{ padding: '1.5rem' }}>
          {/* Current Password */}
          <div className="pf-field" style={{ marginBottom: '1rem' }}>
            <label className="pf-field-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                className="pf-edit-input"
                value={form.currentPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 2.5rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
              >
                {showCurrent ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="pf-field" style={{ marginBottom: '1rem' }}>
            <label className="pf-field-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                className="pf-edit-input"
                value={form.newPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 2.5rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
              >
                {showNew ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="pf-field" style={{ marginBottom: '1rem' }}>
            <label className="pf-field-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className="pf-edit-input"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 2.5rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="Re-type new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 0 }}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Complexity Indicators */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', marginTop: 0 }}>Password Requirements:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {renderRequirement(hasLength, 'At least 8 chars')}
              {renderRequirement(hasUpper, '1 Uppercase')}
              {renderRequirement(hasLower, '1 Lowercase')}
              {renderRequirement(hasNumber, '1 Number')}
              {renderRequirement(hasSymbol, '1 Symbol')}
              {renderRequirement(passwordsMatch, 'Passwords match')}
            </div>
          </div>

          <div className="dlg-footer" style={{ padding: '0', background: 'transparent', borderTop: 'none' }}>
            <button type="button" className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="dlg-btn" style={{ background: '#0f172a', color: 'white' }} disabled={isSaving}>
              {isSaving ? <FaSpinner className="animate-spin" /> : <FaKey />}
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
