import {
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaKey,
  FaEdit,
} from 'react-icons/fa';

function formatClientSince(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-PH', {
    month: 'long',
    year: 'numeric',
  });
}

export default function CompanyCard({ profile, onChangePassword }) {
  const contactItems = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: profile?.contact_email || '—',
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: profile?.phone_number || '—',
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Address',
      value: profile?.billing_address || '—',
    },
  ];

  const clientSince = formatClientSince(profile?.client_since);
  const contractStatus = profile?.contract_status || null;

  return (
    <div className="cms-profile-company-card">
      {/* Header */}
      <div className="cms-profile-company-card__header">
        <div className="cms-profile-company-card__logo">
          <FaBuilding />
        </div>
        <h3 className="cms-profile-company-card__name">
          {profile?.company || '—'}
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

        {/* Actions */}
        <div className="cms-profile-card__actions">
          <button className="cms-profile-card__btn cms-profile-card__btn--outline">
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