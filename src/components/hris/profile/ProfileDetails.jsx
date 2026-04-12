import { FaBriefcase, FaUser } from 'react-icons/fa';

export default function ProfileDetails() {
  return (
    <div className="pf-details-card">
      {/* Account Details */}
      <div className="pf-section">
        <h3 className="pf-section-title">
          <FaBriefcase className="pf-section-icon" /> Account Details
        </h3>
        <div className="pf-form-grid">
          <ReadonlyField label="User ID" value="ADMIN-001" />
          <ReadonlyField label="Position" value="PRESIDENT" />
          <ReadonlyField label="Date Joined" value="January 15, 2020" />
        </div>
      </div>

      <hr className="pf-section-divider" />

      {/* Personal Details */}
      <div className="pf-section">
        <h3 className="pf-section-title">
          <FaUser className="pf-section-icon" /> Personal Details
        </h3>
        <div className="pf-form-grid">
          <ReadonlyField label="First Name" value="John" />
          <ReadonlyField label="Last Name" value="Juan" />
          <ReadonlyField label="Email Address" value="president@prismguard.com" />
          <ReadonlyField label="Phone Number" value="+63 917 123 4567" />
        </div>
      </div>
    </div>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <div className="pf-field">
      <label className="pf-field-label">{label}</label>
      <div className="pf-field-value">{value}</div>
    </div>
  );
}
