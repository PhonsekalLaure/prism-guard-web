import { useState, useEffect } from 'react';
import { FaMobileAlt, FaSave, FaSpinner, FaTimes, FaUserTie } from 'react-icons/fa';
import profileService from '@services/profileService';
import {
  formatPhilippineMobile,
  getEditableEmail,
  getPhoneInputValue,
  validatePhilippineMobile,
} from '@utils/profileViewModel';

export default function ContactPerson({ profile, onProfileUpdate, isEditing, onCancelEdit }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        middleName: profile.middle_name || '',
        suffix: profile.suffix || '',
        email: getEditableEmail(profile),
        phone: getPhoneInputValue(profile.phone_number),
      });
    }
  }, [profile, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setError(null);
      setSuccess(false);
    }
  }, [isEditing]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('First name and last name are required.');
      return;
    }

    const phoneError = validatePhilippineMobile(form.phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    setSaving(true);
    const formattedPhone = formatPhilippineMobile(form.phone);
    const contactUpdates = {
      first_name: form.firstName,
      last_name: form.lastName,
      middle_name: form.middleName,
      suffix: form.suffix,
      phone_number: formattedPhone,
    };

    try {
      await profileService.updateContactPerson({
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        suffix: form.suffix,
        phone: formattedPhone,
      });

      onProfileUpdate?.(contactUpdates);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save personal details.');
      setSaving(false);
      return;
    }

    try {
      const shouldRequestEmailChange = form.email
        && form.email !== profile?.contact_email
        && form.email !== profile?.pending_contact_email;

      if (shouldRequestEmailChange) {
        const emailChangeResult = await profileService.requestEmailChange({
          email: form.email,
        });

        onProfileUpdate?.({
          ...contactUpdates,
          pending_contact_email: emailChangeResult?.pending_contact_email || null,
        });
      }

      setSuccess(true);
      setTimeout(() => {
        onCancelEdit?.();
      }, 1500);
    } catch (err) {
      setError(`Personal details were saved, but email change failed: ${err?.response?.data?.error || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'middleName', label: 'Middle Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'suffix', label: 'Suffix', type: 'text', placeholder: 'Jr., Sr., III' },
    { name: 'email', label: 'Email Address', type: 'email' },
  ];

  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <div className="cms-profile-section__header">
          <h3 className="cms-profile-section__title">
            <FaUserTie className="cms-profile-section__icon" /> Contact Person / Representative
          </h3>
          {isEditing && (
            <div className="cms-profile-form__actions cms-profile-form__actions--inline">
              <button
                type="button"
                className="cms-profile-form__cancel-btn"
                onClick={onCancelEdit}
                disabled={saving}
              >
                <FaTimes /> Cancel
              </button>
              <button
                type="submit"
                form="cms-profile-contact-form"
                className="cms-profile-form__save-btn"
                disabled={saving}
              >
                {saving ? <FaSpinner className="cms-profile-form__spinner" /> : <FaSave />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        <form id="cms-profile-contact-form" onSubmit={handleSave} className="cms-profile-form__stack">
          <div className="cms-profile-field-grid">
            {fields.map(({ name, label, type, placeholder }) => (
              <ProfileField
                key={name}
                isEditing={isEditing}
                label={label}
                name={name}
                onChange={(value) => handleChange(name, value)}
                placeholder={placeholder}
                saving={saving}
                type={type}
                value={form[name]}
              />
            ))}

            <ProfileField
              isEditing={isEditing}
              label="Phone Number"
              name="phone"
              onChange={(value) => handleChange('phone', value)}
              prefix={<><FaMobileAlt /> +63</>}
              saving={saving}
              type="tel"
              value={form.phone}
            />
          </div>

          {isEditing && (
            <p className="cms-profile-form__hint">Enter 10 digits without +63.</p>
          )}

          {error && (
            <p className="cms-profile-form__error">{error}</p>
          )}
          {success && (
            <p className="cms-profile-form__success">
              {form.email && form.email !== profile?.contact_email
                ? 'Changes saved. Check your email to confirm the new address.'
                : 'Personal details updated successfully.'}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

function ProfileField({ isEditing, label, name, onChange, placeholder, prefix, saving, type, value }) {
  return (
    <div className="cms-profile-field">
      <label htmlFor={name} className="cms-profile-field__label">
        {label}
      </label>
      {isEditing ? (
        <div className="cms-profile-form__input-wrap">
          {prefix && <span className="cms-profile-form__input-prefix">{prefix}</span>}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="cms-profile-form__input"
            placeholder={placeholder || ''}
            disabled={saving}
            style={prefix ? { paddingLeft: '4.75rem' } : undefined}
          />
        </div>
      ) : (
        <div className="cms-profile-field__value">
          {value || <span style={{ color: '#9ca3af', fontWeight: 400 }}>Not provided</span>}
        </div>
      )}
    </div>
  );
}
