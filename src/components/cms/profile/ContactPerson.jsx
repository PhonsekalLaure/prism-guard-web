import { useState } from 'react';
import { FaUserTie, FaSave } from 'react-icons/fa';

const initialValues = {
  fullName: 'Engr. Maria Santos',
  position: 'Head, General Services',
  email: 'm.santos@feutech.edu.ph',
  phone: '+63 917 123 4567',
};

export default function ContactPerson() {
  const [form, setForm] = useState(initialValues);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: wire to API
  };

  return (
    <div className="cms-profile-details-card">
      <div className="cms-profile-section">
        <h3 className="cms-profile-section__title">
          <FaUserTie className="cms-profile-section__icon" /> Contact Person / Representative
        </h3>

        <form onSubmit={handleSave} className="cms-profile-form__stack">
          <div className="cms-profile-field-grid">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="cms-profile-field__label">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange}
                className="cms-profile-form__input"
              />
            </div>

            {/* Position */}
            <div>
              <label htmlFor="position" className="cms-profile-field__label">
                Position
              </label>
              <input
                id="position"
                name="position"
                type="text"
                value={form.position}
                onChange={handleChange}
                className="cms-profile-form__input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="cms-profile-field__label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="cms-profile-form__input"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="cms-profile-field__label">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="cms-profile-form__input"
              />
            </div>
          </div>

          <div className="cms-profile-form__actions">
            <button type="submit" className="cms-profile-form__save-btn">
              <FaSave />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}