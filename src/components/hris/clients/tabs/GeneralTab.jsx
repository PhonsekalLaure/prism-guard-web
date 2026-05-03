import { useEffect, useMemo, useRef } from 'react';
import { FaAddressBook, FaEdit, FaFileContract, FaSave, FaTimes } from 'react-icons/fa';
import { InfoCell, fmtDate } from './ClientInfoCell';

function EditInput({ label, value, onChange, type = 'text', placeholder, readOnly = false, disabled = false }) {
  return (
    <div className="vc-edit-field">
      <label className="vc-edit-label">{label}</label>
      <input
        type={type}
        className="ve-edit-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ''}
        readOnly={readOnly}
        disabled={disabled}
      />
    </div>
  );
}

export default function GeneralTab({
  client,
  canEdit = false,
  isEditing = false,
  editForm = {},
  pendingFiles = {},
  onEdit,
  onSave,
  onCancel,
  onField,
  onFile,
  isSaving = false,
}) {
  const avatarInputRef = useRef(null);
  const contractColor =
    client.contract_status === 'Active' ? '#16a34a'
      : client.contract_status === 'Expired' ? '#dc2626'
        : '#d97706';
  const avatarFile = pendingFiles?.avatar || null;
  const avatarPreview = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile]
  );
  const displayAvatarUrl = avatarPreview || client.avatar_url;

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  return (
    <div className="vc-tab-content">
      <div className="vc-profile-card">
        <div className="vc-profile-left">
          <div className="relative group inline-block">
            {displayAvatarUrl ? (
              <img src={displayAvatarUrl} alt={client.initials || client.company} className="vc-profile-avatar object-cover" />
            ) : (
              <div className="vc-profile-avatar">
                {client.initials || '??'}
              </div>
            )}
            {isEditing && (
              <>
                <div
                  className="absolute inset-0 bg-black/50 rounded-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <span className="text-white text-xs font-semibold">{displayAvatarUrl ? 'Change' : 'Upload'}</span>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onFile?.('avatar', e.target.files[0]);
                    }
                  }}
                />
              </>
            )}
          </div>
          <div>
            <h3 className="vc-profile-name">{client.company}</h3>
            <p className="vc-profile-sub">{client.contact_person || 'No contact person set'}</p>
            <div className="vc-profile-meta">
              <span className={`vc-profile-badge badge-${client.status}`}>
                {client.status?.toUpperCase()}
              </span>
              <span className="vc-profile-contract" style={{ color: contractColor }}>
                Contract: {client.contract_status}
              </span>
            </div>
          </div>
        </div>

        {!isEditing && canEdit ? (
          <button className="ve-edit-btn" onClick={onEdit}>
            <FaEdit /> Edit Details
          </button>
        ) : isEditing ? (
          <div className="ve-edit-actions">
            <button className="ve-btn-save" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : <><FaSave /> Save Changes</>}
            </button>
            <button className="ve-btn-cancel" onClick={onCancel} disabled={isSaving}>
              <FaTimes /> Cancel
            </button>
          </div>
        ) : null}
      </div>

      {!isEditing && (
        <>
          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaAddressBook className="vc-section-icon" /> Contact Information
            </h3>
            <div className="vc-info-grid cols-2">
              <InfoCell label="Contact Person" value={client.contact_person || 'N/A'} />
              <InfoCell label="Email Address" value={client.contact_email || 'N/A'} />
              <InfoCell label="Phone Number" value={client.phone_number || 'N/A'} />
              <InfoCell label="Billing Address" value={client.billing_address || 'N/A'} span2 />
            </div>
          </div>

          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaFileContract className="vc-section-icon" /> Contract Details
            </h3>
            <div className="vc-info-grid cols-3">
              <InfoCell label="Contract Start" value={fmtDate(client.contract_start_date)} variant="blue" />
              <InfoCell label="Contract End" value={fmtDate(client.contract_end_date)} variant="blue" />
              <InfoCell label="Contract Status" value={client.contract_status || 'N/A'} valueColor={contractColor} />
              <InfoCell label="Rate per Guard" value={client.rate_per_guard ? `PHP ${Number(client.rate_per_guard).toLocaleString()}` : 'N/A'} variant="green" valueSize="xl" />
              <InfoCell label="Billing Type" value={client.billing_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A'} />
              <InfoCell label="Guard Count" value={client.guard_count != null ? `${client.guard_count} guards` : 'N/A'} />
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <div className="vc-section">
          <h3 className="vc-section-title">
            <FaAddressBook className="vc-section-icon" /> Contact Information
          </h3>
          <div className="vc-edit-grid cols-2">
            <EditInput label="First Name" value={editForm.firstName} onChange={(v) => onField('firstName', v)} />
            <EditInput label="Last Name" value={editForm.lastName} onChange={(v) => onField('lastName', v)} />
            <EditInput label="Middle Name" value={editForm.middleName} onChange={(v) => onField('middleName', v)} />
            <EditInput label="Suffix" value={editForm.suffix} onChange={(v) => onField('suffix', v)} placeholder="Jr., Sr., III" />
            <EditInput label="Mobile Number" value={editForm.mobile} onChange={(v) => onField('mobile', v)} placeholder="10-digit number" />
            <EditInput label="Email Address" value={editForm.email} onChange={(v) => onField('email', v)} type="email" />
            <EditInput label="Company Name" value={editForm.company} onChange={(v) => onField('company', v)} />
            <div className="vc-edit-field span-2">
              <label className="vc-edit-label">Billing Address</label>
              <input
                type="text"
                className="ve-edit-input"
                value={editForm.billingAddress}
                onChange={(e) => onField('billingAddress', e.target.value)}
                placeholder="Full billing address"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
