import { FaAddressBook, FaEdit, FaFileContract, FaSave, FaTimes } from 'react-icons/fa';
import { InfoCell, fmtDate } from './ClientInfoCell';

const BILLING_TYPE_OPTIONS = [
  { value: 'semi_monthly', label: 'Semi Monthly' },
  { value: 'monthly',      label: 'Monthly' },
  { value: 'weekly',       label: 'Weekly' },
];

function EditInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="vc-edit-field">
      <label className="vc-edit-label">{label}</label>
      <input
        type={type}
        className="ve-edit-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ''}
      />
    </div>
  );
}

function EditSelect({ label, value, onChange, options }) {
  return (
    <div className="vc-edit-field">
      <label className="vc-edit-label">{label}</label>
      <select className="ve-edit-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

export default function GeneralTab({
  client,
  canEdit = false,
  isEditing = false,
  editForm = {},
  onEdit,
  onSave,
  onCancel,
  onField,
  isSaving = false,
}) {
  const contractColor =
    client.contract_status === 'Active'  ? '#16a34a' :
    client.contract_status === 'Expired' ? '#dc2626' : '#d97706';

  return (
    <div className="vc-tab-content">
      {/* Profile card */}
      <div className="vc-profile-card">
        <div className="vc-profile-left">
          <div className="vc-profile-avatar">
            {client.initials || '??'}
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

        {/* Edit / Save / Cancel — mirrors employee pattern */}
        {!isEditing && canEdit ? (
          <button className="ve-edit-btn" onClick={onEdit}>
            <FaEdit /> Edit Details
          </button>
        ) : isEditing ? (
          <div className="ve-edit-actions">
            <button className="ve-btn-save" onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving…' : <><FaSave /> Save Changes</>}
            </button>
            <button className="ve-btn-cancel" onClick={onCancel} disabled={isSaving}>
              <FaTimes /> Cancel
            </button>
          </div>
        ) : null}
      </div>

      {/* ── View Mode ── */}
      {!isEditing && (
        <>
          {/* Contact Information */}
          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaAddressBook className="vc-section-icon" /> Contact Information
            </h3>
            <div className="vc-info-grid cols-2">
              <InfoCell label="Contact Person"  value={client.contact_person  || 'N/A'} />
              <InfoCell label="Email Address"   value={client.contact_email   || 'N/A'} />
              <InfoCell label="Phone Number"    value={client.phone_number    || 'N/A'} />
              <InfoCell label="Billing Address" value={client.billing_address || 'N/A'} span2 />
            </div>
          </div>

          {/* Contract Details */}
          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaFileContract className="vc-section-icon" /> Contract Details
            </h3>
            <div className="vc-info-grid cols-3">
              <InfoCell label="Contract Start"  value={fmtDate(client.contract_start_date)} variant="blue" />
              <InfoCell label="Contract End"    value={fmtDate(client.contract_end_date)}   variant="blue" />
              <InfoCell label="Contract Status" value={client.contract_status || 'N/A'}     valueColor={contractColor} />
              <InfoCell label="Rate per Guard"  value={client.rate_per_guard ? `₱${Number(client.rate_per_guard).toLocaleString()}` : 'N/A'} variant="green" valueSize="xl" />
              <InfoCell label="Billing Type"    value={client.billing_type?.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A'} />
              <InfoCell label="Guard Count"     value={client.guard_count != null ? `${client.guard_count} guards` : 'N/A'} />
            </div>
          </div>
        </>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <>
          {/* Contact Information */}
          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaAddressBook className="vc-section-icon" /> Contact Information
            </h3>
            <div className="vc-edit-grid cols-2">
              <EditInput label="First Name"      value={editForm.firstName}      onChange={(v) => onField('firstName', v)} />
              <EditInput label="Last Name"       value={editForm.lastName}       onChange={(v) => onField('lastName', v)} />
              <EditInput label="Middle Name"     value={editForm.middleName}     onChange={(v) => onField('middleName', v)} />
              <EditInput label="Suffix"          value={editForm.suffix}         onChange={(v) => onField('suffix', v)} placeholder="Jr., Sr., III…" />
              <EditInput label="Mobile Number"   value={editForm.mobile}         onChange={(v) => onField('mobile', v)} placeholder="10-digit number" />
              <EditInput label="Email Address"   value={editForm.email}          onChange={(v) => onField('email', v)} type="email" />
              <EditInput label="Company Name"    value={editForm.company}        onChange={(v) => onField('company', v)} />
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

          {/* Contract Details */}
          <div className="vc-section">
            <h3 className="vc-section-title">
              <FaFileContract className="vc-section-icon" /> Contract Details
            </h3>
            <div className="vc-edit-grid cols-3">
              <EditInput label="Contract Start" value={editForm.contractStartDate} onChange={(v) => onField('contractStartDate', v)} type="date" />
              <EditInput label="Contract End"   value={editForm.contractEndDate}   onChange={(v) => onField('contractEndDate', v)} type="date" />
              <EditInput label="Rate per Guard (₱)" value={editForm.ratePerGuard} onChange={(v) => onField('ratePerGuard', v)} type="number" placeholder="0.00" />
              <EditSelect
                label="Billing Type"
                value={editForm.billingType}
                onChange={(v) => onField('billingType', v)}
                options={BILLING_TYPE_OPTIONS}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
