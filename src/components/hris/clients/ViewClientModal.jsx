import { useState, useEffect } from 'react';
import {
  FaTimes, FaBuilding, FaMapMarkerAlt, FaFileInvoiceDollar, FaTicketAlt,
  FaAddressBook, FaFileContract, FaHistory, FaUsers, FaExclamationTriangle
} from 'react-icons/fa';
import clientService from '@services/clientService';

const tabs = [
  { key: 'general',  label: 'General Info',     icon: FaBuilding },
  { key: 'sites',    label: 'Sites',             icon: FaMapMarkerAlt },
  { key: 'billings', label: 'Billings',          icon: FaFileInvoiceDollar },
  { key: 'tickets',  label: 'Service Tickets',   icon: FaTicketAlt },
];

const fmtDate = (d) => d
  ? new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  : 'N/A';

const fmtMoney = (v) => v == null ? 'N/A'
  : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(v);

export default function ViewClientModal({ isOpen, client: previewClient, onClose }) {
  const [activeTab, setActiveTab] = useState('general');
  const [clientDetails, setClientDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    if (isOpen && previewClient?.id) {
      setLoading(true);
      setFetchError(false);
      clientService.getClientDetails(previewClient.id)
        .then(data => { setClientDetails(data); setLoading(false); })
        .catch(err => { console.error(err); setFetchError(true); setLoading(false); });
    } else {
      setClientDetails(null);
      setFetchError(false);
      setActiveTab('general');
    }
  }, [isOpen, previewClient]);

  if (!isOpen || !previewClient) return null;

  // Always fall back to previewClient so the modal never renders blank
  const data = clientDetails || previewClient;

  return (
    <div className="vc-modal-overlay" onClick={onClose}>
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
              {activeTab === 'sites'    && <SitesTab    client={data} />}
              {activeTab === 'billings' && <BillingsTab client={data} />}
              {activeTab === 'tickets'  && <TicketsTab  client={data} />}
            </>
          )}
        </div>
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
function SitesTab({ client }) {
  const sites = client.sites || [];
  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <h3 className="vc-section-title">
          <FaMapMarkerAlt className="vc-section-icon" /> Deployment Sites
        </h3>

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