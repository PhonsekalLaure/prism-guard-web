import { useEffect, useState } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt,
} from 'react-icons/fa';
import clientService from '@services/clientService';
import employeeService from '@services/employeeService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

// Tab fragments
import GeneralTab  from './tabs/GeneralTab';
import SitesTab    from './tabs/SitesTab';
import BillingsTab from './tabs/BillingsTab';
import TicketsTab  from './tabs/TicketsTab';

const TABS = [
  { key: 'general',  label: 'General Info',   icon: FaBuilding },
  { key: 'sites',    label: 'Sites',           icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings',        icon: FaFileInvoiceDollar },
  { key: 'tickets',  label: 'Service Tickets', icon: FaTicketAlt },
];

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' }, { value: 1, label: 'Mon' }, { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' }, { value: 4, label: 'Thu' }, { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export default function ViewClientDetail({
  isOpen, client: previewClient, onClose, onUpdated, pageMode = false,
}) {
  const [activeTab,               setActiveTab]               = useState('general');
  const [clientDetails,           setClientDetails]           = useState(null);
  const [loading,                 setLoading]                 = useState(false);
  const [fetchError,              setFetchError]              = useState(false);
  const [showDeployModal,         setShowDeployModal]         = useState(false);
  const [deployableEmployees,     setDeployableEmployees]     = useState([]);
  const [loadingDeployable,       setLoadingDeployable]       = useState(false);
  const [selectedEmployeeIds,     setSelectedEmployeeIds]     = useState([]);
  const [isDeploying,             setIsDeploying]             = useState(false);
  const [deployForm,              setDeployForm]              = useState({
    siteId: '', contractStartDate: '', contractEndDate: '', daysOfWeek: [], shiftStart: '', shiftEnd: '',
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
      setSelectedEmployeeIds([]);
      setDeployForm({ siteId: '', contractStartDate: '', contractEndDate: '', daysOfWeek: [], shiftStart: '', shiftEnd: '' });
    }
  }, [isOpen, previewClient]);

  if (!isOpen || !previewClient) return null;

  const data        = clientDetails || previewClient;
  const activeSites = (data.sites || []).filter((s) => s.is_active);

  /* ── Deploy helpers ── */
  const openDeployModal = async (siteId = '') => {
    setShowDeployModal(true);
    setSelectedEmployeeIds([]);
    setDeployForm({
      siteId: siteId || activeSites[0]?.id || '',
      contractStartDate: '', contractEndDate: '',
      daysOfWeek: [], shiftStart: '', shiftEnd: '',
    });
    setLoadingDeployable(true);
    try {
      const employees = await employeeService.getDeployableEmployees();
      setDeployableEmployees(employees);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load available guards.', 'error');
    } finally {
      setLoadingDeployable(false);
    }
  };

  const toggleScheduleDay = (dayValue) => {
    setDeployForm((cur) => ({
      ...cur,
      daysOfWeek: cur.daysOfWeek.includes(dayValue)
        ? cur.daysOfWeek.filter((d) => d !== dayValue)
        : [...cur.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  };

  const handleEmployeeToggle = (id) => {
    setSelectedEmployeeIds((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  const handleDeployGuards = async () => {
    if (!deployForm.siteId)                    { showNotification('Please select an active site.', 'error'); return; }
    if (selectedEmployeeIds.length === 0)       { showNotification('Please select at least one guard.', 'error'); return; }
    if (deployForm.daysOfWeek.length === 0)    { showNotification('Please select at least one schedule day.', 'error'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { showNotification('Please set both shift start and end time.', 'error'); return; }

    setIsDeploying(true);
    const succeeded = [];
    const failed    = [];

    for (const employeeId of selectedEmployeeIds) {
      try {
        const payload = new FormData();
        payload.append('siteId', deployForm.siteId);
        if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
        if (deployForm.contractEndDate)   payload.append('contractEndDate',   deployForm.contractEndDate);
        deployForm.daysOfWeek.forEach((d) => payload.append('daysOfWeek', String(d)));
        payload.append('shiftStart', deployForm.shiftStart);
        payload.append('shiftEnd',   deployForm.shiftEnd);
        await employeeService.deployEmployee(employeeId, payload);
        succeeded.push(employeeId);
      } catch (err) {
        failed.push(err.response?.data?.error || err.message || `Failed to deploy employee ${employeeId}.`);
      }
    }

    try {
      await loadClientDetails(previewClient.id);
      onUpdated?.();
    } finally {
      setIsDeploying(false);
    }

    if (succeeded.length > 0 && failed.length === 0) {
      showNotification(`${succeeded.length} guard${succeeded.length > 1 ? 's were' : ' was'} deployed successfully.`, 'success');
      setShowDeployModal(false);
    } else if (succeeded.length > 0) {
      showNotification(`${succeeded.length} deployed, ${failed.length} failed. ${failed[0]}`, 'error');
      setShowDeployModal(false);
    } else {
      showNotification(failed[0] || 'Failed to deploy selected guards.', 'error');
    }
  };

  /* ── Layout ── */
  const outerClass   = pageMode ? 'ep-page-wrapper'     : 'vc-modal-overlay';
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

        {/* Header */}
        <div className="vc-modal-header">
          <div>
            <h2>Client Details</h2>
            <p>{data.company || 'Client'}</p>
          </div>
          {!pageMode && (
            <button className="vc-close-btn" onClick={onClose}><FaTimes /></button>
          )}
        </div>

        {/* Tabs */}
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

        {/* Body */}
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
                  ⚠️ Could not load full client details. Showing limited information.
                </div>
              )}
              {activeTab === 'general'  && <GeneralTab  client={data} />}
              {activeTab === 'sites'    && <SitesTab    client={data} onDeployGuard={openDeployModal} />}
              {activeTab === 'billings' && <BillingsTab client={data} />}
              {activeTab === 'tickets'  && <TicketsTab  client={data} />}
            </>
          )}
        </div>
      </div>

      {/* ── Deploy Guards Dialog ── */}
      {showDeployModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDeployModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Deploy Guards</h3>
                <p className="text-sm text-slate-600">Select an active site and assign one or more available guards.</p>
              </div>
              <button className="vc-close-btn" onClick={() => setShowDeployModal(false)}><FaTimes /></button>
            </div>

            <div className="px-6 py-5 overflow-y-auto max-h-[calc(85vh-148px)]">
              <div className="grid md:grid-cols-3 gap-4 mb-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Site</span>
                  <select className="border border-slate-300 rounded-lg px-3 py-2" value={deployForm.siteId} onChange={(e) => setDeployForm((f) => ({ ...f, siteId: e.target.value }))}>
                    <option value="">Select site</option>
                    {activeSites.map((site) => (
                      <option key={site.id} value={site.id}>{site.site_name}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Contract Start</span>
                  <input type="date" className="border border-slate-300 rounded-lg px-3 py-2" value={deployForm.contractStartDate} onChange={(e) => setDeployForm((f) => ({ ...f, contractStartDate: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Contract End</span>
                  <input type="date" className="border border-slate-300 rounded-lg px-3 py-2" value={deployForm.contractEndDate} onChange={(e) => setDeployForm((f) => ({ ...f, contractEndDate: e.target.value }))} />
                </label>
              </div>

              <div className="mb-5">
                <span className="text-sm font-semibold text-slate-700 block mb-2">Days of Week</span>
                <div className="grid grid-cols-4 gap-2">
                  {DAY_OPTIONS.map((day) => (
                    <label key={day.value} className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" checked={deployForm.daysOfWeek.includes(day.value)} onChange={() => toggleScheduleDay(day.value)} />
                      <span>{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Shift Start</span>
                  <input type="time" className="border border-slate-300 rounded-lg px-3 py-2" value={deployForm.shiftStart} onChange={(e) => setDeployForm((f) => ({ ...f, shiftStart: e.target.value }))} />
                </label>
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Shift End</span>
                  <input type="time" className="border border-slate-300 rounded-lg px-3 py-2" value={deployForm.shiftEnd} onChange={(e) => setDeployForm((f) => ({ ...f, shiftEnd: e.target.value }))} />
                </label>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">Available Guards</p>
                    <p className="text-sm text-slate-600">Only active employees without an active deployment are listed.</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{selectedEmployeeIds.length} selected</span>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {loadingDeployable ? (
                    <div className="px-4 py-8 text-center text-slate-600">Loading available guards...</div>
                  ) : deployableEmployees.length === 0 ? (
                    <div className="px-4 py-8 text-center text-slate-600">No deployable guards are currently available.</div>
                  ) : (
                    deployableEmployees.map((emp) => (
                      <label key={emp.id} className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50">
                        <input type="checkbox" className="mt-1" checked={selectedEmployeeIds.includes(emp.id)} onChange={() => handleEmployeeToggle(emp.id)} />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <p className="text-sm text-slate-600">{emp.employee_id_number} • {emp.position}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-slate-50">
              <button type="button" className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold" onClick={() => setShowDeployModal(false)} disabled={isDeploying}>
                Cancel
              </button>
              <button type="button" className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-60" onClick={handleDeployGuards} disabled={isDeploying || loadingDeployable || deployableEmployees.length === 0}>
                {isDeploying ? 'Deploying...' : 'Deploy Selected Guards'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
