import { useState, useEffect } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaShieldAlt, FaMoneyCheckAlt,
  FaFileContract, FaUserTimes, FaMapMarkerAlt, FaUserMinus,
} from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import employeeService from '@services/employeeService';
import clientService from '@services/clientService';
import authService from '@services/authService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import { hasPermission } from '@utils/adminPermissions';

// Tab fragments
import PersonalTab    from './tabs/PersonalTab';
import EmploymentTab  from './tabs/EmploymentTab';
import ComplianceTab  from './tabs/ComplianceTab';
import PayrollTab     from './tabs/PayrollTab';

// Dialogs
import TerminateEmployeeDialog from './TerminateEmployeeDialog';
import DeployEmployeeDialog    from './DeployEmployeeDialog';
import RelieveEmployeeDialog   from './RelieveEmployeeDialog';

const TABS = [
  { key: 'personal',   label: 'Personal Info', icon: FaUser },
  { key: 'employment', label: 'Employment',     icon: FaBriefcase },
  { key: 'compliance', label: 'Compliance',     icon: FaShieldAlt },
  { key: 'payroll',    label: 'Payroll',        icon: FaMoneyCheckAlt },
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
  const profile = authService.getProfile() || {};
  const canWriteEmployees = hasPermission(profile, 'employees.write');
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
  const [showRelieveConfirm, setShowRelieveConfirm] = useState(false);
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
  const hasActiveDeployment = Array.isArray(data.deployments) && data.deployments.some((deployment) => deployment.status === 'active');

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

  const handleRelieve = async () => {
    try {
      setIsSaving(true);
      await employeeService.relieveEmployeeAssignment(previewEmployee.id);
      const refreshed = await employeeService.getEmployeeDetails(previewEmployee.id);
      setEmployeeDetails(refreshed);
      setShowRelieveConfirm(false);
      onUpdated?.();
      showNotification('Employee relieved from current assignment.', 'success');
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to relieve employee from current assignment.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeployModal = async () => {
    setShowDeployModal(true);
    setDeployForm({ siteId: '', contractStartDate: '', contractEndDate: '', daysOfWeek: [], shiftStart: '', shiftEnd: '', deploymentOrderFile: null });
    try {
      const sites = await clientService.getAllSitesList({
        latitude: data.latitude,
        longitude: data.longitude,
      });
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
      if (hasActiveDeployment) {
        await employeeService.transferEmployeeAssignment(data.id, payload);
      } else {
        await employeeService.deployEmployee(data.id, payload);
      }
      const refreshed = await employeeService.getEmployeeDetails(previewEmployee.id);
      setEmployeeDetails(refreshed);
      showNotification(hasActiveDeployment ? 'Employee transferred successfully!' : 'Employee deployed successfully!', 'success');
      setShowDeployModal(false);
      onUpdated?.();
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || (hasActiveDeployment ? 'Failed to transfer employee.' : 'Failed to deploy employee.'), 'error');
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
        <div className="ve-modal-body">
          {loading && (
            <div className="detail-skeleton">
              <div className="dsk-profile-card">
                <div className="dsk-avatar" />
                <div className="dsk-profile-lines">
                  <div className="dsk-line xl" />
                  <div className="dsk-line md" />
                  <div className="dsk-line sm" />
                </div>
              </div>
              <div className="dsk-grid cols-2">
                {[1,2,3,4,5,6].map(i => <div key={i} className="dsk-info-cell"><div className="dsk-line sm" /><div className="dsk-line lg" /></div>)}
              </div>
              <div className="dsk-grid cols-2" style={{ marginTop: '1rem' }}>
                {[1,2,3,4].map(i => <div key={i} className="dsk-info-cell"><div className="dsk-line sm" /><div className="dsk-line lg" /></div>)}
              </div>
              <div className="dsk-actions">
                {[1,2,3].map(i => <div key={i} className="dsk-btn" />)}
              </div>
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
                  canEdit={canWriteEmployees && !fetchError && !!employeeDetails}
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
            <button className="ve-btn ve-btn-green" onClick={openDeployModal} disabled={!canWriteEmployees || data.status === 'terminated'}>
              <FaMapMarkerAlt /> {hasActiveDeployment ? 'Transfer Assignment' : 'Assign Client'}
            </button>
            {hasActiveDeployment && (
              <button className="ve-btn ve-btn-blue" onClick={() => setShowRelieveConfirm(true)} disabled={!canWriteEmployees || data.status === 'terminated'}>
                <FaUserMinus /> Relieve From Post
              </button>
            )}
            <button className="ve-btn ve-btn-red" onClick={() => setShowTerminateConfirm(true)} disabled={!canWriteEmployees || data.status === 'terminated'}>
              <FaUserTimes /> {data.status === 'terminated' ? 'Terminated' : 'Terminate Employee'}
            </button>
          </div>
        </div>
      </div>

      <TerminateEmployeeDialog
        isOpen={showTerminateConfirm}
        employeeName={data.full_name || data.name}
        isSaving={isSaving}
        onCancel={() => setShowTerminateConfirm(false)}
        onConfirm={handleTerminate}
      />

      <RelieveEmployeeDialog
        isOpen={showRelieveConfirm}
        employeeName={data.full_name || data.name}
        isSaving={isSaving}
        onCancel={() => setShowRelieveConfirm(false)}
        onConfirm={handleRelieve}
      />

      <DeployEmployeeDialog
        isOpen={showDeployModal}
        employeeName={data.full_name || data.name}
        sitesList={sitesList}
        deployForm={deployForm}
        setDeployForm={setDeployForm}
        isDeploying={isDeploying}
        onCancel={() => setShowDeployModal(false)}
        onDeploy={handleDeploy}
        toggleScheduleDay={toggleScheduleDay}
      />
    </div>
  );
}
