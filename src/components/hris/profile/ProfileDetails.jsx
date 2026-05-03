import { useState, useEffect } from 'react';
import { FaBriefcase, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { getAdminRoleLabel } from '@utils/adminPermissions';
import profileService from '@services/profileService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

export default function ProfileDetails({ profile, loading, isEditing, onCancel, onProfileUpdate }) {
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
        email: profile.contact_email || '',
        phone: profile.phone_number || '',
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
  const position = profile?.role === 'admin'
    ? getAdminRoleLabel(profile?.admin_role, profile?.role || 'Administrator')
    : (profile?.position || profile?.role || 'Client');
    
  const displayDate = profile?.hire_date || profile?.created_at;
  const dateJoinedStr = displayDate 
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(displayDate))
    : 'N/A';

  const nameParts = [
    profile?.first_name,
    profile?.middle_name ? `${profile.middle_name.charAt(0)}.` : '',
    profile?.last_name,
    profile?.suffix
  ].filter(Boolean);
  const fullName = nameParts.length > 0 ? nameParts.join(' ') : 'Not provided';
  
  const email = profile?.pending_contact_email
    ? `${profile.contact_email || 'Not provided'} (pending: ${profile.pending_contact_email})`
    : (profile?.contact_email || 'Not provided');
  const phone = profile?.phone_number || 'Not provided';

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await profileService.updateContactPerson({
        firstName: form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        suffix: form.suffix,
        phone: form.phone,
      });

      let emailChangeResult = null;
      if (form.email && form.email !== profile?.contact_email && form.email !== profile?.pending_contact_email) {
        emailChangeResult = await profileService.requestEmailChange({
          email: form.email,
        });
      }

      showNotification(
        emailChangeResult 
          ? 'Changes saved. Check your email to confirm the new address.'
          : 'Personal details updated successfully.',
        'success'
      );

      if (onProfileUpdate) {
        onProfileUpdate({
          first_name: form.firstName,
          last_name: form.lastName,
          middle_name: form.middleName,
          suffix: form.suffix,
          phone_number: form.phone,
          pending_contact_email: emailChangeResult?.pending_contact_email || profile?.pending_contact_email || null,
        });
      }

      setTimeout(() => {
        if (onCancel) onCancel();
      }, 1500);
    } catch (err) {
      showNotification(err?.response?.data?.error || 'Failed to save changes.', 'error');
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
          {isEditing && (
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

        {!isEditing ? (
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
            <EditInput label="Phone Number" value={form.phone} onChange={(v) => handleChange('phone', v)} />
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

function EditInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="pf-field">
      <label className="pf-field-label">{label}</label>
      <input
        type={type}
        className="pf-edit-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ''}
        style={{
          width: '100%',
          padding: '0.6rem 0.8rem',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          marginTop: '0.4rem',
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
  );
}
