import { useState, useEffect, useRef } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaShieldAlt, FaMoneyCheckAlt,
  FaIdCard, FaAddressBook, FaFileContract, FaCalendarCheck,
  FaUserTimes, FaEdit, FaCertificate, FaFileAlt, FaHistory,
  FaEye, FaFilePdf, FaFileImage, FaDownload, FaCheck, FaUpload, FaSave,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import GoogleAddressAutofill from './GoogleAddressAutofill';
import employeeService from '@services/employeeService';
import clientService from '@services/clientService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import { useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'personal',   label: 'Personal Info', icon: FaUser },
  { key: 'employment', label: 'Employment',     icon: FaBriefcase },
  { key: 'compliance', label: 'Compliance',     icon: FaShieldAlt },
  { key: 'payroll',    label: 'Payroll',         icon: FaMoneyCheckAlt },
];

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const POSITIONS = [
  'Security Guard', 'Security Officer', 'Team Leader', 'Shift Supervisor',
  'Operations Manager', 'Administrative Officer', 'HR Officer', 'Utility Personnel',
];

const EDUCATIONAL_LEVELS = [
  'Elementary Graduate', 'High School Graduate', 'Vocational / TESDA',
  'College Level', "Bachelor's Degree", "Master's Degree", 'Doctorate',
];

/* Build a blank edit form from current employee data */
const buildForm = (emp) => ({
  // Personal
  date_of_birth:            emp.date_of_birth            || '',
  gender:                   emp.gender                    || '',
  civil_status:             emp.civil_status              || '',
  height_cm:                emp.height_cm                 || '',
  educational_level:        emp.educational_level         || '',
  blood_type:               emp.blood_type                || '',
  place_of_birth:           emp.place_of_birth            || '',
  // Contact
  phone_number:             (emp.phone_number             || '').replace(/^\+63/, ''),
  contact_email:            emp.contact_email             || '',
  residential_address:      emp.residential_address       || '',
  provincial_address:       emp.provincial_address        || '',
  latitude:                 emp.latitude                  || null,
  longitude:                emp.longitude                 || null,
  emergency_contact_name:   emp.emergency_contact_name    || '',
  emergency_contact_number: (emp.emergency_contact_number || '').replace(/^\+63/, ''),
  // Employment
  position:                 emp.position                  || '',
  employment_type:          emp.employment_type           || '',
  badge_number:             emp.badge_number              || '',
  license_number:           emp.license_number            || '',
  license_expiry_date:      emp.license_expiry_date       || '',
});

export default function ViewEmployeeModal({ isOpen, employee: previewEmployee, onClose, onUpdated }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]         = useState('personal');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [fetchError, setFetchError]       = useState(false);
  const [previewUrl, setPreviewUrl]       = useState(null);
  const [isEditing, setIsEditing]         = useState(false);
  const [editForm, setEditForm]           = useState({});
  const [pendingFiles, setPendingFiles]   = useState({}); // { clearance_type: File }
  const [isSaving, setIsSaving]           = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [sitesList, setSitesList] = useState([]);
  const [deployForm, setDeployForm] = useState({ siteId: '', contractStartDate: '', contractEndDate: '' });
  const [isDeploying, setIsDeploying] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    if (isOpen && previewEmployee?.id) {
      setLoading(true);
      setFetchError(false);
      employeeService.getEmployeeDetails(previewEmployee.id)
        .then(data => {
          setEmployeeDetails(data);
          setLoading(false);
        })
        .catch(err  => {
          console.error(err);
          setFetchError(true);
          setLoading(false);
        });
    } else {
      setEmployeeDetails(null);
      setActiveTab('personal');
      setIsEditing(false);
      setPendingFiles({});
      setFetchError(false);
    }
  }, [isOpen, previewEmployee]);

  if (!isOpen || !previewEmployee) return null;
  const data = employeeDetails || previewEmployee;

  /* Start editing — pre-fill form with current values */
  const handleEdit = () => {
    setEditForm(buildForm(data));
    setPendingFiles({});
    setIsEditing(true);
  };

  /* Cancel — discard changes */
  const handleCancel = () => {
    setIsEditing(false);
    setPendingFiles({});
  };

  /* Field change helper */
  const handleField = (key, value) => setEditForm(f => ({ ...f, [key]: value }));

  /* Clearance file selected in edit mode */
  const handleClearanceFile = (type, file) => {
    setPendingFiles(prev => ({ ...prev, [type]: file }));
  };

  /* Save */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();

      // Append all scalar fields
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));

      // Append clearance files
      Object.entries(pendingFiles).forEach(([type, file]) => {
        formData.append(`document_${type}`, file);
      });

      await employeeService.updateEmployee(previewEmployee.id, formData);

      // Refresh displayed data
      const refreshed = await employeeService.getEmployeeDetails(previewEmployee.id);
      setEmployeeDetails(refreshed);
      setIsEditing(false);
      setPendingFiles({});
      onUpdated?.();
      showNotification('Employee details updated successfully.', 'success');
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to save changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTerminate = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();
      formData.append('status', 'terminated');
      await employeeService.updateEmployee(previewEmployee.id, formData);
      showNotification('Employee terminated successfully.', 'success');
      setShowTerminateConfirm(false);
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to terminate employee.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeployModal = async () => {
    setShowDeployModal(true);
    setDeployForm({ siteId: '', contractStartDate: '', contractEndDate: '' });
    try {
      const sites = await clientService.getAllSitesList();
      setSitesList(sites);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load client sites.', 'error');
    }
  };

  const handleDeploy = async () => {
    if (!deployForm.siteId) {
      showNotification('Please select a client site.', 'error');
      return;
    }
    setIsDeploying(true);
    try {
      await employeeService.deployEmployee(data.id, {
        siteId: deployForm.siteId,
        contractStartDate: deployForm.contractStartDate || undefined,
        contractEndDate: deployForm.contractEndDate || undefined
      });
      showNotification('Employee deployed successfully!', 'success');
      setShowDeployModal(false);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to deploy employee.', 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="ve-modal-overlay" onClick={onClose}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className="ve-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ve-modal-header">
          <div>
            <h2>Employee Details</h2>
            <p>{data.employee_id_number} • {data.full_name || data.name}</p>
          </div>
          <button className="ve-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Tabs */}
        <div className="ve-tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`ve-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon />{tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="ve-modal-body relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/70">
              <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {!loading && (
            <>
              {fetchError && (
                <div style={{ background:'#fef3c7', border:'1px solid #fde68a', color:'#92400e', borderRadius:'8px', padding:'0.65rem 1rem', fontSize:'0.8rem', fontWeight:600, marginBottom:'1rem' }}>
                  Could not load full employee details. Showing limited information.
                </div>
              )}
              {activeTab === 'personal'   && (
                <PersonalTab
                  employee={data}
                  canEdit={!fetchError && !!employeeDetails}
                  isEditing={isEditing}
                  editForm={editForm}
                  pendingFiles={pendingFiles}
                  onFile={handleClearanceFile}
                  onField={handleField}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  isSaving={isSaving}
                />
              )}
              {activeTab === 'employment' && (
                <EmploymentTab
                  employee={data}
                  isEditing={isEditing}
                  editForm={editForm}
                  onField={handleField}
                />
              )}
              {activeTab === 'compliance' && (
                <ComplianceTab
                  employee={data}
                  isEditing={isEditing}
                  pendingFiles={pendingFiles}
                  onPreview={setPreviewUrl}
                  onClearanceFile={handleClearanceFile}
                />
              )}
              {activeTab === 'payroll' && <PayrollTab employee={data} />}
            </>
          )}

          {/* Image Preview Modal */}
          {previewUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewUrl(null)}>
              <button className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors">
                <FaTimes />
              </button>
              <img
                src={previewUrl}
                alt="Document Preview"
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="ve-action-buttons mt-6">
            <button 
              className="ve-btn ve-btn-gold" 
              onClick={() => {
                const url = data.contract_document_url;
                if (url) window.open(url, '_blank');
                else showNotification('No contract document found.', 'error');
              }}
            >
              <FaFileContract /> View Contract
            </button>
            <button 
              className="ve-btn ve-btn-blue"
              onClick={() => {
                onClose();
                navigate(`/hris/attendance?employeeId=${data.id}`);
              }}
            >
              <FaCalendarCheck /> View Attendance
            </button>
            <button 
              className="ve-btn ve-btn-green"
              onClick={openDeployModal}
              disabled={data.status === 'terminated'}
            >
              <FaMapMarkerAlt /> Assign Client
            </button>
            <button 
              className="ve-btn ve-btn-red"
              onClick={() => setShowTerminateConfirm(true)}
              disabled={data.status === 'terminated'}
            >
              <FaUserTimes /> {data.status === 'terminated' ? 'Terminated' : 'Terminate Employee'}
            </button>
          </div>
        </div>
      </div>

      {/* Terminate Confirmation Modal */}
      {showTerminateConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Terminate Employee?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to terminate <strong>{data.full_name || data.name}</strong>? This action will mark their status as terminated and they will no longer be assignable to clients.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowTerminateConfirm(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                onClick={handleTerminate}
                disabled={isSaving}
              >
                {isSaving && <FaSpinner className="animate-spin" />}
                Yes, Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deploy / Assign Client Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Assign to Client Site</h3>
            <p className="text-sm text-gray-500 mb-5">
              Deploy <strong>{data.full_name || data.name}</strong> to a client site.
            </p>

            <div className="space-y-4">
              {/* Site selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Site *</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={deployForm.siteId}
                  onChange={(e) => setDeployForm(f => ({ ...f, siteId: e.target.value }))}
                >
                  <option value="">— Select a site —</option>
                  {sitesList.map(site => (
                    <option key={site.id} value={site.id}>
                      {site.site_name} — {site.clients?.company || 'Unknown Client'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={deployForm.contractStartDate}
                    onChange={(e) => setDeployForm(f => ({ ...f, contractStartDate: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={deployForm.contractEndDate}
                    onChange={(e) => setDeployForm(f => ({ ...f, contractEndDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setShowDeployModal(false)}
                disabled={isDeploying}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
                onClick={handleDeploy}
                disabled={isDeploying || !deployForm.siteId}
              >
                {isDeploying && <FaSpinner className="animate-spin" />}
                Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared: edit field wrappers
───────────────────────────────────────────────────────── */
function EditInput({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="ve-edit-field">
      <label className="ve-edit-label">{label}</label>
      <input
        type={type}
        className="ve-edit-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || label}
      />
    </div>
  );
}

function EditSelect({ label, value, onChange, options }) {
  return (
    <div className="ve-edit-field">
      <label className="ve-edit-label">{label}</label>
      <select className="ve-edit-input" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">— Select —</option>
        {options.map(o => (
          <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
        ))}
      </select>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Personal Info Tab
───────────────────────────────────────────────────────── */
function PersonalTab({ employee, canEdit, isEditing, editForm, pendingFiles, onFile, onField, onEdit, onSave, onCancel, isSaving }) {
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
                  onChange={(e) => {
                    if (e.target.files[0]) {
                      onFile('avatar', e.target.files[0]);
                    }
                  }} 
                />
              </>
            )}
          </div>
          <div>
            <h3 className="ve-profile-name">{employee.full_name || employee.name}</h3>
            <p className="ve-profile-position">{employee.position}</p>
            <div className="ve-profile-meta">
              <span className={`ve-profile-badge badge-${employee.status || 'unknown'}`}>{employee.status?.toUpperCase() || 'UNKNOWN'}</span>

              <span className="ve-profile-id">ID: {employee.employee_id_number}</span>
            </div>
          </div>
        </div>

        {/* Edit / Save / Cancel buttons */}
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
              <EditInput  label="Date of Birth"          type="date"  value={editForm.date_of_birth}      onChange={v => onField('date_of_birth', v)} />
              <EditSelect label="Gender"                 value={editForm.gender}                           onChange={v => onField('gender', v)}
                options={['Male', 'Female']} />
              <EditSelect label="Marital Status"         value={editForm.civil_status}                     onChange={v => onField('civil_status', v)}
                options={['Single', 'Married', 'Widowed', 'Separated']} />
              <EditSelect label="Blood Type"             value={editForm.blood_type}                       onChange={v => onField('blood_type', v)}
                options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} />
              <EditInput  label="Place of Birth"         value={editForm.place_of_birth}                   onChange={v => onField('place_of_birth', v)} placeholder="City, Province" />
              <EditInput  label="Height (cm)"            type="number" value={editForm.height_cm}          onChange={v => onField('height_cm', v)} placeholder="e.g. 170" />
              <EditSelect label="Educational Attainment" value={editForm.educational_level}                onChange={v => onField('educational_level', v)}
                options={EDUCATIONAL_LEVELS} />
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
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Employment Tab
───────────────────────────────────────────────────────── */
function EmploymentTab({ employee, isEditing, editForm, onField }) {
  let tenureStr = 'N/A';
  if (employee.hire_date) {
    const diff = new Date() - new Date(employee.hire_date);
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    if (years >= 1) {
      tenureStr = `${Math.floor(years)} year(s)`;
      const months = Math.floor((years - Math.floor(years)) * 12);
      if (months > 0) tenureStr += `, ${months} month(s)`;
    } else {
      tenureStr = `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} month(s)`;
    }
  }
  const hireDateStr = employee.hire_date
    ? new Date(employee.hire_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title"><FaBriefcase className="ve-section-icon" /> Employment Details</h3>

        {/* Always-read-only core fields */}
        <div className="ve-info-grid cols-3" style={{ marginBottom: '1rem' }}>
          <InfoCell label="Employee ID"   value={employee.employee_id_number} variant="blue" />
          <InfoCell label="Date Started"  value={hireDateStr}                 variant="blue" />
          <InfoCell label="Tenure"        value={tenureStr}                   variant="blue" />
          <InfoCell label="Status"        value={employee.status?.toUpperCase()} valueColor={employee.status === 'active' ? '#16a34a' : '#d97706'} />
          <InfoCell label="Assigned Company" value={`${employee.current_company} - ${employee.current_site}`} span2 />
        </div>

        {/* Editable fields */}
        {!isEditing ? (
          <div className="ve-info-grid cols-3">
            <InfoCell label="Position"        value={employee.position || 'N/A'} />
            <InfoCell label="Employment Type" value={toProperCase(employee.employment_type)} />
            <InfoCell label="Badge Number"    value={employee.badge_number || 'N/A'} />
            <InfoCell label="License Number"  value={employee.license_number || 'N/A'} />
            <InfoCell label="License Expiry"  value={employee.license_expiry_date || 'N/A'} />
          </div>
        ) : (
          <div className="ve-edit-grid cols-2">
            <EditSelect label="Position" value={editForm.position} onChange={v => onField('position', v)} options={POSITIONS} />
            <EditSelect label="Employment Type" value={editForm.employment_type} onChange={v => onField('employment_type', v)}
              options={[{ value: 'regular', label: 'Regular' }, { value: 'reliever', label: 'Reliever' }]} />
            <EditInput label="Badge Number" value={editForm.badge_number} onChange={v => onField('badge_number', v)} />
            <EditInput label="License Number" value={editForm.license_number} onChange={v => onField('license_number', v)} />
            <EditInput label="License Expiry" type="date" value={editForm.license_expiry_date} onChange={v => onField('license_expiry_date', v)} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Compliance Tab
───────────────────────────────────────────────────────── */
function ComplianceTab({ employee, isEditing, pendingFiles, onPreview, onClearanceFile }) {
  const fileInputRefs = useRef({});

  const docLabels = {
    valid_id: 'Valid ID',
    resume:   'Resume',
    biodata:  '201 File / Bio-data (Legacy)',
    sg_license: 'Security Guard License (LTOPF)',
    les:      'Security License (Legacy)',
    barangay: 'Barangay Clearance',
    police:   'Police Clearance',
    nbi:      'NBI Clearance',
    neuro:    'Neuro-Psychiatric Test',
    drugtest: 'Drug Test Result',
    deployment_order: 'Deployment Order'
  };

  // All possible clearance types (so admin can upload even missing ones)
  const ALL_TYPES = Object.keys(docLabels);

  const handleViewDoc = (url) => {
    if (!url) return;
    const isPdf = url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf');
    if (isPdf) window.open(url, '_blank');
    else onPreview(url);
  };

  const getIsPdf = (url) => {
    if (!url) return false;
    return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('/pdf');
  };

  // Build a map of existing clearances keyed by type
  const existingMap = {};
  (employee.clearances || []).forEach(c => { existingMap[c.clearance_type] = c; });

  // In view mode, show only what exists; in edit mode show all slots
  const displayTypes = isEditing ? ALL_TYPES : (employee.clearances?.length > 0 ? ALL_TYPES.filter(t => existingMap[t]) : []);

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaCertificate className="ve-section-icon" /> Requirements &amp; Clearances
        </h3>

        {displayTypes.length > 0 ? (
          <div className="ve-doc-grid">
            {displayTypes.map((type) => {
              const c        = existingMap[type];
              const hasDoc   = !!(c?.document_url);
              const isPdf    = getIsPdf(c?.document_url);
              const pending  = pendingFiles[type];

              return (
                <div key={type} className={`ve-doc-card ${hasDoc || pending ? 'has-doc' : 'no-doc'}`}>
                  <div className="ve-doc-card-icon-wrap">
                    <div className={`ve-doc-card-icon ${pending ? 'img' : isPdf ? 'pdf' : hasDoc ? 'img' : 'empty'}`}>
                      {pending ? <FaUpload /> : isPdf ? <FaFilePdf /> : hasDoc ? <FaFileImage /> : <FaFileAlt />}
                    </div>
                  </div>
                  <div className="ve-doc-card-info">
                    <p className="ve-doc-card-title">{docLabels[type] || type}</p>
                    <p className="ve-doc-card-sub">
                      {pending
                        ? `New: ${pending.name}`
                        : isPdf ? 'PDF Document'
                        : hasDoc ? 'Image File'
                        : 'Not yet uploaded'}
                    </p>
                  </div>

                  {/* View/Preview button (always visible when has doc or pending) */}
                  {!isEditing && (
                    <button
                      onClick={() => handleViewDoc(c?.document_url)}
                      disabled={!hasDoc}
                      className={`ve-doc-view-btn ${!hasDoc ? 'disabled' : isPdf ? 'pdf' : 'img'}`}
                      title={hasDoc ? (isPdf ? 'Open PDF' : 'Preview') : 'No document'}
                    >
                      {isPdf ? <FaDownload /> : <FaEye />}
                      <span>{isPdf ? 'Open' : 'Preview'}</span>
                    </button>
                  )}

                  {/* Upload button in edit mode */}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        style={{ display: 'none' }}
                        ref={el => fileInputRefs.current[type] = el}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) onClearanceFile(type, file);
                        }}
                      />
                      <button
                        className={`ve-doc-view-btn img ${pending ? 'pdf' : ''}`}
                        onClick={() => fileInputRefs.current[type]?.click()}
                        title={hasDoc ? 'Replace document' : 'Upload document'}
                      >
                        <FaUpload />
                        <span>{pending ? 'Changed' : hasDoc ? 'Replace' : 'Upload'}</span>
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="ve-doc-empty">
            <FaFileAlt className="ve-doc-empty-icon" />
            <p className="ve-doc-empty-text">No clearances or documents recorded.</p>
            <p className="ve-doc-empty-sub">Documents will appear here once uploaded during onboarding.</p>
          </div>
        )}
      </div>

      {/* Government IDs — always read-only */}
      <div className="ve-section">
        <h3 className="ve-section-title"><FaFileAlt className="ve-section-icon" /> Government Identity Numbers</h3>
        <div className="ve-info-grid cols-2 shadow-sm rounded-xl p-4 border border-gray-50 bg-white">
          <InfoCell label="TIN"              value={employee.tin_number        || 'N/A'} />
          <InfoCell label="SSS Number"       value={employee.sss_number        || 'N/A'} />
          <InfoCell label="PhilHealth Number" value={employee.philhealth_number || 'N/A'} />
          <InfoCell label="Pag-IBIG MID"     value={employee.pagibig_number    || 'N/A'} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Payroll Tab (read-only)
───────────────────────────────────────────────────────── */
function PayrollTab({ employee }) {
  const fmt = (val) => val == null ? 'N/A'
    : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title"><FaMoneyCheckAlt className="ve-section-icon" /> Payroll Information</h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Base Pay"       value={fmt(employee.base_salary)}            variant="green" valueSize="xl" />
          <InfoCell label="Pay Frequency"  value={toProperCase(employee.pay_frequency)} />
        </div>
      </div>

      <div className="ve-section">
        <h3 className="ve-section-title"><FaHistory className="ve-section-icon" /> Recent Payroll History</h3>
        <div className="ve-table-wrap">
          <table className="ve-payroll-table">
            <thead>
              <tr>
                <th>Pay Period</th>
                <th className="text-right">Basic Pay</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employee.payroll_records?.length > 0 ? employee.payroll_records.map(pr => {
                const totalDeductions = (pr.statutory_deductions || 0) + (pr.cash_advance_deduction || 0) + (pr.absences_deduction || 0);
                return (
                  <tr key={pr.id}>
                    <td className="fw-600">{new Date(pr.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(pr.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="text-right text-green">{fmt(pr.basic_pay)}</td>
                    <td className="text-right text-red">{fmt(totalDeductions)}</td>
                    <td className="text-right fw-700">{fmt(pr.net_pay)}</td>
                    <td><span className={`ve-pay-badge ${pr.status === 'paid' ? '' : 'bg-gray-200 text-gray-700'}`}>{pr.status?.toUpperCase()}</span></td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No payroll records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Shared: read-only info cell
───────────────────────────────────────────────────────── */
function InfoCell({ label, value, variant, span2, span3, valueColor, valueSize }) {
  const cellClass = [
    've-info-cell',
    variant === 'blue'  ? 'blue'   : '',
    variant === 'green' ? 'green'  : '',
    span2               ? 'span-2' : '',
    span3               ? 'span-3' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClass}>
      <p className="ve-info-label">{label}</p>
      <p className={`ve-info-value ${valueSize === 'xl' ? 'xl' : ''}`} style={valueColor ? { color: valueColor } : undefined}>
        {value}
      </p>
    </div>
  );
}
