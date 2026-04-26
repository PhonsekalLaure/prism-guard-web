import { useEffect, useState } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt,
  FaAddressBook, FaFileContract, FaHistory, FaUsers
} from 'react-icons/fa';
import clientService from '@services/clientService';
import employeeService from '@services/employeeService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

const tabs = [
  { key: 'general',  label: 'General Info',     icon: FaBuilding },
  { key: 'sites',    label: 'Sites',             icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings',          icon: FaFileInvoiceDollar },
  { key: 'tickets',  label: 'Service Tickets',   icon: FaTicketAlt },
];

const DAY_OPTIONS = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  : 'N/A';

const fmtMoney = (v) => v == null ? 'N/A'
  : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v);

export default function ViewClientModal({ isOpen, client: previewClient, onClose, onUpdated }) {
  const [activeTab, setActiveTab] = useState('general');
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [loadingDeployableEmployees, setLoadingDeployableEmployees] = useState(false);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [deployForm, setDeployForm] = useState({
    siteId: '',
    contractStartDate: '',
    contractEndDate: '',
    daysOfWeek: [],
    shiftStart: '',
    shiftEnd: '',
  });
  const [isDeploying, setIsDeploying] = useState(false);
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

  // Always fall back to previewClient so the modal never renders blank
  const data = clientDetails || previewClient;
  const activeSites = (data.sites || []).filter((site) => site.is_active);

  const openDeployModal = async (siteId = '') => {
    setShowDeployModal(true);
    setSelectedEmployeeIds([]);
    setDeployForm({
      siteId: siteId || activeSites[0]?.id || '',
      contractStartDate: '',
      contractEndDate: '',
      daysOfWeek: [],
      shiftStart: '',
      shiftEnd: '',
    });
    setLoadingDeployableEmployees(true);

    try {
      const employees = await employeeService.getDeployableEmployees();
      setDeployableEmployees(employees);
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to load available guards.', 'error');
    } finally {
      setLoadingDeployableEmployees(false);
    }
  };

  const handleEmployeeToggle = (employeeId) => {
    setSelectedEmployeeIds((current) => (
      current.includes(employeeId)
        ? current.filter((id) => id !== employeeId)
        : [...current, employeeId]
    ));
  };

  const handleDeployGuards = async () => {
    if (!deployForm.siteId) {
      showNotification('Please select an active site.', 'error');
      return;
    }

    if (selectedEmployeeIds.length === 0) {
      showNotification('Please select at least one available guard.', 'error');
      return;
    }
    if (deployForm.daysOfWeek.length === 0) {
      showNotification('Please select at least one schedule day.', 'error');
      return;
    }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) {
      showNotification('Please set both shift start and shift end time.', 'error');
      return;
    }

    setIsDeploying(true);

    const successfulDeployments = [];
    const failedDeployments = [];

    for (const employeeId of selectedEmployeeIds) {
      try {
        const payload = new FormData();
        payload.append('siteId', deployForm.siteId);
        if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
        if (deployForm.contractEndDate) payload.append('contractEndDate', deployForm.contractEndDate);
        deployForm.daysOfWeek.forEach((day) => payload.append('daysOfWeek', String(day)));
        payload.append('shiftStart', deployForm.shiftStart);
        payload.append('shiftEnd', deployForm.shiftEnd);

        await employeeService.deployEmployee(employeeId, payload);
        successfulDeployments.push(employeeId);
      } catch (err) {
        failedDeployments.push(
          err.response?.data?.error || err.message || `Failed to deploy employee ${employeeId}.`
        );
      }
    }

    try {
      await loadClientDetails(previewClient.id);
      onUpdated?.();
    } finally {
      setIsDeploying(false);
    }

    if (successfulDeployments.length > 0 && failedDeployments.length === 0) {
      showNotification(
        `${successfulDeployments.length} guard${successfulDeployments.length > 1 ? 's were' : ' was'} deployed successfully.`,
        'success'
      );
      setShowDeployModal(false);
      return;
    }

    if (successfulDeployments.length > 0) {
      showNotification(
        `${successfulDeployments.length} deployed, ${failedDeployments.length} failed. ${failedDeployments[0]}`,
        'error'
      );
      setShowDeployModal(false);
      return;
    }

    showNotification(failedDeployments[0] || 'Failed to deploy selected guards.', 'error');
  };

  const toggleScheduleDay = (dayValue) => {
    setDeployForm((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(dayValue)
        ? current.daysOfWeek.filter((day) => day !== dayValue)
        : [...current.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  };

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <div className="vc-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="vc-modal-header">
          <div>
            <h2>Client Details</h2>
            <p>{data.company || 'Client'}</p>
          </div>
          <button className="vc-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* ── Tabs ── */}
        <div className="vc-tabs-bar">
          {tabs.map((tab) => (
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
        <div className="vc-modal-body relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/70">
              <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}

          {/* Render content as soon as we have any data (previewClient is always available) */}
          {!loading && (
            <>
              {fetchError && (
                <div style={{ background:'#fef3c7', border:'1px solid #fde68a', color:'#92400e', borderRadius:'8px', padding:'0.65rem 1rem', fontSize:'0.8rem', fontWeight:600, marginBottom:'1rem' }}>
                  ⚠️ Could not load full client details. Showing limited information.
                </div>
              )}
              {activeTab === 'general'  && <GeneralTab  client={data} />}
              {activeTab === 'sites'    && <SitesTab client={data} onDeployGuard={openDeployModal} />}
              {activeTab === 'billings' && <BillingsTab client={data} />}
              {activeTab === 'tickets'  && <TicketsTab  client={data} />}
            </>
          )}
        </div>

        {showDeployModal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => setShowDeployModal(false)}>
            <div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
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
                    <select
                      className="border border-slate-300 rounded-lg px-3 py-2"
                      value={deployForm.siteId}
                      onChange={(e) => setDeployForm((current) => ({ ...current, siteId: e.target.value }))}
                    >
                      <option value="">Select site</option>
                      {activeSites.map((site) => (
                        <option key={site.id} value={site.id}>
                          {site.site_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Contract Start</span>
                    <input
                      type="date"
                      className="border border-slate-300 rounded-lg px-3 py-2"
                      value={deployForm.contractStartDate}
                      onChange={(e) => setDeployForm((current) => ({ ...current, contractStartDate: e.target.value }))}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Contract End</span>
                    <input
                      type="date"
                      className="border border-slate-300 rounded-lg px-3 py-2"
                      value={deployForm.contractEndDate}
                      onChange={(e) => setDeployForm((current) => ({ ...current, contractEndDate: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="mb-5">
                  <span className="text-sm font-semibold text-slate-700 block mb-2">Days of Week</span>
                  <div className="grid grid-cols-4 gap-2">
                    {DAY_OPTIONS.map((day) => (
                      <label key={day.value} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={deployForm.daysOfWeek.includes(day.value)}
                          onChange={() => toggleScheduleDay(day.value)}
                        />
                        <span>{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-5">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Shift Start</span>
                    <input
                      type="time"
                      className="border border-slate-300 rounded-lg px-3 py-2"
                      value={deployForm.shiftStart}
                      onChange={(e) => setDeployForm((current) => ({ ...current, shiftStart: e.target.value }))}
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-slate-700">Shift End</span>
                    <input
                      type="time"
                      className="border border-slate-300 rounded-lg px-3 py-2"
                      value={deployForm.shiftEnd}
                      onChange={(e) => setDeployForm((current) => ({ ...current, shiftEnd: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">Available Guards</p>
                      <p className="text-sm text-slate-600">Only active employees without an active deployment are listed.</p>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {selectedEmployeeIds.length} selected
                    </span>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {loadingDeployableEmployees ? (
                      <div className="px-4 py-8 text-center text-slate-600">Loading available guards...</div>
                    ) : deployableEmployees.length === 0 ? (
                      <div className="px-4 py-8 text-center text-slate-600">No deployable guards are currently available.</div>
                    ) : (
                      deployableEmployees.map((employee) => (
                        <label
                          key={employee.id}
                          className="flex items-start gap-3 px-4 py-3 border-b border-slate-100 last:border-b-0 cursor-pointer hover:bg-slate-50"
                        >
                          <input
                            type="checkbox"
                            className="mt-1"
                            checked={selectedEmployeeIds.includes(employee.id)}
                            onChange={() => handleEmployeeToggle(employee.id)}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900">{employee.name}</p>
                            <p className="text-sm text-slate-600">
                              {employee.employee_id_number} • {employee.position}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-slate-50">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold"
                  onClick={() => setShowDeployModal(false)}
                  disabled={isDeploying}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold disabled:opacity-60"
                  onClick={handleDeployGuards}
                  disabled={isDeploying || loadingDeployableEmployees || deployableEmployees.length === 0}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Selected Guards'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   General Info Tab
───────────────────────────────────────────── */
function GeneralTab({ client }) {
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
      </div>

      {/* Contact Information */}
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaAddressBook className="vc-section-icon" /> Contact Information
        </h3>
        <div className="vc-info-grid cols-2">
          <InfoCell label="Contact Person"   value={client.contact_person  || 'N/A'} />
          <InfoCell label="Email Address"    value={client.contact_email   || 'N/A'} />
          <InfoCell label="Phone Number"     value={client.phone_number    || 'N/A'} />
          <InfoCell label="Billing Address"  value={client.billing_address || 'N/A'} span2 />
        </div>
      </div>

      {/* Contract Details */}
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaFileContract className="vc-section-icon" /> Contract Details
        </h3>
        <div className="vc-info-grid cols-3">
          <InfoCell label="Contract Start"   value={fmtDate(client.contract_start_date)} variant="blue" />
          <InfoCell label="Contract End"     value={fmtDate(client.contract_end_date)}   variant="blue" />
          <InfoCell label="Contract Status"  value={client.contract_status || 'N/A'}     valueColor={contractColor} />
          <InfoCell label="Rate per Guard"   value={client.rate_per_guard ? `₱${Number(client.rate_per_guard).toLocaleString()}` : 'N/A'} variant="green" valueSize="xl" />
          <InfoCell label="Billing Type"     value={client.billing_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'} />
          <InfoCell label="Guard Count"      value={client.guard_count != null ? `${client.guard_count} guards` : 'N/A'} />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sites Tab
───────────────────────────────────────────── */
function SitesTab({ client, onDeployGuard }) {
  const sites = client.sites || [];
  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="vc-section-title !mb-0">
            <FaMapMarkerAlt className="vc-section-icon" /> Deployment Sites
          </h3>
          {sites.some((site) => site.is_active) && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold"
              onClick={() => onDeployGuard()}
            >
              Deploy Guard
            </button>
          )}
        </div>

        {sites.length > 0 ? (
          <div className="vc-sites-grid">
            {sites.map((site, i) => (
              <div key={site.id || i} className={`vc-site-card ${site.is_active ? 'active' : 'inactive'}`}>
                <div className="vc-site-header">
                  <div>
                    <p className="vc-site-name">{site.site_name}</p>
                    <p className="vc-site-address">{site.site_address}</p>
                  </div>
                  <span className={`vc-site-badge ${site.is_active ? 'active' : 'inactive'}`}>
                    {site.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="vc-site-meta">
                  <span><FaMapMarkerAlt /> Geofence: {site.geofence_radius_meters}m radius</span>
                  <span><FaUsers /> Active Guards: {site.active_guard_count ?? 0}</span>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold ${site.is_active ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                    onClick={() => site.is_active && onDeployGuard(site.id)}
                    disabled={!site.is_active}
                  >
                    {site.is_active ? 'Deploy Guard Here' : 'Inactive Site'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vc-empty">
            <FaMapMarkerAlt className="vc-empty-icon" />
            <p className="vc-empty-text">No sites registered for this client.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Billings Tab
───────────────────────────────────────────── */
function BillingsTab({ client }) {
  const billings = client.billings || [];
  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaHistory className="vc-section-icon" /> Billing Records
        </h3>

        {billings.length > 0 ? (
          <div className="vc-table-wrap">
            <table className="vc-table">
              <thead>
                <tr>
                  <th>Pay Period</th>
                  <th className="text-right">Total</th>
                  <th className="text-right">Paid</th>
                  <th className="text-right">Balance</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {billings.map((b, i) => (
                  <tr key={b.id || i}>
                    <td className="fw-600">
                      {fmtDate(b.period_start)} — {fmtDate(b.period_end)}
                    </td>
                    <td className="text-right text-green">{fmtMoney(b.total_amount)}</td>
                    <td className="text-right">{fmtMoney(b.amount_paid)}</td>
                    <td className="text-right text-red">{fmtMoney(b.balance_due)}</td>
                    <td>{fmtDate(b.due_date)}</td>
                    <td>
                      <span className={`vc-bill-badge ${b.status}`}>
                        {b.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="vc-empty">
            <FaFileInvoiceDollar className="vc-empty-icon" />
            <p className="vc-empty-text">No billing records found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Service Tickets Tab
───────────────────────────────────────────── */
function TicketsTab({ client }) {
  const tickets = client.service_tickets || [];

  const priorityColor = (p) =>
    p === 'urgent' ? '#dc2626' : p === 'high' ? '#d97706' : '#2563eb';

  const statusColor = (s) =>
    s === 'resolved' ? '#16a34a' : s === 'in_progress' ? '#2563eb' : '#d97706';

  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaTicketAlt className="vc-section-icon" /> Service Tickets
        </h3>

        {tickets.length > 0 ? (
          <div className="vc-tickets-list">
            {tickets.map((t, i) => (
              <div key={t.id || i} className="vc-ticket-card">
                <div className="vc-ticket-header">
                  <div>
                    <p className="vc-ticket-subject">{t.subject}</p>
                    <p className="vc-ticket-type">{t.ticket_type}</p>
                  </div>
                  <div className="vc-ticket-badges">
                    <span className="vc-ticket-badge" style={{ color: priorityColor(t.priority), borderColor: priorityColor(t.priority) }}>
                      {t.priority?.toUpperCase()}
                    </span>
                    <span className="vc-ticket-status" style={{ color: statusColor(t.status) }}>
                      ● {t.status?.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="vc-ticket-desc">{t.description}</p>
                <p className="vc-ticket-date">Created: {fmtDate(t.created_at)}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="vc-empty">
            <FaTicketAlt className="vc-empty-icon" />
            <p className="vc-empty-text">No service tickets found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Shared: read-only info cell
───────────────────────────────────────────── */
function InfoCell({ label, value, variant, span2, valueColor, valueSize }) {
  const cellClass = [
    'vc-info-cell',
    variant === 'blue'  ? 'blue'   : '',
    variant === 'green' ? 'green'  : '',
    span2               ? 'span-2' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClass}>
      <p className="vc-info-label">{label}</p>
      <p
        className={`vc-info-value ${valueSize === 'xl' ? 'xl' : ''}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}
