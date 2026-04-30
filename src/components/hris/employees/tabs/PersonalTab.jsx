import { useState, useEffect, useRef } from 'react';
import {
  FaEdit, FaSave, FaIdCard, FaAddressBook, FaTimes,
} from 'react-icons/fa';
import GoogleAddressAutofill from '../GoogleAddressAutofill';
import { EditInput, EditSelect, InfoCell } from './EmployeeEditFields';

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const EDUCATIONAL_LEVELS = [
  'Elementary Graduate', 'High School Graduate', 'Vocational / TESDA',
  'College Level', "Bachelor's Degree", "Master's Degree", 'Doctorate',
];

export default function PersonalTab({
  employee, canEdit, isEditing, editForm, pendingFiles,
  onFile, onField, onEdit, onSave, onCancel, isSaving,
}) {
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    const file = pendingFiles?.avatar;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }, [pendingFiles?.avatar]);

  const displayAvatarUrl = avatarPreview || employee.avatar_url;

  return (
    <div className="ve-tab-content">
      {/* Profile card */}
      <div className="ve-profile-card">
        <div className="ve-profile-left">
          <div className="relative group inline-block">
            {displayAvatarUrl
              ? <img src={displayAvatarUrl} alt={employee.initials} className="ve-profile-avatar object-cover" />
              : <div className="ve-profile-avatar">{employee.initials}</div>
            }
            {isEditing && (
              <>
                <div
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                  onClick={() => avatarInputRef.current?.click()}
                >
                  <span className="text-white text-xs font-semibold">{displayAvatarUrl ? 'Change' : 'Upload'}</span>
                </div>
                <input
                  type="file"
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => { if (e.target.files[0]) onFile('avatar', e.target.files[0]); }}
                />
              </>
            )}
          </div>
          <div>
            <h3 className="ve-profile-name">{employee.full_name || employee.name}</h3>
            <p className="ve-profile-position">{employee.position}</p>
            <div className="ve-profile-meta">
              <span className={`ve-profile-badge badge-${employee.status || 'unknown'}`}>
                {employee.status?.toUpperCase() || 'UNKNOWN'}
              </span>
              <span className="ve-profile-id">ID: {employee.employee_id_number}</span>
            </div>
          </div>
        </div>

        {/* Edit / Save / Cancel */}
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
          <div className="ve-section">
            <h3 className="ve-section-title"><FaIdCard className="ve-section-icon" /> Basic Information</h3>
            <div className="ve-info-grid cols-3">
              <InfoCell label="Full Name"               value={employee.full_name || employee.name} />
              <InfoCell label="Date of Birth"           value={employee.date_of_birth ? `${new Date(employee.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}${employee.age ? ` (Age ${employee.age})` : ''}` : 'N/A'} />
              <InfoCell label="Gender"                  value={employee.gender || 'N/A'} />
              <InfoCell label="Citizenship"             value={employee.citizenship || 'Filipino'} />
              <InfoCell label="Marital Status"          value={employee.civil_status || 'N/A'} />
              <InfoCell label="Blood Type"              value={employee.blood_type || 'N/A'} />
              <InfoCell label="Place of Birth"          value={employee.place_of_birth || 'N/A'} />
              <InfoCell label="Height"                  value={employee.height_cm ? `${employee.height_cm} cm` : 'N/A'} />
              <InfoCell label="Educational Attainment"  value={employee.educational_level || 'N/A'} />
            </div>
          </div>

          <div className="ve-section">
            <h3 className="ve-section-title"><FaAddressBook className="ve-section-icon" /> Contact Information</h3>
            <div className="ve-info-grid cols-2">
              <InfoCell label="Mobile Number"      value={employee.phone_number || 'N/A'} />
              <InfoCell label="Email Address"      value={employee.contact_email || 'N/A'} />
              <InfoCell label="Residential Address" value={employee.residential_address || 'N/A'} span2 />
              <InfoCell label="Provincial Address" value={employee.provincial_address || 'N/A'} span2 />
              <InfoCell label="Emergency Contact"  value={employee.emergency_contact_name || 'N/A'} />
              <InfoCell label="Emergency Number"   value={employee.emergency_contact_number || 'N/A'} />
              <InfoCell label="Relationship"       value={employee.emergency_contact_relationship || 'N/A'} />
            </div>
          </div>
        </>
      )}

      {/* ── Edit Mode ── */}
      {isEditing && (
        <>
          <div className="ve-section">
            <h3 className="ve-section-title"><FaIdCard className="ve-section-icon" /> Basic Information</h3>
            <div className="ve-edit-grid cols-3">
              <EditInput  label="Date of Birth"          type="date"   value={editForm.date_of_birth}      onChange={v => onField('date_of_birth', v)} />
              <EditSelect label="Gender"                 value={editForm.gender}                            onChange={v => onField('gender', v)}        options={['Male', 'Female']} />
              <EditSelect label="Marital Status"         value={editForm.civil_status}                     onChange={v => onField('civil_status', v)}  options={['Single', 'Married', 'Widowed', 'Separated']} />
              <EditSelect label="Blood Type"             value={editForm.blood_type}                       onChange={v => onField('blood_type', v)}    options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
              <EditInput  label="Place of Birth"         value={editForm.place_of_birth}                   onChange={v => onField('place_of_birth', v)} placeholder="City, Province" />
              <EditInput  label="Height (cm)"            type="number" value={editForm.height_cm}          onChange={v => onField('height_cm', v)}     placeholder="e.g. 170" />
              <EditSelect label="Educational Attainment" value={editForm.educational_level}                onChange={v => onField('educational_level', v)} options={EDUCATIONAL_LEVELS} />
              <EditInput  label="Citizenship"            value={editForm.citizenship}                      onChange={v => onField('citizenship', v)}   readOnly disabled />
            </div>
          </div>

          <div className="ve-section">
            <h3 className="ve-section-title"><FaAddressBook className="ve-section-icon" /> Contact Information</h3>
            <div className="ve-edit-grid cols-2">
              <EditInput label="Mobile Number"         value={editForm.phone_number}             onChange={v => onField('phone_number', v)}             placeholder="10-digit number" />
              <EditInput label="Email Address"  type="email" value={editForm.contact_email}      onChange={v => onField('contact_email', v)} />
              <div className="ve-edit-field span-2">
                <label className="ve-edit-label">Residential Address</label>
                <GoogleAddressAutofill
                  apiKey={GOOGLE_MAPS_KEY}
                  value={editForm.residential_address}
                  onChange={(e) => {
                    onField('residential_address', e.target.value);
                    onField('latitude', null);
                    onField('longitude', null);
                  }}
                  className="ve-edit-input"
                  placeholder="Search for an address..."
                  onPlaceSelected={({ formattedAddress, lat, lng }) => {
                    onField('residential_address', formattedAddress);
                    onField('latitude', lat);
                    onField('longitude', lng);
                  }}
                />
                <p className="ae-hint">Validated address saves coordinates for deployment calculations.</p>
              </div>
              <div className="ve-edit-field span-2">
                <EditInput label="Provincial Address" value={editForm.provincial_address} onChange={v => onField('provincial_address', v)} placeholder="Complete provincial address" />
              </div>
              <EditInput label="Emergency Contact Name"   value={editForm.emergency_contact_name}   onChange={v => onField('emergency_contact_name', v)} />
              <EditInput label="Emergency Contact Number" value={editForm.emergency_contact_number} onChange={v => onField('emergency_contact_number', v)} placeholder="10-digit number" />
              <EditInput label="Relationship"             value={editForm.emergency_contact_relationship} onChange={v => onField('emergency_contact_relationship', v)} placeholder="e.g. Parent, Spouse" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
