import { useState } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaCertificate, FaMapMarkerAlt,
  FaCommentAlt, FaCheckCircle, FaFilePdf, FaFileImage,
  FaFileAlt, FaPhone, FaEnvelope, FaShieldAlt, FaIdCard,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────────────────
   Constants & helpers
───────────────────────────────────────────────────────── */

const TABS = [
  { key: 'personal',    label: 'Personal Info',  icon: FaUser },
  { key: 'employment',  label: 'Employment',      icon: FaBriefcase },
  { key: 'compliance',  label: 'Compliance',      icon: FaCertificate },
  { key: 'deployment',  label: 'Deployment',      icon: FaMapMarkerAlt },
];

const STATUS_CONFIG = {
  active:     { label: 'Active',     cls: 'gdm-badge--active' },
  inactive:   { label: 'Inactive',   cls: 'gdm-badge--inactive' },
  terminated: { label: 'Terminated', cls: 'gdm-badge--terminated' },
  archived:   { label: 'Archived',   cls: 'gdm-badge--archived' },
  unknown:    { label: 'Unknown',    cls: 'gdm-badge--unknown' },
};

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const DOC_LABELS = {
  valid_id:                   'Valid ID',
  resume:                     'Resume',
  personal_information_sheet: 'Personal Information Sheet',
  sg_license:                 'Security Guard License',
  barangay:                   'Barangay Clearance',
  police:                     'Police Clearance',
  nbi:                        'NBI Clearance',
  neuro:                      'Neuro-Psychiatric Test',
  drugtest:                   'Drug Test Result',
  deployment_order:           'Deployment Order',
};

function fmtDate(dateStr) {
  if (!dateStr) return 'N/A';
  const datePart = String(dateStr).split('T')[0];
  const [y, m, d] = datePart.split('-').map(Number);
  const dt = y && m && d ? new Date(y, m - 1, d) : new Date(dateStr);
  if (Number.isNaN(dt.getTime())) return 'N/A';
  return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function fmtTime(t = '') { return t.slice(0, 5) || 'N/A'; }

function fmtSchedule(s) {
  const days = Array.isArray(s.days_of_week)
    ? s.days_of_week.map((d) => DAY_LABELS[d] || d).join(', ')
    : 'N/A';
  return `${days} · ${fmtTime(s.shift_start)} – ${fmtTime(s.shift_end)}`;
}

function fmtStatus(status) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.unknown;
}

/* ─────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────── */

function InfoCell({ label, value, variant = '' }) {
  return (
    <div className={`gdm-info-cell ${variant ? `gdm-info-cell--${variant}` : ''}`}>
      <p className="gdm-info-label">{label}</p>
      <p className="gdm-info-value">{value || 'N/A'}</p>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="gdm-section">
      <h3 className="gdm-section-title">
        <Icon className="gdm-section-icon" /> {title}
      </h3>
      {children}
    </div>
  );
}

/* ─── TAB: Personal ─── */
function PersonalTab({ guard }) {
  return (
    <div className="gdm-tab-content">
      {/* Profile hero */}
      <div className="gdm-profile-card">
        <div className="gdm-profile-left">
          {guard.avatar_url ? (
            <img src={guard.avatar_url} alt={guard.name} className="gdm-profile-avatar" style={{ objectFit: 'cover' }} />
          ) : (
            <div className="gdm-profile-avatar">{guard.initials}</div>
          )}
          <div>
            <h3 className="gdm-profile-name">{guard.full_name || guard.name}</h3>
            <p className="gdm-profile-position">{guard.position || 'Security Officer'}</p>
            <div className="gdm-profile-meta">
              <span className={`gdm-badge ${fmtStatus(guard.status).cls}`}>
                {fmtStatus(guard.status).label}
              </span>
              {guard.deployment_type === 'reliever' && (
                <span className="gdm-badge gdm-badge--reliever">Reliever</span>
              )}
              <span className="gdm-profile-id">ID: {guard.employee_id_number || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="gdm-profile-quick">
          <div className="gdm-quick-item">
            <FaPhone className="gdm-quick-icon" />
            <div>
              <p className="gdm-quick-label">Mobile</p>
              <p className="gdm-quick-value">{guard.phone_number || 'N/A'}</p>
            </div>
          </div>
          <div className="gdm-quick-item">
            <FaEnvelope className="gdm-quick-icon" />
            <div>
              <p className="gdm-quick-label">Email</p>
              <p className="gdm-quick-value">{guard.contact_email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <Section icon={FaIdCard} title="Basic Information">
        <div className="gdm-info-grid gdm-info-grid--3">
          <InfoCell label="Full Name"         value={guard.full_name || guard.name} />
          <InfoCell label="Age"               value={guard.age != null ? `${guard.age} years old` : 'N/A'} />
          <InfoCell label="Gender"            value={guard.gender} />
          <InfoCell label="Civil Status"      value={guard.civil_status} />
          <InfoCell label="Citizenship"       value={guard.citizenship || 'Filipino'} />
          <InfoCell label="Height"            value={guard.height_cm ? `${guard.height_cm} cm` : 'N/A'} />
          <InfoCell label="Date of Birth"     value={fmtDate(guard.date_of_birth)} />
          <InfoCell label="Educational Level" value={guard.educational_level} />
        </div>
      </Section>

      <Section icon={FaUser} title="Contact Information">
        <div className="gdm-info-grid gdm-info-grid--2">
          <InfoCell label="Mobile Number" value={guard.phone_number} variant="blue" />
          <InfoCell label="Email Address" value={guard.contact_email} variant="blue" />
        </div>
        <div className="gdm-address-box">
          <p className="gdm-address-label">Residential Address</p>
          <p className="gdm-address-text">{guard.residential_address || 'N/A'}</p>
        </div>
        <div className="gdm-info-grid gdm-info-grid--3">
          <InfoCell label="Emergency Contact" value={guard.emergency_contact_name} />
          <InfoCell label="Emergency Number"  value={guard.emergency_contact_number} />
        </div>
      </Section>
    </div>
  );
}

/* ─── TAB: Employment ─── */
function EmploymentTab({ guard }) {
  let tenureStr = 'N/A';
  if (guard.hire_date) {
    const diff  = new Date() - new Date(guard.hire_date);
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    if (years >= 1) {
      tenureStr = `${Math.floor(years)} year(s)`;
      const months = Math.floor((years - Math.floor(years)) * 12);
      if (months > 0) tenureStr += `, ${months} month(s)`;
    } else {
      tenureStr = `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))} month(s)`;
    }
  }

  return (
    <div className="gdm-tab-content">
      <Section icon={FaBriefcase} title="Employment Details">
        <div className="gdm-info-grid gdm-info-grid--3">
          <InfoCell label="Employee ID"     value={guard.employee_id_number} variant="blue" />
          <InfoCell label="Date Hired"      value={fmtDate(guard.hire_date)} variant="blue" />
          <InfoCell label="Tenure"          value={tenureStr}               variant="blue" />
          <InfoCell label="Position"        value={guard.position} />
          <InfoCell label="Employment Type" value={guard.employment_type ? guard.employment_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'} />
          <InfoCell label="Badge Number"    value={guard.badge_number} />
          <InfoCell label="License Number"  value={guard.license_number} />
          <InfoCell label="License Expiry"  value={fmtDate(guard.license_expiry_date)} />
        </div>
      </Section>
    </div>
  );
}

/* ─── TAB: Compliance ─── */
function ComplianceTab({ guard }) {
  const existingMap = {};
  (guard.clearances || []).forEach((c) => { existingMap[c.clearance_type] = c; });
  if (guard.deployment_order_url) {
    existingMap.deployment_order = { clearance_type: 'deployment_order', document_url: guard.deployment_order_url };
  }

  const displayTypes = Object.keys(DOC_LABELS).filter((t) => !!existingMap[t]);

  return (
    <div className="gdm-tab-content">
      <Section icon={FaCertificate} title="Requirements & Clearances">
        {displayTypes.length > 0 ? (
          <div className="gdm-doc-grid">
            {displayTypes.map((type) => {
              const c = existingMap[type];
              const hasDoc = !!c?.document_url;
              const isPdf = hasDoc && (c.document_url.toLowerCase().includes('.pdf') || c.document_url.toLowerCase().includes('/pdf'));

              return (
                <div key={type} className={`gdm-doc-card ${hasDoc ? 'has-doc' : 'no-doc'}`}>
                  <div className="gdm-doc-icon-wrap">
                    <div className={`gdm-doc-icon ${isPdf ? 'pdf' : hasDoc ? 'img' : 'empty'}`}>
                      {isPdf ? <FaFilePdf /> : hasDoc ? <FaFileImage /> : <FaFileAlt />}
                    </div>
                  </div>
                  <div className="gdm-doc-info">
                    <p className="gdm-doc-title">{DOC_LABELS[type] || type}</p>
                    <p className="gdm-doc-sub">{isPdf ? 'PDF Document' : hasDoc ? 'Image File' : 'Not yet uploaded'}</p>
                    {c?.expiry_date && (
                      <p className="gdm-doc-expiry">
                        <FaCheckCircle /> Valid until {fmtDate(c.expiry_date)}
                      </p>
                    )}
                  </div>
                  {hasDoc && (
                    <a
                      href={c.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`gdm-doc-view-btn ${isPdf ? 'pdf' : 'img'}`}
                    >
                      {isPdf ? <FaFilePdf /> : <FaFileImage />}
                      <span>View</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="gdm-doc-empty">
            <FaFileAlt className="gdm-doc-empty-icon" />
            <p className="gdm-doc-empty-text">No clearances on file.</p>
            <p className="gdm-doc-empty-sub">Documents will appear here once they have been uploaded.</p>
          </div>
        )}
      </Section>
    </div>
  );
}

/* ─── TAB: Deployment ─── */
function DeploymentTab({ guard }) {
  return (
    <div className="gdm-tab-content">
      <Section icon={FaMapMarkerAlt} title="Current Deployment">
        <div className="gdm-info-grid gdm-info-grid--3">
          <InfoCell label="Assigned Company" value={guard.company} />
          <InfoCell label="Assigned Site"    value={guard.site_name} />
          <InfoCell label="Shift Schedule"   value={guard.shift} />
          <InfoCell label="Deployment Type"  value={guard.deployment_type ? guard.deployment_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : 'N/A'} />
          <InfoCell label="Deployment Start" value={fmtDate(guard.start_date)} variant="blue" />
          <InfoCell label="Contract End"     value={fmtDate(guard.end_date)}   variant="blue" />
          {guard.deployment_order_url && (
            <div className="gdm-info-cell">
              <p className="gdm-info-label">Deployment Order</p>
              <a
                href={guard.deployment_order_url}
                target="_blank"
                rel="noopener noreferrer"
                className="gdm-info-link"
              >
                View Document
              </a>
            </div>
          )}
        </div>

        {guard.site_address && (
          <div className="gdm-address-box">
            <p className="gdm-address-label">Site Address</p>
            <p className="gdm-address-text">{guard.site_address}</p>
          </div>
        )}

        {Array.isArray(guard.schedules) && guard.schedules.length > 0 && (
          <div className="gdm-schedule-box">
            <p className="gdm-schedule-heading">Active Schedules</p>
            {guard.schedules.map((s) => (
              <div key={s.id} className="gdm-schedule-row">
                <FaShieldAlt className="gdm-schedule-icon" />
                <span>{fmtSchedule(s)}</span>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */

export default function GuardDetailModal({ isOpen, onClose, guard, loading }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen) return null;

  const handleSubmitReview = () => {
    navigate('/cms/reviews', {
      state: {
        guardId:         guard?.employee_id,
        deploymentId:    guard?.deployment_id,
        guardName:       guard?.full_name || guard?.name,
        guardEmployeeId: guard?.employee_id_number,
        siteName:        guard?.site_name,
        siteId:          guard?.site_id,
      },
    });
  };

  return (
    <div className="gdm-overlay" onClick={onClose}>
      <div className="gdm-content" onClick={(e) => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="gdm-header">
          <div>
            <h2>Guard Profile</h2>
            <p>
              {loading ? '…' : guard
                ? `${guard.employee_id_number || 'N/A'} · ${guard.full_name || guard.name || 'N/A'}`
                : 'Loading…'}
            </p>
          </div>
          <button className="gdm-close-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* ── Tab bar ── */}
        <div className="gdm-tabs-bar">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`gdm-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              disabled={loading || !guard}
            >
              <tab.icon /> {tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="gdm-body">
          {loading && (
            <div className="gdm-skeleton">
              <div className="gdm-sk-profile">
                <div className="gdm-sk-avatar" />
                <div className="gdm-sk-lines">
                  <div className="gdm-sk-line xl" />
                  <div className="gdm-sk-line md" />
                  <div className="gdm-sk-line sm" />
                </div>
              </div>
              <div className="gdm-sk-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="gdm-sk-cell">
                    <div className="gdm-sk-line sm" />
                    <div className="gdm-sk-line lg" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !guard && (
            <div className="gdm-empty">
              <FaShieldAlt className="gdm-empty-icon" />
              <p className="gdm-empty-text">No guard data available.</p>
            </div>
          )}

          {!loading && guard && (
            <>
              {activeTab === 'personal'   && <PersonalTab   guard={guard} />}
              {activeTab === 'employment' && <EmploymentTab guard={guard} />}
              {activeTab === 'compliance' && <ComplianceTab guard={guard} />}
              {activeTab === 'deployment' && <DeploymentTab guard={guard} />}
            </>
          )}
        </div>

        {/* ── Footer actions ── */}
        <div className="gdm-footer">
          <button
            className="gdm-footer-btn gdm-footer-btn--gold"
            disabled={loading || !guard}
            onClick={handleSubmitReview}
          >
            <FaCommentAlt /> Submit Review
          </button>
          <button className="gdm-footer-btn gdm-footer-btn--secondary" onClick={onClose}>
            <FaTimes /> Close
          </button>
        </div>
      </div>
    </div>
  );
}
