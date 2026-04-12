import { FaUserShield, FaEnvelope, FaPhone, FaKey, FaEdit } from 'react-icons/fa';

export default function ProfileCard() {
  return (
    <div className="pf-left-col">
      {/* Main Profile Card */}
      <div className="pf-card">
        {/* Blue header */}
        <div className="pf-card-header">
          <div className="pf-avatar">
            <FaUserShield />
          </div>
          <h3 className="pf-name">John Juan</h3>
          <p className="pf-role">PRESIDENT</p>
        </div>

        {/* Contact info */}
        <div className="pf-card-body">
          <div className="pf-contact-list">
            <div className="pf-contact-item">
              <div className="pf-contact-icon">
                <FaEnvelope />
              </div>
              <div>
                <p className="pf-contact-label">Email Address</p>
                <p className="pf-contact-value">president@prismguard.com</p>
              </div>
            </div>

            <div className="pf-contact-item">
              <div className="pf-contact-icon">
                <FaPhone />
              </div>
              <div>
                <p className="pf-contact-label">Phone Number</p>
                <p className="pf-contact-value">+63 917 123 4567</p>
              </div>
            </div>
          </div>

          <hr className="pf-divider" />

          {/* Actions */}
          <div className="pf-actions">
            <button className="pf-btn pf-btn-outline">
              <FaEdit /> Edit Profile
            </button>
            <button className="pf-btn pf-btn-gold">
              <FaKey /> Change Password
            </button>
          </div>
        </div>
      </div>

      {/* System Roles Card */}
      <div className="pf-roles-card">
        <h4 className="pf-roles-title">
          <FaUserShield /> System Roles
        </h4>
        <div className="pf-roles-tags">
          <span className="pf-role-tag blue">Administrator</span>
          <span className="pf-role-tag purple">Approver</span>
          <span className="pf-role-tag green">Payroll Manager</span>
        </div>
      </div>
    </div>
  );
}
