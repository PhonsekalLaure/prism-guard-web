import { useState } from 'react';
import {
  FaTimes, FaUser, FaEnvelope, FaShieldAlt,
  FaMobileAlt, FaUserPlus, FaExclamationTriangle,
} from 'react-icons/fa';

const modulePermissions = [
  'Employee Management',
  'Client Management',
  'Attendance Monitoring',
  'Payroll Processing',
  'Incident Reports',
  'Leave Management',
  'Applicant Tracking',
  'Reports & Analytics',
];

export default function CreateAdminModal({ isOpen, onClose }) {
  const [twoFA, setTwoFA] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="ca-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ca-modal-content">
        {/* Header */}
        <div className="ca-modal-header">
          <div>
            <h2>Create New Administrator</h2>
            <p>Add a new admin user to the system</p>
          </div>
          <button className="ca-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="ca-modal-body">
          {/* Personal Information */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <FaUser className="ca-section-icon" />
              Personal Information
            </h3>
            <div className="ca-form-grid cols-2">
              <div className="ca-form-group">
                <label className="ca-form-label">First Name *</label>
                <input type="text" className="ca-form-input" placeholder="Enter first name" />
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Last Name *</label>
                <input type="text" className="ca-form-input" placeholder="Enter last name" />
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <FaEnvelope className="ca-section-icon" />
              Account Information
            </h3>
            <div className="ca-form-grid">
              <div className="ca-form-group">
                <label className="ca-form-label">Email Address *</label>
                <input type="email" className="ca-form-input" placeholder="admin@prismguard.com" />
                <p className="ca-form-hint">This will be used as login username</p>
              </div>
              <div className="ca-form-group">
                <label className="ca-form-label">Temporary Password *</label>
                <input type="password" className="ca-form-input" placeholder="Min. 8 characters" />
                <p className="ca-form-hint warning">
                  <FaExclamationTriangle style={{ marginRight: '0.3rem' }} />
                  User must change password on first login
                </p>
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="ca-form-section">
            <h3 className="ca-section-title">
              <FaShieldAlt className="ca-section-icon" />
              Role &amp; Permissions
            </h3>
            <div className="ca-form-grid">
              <div className="ca-form-group">
                <label className="ca-form-label">Admin Role *</label>
                <select className="ca-form-select">
                  <option value="">Select Role</option>
                  <option value="operations">Operations Manager</option>
                  <option value="hr">HR Manager</option>
                  <option value="finance">Finance Manager</option>
                  <option value="secretary">Secretary</option>
                  <option value="it">IT Administrator</option>
                </select>
              </div>

              <div className="ca-permissions-box">
                <p className="ca-permissions-title">Module Access Permissions</p>
                <div className="ca-checkbox-grid">
                  {modulePermissions.map((perm) => (
                    <label key={perm} className="ca-checkbox-label">
                      <input type="checkbox" />
                      {perm}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Two-Factor Authentication */}
          <div className="ca-twofa-box">
            <label className="ca-twofa-label">
              <input
                type="checkbox"
                checked={twoFA}
                onChange={(e) => setTwoFA(e.target.checked)}
              />
              <FaMobileAlt />
              Require Two-Factor Authentication (Recommended)
            </label>
          </div>

          {/* Action Buttons */}
          <div className="ca-modal-actions">
            <button className="ca-btn ca-btn-gold">
              <FaUserPlus />
              Create Admin Account
            </button>
            <button className="ca-btn ca-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
