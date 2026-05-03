import { useState } from 'react';
import { FaSpinner, FaKey, FaLock } from 'react-icons/fa';
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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      showNotification('All fields are required.', 'error');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showNotification('New password and confirmation do not match.', 'error');
      return;
    }

    if (form.newPassword.length < 8) {
      showNotification('New password must be at least 8 characters.', 'error');
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
      }, 1500);
    } catch (err) {
      showNotification(err?.response?.data?.error || 'Failed to change password.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
          <div className="pf-field" style={{ marginBottom: '1rem' }}>
            <label className="pf-field-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type="password"
                name="currentPassword"
                className="pf-edit-input"
                value={form.currentPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div className="pf-field" style={{ marginBottom: '1rem' }}>
            <label className="pf-field-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type="password"
                name="newPassword"
                className="pf-edit-input"
                value={form.newPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="At least 8 characters"
              />
            </div>
          </div>

          <div className="pf-field" style={{ marginBottom: '1.5rem' }}>
            <label className="pf-field-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <FaLock style={{ position: 'absolute', top: '12px', left: '12px', color: '#9ca3af' }} />
              <input
                type="password"
                name="confirmPassword"
                className="pf-edit-input"
                value={form.confirmPassword}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #d1d5db', marginTop: '0.4rem', outline: 'none' }}
                placeholder="Re-type new password"
              />
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
