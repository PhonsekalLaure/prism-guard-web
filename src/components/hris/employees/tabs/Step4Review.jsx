import { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const DOC_LABELS = {
  valid_id:                   'Valid ID',
  resume:                     'Resume',
  personal_information_sheet: 'Personal Information Sheet',
  barangay:                   'Barangay Clearance',
  police:                     'Police Clearance',
  nbi:                        'NBI Clearance',
  neuro:                      'Neuro-Psychiatric Exam',
  drugtest:                   'Drug Test',
  sg_license:                 'SG License (LTOPF)',
  contract:                   'Employee Contract',
  deployment_order:           'Deployment Order',
};

const toProperCase = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

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
      <span className={`ae-review-field-value ${highlight ? 'highlight' : ''}`}>{value || '—'}</span>
    </div>
  );
}

export default function Step4Review({ data }) {
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (data.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(data.avatar);
    } else {
      setAvatarPreview(null);
    }
  }, [data.avatar]);

  const isComplete    = data.firstName && data.lastName && data.employeeId;
  const docsAttached  = Object.keys(data.documents).filter(k => data.documents[k]);

  return (
    <div className="ae-step-content">
      {/* Header Banner */}
      <div className="ae-review-banner">
        {avatarPreview ? (
          <div className="ae-review-banner-avatar"><img src={avatarPreview} alt="Avatar" /></div>
        ) : (
          <div className="ae-review-banner-icon"><FaCheck /></div>
        )}
        <div>
          <h3 className="ae-review-banner-title">Ready to Add Employee</h3>
          <p className="ae-review-banner-sub">Review all information carefully before confirming.</p>
        </div>
        <div className="ae-review-banner-id">
          <span className="ae-review-banner-id-label">Employee ID</span>
          <span className="ae-review-banner-id-value">{data.employeeId}</span>
        </div>
      </div>

      <div className="ae-review-grid">
        <ReviewSection title="Personal Identity" icon="👤">
          <ReviewField label="Full Name"      value={`${toProperCase(data.firstName)} ${toProperCase(data.middleName || '')} ${toProperCase(data.lastName)}`.trim()} />
          <ReviewField label="Date of Birth"  value={data.dob} />
          <ReviewField label="Gender"         value={data.gender} />
          <ReviewField label="Marital Status" value={data.civilStatus} />
          <ReviewField label="Height"         value={data.height ? `${data.height} cm` : null} />
          <ReviewField label="Education"      value={data.educationalLevel} />
        </ReviewSection>

        <ReviewSection title="Contact & Location" icon="📞">
          <ReviewField label="Mobile"           value={data.mobile ? `+63 ${data.mobile}` : null} />
          <ReviewField label="Email"            value={data.email} />
          <ReviewField label="Address"          value={data.address} />
          <ReviewField label="Emergency Contact" value={data.emergencyName} />
          <ReviewField label="Emergency Number" value={data.emergencyContact ? `+63 ${data.emergencyContact}` : null} />
          <ReviewField label="Relationship"     value={data.emergencyRelationship} />
        </ReviewSection>

        <ReviewSection title="Employment Details" icon="💼">
          <ReviewField label="Position"      value={data.position} />
          <ReviewField label="Type"          value={data.employmentType === 'regular' ? 'Regular' : 'Reliever'} />
          <ReviewField label="Date Hired"    value={data.hireDate} />
          <ReviewField label="Assignment"    value={data.initialSiteLabel || 'Floating'} />
          <ReviewField label="Contract End"  value={data.contractEndDate || null} />
          <ReviewField label="Basic Rate"    value={data.basicRate ? `₱${parseFloat(data.basicRate).toLocaleString()}` : null} highlight={!!data.basicRate} />
          <ReviewField label="Pay Frequency" value="Semi-monthly" />
        </ReviewSection>

        <ReviewSection title="Government IDs & Credentials" icon="🪪">
          <ReviewField label="TIN"            value={data.tinNumber} />
          <ReviewField label="SSS Number"     value={data.sssNumber} />
          <ReviewField label="Pag-IBIG"       value={data.pagibigNumber} />
          <ReviewField label="PhilHealth"     value={data.philhealthNumber} />
          <ReviewField label="License Number" value={data.licenseNumber} />
          <ReviewField label="Badge Number"   value={data.badgeNumber} />
          <ReviewField label="License Expiry" value={data.licenseExpiryDate} />
        </ReviewSection>
      </div>

      {/* Documents Summary */}
      <div className="ae-review-docs">
        <div className="ae-review-docs-header">
          <span>📎</span>
          <span>Attached Documents ({docsAttached.length})</span>
        </div>
        {docsAttached.length > 0 ? (
          <div className="ae-review-docs-list">
            {docsAttached.map(docId => (
              <span key={docId} className="ae-review-doc-tag">
                <FaCheck /> {DOC_LABELS[docId] || docId}
              </span>
            ))}
          </div>
        ) : (
          <p className="ae-review-docs-empty"><FaTimes /> Required documents are missing, including the employee contract.</p>
        )}
      </div>

      {!isComplete && (
        <div className="ae-review-warning">
          <FaTimes />
          <span>Required basic fields are missing. Please go back to complete all required fields.</span>
        </div>
      )}
    </div>
  );
}
