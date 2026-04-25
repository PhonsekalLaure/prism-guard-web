import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaKey,
  FaEdit,
} from 'react-icons/fa';

const contactItems = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'admin@feutech.edu.ph',
  },
  {
    icon: FaPhone,
    label: 'Phone',
    value: '+63 917 123 4567',
  },
  {
    icon: FaMapMarkerAlt,
    label: 'Address',
    value: 'P. Paredes St., Sampaloc, Manila',
  },
];

export default function CompanyCard({ onChangePassword }) {
  return (
    <div className="cms-profile-company-card">
      {/* Header */}
      <div className="cms-profile-company-card__header">
        <div className="cms-profile-company-card__logo">
          <FaBuilding />
        </div>
        <h3 className="cms-profile-company-card__name">FEU Institute of Technology</h3>
        <p className="cms-profile-company-card__since">Client since January 2024</p>
        <span className="cms-profile-company-card__badge">Active Contract</span>
      </div>

      {/* Contact Info */}
      <div className="cms-profile-company-card__body">
        {contactItems.map(({ icon: Icon, label, value }) => (
          <div key={label} className="cms-profile-company-card__contact-row">
            <div className="cms-profile-company-card__contact-icon">
              <Icon />
            </div>
            <div className="cms-profile-company-card__contact-text">
              <p className="cms-profile-company-card__contact-label">{label}</p>
              <p className="cms-profile-company-card__contact-value">{value}</p>
            </div>
          </div>
        ))}

        <hr className="cms-profile-card__divider" />

        {/* Actions — matches HRIS ProfileCard */}
        <div className="cms-profile-card__actions">
          <button className="cms-profile-card__btn cms-profile-card__btn--outline">
            <FaEdit /> Edit Profile
          </button>
          <button className="cms-profile-card__btn cms-profile-card__btn--gold" onClick={onChangePassword}>
            <FaKey /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
}