import { FaCheck } from 'react-icons/fa';

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const formatBillingType = (value) => toProperCase(value || '').replace('-', ' ');
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ReviewSection({ title, icon, children }) {
  return (
    <div className="ae-review-section">
      <div className="ae-review-section-header">
        <span className="ae-review-section-icon">{icon}</span>
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
        <ReviewSection title="Primary Contact" icon="C">
          <ReviewField
            label="Contact Name"
            value={`${toProperCase(data.firstName)} ${toProperCase(data.middleName)} ${toProperCase(data.lastName)} ${toProperCase(data.suffix)}`.replace(/\s+/g, ' ').trim()}
          />
          <ReviewField label="Email"  value={data.email} />
          <ReviewField label="Mobile" value={data.mobile ? `+63 ${data.mobile}` : ''} />
        </ReviewSection>

        <ReviewSection title="Company Details" icon="B">
          <ReviewField label="Company"         value={toProperCase(data.company)} />
          <ReviewField label="Billing Address" value={data.billingAddress} />
        </ReviewSection>

        <ReviewSection title="Contract Terms" icon="T">
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

        <ReviewSection title="Sites" icon="S">
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

        <ReviewSection title="Initial Deployment" icon="D">
          <ReviewField
            label="Selected Guards"
            value={hasInitialDeployment ? `${assignments.length} selected` : 'No initial guard assigned'}
          />
          {hasInitialDeployment && (
            <>
              <ReviewField
                label="Site"
                value={data.sites[Number(data.initialDeployment.siteIndex)]?.siteName || data.sites[Number(data.initialDeployment.siteIndex)]?.siteAddress || ''}
              />
              {assignments.map((assignment, index) => (
                <div key={assignment.employeeId} className="ae-review-field" style={{ display: 'block' }}>
                  <span className="ae-review-field-label">{`Guard ${index + 1}`}</span>
                  <div className="mt-1 text-sm text-slate-700 space-y-1">
                    <div>{assignment.employeeName || assignment.employeeId}</div>
                    <div>{assignment.baseSalary ? `Base Pay: PHP ${Number(assignment.baseSalary).toLocaleString()}` : 'Base Pay: -'}</div>
                    <div>{`Contract: ${assignment.contractStartDate || '-'} to ${assignment.contractEndDate || '-'}`}</div>
                    <div>
                      {assignment.daysOfWeek.length > 0
                        ? `Schedule: ${assignment.daysOfWeek.map((day) => DAY_LABELS[day] || day).join(', ')} | ${assignment.shiftStart} - ${assignment.shiftEnd}`
                        : 'Schedule: -'}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </ReviewSection>
      </div>
    </div>
  );
}
