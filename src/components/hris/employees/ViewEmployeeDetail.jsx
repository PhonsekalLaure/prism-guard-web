import { useState, useEffect } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaShieldAlt, FaMoneyCheckAlt,
  FaFileContract, FaUserTimes, FaMapMarkerAlt,
} from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import employeeService from '@services/employeeService';
import clientService from '@services/clientService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

// Tab fragments
import PersonalTab    from './tabs/PersonalTab';
import EmploymentTab  from './tabs/EmploymentTab';
import ComplianceTab  from './tabs/ComplianceTab';
import PayrollTab     from './tabs/PayrollTab';

const TABS = [
  { key: 'personal',   label: 'Personal Info', icon: FaUser },
  { key: 'employment', label: 'Employment',     icon: FaBriefcase },
  { key: 'compliance', label: 'Compliance',     icon: FaShieldAlt },
  { key: 'payroll',    label: 'Payroll',        icon: FaMoneyCheckAlt },
];

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' }, { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' }, { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const buildForm = (emp) => ({
  date_of_birth:                    emp.date_of_birth                    || '',
  gender:                           emp.gender                           || '',
  civil_status:                     emp.civil_status                     || '',
  height_cm:                        emp.height_cm                        || '',
  educational_level:                emp.educational_level                || '',
  blood_type:                       emp.blood_type                       || '',
  place_of_birth:                   emp.place_of_birth                   || '',
  phone_number:                     (emp.phone_number                    || '').replace(/^\+63/, ''),
  contact_email:                    emp.contact_email                    || '',
  residential_address:              emp.residential_address              || '',
  provincial_address:               emp.provincial_address               || '',
  latitude:                         emp.latitude                         || null,
  longitude:                        emp.longitude                        || null,
  citizenship:                      emp.citizenship                      || 'Filipino',
  emergency_contact_name:           emp.emergency_contact_name           || '',
  emergency_contact_number:         (emp.emergency_contact_number        || '').replace(/^\+63/, ''),
  emergency_contact_relationship:   emp.emergency_contact_relationship   || '',
  position:                         emp.position                         || '',
  employment_type:                  emp.employment_type                  || '',
  badge_number:                     emp.badge_number                     || '',
  license_number:                   emp.license_number                   || '',
  license_expiry_date:              emp.license_expiry_date              || '',
});

export default function ViewEmployeeDetail({
  isOpen, employee: previewEmployee, onClose, onUpdated, pageMode = false,
}) {
  const [activeTab,        setActiveTab]        = useState('personal');
  const [employeeDetails,  setEmployeeDetails]  = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [fetchError,       setFetchError]       = useState(false);
  const [previewUrl,       setPreviewUrl]       = useState(null);
  const [isEditing,        setIsEditing]        = useState(false);
  const [editForm,         setEditForm]         = useState({});
  const [pendingFiles,     setPendingFiles]     = useState({});
  const [isSaving,         setIsSaving]         = useState(false);
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
  const [showDeployModal,  setShowDeployModal]  = useState(false);
  const [sitesList,        setSitesList]        = useState([]);
  const [deployForm,       setDeployForm]       = useState({
    siteId: '', contractStartDate: '', contractEndDate: '',
    daysOfWeek: [], shiftStart: '', shiftEnd: '', deploymentOrderFile: null,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    if (isOpen && previewEmployee?.id) {
      setLoading(true);
      setFetchError(false);
      employeeService.getEmployeeDetails(previewEmployee.id)
        .then(data => { setEmployeeDetails(data); setLoading(false); })
        .catch(err  => { console.error(err); setFetchError(true); setLoading(false); });
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

  const handleEdit   = () => { setEditForm(buildForm(data)); setPendingFiles({}); setIsEditing(true); };
  const handleCancel = () => { setIsEditing(false); setPendingFiles({}); };
  const handleField  = (key, value) => setEditForm(f => ({ ...f, [key]: value }));
  const handleClearanceFile = (type, file) => setPendingFiles(prev => ({ ...prev, [type]: file }));

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([k, v]) => formData.append(k, v));
      Object.entries(pendingFiles).forEach(([type, file]) => formData.append(`document_${type}`, file));
      await employeeService.updateEmployee(previewEmployee.id, formData);
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
    setDeployForm({ siteId: '', contractStartDate: '', contractEndDate: '', daysOfWeek: [], shiftStart: '', shiftEnd: '', deploymentOrderFile: null });
    try {
      const sites = await clientService.getAllSitesList();
      setSitesList(sites);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load client sites.', 'error');
    }
  };

  const handleDeploy = async () => {
    if (!deployForm.siteId)                    { showNotification('Please select a client site.', 'error'); return; }
    if (deployForm.daysOfWeek.length === 0)    { showNotification('Please select at least one schedule day.', 'error'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { showNotification('Please set both shift start and shift end time.', 'error'); return; }
    setIsDeploying(true);
    try {
      const payload = new FormData();
      payload.append('siteId', deployForm.siteId);
      if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
      if (deployForm.contractEndDate)   payload.append('contractEndDate',   deployForm.contractEndDate);
      deployForm.daysOfWeek.forEach(day => payload.append('daysOfWeek', String(day)));
      payload.append('shiftStart', deployForm.shiftStart);
      payload.append('shiftEnd',   deployForm.shiftEnd);
      if (deployForm.deploymentOrderFile) payload.append('document_deployment_order', deployForm.deploymentOrderFile);
      await employeeService.deployEmployee(data.id, payload);
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

  const toggleScheduleDay = (dayValue) => {
    setDeployForm(cur => ({
      ...cur,
      daysOfWeek: cur.daysOfWeek.includes(dayValue)
        ? cur.daysOfWeek.filter(d => d !== dayValue)
        : [...cur.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  };

  /* ── Render ── */
  const outerClass   = pageMode ? 'ep-page-wrapper'    : 've-modal-overlay';
  const contentClass = pageMode ? 'ep-detail-container' : 've-modal-content';

  return (
    <div className={outerClass} onClick={pageMode ? undefined : onClose}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className={contentClass} onClick={pageMode ? undefined : (e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ve-modal-header">
          <div>
            <h2>Employee Details</h2>
            <p>{data.employee_id_number} • {data.full_name || data.name}</p>
          </div>
          {!pageMode && (
            <button className="ve-close-btn" onClick={onClose}><FaTimes /></button>
          )}
        </div>

        {/* Tabs */}
        <div className="ve-tabs-bar">
          {TABS.map(tab => (
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
                <EmploymentTab employee={data} isEditing={isEditing} editForm={editForm} onField={handleField} />
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

          {/* Image Preview Overlay */}
          {previewUrl && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" onClick={() => setPreviewUrl(null)}>
              <button className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition-colors"><FaTimes /></button>
              <img src={previewUrl} alt="Document Preview" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" onClick={e => e.stopPropagation()} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="ve-action-buttons mt-6">
            <button
              className="ve-btn ve-btn-gold"
              onClick={() => { const url = data.document_url; if (url) window.open(url, '_blank'); else showNotification('No contract document found.', 'error'); }}
            >
              <FaFileContract /> View Contract
            </button>
            <button className="ve-btn ve-btn-green" onClick={openDeployModal} disabled={data.status === 'terminated'}>
              <FaMapMarkerAlt /> Assign Client
            </button>
            <button className="ve-btn ve-btn-red" onClick={() => setShowTerminateConfirm(true)} disabled={data.status === 'terminated'}>
              <FaUserTimes /> {data.status === 'terminated' ? 'Terminated' : 'Terminate Employee'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Terminate Confirmation Dialog ── */}
      {showTerminateConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Terminate Employee?</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to terminate <strong>{data.full_name || data.name}</strong>?
              This will mark their status as terminated and they will no longer be assignable to clients.
            </p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" onClick={() => setShowTerminateConfirm(false)} disabled={isSaving}>
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center gap-2" onClick={handleTerminate} disabled={isSaving}>
                {isSaving && <FaSpinner className="animate-spin" />}
                Yes, Terminate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Deploy / Assign Client Dialog ── */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Assign to Client Site</h3>
            <p className="text-sm text-gray-500 mb-5">Deploy <strong>{data.full_name || data.name}</strong> to a client site.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Client Site *</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" value={deployForm.siteId} onChange={e => setDeployForm(f => ({ ...f, siteId: e.target.value }))}>
                  <option value="">— Select a site —</option>
                  {sitesList.map(site => (
                    <option key={site.id} value={site.id}>{site.site_name} — {site.clients?.company || 'Unknown Client'}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={deployForm.contractStartDate} onChange={e => setDeployForm(f => ({ ...f, contractStartDate: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={deployForm.contractEndDate} onChange={e => setDeployForm(f => ({ ...f, contractEndDate: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days of Week *</label>
                <div className="grid grid-cols-4 gap-2">
                  {DAY_OPTIONS.map(day => (
                    <label key={day.value} className="flex items-center gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={deployForm.daysOfWeek.includes(day.value)} onChange={() => toggleScheduleDay(day.value)} />
                      <span>{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Start *</label>
                  <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={deployForm.shiftStart} onChange={e => setDeployForm(f => ({ ...f, shiftStart: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift End *</label>
                  <input type="time" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" value={deployForm.shiftEnd} onChange={e => setDeployForm(f => ({ ...f, shiftEnd: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deployment Order</label>
                <input type="file" accept="image/*,application/pdf" className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" onChange={e => setDeployForm(f => ({ ...f, deploymentOrderFile: e.target.files?.[0] || null }))} />
                {deployForm.deploymentOrderFile && <p className="mt-1 text-xs text-emerald-700">{deployForm.deploymentOrderFile.name}</p>}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200" onClick={() => setShowDeployModal(false)} disabled={isDeploying}>
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2" onClick={handleDeploy} disabled={isDeploying || !deployForm.siteId}>
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
