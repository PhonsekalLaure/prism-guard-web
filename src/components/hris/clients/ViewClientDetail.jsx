import { useEffect, useState } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt,
  FaFileContract, FaUserPlus, FaUserMinus,
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
import DeactivateClientDialog from './DeactivateClientDialog';
import RelieveAllClientGuardsDialog from './RelieveAllClientGuardsDialog';
import ClientSiteEditorDialog from './ClientSiteEditorDialog';
import RenewClientContractDialog from './RenewClientContractDialog';
import DeactivateClientSiteDialog from './DeactivateClientSiteDialog';

const TABS = [
  { key: 'general', label: 'General Info', icon: FaBuilding },
  { key: 'sites', label: 'Sites', icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings', icon: FaFileInvoiceDollar },
  { key: 'tickets', label: 'Service Tickets', icon: FaTicketAlt },
];

const buildEditForm = (client) => ({
  firstName: client.first_name || '',
  lastName: client.last_name || '',
  middleName: client.middle_name || '',
  suffix: client.suffix || '',
  mobile: (client.phone_number || '').replace(/^\+63/, ''),
  email: client.contact_email || '',
  company: client.company || '',
  billingAddress: client.billing_address || '',
});

const EMPTY_SITE_FORM = {
  siteName: '',
  siteAddress: '',
  latitude: '',
  longitude: '',
  geofenceRadius: 50,
};

function buildSiteForm(site = null) {
  if (!site) return { ...EMPTY_SITE_FORM };

  return {
    siteName: site.site_name || '',
    siteAddress: site.site_address || '',
    latitude: site.latitude ?? '',
    longitude: site.longitude ?? '',
    geofenceRadius: site.geofence_radius_meters ?? 50,
  };
}

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
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [pendingFiles, setPendingFiles] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showRelieveAllConfirm, setShowRelieveAllConfirm] = useState(false);
  const [showRenewContractDialog, setShowRenewContractDialog] = useState(false);
  const [showSiteDialog, setShowSiteDialog] = useState(false);
  const [sitePendingDeactivation, setSitePendingDeactivation] = useState(null);
  const [siteDialogMode, setSiteDialogMode] = useState('create');
  const [editingSite, setEditingSite] = useState(null);
  const [siteForm, setSiteForm] = useState(EMPTY_SITE_FORM);
  const [contractForm, setContractForm] = useState({
    contractStartDate: '',
    contractEndDate: '',
    ratePerGuard: '',
    billingType: 'semi_monthly',
    contractFile: null,
  });
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
    deploymentOrderFile: null,
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
      setPendingFiles({});
      setShowDeactivateConfirm(false);
      setShowRelieveAllConfirm(false);
      setShowRenewContractDialog(false);
      setShowSiteDialog(false);
      setSitePendingDeactivation(null);
      setEditingSite(null);
      setSiteForm(EMPTY_SITE_FORM);
      setContractForm({
        contractStartDate: '',
        contractEndDate: '',
        ratePerGuard: '',
        billingType: 'semi_monthly',
        contractFile: null,
      });
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
        deploymentOrderFile: null,
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

  const handleEdit = () => {
    setEditForm(buildEditForm(data));
    setPendingFiles({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPendingFiles({});
  };

  const handleField = (key, value) => setEditForm((cur) => ({ ...cur, [key]: value }));
  const handleFile = (key, file) => setPendingFiles((prev) => ({ ...prev, [key]: file }));
  const handleSiteField = (key, value) => setSiteForm((cur) => ({ ...cur, [key]: value }));
  const handleContractField = (key, value) => setContractForm((cur) => ({ ...cur, [key]: value }));

  const openRenewContractDialog = () => {
    const baseStartDate = data.contract_end_date
      ? (() => {
        const nextDay = new Date(data.contract_end_date);
        nextDay.setDate(nextDay.getDate() + 1);
        return nextDay.toISOString().split('T')[0];
      })()
      : new Date().toISOString().split('T')[0];

    setContractForm({
      contractStartDate: baseStartDate,
      contractEndDate: '',
      ratePerGuard: data.rate_per_guard || '',
      billingType: data.billing_type || 'semi_monthly',
      contractFile: null,
    });
    setShowRenewContractDialog(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        formData.append(key, value ?? '');
      });
      Object.entries(pendingFiles).forEach(([key, file]) => {
        if (file) formData.append(key, file);
      });

      await clientService.updateClient(previewClient.id, formData);
      await loadClientDetails(previewClient.id);
      setIsEditing(false);
      setPendingFiles({});
      showNotification('Client details updated successfully.', 'success');
      onUpdated?.();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to save changes.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateSiteDialog = () => {
    setSiteDialogMode('create');
    setEditingSite(null);
    setSiteForm({ ...EMPTY_SITE_FORM });
    setShowSiteDialog(true);
  };

  const openEditSiteDialog = (site) => {
    setSiteDialogMode('edit');
    setEditingSite(site);
    setSiteForm(buildSiteForm(site));
    setShowSiteDialog(true);
  };

  const handleSaveSite = async () => {
    setIsSaving(true);
    try {
      const payload = {
        siteName: siteForm.siteName,
        siteAddress: siteForm.siteAddress,
        latitude: siteForm.latitude,
        longitude: siteForm.longitude,
        geofenceRadius: siteForm.geofenceRadius,
      };

      if (siteDialogMode === 'edit' && editingSite?.id) {
        await clientService.updateClientSite(previewClient.id, editingSite.id, payload);
        showNotification('Client site updated successfully.', 'success');
      } else {
        await clientService.createClientSite(previewClient.id, payload);
        showNotification('Client site created successfully.', 'success');
      }

      setShowSiteDialog(false);
      setEditingSite(null);
      await loadClientDetails(previewClient.id);
      onUpdated?.();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to save client site.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeactivateSiteDialog = (site) => {
    if (!site?.is_active) return;
    if ((site.active_guard_count || 0) > 0) {
      showNotification('Relieve or transfer all active guards before deactivating this site.', 'error');
      return;
    }
    setSitePendingDeactivation(site);
  };

  const handleDeactivateSite = async () => {
    if (!sitePendingDeactivation?.id) return;

    setIsSaving(true);
    try {
      await clientService.deactivateClientSite(previewClient.id, sitePendingDeactivation.id);
      await loadClientDetails(previewClient.id);
      onUpdated?.();
      showNotification(`Site "${sitePendingDeactivation.site_name}" deactivated successfully.`, 'success');
      setSitePendingDeactivation(null);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to deactivate site.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRenewContract = async () => {
    if (!contractForm.contractStartDate || !contractForm.contractEndDate) {
      showNotification('Please set both renewal contract dates.', 'error');
      return;
    }
    if (new Date(contractForm.contractEndDate) <= new Date(contractForm.contractStartDate)) {
      showNotification('Renewal contract end date must be after renewal contract start date.', 'error');
      return;
    }
    if (!contractForm.contractFile) {
      showNotification('Please upload the renewed client contract document.', 'error');
      return;
    }
    if (!contractForm.ratePerGuard || Number(contractForm.ratePerGuard) <= 0) {
      showNotification('Please set the contract rate per guard.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = new FormData();
      payload.append('contractStartDate', contractForm.contractStartDate);
      payload.append('contractEndDate', contractForm.contractEndDate);
      payload.append('ratePerGuard', contractForm.ratePerGuard);
      payload.append('billingType', contractForm.billingType);
      payload.append('contractUrl', contractForm.contractFile);
      await clientService.updateClient(previewClient.id, payload);
      await loadClientDetails(previewClient.id);
      setShowRenewContractDialog(false);
      setContractForm({
        contractStartDate: '',
        contractEndDate: '',
        ratePerGuard: '',
        billingType: 'semi_monthly',
        contractFile: null,
      });
      onUpdated?.();
      showNotification('Client contract renewed successfully.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to renew client contract.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    setIsSaving(true);
    try {
      await clientService.deactivateClient(previewClient.id);
      showNotification('Client deactivated successfully.', 'success');
      setShowDeactivateConfirm(false);
      onUpdated?.();
      onClose();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to deactivate client.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRelieveAllGuards = async () => {
    setIsSaving(true);
    try {
      const response = await clientService.relieveAllClientGuards(previewClient.id);
      await loadClientDetails(previewClient.id);
      onUpdated?.();
      setShowRelieveAllConfirm(false);
      showNotification(
        `Relieved ${response?.data?.relieved_guard_count || data.guard_count || 0} guard(s) from this client.`,
        'success'
      );
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to relieve client guards.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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
      deploymentOrderFile: null,
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
    if (!deployForm.siteId) { showNotification('Please select an active site.', 'error'); return; }
    if (!selectedEmployee?.id) { showNotification('Please select a guard.', 'error'); return; }
    if (!deployForm.baseSalary) { showNotification('Please set the guard base pay.', 'error'); return; }
    if (deployForm.daysOfWeek.length === 0) { showNotification('Please select at least one schedule day.', 'error'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { showNotification('Please set both shift start and end time.', 'error'); return; }
    if (!deployForm.deploymentOrderFile) { showNotification('Please upload the deployment order document.', 'error'); return; }

    setIsDeploying(true);
    try {
      const payload = new FormData();
      payload.append('siteId', deployForm.siteId);
      payload.append('baseSalary', deployForm.baseSalary);
      if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
      if (deployForm.contractEndDate) payload.append('contractEndDate', deployForm.contractEndDate);
      deployForm.daysOfWeek.forEach((day) => payload.append('daysOfWeek', String(day)));
      payload.append('shiftStart', deployForm.shiftStart);
      payload.append('shiftEnd', deployForm.shiftEnd);
      payload.append('document_deployment_order', deployForm.deploymentOrderFile);
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

  const outerClass = pageMode ? 'ep-page-wrapper' : 'vc-modal-overlay';
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
        <div className="vc-modal-header">
          <div>
            <h2>Client Details</h2>
            <p>{data.company || 'Client'}</p>
          </div>
          {!pageMode && (
            <button className="vc-close-btn" onClick={onClose}><FaTimes /></button>
          )}
        </div>

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
                {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="dsk-info-cell"><div className="dsk-line sm" /><div className="dsk-line lg" /></div>)}
              </div>
              <div className="dsk-grid cols-2" style={{ marginTop: '1rem' }}>
                {[1, 2, 3, 4].map((i) => <div key={i} className="dsk-info-cell"><div className="dsk-line sm" /><div className="dsk-line lg" /></div>)}
              </div>
              <div className="dsk-actions">
                {[1, 2].map((i) => <div key={i} className="dsk-btn" />)}
              </div>
            </div>
          )}

          {!loading && (
            <>
              {fetchError && (
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' }}>
                  Could not load full client details. Showing limited information.
                </div>
              )}
              {data.contract_needs_renewal && (
                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem' }}>
                  {data.admin_action_message || 'Service contract needs admin review.'}
                </div>
              )}

              {activeTab === 'general' && (
                <GeneralTab
                  client={data}
                  canEdit={canWriteClients && !fetchError && !!clientDetails}
                  isEditing={isEditing}
                  editForm={editForm}
                  pendingFiles={pendingFiles}
                  onEdit={handleEdit}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onField={handleField}
                  onFile={handleFile}
                  isSaving={isSaving}
                />
              )}

              {activeTab === 'sites' && (
                <SitesTab
                  client={data}
                  onDeployGuard={canWriteEmployees && data.status === 'active' ? openDeployModal : undefined}
                  canManageSites={canWriteClients && data.status === 'active'}
                  onAddSite={openCreateSiteDialog}
                  onEditSite={openEditSiteDialog}
                  onDeactivateSite={openDeactivateSiteDialog}
                />
              )}

              {activeTab === 'billings' && <BillingsTab client={data} />}
              {activeTab === 'tickets' && <TicketsTab client={data} />}
            </>
          )}

          <div className="ve-action-buttons mt-6">
            <button
              className="ve-btn ve-btn-gold"
              onClick={async () => {
                const url = data.contract_url;
                if (!url) {
                  showNotification('No contract document found.', 'error');
                  return;
                }

                try {
                  await authService.openFileUrl(url);
                } catch (err) {
                  console.error(err);
                  showNotification('Failed to open contract document.', 'error');
                }
              }}
            >
              <FaFileContract /> View Contract
            </button>

            <button className="ve-btn ve-btn-blue" onClick={openRenewContractDialog} disabled={!canWriteClients || data.status !== 'active'}>
              <FaFileContract /> Renew Contract
            </button>

            {activeSites.length > 0 && (
              <button className="ve-btn ve-btn-green" onClick={() => openDeployModal()} disabled={!canWriteEmployees || data.status !== 'active'}>
                <FaUserPlus /> Deploy Guard
              </button>
            )}

            {data.guard_count > 0 && (
              <button className="ve-btn ve-btn-blue" onClick={() => setShowRelieveAllConfirm(true)} disabled={!canWriteEmployees || data.status !== 'active'}>
                <FaUserMinus /> Relieve All Guards
              </button>
            )}

            <button className="ve-btn ve-btn-red" onClick={() => setShowDeactivateConfirm(true)} disabled={!canWriteClients || data.status !== 'active'}>
              <FaUserMinus /> {data.status === 'inactive' ? 'Inactive' : 'Deactivate Client'}
            </button>
          </div>
        </div>
      </div>

      {showDeployModal && (
        <div className="dlg-overlay" onClick={() => setShowDeployModal(false)}>
          <div className="dlg-card dlg-card-wide" onClick={(e) => e.stopPropagation()}>
            <div className="dep-header">
              <div className="dep-header-icon">
                <FaUserPlus />
              </div>
              <div className="dep-header-text">
                <h3>Deploy Guard</h3>
                <p>Select an active site, then pick the <strong>best-fit guard</strong>.</p>
              </div>
              <button className="dep-close-btn" onClick={() => setShowDeployModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="dep-body">
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
                    deploymentOrderFile: null,
                  }));
                }}
                employees={deployableEmployees}
                loadingEmployees={loadingDeployable}
                filters={deployFilters}
                onFilterChange={(field, value) => setDeployFilters((cur) => ({ ...cur, [field]: value }))}
                selectedEmployeeIds={selectedEmployee?.id ? [selectedEmployee.id] : []}
                onToggleEmployee={handleEmployeeSelect}
                deploymentForm={deployForm}
                onFieldChange={(field, value) => setDeployForm((cur) => ({ ...cur, [field]: value }))}
                toggleScheduleDay={toggleScheduleDay}
                emptyMessage="No deployable guards match the selected site and filters."
              />
            </div>

            <div className="dlg-footer">
              <button type="button" className="dlg-btn dlg-btn-ghost" onClick={() => setShowDeployModal(false)} disabled={isDeploying}>
                Cancel
              </button>
              <button
                type="button"
                className="dlg-btn dlg-btn-deploy"
                onClick={handleDeployGuard}
                disabled={isDeploying || loadingDeployable || deployableEmployees.length === 0}
              >
                {isDeploying ? 'Deploying...' : 'Deploy Guard'}
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientSiteEditorDialog
        isOpen={showSiteDialog}
        mode={siteDialogMode}
        form={siteForm}
        isSaving={isSaving}
        onFieldChange={handleSiteField}
        onCancel={() => {
          if (isSaving) return;
          setShowSiteDialog(false);
          setEditingSite(null);
        }}
        onSave={handleSaveSite}
      />

      <RenewClientContractDialog
        isOpen={showRenewContractDialog}
        clientName={data.company || 'Client'}
        form={contractForm}
        isSaving={isSaving}
        onFieldChange={handleContractField}
        onFileChange={(file) => setContractForm((cur) => ({ ...cur, contractFile: file }))}
        onCancel={() => {
          if (isSaving) return;
          setShowRenewContractDialog(false);
        }}
        onSave={handleRenewContract}
      />

      <DeactivateClientSiteDialog
        isOpen={!!sitePendingDeactivation}
        siteName={sitePendingDeactivation?.site_name || 'Site'}
        clientName={data.company || 'Client'}
        isSaving={isSaving}
        onCancel={() => {
          if (isSaving) return;
          setSitePendingDeactivation(null);
        }}
        onConfirm={handleDeactivateSite}
      />

      <DeactivateClientDialog
        isOpen={showDeactivateConfirm}
        clientName={data.company || 'Client'}
        isSaving={isSaving}
        onCancel={() => setShowDeactivateConfirm(false)}
        onConfirm={handleDeactivate}
      />

      <RelieveAllClientGuardsDialog
        isOpen={showRelieveAllConfirm}
        clientName={data.company || 'Client'}
        guardCount={data.guard_count || 0}
        isSaving={isSaving}
        onCancel={() => setShowRelieveAllConfirm(false)}
        onConfirm={handleRelieveAllGuards}
      />
    </div>
  );
}
