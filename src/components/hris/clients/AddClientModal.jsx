import { useState } from 'react';
import {
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaSpinner,
  FaUser,
  FaBuilding,
  FaFileContract,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import clientService from '@services/clientService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import GoogleAddressAutofill from '@hris-components/employees/GoogleAddressAutofill';

const STEPS = [
  { num: 1, label: 'Contact Info' },
  { num: 2, label: 'Company Details' },
  { num: 3, label: 'Contract' },
  { num: 4, label: 'Sites' },
  { num: 5, label: 'Review' },
];

const INITIAL_FORM_DATA = {
  firstName: '',
  lastName: '',
  middleName: '',
  suffix: '',
  mobile: '',
  email: '',
  company: '',
  billingAddress: '',
  contractStartDate: '',
  contractEndDate: '',
  ratePerGuard: '',
  billingType: 'semi_monthly',
  sites: [],
};

const toProperCase = (str) => {
  if (!str) return '';
  return str.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

const formatBillingType = (value) => toProperCase(value || '').replace('-', ' ');
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function AddClientModal({ isOpen, onClose, onSaved }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const { notification, showNotification, closeNotification } = useNotification();

  if (!isOpen) return null;

  const resetForm = () => {
    setCurrentStep(1);
    setIsSubmitting(false);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    resetForm();
    onClose();
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1: {
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.mobile.trim()) {
          showNotification('Please fill in all required contact information fields.', 'error');
          return false;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          showNotification('Please enter a valid email address.', 'error');
          return false;
        }

        if (formData.mobile.replace(/\D/g, '').length !== 10) {
          showNotification('Mobile number must be exactly 10 digits (excluding +63).', 'error');
          return false;
        }
        return true;
      }

      case 2: {
        if (!formData.company.trim() || !formData.billingAddress.trim()) {
          showNotification('Please fill in all required company information fields.', 'error');
          return false;
        }
        return true;
      }

      case 3: {
        if (!formData.contractStartDate || !formData.contractEndDate) {
          showNotification('Please select contract start and end dates.', 'error');
          return false;
        }

        if (new Date(formData.contractStartDate) >= new Date(formData.contractEndDate)) {
          showNotification('Contract end date must be after start date.', 'error');
          return false;
        }
        return true;
      }

      case 4: {
        for (let index = 0; index < formData.sites.length; index += 1) {
          const site = formData.sites[index];
          const hasAnyValue = [
            site.siteName,
            site.siteAddress,
            site.geofenceRadius,
          ].some((value) => String(value || '').trim() !== '');

          if (!hasAnyValue) continue;

          if (!site.siteName?.trim() || !site.siteAddress?.trim()) {
            showNotification(`Site ${index + 1} needs both a site name and address.`, 'error');
            return false;
          }

          if (site.latitude === '' || site.latitude == null || site.longitude === '' || site.longitude == null) {
            showNotification(`Please select a validated address for Site ${index + 1} from the Google suggestions.`, 'error');
            return false;
          }
        }

        return true;
      }

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep() && currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSite = () => {
    setFormData(prev => ({
      ...prev,
      sites: [
        ...prev.sites,
        {
          siteName: '',
          siteAddress: '',
          latitude: '',
          longitude: '',
          geofenceRadius: 50,
        },
      ],
    }));
  };

  const updateSite = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sites: prev.sites.map((site, i) => (i === index ? { ...site, [field]: value } : site)),
    }));
  };

  const removeSite = (index) => {
    setFormData(prev => ({
      ...prev,
      sites: prev.sites.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      await clientService.createClient(formData);
      showNotification('Client created successfully! An invitation email has been sent.', 'success');
      onSaved?.();
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Error creating client:', err);
      showNotification(err.response?.data?.error || 'Failed to create client. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div className="ae-modal-overlay" onClick={handleClose}>
        <div className="ae-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="ae-modal-header">
            <div>
              <h2>Add New Client</h2>
              <p>Complete client onboarding process</p>
            </div>
            <button className="ae-close-btn" onClick={handleClose} disabled={isSubmitting}>
              <FaTimes />
            </button>
          </div>

          <div className="ae-step-bar">
            <div className="ae-step-track">
              {STEPS.map((step, idx) => (
                <div key={step.num} className="ae-step-item">
                  <div
                    className={`ae-step-circle ${
                      step.num < currentStep ? 'completed' : step.num === currentStep ? 'active' : ''
                    }`}
                  >
                    {step.num < currentStep ? <FaCheck /> : step.num}
                  </div>
                  <span className={`ae-step-label ${step.num === currentStep ? 'active' : ''}`}>
                    {step.label}
                  </span>
                  {idx < STEPS.length - 1 && (
                    <div className={`ae-step-line ${step.num < currentStep ? 'completed' : ''}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form className="ae-modal-body" onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <Step1ContactInfo data={formData} onChange={handleChange} />}
            {currentStep === 2 && <Step2CompanyDetails data={formData} onChange={handleChange} />}
            {currentStep === 3 && <Step3Contract data={formData} onChange={handleChange} />}
            {currentStep === 4 && (
              <Step4Sites
                data={formData}
                onAddSite={addSite}
                onUpdateSite={updateSite}
                onRemoveSite={removeSite}
              />
            )}
            {currentStep === 5 && <Step5Review data={formData} />}

            <div className="ae-nav-buttons">
              {currentStep === 1 ? (
                <button type="button" className="ae-btn ae-btn-secondary" onClick={handleClose} disabled={isSubmitting}>
                  Cancel
                </button>
              ) : (
                <button type="button" className="ae-btn ae-btn-secondary" onClick={prevStep} disabled={isSubmitting}>
                  <FaArrowLeft /> Back
                </button>
              )}

              {currentStep < STEPS.length ? (
                <button type="button" className="ae-btn ae-btn-primary" onClick={nextStep} disabled={isSubmitting}>
                  Next: {STEPS[currentStep]?.label} <FaArrowRight />
                </button>
              ) : (
                <button type="button" className="ae-btn ae-btn-success" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                  {isSubmitting ? 'Submitting...' : 'Confirm & Add Client'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function Step1ContactInfo({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaUser className="inline mr-2" /> Contact Information
      </h3>
      <div className="ae-form-grid">
        <FormField
          label="First Name *"
          type="text"
          required
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
        />
        <FormField
          label="Last Name *"
          type="text"
          required
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
        />
        <FormField
          label="Middle Name"
          type="text"
          value={data.middleName}
          onChange={(e) => onChange('middleName', e.target.value)}
        />
        <FormField
          label="Suffix"
          type="text"
          placeholder="e.g. Jr., Sr., III"
          value={data.suffix}
          onChange={(e) => onChange('suffix', e.target.value)}
        />
        <FormField
          label="Email Address *"
          type="email"
          span2
          required
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
        />
        <FormField
          label="Mobile Number *"
          type="tel"
          span2
          required
          placeholder="912 345 6789"
          prefix="+63"
          value={data.mobile}
          onChange={(e) => onChange('mobile', e.target.value)}
        />
      </div>
    </div>
  );
}

function Step2CompanyDetails({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaBuilding className="inline mr-2" /> Company Details
      </h3>
      <div className="ae-form-grid">
        <FormField
          label="Company Name *"
          type="text"
          required
          span2
          value={data.company}
          onChange={(e) => onChange('company', e.target.value)}
        />
        <FormField
          label="Billing Address *"
          type="textarea"
          span2
          required
          placeholder="Enter billing address"
          value={data.billingAddress}
          onChange={(e) => onChange('billingAddress', e.target.value)}
        />
      </div>
    </div>
  );
}

function Step3Contract({ data, onChange }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaFileContract className="inline mr-2" /> Contract Details
      </h3>
      <div className="ae-form-grid">
        <FormField
          label="Contract Start Date *"
          type="date"
          required
          value={data.contractStartDate}
          onChange={(e) => onChange('contractStartDate', e.target.value)}
        />
        <FormField
          label="Contract End Date *"
          type="date"
          required
          value={data.contractEndDate}
          onChange={(e) => onChange('contractEndDate', e.target.value)}
        />
        <FormField
          label="Rate per Guard"
          type="number"
          placeholder="0.00"
          prefix="PHP"
          value={data.ratePerGuard}
          onChange={(e) => onChange('ratePerGuard', e.target.value)}
        />
        <FormField
          label="Billing Type"
          type="select"
          options={[
            { value: 'semi_monthly', label: 'Semi-Monthly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'weekly', label: 'Weekly' },
          ]}
          value={data.billingType}
          onChange={(e) => onChange('billingType', e.target.value)}
        />
      </div>
    </div>
  );
}

function Step4Sites({ data, onAddSite, onUpdateSite, onRemoveSite }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaMapMarkerAlt className="inline mr-2" /> Client Sites
      </h3>
      <p className="ae-hint" style={{ marginBottom: '0.9rem' }}>
        Add one or more deployment locations for this client. This step is optional.
      </p>

      <div className="ae-checklist" style={{ marginBottom: '0.9rem' }}>
        {data.sites.map((site, index) => (
          <div key={index} className="ae-check-item" style={{ display: 'block', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong>Site {index + 1}</strong>
              <button
                type="button"
                className="ae-btn ae-btn-secondary"
                style={{ flex: '0 0 auto', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
                onClick={() => onRemoveSite(index)}
              >
                Remove
              </button>
            </div>

            <div className="ae-form-grid">
              <FormField
                label="Site Name"
                type="text"
                span2
                value={site.siteName}
                onChange={(e) => onUpdateSite(index, 'siteName', e.target.value)}
              />
              <FormField
                label="Site Address"
                span2
                customInput={(
                  <>
                    <GoogleAddressAutofill
                      apiKey={GOOGLE_MAPS_KEY}
                      value={site.siteAddress}
                      onChange={(e) => {
                        onUpdateSite(index, 'siteAddress', e.target.value);
                        onUpdateSite(index, 'latitude', '');
                        onUpdateSite(index, 'longitude', '');
                      }}
                      className="ae-input"
                      placeholder="Search for a site address..."
                      onPlaceSelected={({ formattedAddress, lat, lng }) => {
                        onUpdateSite(index, 'siteAddress', formattedAddress);
                        onUpdateSite(index, 'latitude', lat);
                        onUpdateSite(index, 'longitude', lng);
                      }}
                    />
                    <p className="ae-hint">Select a suggested address so coordinates are saved automatically for geofencing.</p>
                  </>
                )}
              />
              <FormField
                label="Geofence Radius (m)"
                type="number"
                value={site.geofenceRadius}
                onChange={(e) => onUpdateSite(index, 'geofenceRadius', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="ae-btn ae-btn-secondary" onClick={onAddSite}>
        + Add Site
      </button>
    </div>
  );
}

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

function Step5Review({ data }) {
  const sitesCount = data.sites.length;

  return (
    <div className="ae-step-content">
      <div className="ae-review-banner">
        <div className="ae-review-banner-icon">
          <FaCheck />
        </div>
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
          <ReviewField label="Email" value={data.email} />
          <ReviewField label="Mobile" value={data.mobile ? `+63 ${data.mobile}` : ''} />
        </ReviewSection>

        <ReviewSection title="Company Details" icon="B">
          <ReviewField label="Company" value={toProperCase(data.company)} />
          <ReviewField label="Billing Address" value={data.billingAddress} />
        </ReviewSection>

        <ReviewSection title="Contract Terms" icon="T">
          <ReviewField label="Contract Start" value={data.contractStartDate} />
          <ReviewField label="Contract End" value={data.contractEndDate} />
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

function FormField({
  label,
  type,
  options,
  placeholder,
  required,
  hint,
  value,
  onChange,
  readOnly,
  span2,
  prefix,
  customInput,
}) {
  const wrapClass = `ae-form-group ${span2 ? 'span-2' : ''}`;

  if (customInput) {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        {customInput}
        {hint && <p className="ae-hint">{hint}</p>}
      </div>
    );
  }

  if (type === 'select') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <select className="ae-input" required={required} value={value} onChange={onChange}>
          {options?.map((opt) => {
            const isObj = typeof opt === 'object';
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return (
              <option key={val} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <textarea
          className="ae-input ae-textarea"
          rows="2"
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
        />
        {hint && <p className="ae-hint">{hint}</p>}
      </div>
    );
  }

  return (
    <div className={wrapClass}>
      <label>{label}</label>
      <div className={prefix ? 'ae-input-prefix-wrap' : undefined}>
        {prefix && <span className="ae-prefix">{prefix}</span>}
        <input
          type={type}
          className={`ae-input ${readOnly ? 'ae-readonly' : ''} ${prefix ? 'ae-has-prefix' : ''}`}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
        />
      </div>
      {hint && <p className="ae-hint">{hint}</p>}
    </div>
  );
}
