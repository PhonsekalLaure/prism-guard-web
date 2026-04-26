import { FaCheck } from 'react-icons/fa';

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
};

const formatBillingType = (value) => toProperCase(value || '').replace('-', ' ');

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

export default function Step5Review({ data }) {
  const sitesCount = data.sites.length;

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
      </div>
    </div>
  );
}
