import { useState, useEffect } from 'react';
import { FaBriefcase, FaUser, FaSave, FaTimes, FaMobileAlt } from 'react-icons/fa';
import profileService from '@services/profileService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import {
  formatPhilippineMobile,
  getEditableEmail,
  getPhoneDisplayValue,
  getPhoneInputValue,
  getProfileEmailLabel,
  getProfileFullName,
  getProfilePositionLabel,
  validatePhilippineMobile,
} from './profileViewModel';

export default function ProfileDetails({ profile, loading, isEditing, canEdit = false, onCancel, onProfileUpdate }) {
  const { notification, showNotification, closeNotification } = useNotification();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    suffix: '',
    email: '',
    phone: '',
  });
  const [isSaving, setIsSaving] = useState(false);

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

  if (loading) {
    return (
      <div className="pf-details-card detail-skeleton">
        <div className="pf-section">
          <div className="dsk-line md" style={{ height: '20px', marginBottom: '1.25rem' }} />
          <div className="pf-form-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pf-field">
                <div className="dsk-line sm" style={{ marginBottom: '0.4rem' }} />
                <div className="dsk-line lg" style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </div>
        <hr className="pf-section-divider" />
        <div className="pf-section">
          <div className="dsk-line md" style={{ height: '20px', marginBottom: '1.25rem' }} />
          <div className="pf-form-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="pf-field">
                <div className="dsk-line sm" style={{ marginBottom: '0.4rem' }} />
                <div className="dsk-line lg" style={{ height: '42px', width: '100%', borderRadius: '8px' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userId = profile?.employee_id_number || 'N/A';
  const position = getProfilePositionLabel(profile);
    
  const displayDate = profile?.hire_date || profile?.created_at;
  const dateJoinedStr = displayDate 
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(displayDate))
    : 'N/A';

  const fullName = getProfileFullName(profile);
  const email = getProfileEmailLabel(profile);
  const phone = getPhoneDisplayValue(profile);

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      showNotification('First name and last name are required.', 'error');
      return;
    }

    const phoneError = validatePhilippineMobile(form.phone);
    if (phoneError) {
      showNotification(phoneError, 'error');
      return;
    }

    setIsSaving(true);
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
      showNotification(err?.response?.data?.error || 'Failed to save personal details.', 'error');
      setIsSaving(false);
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

      showNotification(
        shouldRequestEmailChange
          ? 'Changes saved. Check your email to confirm the new address.'
          : 'Personal details updated successfully.',
        'success'
      );

      setTimeout(() => {
        if (onCancel) onCancel();
      }, 1500);
    } catch (err) {
      showNotification(
        `Personal details were saved, but email change failed: ${err?.response?.data?.error || 'Please try again.'}`,
        'error',
        6000
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pf-details-card">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      {/* Account Details */}
      <div className="pf-section">
        <h3 className="pf-section-title">
          <FaBriefcase className="pf-section-icon" /> Account Details
        </h3>
        <div className="pf-form-grid">
          <ReadonlyField label="User ID" value={userId} />
          <ReadonlyField label="Position" value={String(position).toUpperCase()} />
          <ReadonlyField label="Date Joined" value={dateJoinedStr} />
        </div>
      </div>

      <hr className="pf-section-divider" />

      {/* Personal Details */}
      <div className="pf-section" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 className="pf-section-title" style={{ margin: 0 }}>
            <FaUser className="pf-section-icon" /> Personal Details
          </h3>
          {isEditing && canEdit && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="pf-btn pf-btn-outline" onClick={onCancel} disabled={isSaving} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <FaTimes /> Cancel
              </button>
              <button className="pf-btn pf-btn-gold" onClick={handleSave} disabled={isSaving} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <FaSave /> {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {!isEditing || !canEdit ? (
          <div className="pf-form-grid">
            <ReadonlyField label="Full Name" value={fullName} />
            <ReadonlyField label="Email Address" value={email} />
            <ReadonlyField label="Phone Number" value={phone} />
          </div>
        ) : (
          <div className="pf-form-grid">
            <EditInput label="First Name" value={form.firstName} onChange={(v) => handleChange('firstName', v)} />
            <EditInput label="Middle Name" value={form.middleName} onChange={(v) => handleChange('middleName', v)} />
            <EditInput label="Last Name" value={form.lastName} onChange={(v) => handleChange('lastName', v)} />
            <EditInput label="Suffix" value={form.suffix} onChange={(v) => handleChange('suffix', v)} placeholder="Jr., Sr., III" />
            <EditInput label="Email Address" value={form.email} onChange={(v) => handleChange('email', v)} type="email" />
            <EditInput
              label="Phone Number"
              value={form.phone}
              onChange={(v) => handleChange('phone', v)}
              prefix={
                <><FaMobileAlt /> +63</>
              }
              hint="Enter 10 digits without +63"
            />
          </div>
        )}
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

function EditInput({ label, value, onChange, type = 'text', placeholder, prefix, hint }) {
  return (
    <div className="pf-field">
      <label className="pf-field-label">{label}</label>
      <div style={{ position: 'relative', marginTop: '0.4rem' }}>
        {prefix && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: '#64748b',
            fontSize: '0.9rem',
            fontWeight: 500,
            pointerEvents: 'none'
          }}>
            {prefix}
          </div>
        )}
        <input
          type={type}
          className="pf-edit-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || ''}
          style={{
            width: '100%',
            padding: `0.6rem 0.8rem 0.6rem ${prefix ? '4.5rem' : '0.8rem'}`,
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#1d4ed8';
            e.target.style.boxShadow = '0 0 0 3px rgba(29, 78, 216, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#d1d5db';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>
      {hint && <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.3rem' }}>{hint}</div>}
    </div>
  );
}
