import { useState, useEffect } from 'react';
import { FaUserTie, FaSave, FaSpinner } from 'react-icons/fa';
import profileService from '@services/profileService';

export default function ContactPerson({ profile, onProfileUpdate }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sync form with incoming profile prop whenever it changes
  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        middleName: profile.middle_name || '',
        phone: profile.phone_number || '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
    setSuccess(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await profileService.updateContactPerson({
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        phone: form.phone,
      });

      setSuccess(true);

      // Bubble updated fields up to parent so the card updates without a re-fetch
      if (onProfileUpdate) {
        onProfileUpdate({
          first_name: form.firstName,
          last_name: form.lastName,
          middle_name: form.middleName,
          phone_number: form.phone,
        });
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'middleName', label: 'Middle Name', type: 'text' },
    { name: 'phone', label: 'Phone', type: 'tel' },
  ];

  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <h3 className="cms-profile-section__title">
          <FaUserTie className="cms-profile-section__icon" /> Contact Person / Representative
        </h3>

        <form onSubmit={handleSave} className="cms-profile-form__stack">
          <div className="cms-profile-field-grid">
            {fields.map(({ name, label, type }) => (
              <div key={name}>
                <label htmlFor={name} className="cms-profile-field__label">
                  {label}
                </label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  value={form[name]}
                  onChange={handleChange}
                  className="cms-profile-form__input"
                  disabled={saving}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="cms-profile-form__error">{error}</p>
          )}
          {success && (
            <p className="cms-profile-form__success">Changes saved successfully.</p>
          )}

          <div className="cms-profile-form__actions">
            <button
              type="submit"
              className="cms-profile-form__save-btn"
              disabled={saving}
            >
              {saving ? <FaSpinner className="cms-profile-form__spinner" /> : <FaSave />}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}