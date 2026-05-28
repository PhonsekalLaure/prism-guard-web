import { FaCheck, FaAddressCard, FaBuilding, FaFileContract, FaMapMarkerAlt, FaUserShield } from 'react-icons/fa';

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const formatBillingType = (value) => toProperCase(value || '').replace('-', ' ');
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ReviewSection({ title, icon: Icon, children }) {
  return (
    <div className="ae-review-section">
      <div className="ae-review-section-header">
        <Icon className="ae-review-section-icon" />
        <span className="ae-review-section-title">{title}</span>
      </div>
      <div className="ae-review-section-body">{children}</div>
    </div>
  );
}

function ReviewField({ label, value, highlight }) {
  return (
    <div className="ae-review-field">
      <span className="ae-review-field-label">{label}</span>
      <span className={`ae-review-field-value ${highlight ? 'highlight' : ''}`}>{value || '-'}</span>
    </div>
  );
}

export default function Step6Review({ data }) {
  const sitesCount = data.sites.length;
  const assignments = data.initialDeployment?.assignments || [];
  const hasInitialDeployment = assignments.length > 0;

  return (
    <div className="ae-step-content">
      <div className="ae-review-banner">
        <div className="ae-review-banner-icon"><FaCheck /></div>
        <div>
          <h3 className="ae-review-banner-title">Ready to Add Client</h3>
          <p className="ae-review-banner-sub">Review all information carefully before confirming.</p>
        </div>
        <div className="ae-review-banner-id">
          <span className="ae-review-banner-id-label">Billing Type</span>
          <span className="ae-review-banner-id-value">{formatBillingType(data.billingType)}</span>
        </div>
      </div>

      <div className="ae-review-grid">
        <ReviewSection title="Primary Contact" icon={FaAddressCard}>
          <ReviewField
            label="Contact Name"
            value={`${toProperCase(data.firstName)} ${toProperCase(data.middleName)} ${toProperCase(data.lastName)} ${toProperCase(data.suffix)}`.replace(/\s+/g, ' ').trim()}
          />
          <ReviewField label="Avatar" value={data.avatar?.name || 'No avatar uploaded'} />
          <ReviewField label="Email"  value={data.email} />
          <ReviewField label="Mobile" value={data.mobile ? `+63 ${data.mobile}` : ''} />
        </ReviewSection>

        <ReviewSection title="Company Details" icon={FaBuilding}>
          <ReviewField label="Company"         value={toProperCase(data.company)} />
          <ReviewField label="Billing Address" value={data.billingAddress} />
        </ReviewSection>

        <ReviewSection title="Contract Terms" icon={FaFileContract}>
          <ReviewField label="Contract Start" value={data.contractStartDate} />
          <ReviewField label="Contract End"   value={data.contractEndDate} />
          <ReviewField label="Contract Document" value={data.contractUrl?.name || 'No document uploaded'} />
          <ReviewField
            label="Rate per Guard"
            value={data.ratePerGuard ? `PHP ${Number(data.ratePerGuard).toLocaleString()}` : ''}
            highlight={!!data.ratePerGuard}
          />
          <ReviewField label="Billing Type" value={formatBillingType(data.billingType)} />
        </ReviewSection>

        <ReviewSection title="Sites" icon={FaMapMarkerAlt}>
          <ReviewField label="Total Sites" value={sitesCount ? String(sitesCount) : 'No sites added'} />
          {data.sites.slice(0, 3).map((site, index) => (
            <ReviewField
              key={`${site.siteName}-${index}`}
              label={`Site ${index + 1}`}
              value={site.siteName || site.siteAddress || 'Untitled site'}
            />
          ))}
          {sitesCount > 3 && <ReviewField label="Additional" value={`+${sitesCount - 3} more`} />}
        </ReviewSection>

        <ReviewSection title="Initial Deployment" icon={FaUserShield}>
          <ReviewField
            label="Selected Guards"
            value={hasInitialDeployment ? `${assignments.length} guard(s) selected` : 'No initial guard assigned'}
          />
          {hasInitialDeployment && (
            <ReviewField
              label="Deployment Site"
              value={
                data.sites[Number(data.initialDeployment.siteIndex)]?.siteName ||
                data.sites[Number(data.initialDeployment.siteIndex)]?.siteAddress ||
                '—'
              }
            />
          )}
        </ReviewSection>
      </div>

      {/* Guard assignment mini-cards — full width below the grid */}
      {hasInitialDeployment && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.85rem' }}>
          {/* Section label */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.45rem',
            fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.06em', color: '#64748b',
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: 6,
              background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '0.55rem', flexShrink: 0,
            }}>G</span>
            Guard Assignments
          </div>

          {assignments.map((assignment, index) => (
            <div key={assignment.employeeId} className="ig-assignment-card">
              {/* Card header strip */}
              <div className="ig-assignment-card-header">
                <div className="ig-assignment-avatar">
                  {(assignment.employeeName || 'G').charAt(0).toUpperCase()}
                </div>
                <div className="ig-assignment-info">
                  <p className="ig-assignment-name">{assignment.employeeName || `Guard ${index + 1}`}</p>
                  <p className="ig-assignment-id">{assignment.employeeId}</p>
                </div>
                <span className="ig-assignment-badge">Guard {index + 1}</span>
              </div>

              {/* Card body — key/value summary rows */}
              <div style={{ padding: '0.85rem 1.1rem', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Base Pay</span>
                  <span style={{ color: '#16a34a', fontWeight: 700 }}>
                    {assignment.baseSalary ? `₱${Number(assignment.baseSalary).toLocaleString()}` : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Contract Period</span>
                  <span style={{ color: '#1a202c', fontWeight: 600 }}>
                    {assignment.contractStartDate || '—'} → {assignment.contractEndDate || '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.35rem' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Schedule</span>
                  <span style={{ color: '#1a202c', fontWeight: 600, textAlign: 'right' }}>
                    {assignment.daysOfWeek.length > 0
                      ? `${assignment.daysOfWeek.map((d) => DAY_LABELS[d] || d).join(', ')}  ${assignment.shiftStart}–${assignment.shiftEnd}`
                      : '—'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.78rem' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Deployment Order</span>
                  <span style={{ color: assignment.deploymentOrderFile ? '#16a34a' : '#94a3b8', fontWeight: 600 }}>
                    {assignment.deploymentOrderFile ? assignment.deploymentOrderFile.name : '—'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
