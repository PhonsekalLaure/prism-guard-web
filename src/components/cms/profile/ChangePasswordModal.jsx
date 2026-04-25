import { useState } from 'react';
import { FaTimes, FaLock, FaEye, FaEyeSlash, FaKey } from 'react-icons/fa';

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

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to API
    onClose();
  };

  const fields = [
    { name: 'currentPassword', label: 'Current Password' },
    { name: 'newPassword', label: 'New Password' },
    { name: 'confirmPassword', label: 'Confirm New Password' },
  ];

  return (
    <div className="cms-profile-modal-overlay" onClick={onClose}>
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
          <button className="cms-profile-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="cms-profile-modal__body">
          {/* Icon */}
          <div className="cms-profile-modal__icon-wrap">
            <FaLock />
          </div>

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

            <div className="cms-profile-modal__actions">
              <button type="submit" className="cms-profile-modal__submit-btn">
                <FaKey />
                Update Password
              </button>
              <button type="button" className="cms-profile-modal__cancel-btn" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}