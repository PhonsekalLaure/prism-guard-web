import { useEffect, useState } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt, FaFileContract
} from 'react-icons/fa';
import clientService from '@services/clientService';
import employeeService from '@services/employeeService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

import GeneralTab from './tabs/GeneralTab';
import SitesTab from './tabs/SitesTab';
import BillingsTab from './tabs/BillingsTab';
import TicketsTab from './tabs/TicketsTab';
import GuardDeploymentSelector from './GuardDeploymentSelector';

const TABS = [
  { key: 'general', label: 'General Info', icon: FaBuilding },
  { key: 'sites', label: 'Sites', icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings', icon: FaFileInvoiceDollar },
  { key: 'tickets', label: 'Service Tickets', icon: FaTicketAlt },
];

export default function ViewClientDetail({
  isOpen, client: previewClient, onClose, onUpdated, pageMode = false,
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
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
    if (!showDeployModal || !deployForm.siteId) {
      return;
    }

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
        if (!cancelled) {
          setDeployableEmployees(employees);
        }
      } catch (err) {
        if (!cancelled) {
          setDeployableEmployees([]);
          showNotification(err.response?.data?.error || 'Failed to load available guards.', 'error');
        }
      } finally {
        if (!cancelled) {
          setLoadingDeployable(false);
        }
      }
    };

    loadDeployableEmployees();

    return () => {
      cancelled = true;
    };
  }, [showDeployModal, deployForm.siteId, deployFilters.tallOnly, deployFilters.experiencedOnly, data?.sites, showNotification]);

  useEffect(() => {
    if (!selectedEmployee?.id) return;
    if (deployableEmployees.some((employee) => employee.id === selectedEmployee.id)) return;

    setSelectedEmployee(null);
    setDeployForm((cur) => ({ ...cur, baseSalary: '' }));
  }, [deployableEmployees, selectedEmployee]);

  if (!isOpen || !previewClient) return null;

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
        ? cur.daysOfWeek.filter((day) => day !== dayValue)
        : [...cur.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setDeployForm((cur) => ({
      ...cur,
      baseSalary: cur.baseSalary || employee.base_salary || '',
    }));
  };

  const handleDeployGuard = async () => {
    if (!deployForm.siteId) { showNotification('Please select an active site.', 'error'); return; }
    if (!selectedEmployee?.id) { showNotification('Please select a guard.', 'error'); return; }
    if (!deployForm.baseSalary) { showNotification('Please set the guard base pay.', 'error'); return; }
    if (deployForm.daysOfWeek.length === 0) { showNotification('Please select at least one schedule day.', 'error'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { showNotification('Please set both shift start and end time.', 'error'); return; }

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
          <div className="flex items-center gap-3 mr-8">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors"
              onClick={() => { const url = data.contract_url; if (url) window.open(url, '_blank'); else showNotification('No contract document found.', 'error'); }}
            >
              <FaFileContract /> View Contract
            </button>
            {activeSites.length > 0 && (
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => openDeployModal()}
              >
                Deploy Guard
              </button>
            )}
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

        <div className="vc-modal-body relative min-h-[400px]">
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
                  Could not load full client details. Showing limited information.
                </div>
              )}
              {activeTab === 'general' && <GeneralTab client={data} />}
              {activeTab === 'sites' && <SitesTab client={data} onDeployGuard={openDeployModal} />}
              {activeTab === 'billings' && <BillingsTab client={data} />}
              {activeTab === 'tickets' && <TicketsTab client={data} />}
            </>
          )}
        </div>
      </div>

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
