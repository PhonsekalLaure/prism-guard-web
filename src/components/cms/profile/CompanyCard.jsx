import {
  FaBuilding,
  FaEdit,
  FaEnvelope,
  FaKey,
  FaMapMarkerAlt,
  FaPhone,
} from 'react-icons/fa';
import {
  getPhoneDisplayValue,
  getProfileEmailLabel,
} from '@utils/profileViewModel';

function formatClientSince(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });
}

export default function CompanyCard({ profile, onEditProfile, onChangePassword }) {
  const contactItems = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: getProfileEmailLabel(profile),
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: getPhoneDisplayValue(profile),
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Address',
      value: profile?.billing_address || 'Not provided',
    },
  ];

  const clientSince = formatClientSince(profile?.client_since);
  const contractStatus = profile?.contract_status || null;

  return (
    <div className="cms-profile-company-card">
      <div className="cms-profile-company-card__header">
        <div className="cms-profile-company-card__logo">
          <FaBuilding />
        </div>
        <h3 className="cms-profile-company-card__name">
          {profile?.company || 'Not provided'}
        </h3>
        {clientSince && (
          <p className="cms-profile-company-card__since">Client since {clientSince}</p>
        )}
        {contractStatus && (
          <span
            className={`cms-profile-company-card__badge cms-profile-company-card__badge--${contractStatus.toLowerCase().replace(' ', '-')}`}
          >
            {contractStatus === 'Active' ? 'Active Contract' : contractStatus}
          </span>
        )}
      </div>

      <div className="cms-profile-company-card__body">
        {contactItems.map(({ icon, label, value }) => {
          const ContactIcon = icon;
          return (
            <div key={label} className="cms-profile-company-card__contact-row">
              <div className="cms-profile-company-card__contact-icon">
                <ContactIcon />
              </div>
              <div className="cms-profile-company-card__contact-text">
                <p className="cms-profile-company-card__contact-label">{label}</p>
                <p className="cms-profile-company-card__contact-value">{value}</p>
              </div>
            </div>
          );
        })}

        <hr className="cms-profile-card__divider" />

        <div className="cms-profile-card__actions">
          <button
            className="cms-profile-card__btn cms-profile-card__btn--outline"
            onClick={onEditProfile}
          >
            <FaEdit /> Edit Profile
          </button>
          <button
            className="cms-profile-card__btn cms-profile-card__btn--gold"
            onClick={onChangePassword}
          >
            <FaKey /> Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
