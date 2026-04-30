import { useEffect, useState } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt,
  FaFileContract, FaUserPlus,
} from 'react-icons/fa';
import clientService from '@services/clientService';
import employeeService from '@services/employeeService';
import authService from '@services/authService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import { hasPermission } from '@utils/adminPermissions';

import GeneralTab from './tabs/GeneralTab';
import SitesTab from './tabs/SitesTab';
import BillingsTab from './tabs/BillingsTab';
import TicketsTab from './tabs/TicketsTab';
import GuardDeploymentSelector from './GuardDeploymentSelector';

const TABS = [
  { key: 'general',  label: 'General Info',     icon: FaBuilding },
  { key: 'sites',    label: 'Sites',             icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings',          icon: FaFileInvoiceDollar },
  { key: 'tickets',  label: 'Service Tickets',   icon: FaTicketAlt },
];

/* Build an edit-form snapshot from the current client data */
const buildEditForm = (client) => ({
  firstName:        client.first_name        || '',
  lastName:         client.last_name         || '',
  middleName:       client.middle_name       || '',
  suffix:           client.suffix            || '',
  mobile:           (client.phone_number     || '').replace(/^\+63/, ''),
  email:            client.contact_email     || '',
  company:          client.company           || '',
  billingAddress:   client.billing_address   || '',
  ratePerGuard:     client.rate_per_guard    || '',
  billingType:      client.billing_type      || 'semi_monthly',
  contractStartDate: client.contract_start_date || '',
  contractEndDate:   client.contract_end_date   || '',
});

export default function ViewClientDetail({
  isOpen, client: previewClient, onClose, onUpdated, pageMode = false,
}) {
  const profile = authService.getProfile() || {};
  const canWriteClients = hasPermission(profile, 'clients.write');
  const canWriteEmployees = hasPermission(profile, 'employees.write');
  const [activeTab, setActiveTab] = useState('general');
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  /* Edit state */
  const [isEditing, setIsEditing]   = useState(false);
  const [editForm,  setEditForm]    = useState({});
  const [isSaving,  setIsSaving]    = useState(false);

  /* Deploy modal state */
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [loadingDeployable, setLoadingDeployable] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployFilters, setDeployFilters] = useState({ tallOnly: false, experiencedOnly: false });
  const [deployForm, setDeployForm] = useState({
    siteId: '',
    contractStartDate: '',
    contractEndDate: '',
    daysOfWeek: [],
    shiftStart: '',
    shiftEnd: '',
    baseSalary: '',
  });
  const { notification, showNotification, closeNotification } = useNotification();

  const loadClientDetails = async (clientId) => {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await clientService.getClientDetails(clientId);
      setClientDetails(data);
    } catch (err) {
      console.error(err);
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && previewClient?.id) {
      loadClientDetails(previewClient.id);
    } else {
      setClientDetails(null);
      setFetchError(false);
      setActiveTab('general');
      setIsEditing(false);
      setShowDeployModal(false);
      setDeployableEmployees([]);
      setSelectedEmployee(null);
      setDeployFilters({ tallOnly: false, experiencedOnly: false });
      setDeployForm({
        siteId: '',
        contractStartDate: '',
        contractEndDate: '',
        daysOfWeek: [],
        shiftStart: '',
        shiftEnd: '',
        baseSalary: '',
      });
    }
  }, [isOpen, previewClient]);

  const data = clientDetails || previewClient || null;
  const activeSites = (data?.sites || []).filter((site) => site.is_active);

  useEffect(() => {
    if (!showDeployModal || !deployForm.siteId) return;

    const selectedSite = (data?.sites || [])
      .filter((site) => site.is_active)
      .find((site) => site.id === deployForm.siteId);
    if (!selectedSite?.latitude || !selectedSite?.longitude) {
      setDeployableEmployees([]);
      return;
    }

    let cancelled = false;

    const loadDeployableEmployees = async () => {
      setLoadingDeployable(true);
      try {
        const employees = await employeeService.getDeployableEmployees({
          siteLatitude: selectedSite.latitude,
          siteLongitude: selectedSite.longitude,
          tallOnly: deployFilters.tallOnly,
          experiencedOnly: deployFilters.experiencedOnly,
        });
        if (!cancelled) setDeployableEmployees(employees);
      } catch (err) {
        if (!cancelled) {
          setDeployableEmployees([]);
          showNotification(err.response?.data?.error || 'Failed to load available guards.', 'error');
        }
      } finally {
        if (!cancelled) setLoadingDeployable(false);
      }
    };

    loadDeployableEmployees();
    return () => { cancelled = true; };
  }, [showDeployModal, deployForm.siteId, deployFilters.tallOnly, deployFilters.experiencedOnly, data?.sites, showNotification]);

  useEffect(() => {
    if (!selectedEmployee?.id) return;
    if (deployableEmployees.some((e) => e.id === selectedEmployee.id)) return;
    setSelectedEmployee(null);
    setDeployForm((cur) => ({ ...cur, baseSalary: '' }));
  }, [deployableEmployees, selectedEmployee]);

  if (!isOpen || !previewClient) return null;

  /* ── Edit handlers ── */
  const handleEdit   = () => { setEditForm(buildEditForm(data)); setIsEditing(true); };
  const handleCancel = () => { setIsEditing(false); };
  const handleField  = (key, value) => setEditForm((f) => ({ ...f, [key]: value }));

  /* Frontend-only save (no API call per spec) */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: wire up clientService.updateClient when backend is ready
      await new Promise((r) => setTimeout(r, 600)); // simulate save
      setIsEditing(false);
      showNotification('Client details updated successfully.', 'success');
      onUpdated?.();
    } catch (err) {
      showNotification('Failed to save changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Deploy handlers ── */
  const openDeployModal = (siteId = '') => {
    setShowDeployModal(true);
    setSelectedEmployee(null);
    setDeployFilters({ tallOnly: false, experiencedOnly: false });
    setDeployForm({
      siteId: siteId || activeSites[0]?.id || '',
      contractStartDate: data.contract_start_date || '',
      contractEndDate: data.contract_end_date || '',
      daysOfWeek: [],
      shiftStart: '',
      shiftEnd: '',
      baseSalary: '',
    });
  };

  const toggleScheduleDay = (dayValue) => {
    setDeployForm((cur) => ({
      ...cur,
      daysOfWeek: cur.daysOfWeek.includes(dayValue)
        ? cur.daysOfWeek.filter((d) => d !== dayValue)
        : [...cur.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setDeployForm((cur) => ({ ...cur, baseSalary: cur.baseSalary || employee.base_salary || '' }));
  };

  const handleDeployGuard = async () => {
    if (!deployForm.siteId)                    { showNotification('Please select an active site.', 'error'); return; }
    if (!selectedEmployee?.id)                 { showNotification('Please select a guard.', 'error'); return; }
    if (!deployForm.baseSalary)                { showNotification('Please set the guard base pay.', 'error'); return; }
    if (deployForm.daysOfWeek.length === 0)    { showNotification('Please select at least one schedule day.', 'error'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { showNotification('Please set both shift start and end time.', 'error'); return; }

    setIsDeploying(true);
    try {
      const payload = new FormData();
      payload.append('siteId', deployForm.siteId);
      payload.append('baseSalary', deployForm.baseSalary);
      if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
      if (deployForm.contractEndDate)   payload.append('contractEndDate',   deployForm.contractEndDate);
      deployForm.daysOfWeek.forEach((day) => payload.append('daysOfWeek', String(day)));
      payload.append('shiftStart', deployForm.shiftStart);
      payload.append('shiftEnd',   deployForm.shiftEnd);
      await employeeService.deployEmployee(selectedEmployee.id, payload);
      await loadClientDetails(previewClient.id);
      onUpdated?.();
      showNotification('Guard deployed successfully.', 'success');
      setShowDeployModal(false);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to deploy selected guard.', 'error');
    } finally {
      setIsDeploying(false);
    }
  };

  const outerClass   = pageMode ? 'ep-page-wrapper'    : 'vc-modal-overlay';
  const contentClass = pageMode ? 'ep-detail-container' : 'vc-modal-content';

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
        {/* ── Header (title only, no action buttons) ── */}
        <div className="vc-modal-header">
          <div>
            <h2>Client Details</h2>
            <p>{data.company || 'Client'}</p>
          </div>
          {!pageMode && (
            <button className="vc-close-btn" onClick={onClose}><FaTimes /></button>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div className="vc-tabs-bar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`vc-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon />{tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="vc-modal-body">
          {loading && (
            <div className="detail-skeleton">
              <div className="dsk-profile-card">
                <div className="dsk-avatar" style={{ borderRadius: '14px' }} />
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
                {[1,2].map(i => <div key={i} className="dsk-btn" />)}
              </div>
            </div>
          )}

          {!loading && (
            <>
              {fetchError && (
                <div style={{ background:'#fef3c7', border:'1px solid #fde68a', color:'#92400e', borderRadius:'8px', padding:'0.65rem 1rem', fontSize:'0.8rem', fontWeight:600, marginBottom:'1rem' }}>
                  Could not load full client details. Showing limited information.
                </div>
              )}
              {activeTab === 'general' && (
                <GeneralTab
                  client={data}
                  canEdit={canWriteClients && !fetchError && !!clientDetails}
                  isEditing={isEditing}
                  editForm={editForm}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onField={handleField}
                  isSaving={isSaving}
                />
              )}
              {activeTab === 'sites'    && <SitesTab    client={data} onDeployGuard={canWriteEmployees ? openDeployModal : undefined} />}
              {activeTab === 'billings' && <BillingsTab  client={data} />}
              {activeTab === 'tickets'  && <TicketsTab   client={data} />}
            </>
          )}

          {/* ── Action Buttons (mirrors Employee pattern) ── */}
          <div className="ve-action-buttons mt-6">
            <button
              className="ve-btn ve-btn-gold"
              onClick={() => { const url = data.contract_url; if (url) window.open(url, '_blank'); else showNotification('No contract document found.', 'error'); }}
            >
              <FaFileContract /> View Contract
            </button>
            {activeSites.length > 0 && (
              <button className="ve-btn ve-btn-green" onClick={() => openDeployModal()} disabled={!canWriteEmployees}>
                <FaUserPlus /> Deploy Guard
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Deploy Guard modal ── */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDeployModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Deploy Guard</h3>
                <p className="text-sm text-slate-600">Select an active site, then pick the best-fit guard for it.</p>
              </div>
              <button className="vc-close-btn" onClick={() => setShowDeployModal(false)}><FaTimes /></button>
            </div>

            <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-148px)]">
              <GuardDeploymentSelector
                siteOptions={activeSites.map((site) => ({ value: site.id, label: site.site_name }))}
                siteValue={deployForm.siteId}
                onSiteChange={(value) => {
                  setSelectedEmployee(null);
                  setDeployForm((cur) => ({
                    ...cur,
                    siteId: value,
                    contractStartDate: data.contract_start_date || '',
                    contractEndDate: data.contract_end_date || '',
                    daysOfWeek: [],
                    shiftStart: '',
                    shiftEnd: '',
                    baseSalary: '',
                  }));
                }}
                employees={deployableEmployees}
                loadingEmployees={loadingDeployable}
                filters={deployFilters}
                onFilterChange={(field, value) => setDeployFilters((cur) => ({ ...cur, [field]: value }))}
                selectedEmployeeId={selectedEmployee?.id || ''}
                onSelectEmployee={handleEmployeeSelect}
                deploymentForm={deployForm}
                onFieldChange={(field, value) => setDeployForm((cur) => ({ ...cur, [field]: value }))}
                toggleScheduleDay={toggleScheduleDay}
                emptyMessage="No deployable guards match the selected site and filters."
              />
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-slate-50">
              <button type="button" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold" onClick={() => setShowDeployModal(false)} disabled={isDeploying}>
                Cancel
              </button>
              <button type="button" className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-60" onClick={handleDeployGuard} disabled={isDeploying || loadingDeployable || deployableEmployees.length === 0}>
                {isDeploying ? 'Deploying...' : 'Deploy Guard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
