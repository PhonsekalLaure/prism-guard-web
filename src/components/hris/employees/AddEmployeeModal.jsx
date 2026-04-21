import { useState, useEffect } from 'react';
import {
  FaTimes, FaArrowRight, FaArrowLeft, FaCheck,
} from 'react-icons/fa';
import employeeService from '@services/employeeService';
import clientService from '@services/clientService';
import { AddressAutofill } from '@mapbox/search-js-react';
import { FaSpinner } from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

const STEPS = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Employment' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Review' },
];

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_API_TOKEN;

const toProperCase = (str) => {
  if (!str) return str;
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { notification, showNotification, closeNotification } = useNotification();
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    firstName: '', lastName: '', middleName: '', suffix: '', dob: '', 
    gender: '', height: '', civilStatus: '', citizenship: 'Filipino', 
    educationalLevel: '', mobile: '', email: '', 
    address: '', latitude: null, longitude: null, 
    emergencyName: '', emergencyContact: '', emergencyRelationship: '',
    // Step 2: Employment
    employeeId: '', hireDate: new Date().toISOString().split('T')[0], position: 'Security Guard', employmentType: 'regular',
    tinNumber: '', sssNumber: '', pagibigNumber: '', philhealthNumber: '',
    // Step 3: Documents
    documents: {},
    avatar: null
  });

  useEffect(() => {
    if (isOpen) {
      if (!formData.employeeId) {
        employeeService.getNextEmployeeId()
          .then(id => setFormData(prev => ({ ...prev, employeeId: id })))
          .catch(err => {
            console.error(err);
            setFormData(prev => ({ ...prev, employeeId: 'PG-00001' }));
          });
      }
      async function loadClients() {
        try {
          const data = await clientService.getAllClients();
          setClients(data || []);
        } catch (err) {
          console.error("Failed to load clients:", err);
        }
      }
      loadClients();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(1);
    setIsSubmitting(false);
    setFormData({
      firstName: '', lastName: '', middleName: '', dob: '', 
      gender: '', height: '', civilStatus: '', citizenship: 'Filipino', 
      educationalLevel: '', mobile: '', email: '', 
      address: '', latitude: null, longitude: null, 
      emergencyName: '', emergencyContact: '', emergencyRelationship: '',
      employeeId: '', hireDate: new Date().toISOString().split('T')[0], position: 'Security Guard', employmentType: 'regular',
      initialAssignment: 'Floating Status (No Assignment)', basicRate: '', 
      tinNumber: '', sssNumber: '', pagibigNumber: '', philhealthNumber: '',
      documents: {},
      avatar: null
    });
    onClose();
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const { firstName, lastName, dob, gender, height, civilStatus, educationalLevel, mobile, email, address } = formData;
      if (!firstName || !lastName || !dob || !gender || !height || !civilStatus || !educationalLevel || !mobile || !email || !address) {
        showNotification('Please fill in all required fields marked with *', 'error');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
      }
      if (mobile.replace(/\D/g, '').length !== 10 || formData.emergencyContact.replace(/\D/g, '').length !== 10) {
        showNotification('Mobile numbers must be exactly 10 digits (excluding +63)', 'error');
        return false;
      }
    } else if (currentStep === 2) {
      const { hireDate, position, employmentType } = formData;
      if (!hireDate || !position || !employmentType) {
        showNotification('Please fill in all required employment fields', 'error');
        return false;
      }
    }
    return true;
  };

  const nextStep = async () => { 
    if (validateStep()) {
      if (currentStep === 1 && !formData.latitude && formData.address) {
        // Fallback geocoding if user typed but didn't click
        try {
          const res = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(formData.address)}.json?access_token=${MAPBOX_TOKEN}&country=ph`);
          const data = await res.json();
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].geometry.coordinates;
            setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }));
          }
        } catch(e) { console.error('Geocoding fallback failed', e); }
      }
      if (currentStep < 4) setCurrentStep(currentStep + 1); 
    }
  };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          // Append each file with a specific field name for backend mapping
          Object.keys(formData.documents).forEach(docKey => {
            if (formData.documents[docKey]) {
              payload.append(`document_${docKey}`, formData.documents[docKey]);
            }
          });
        } else if (key === 'avatar') {
          if (formData.avatar) {
            payload.append('avatar', formData.avatar);
          }
        } else if (key === 'mobile' || key === 'emergencyContact') {
          // Ensure +63 prefix is present in payload
          payload.append(key, `+63${formData[key]?.replace(/\D/g, '') || ''}`);
        } else {
          payload.append(key, formData[key] || '');
        }
      });

      await employeeService.createEmployee(payload);
      showNotification('Employee added successfully and welcome email sent!', 'success');
      setTimeout(handleClose, 1500);
    } catch (err) {
      console.error("Failed to add employee:", err);
      showNotification(err.response?.data?.error || 'Failed to add employee. Please check inputs.', 'error');
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

        {/* Header */}
        <div className="ae-modal-header">
          <div>
            <h2>Add New Employee</h2>
            <p>Complete employee onboarding process</p>
          </div>
          <button className="ae-close-btn" onClick={handleClose} disabled={isSubmitting}>
            <FaTimes />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="ae-step-bar">
          <div className="ae-step-track">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="ae-step-item">
                <div className={`ae-step-circle ${
                  step.num < currentStep ? 'completed' :
                  step.num === currentStep ? 'active' : ''
                }`}>
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

        {/* Step Content */}
        <form className="ae-modal-body" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && <Step1Personal data={formData} onChange={handleChange} />}
          {currentStep === 2 && <Step2Employment data={formData} onChange={handleChange} clients={clients} />}
          {currentStep === 3 && <Step3Documents data={formData} onChange={handleChange} />}
          {currentStep === 4 && <Step4Review data={formData} />}

          {/* Navigation */}
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

            {currentStep < 4 ? (
              <button type="button" className="ae-btn ae-btn-primary" onClick={nextStep}>
                Next: {STEPS[currentStep]?.label} <FaArrowRight />
              </button>
            ) : (
              <button type="button" className="ae-btn ae-btn-success" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />} 
                {isSubmitting ? 'Submitting...' : 'Confirm & Add Employee'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

/* Step 1: Personal Information */
function Step1Personal({ data, onChange }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (data.avatar) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(data.avatar);
    } else {
      setPreview(null);
    }
  }, [data.avatar]);

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Personal Information</h3>
      
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative transition-all group-hover:border-blue-400">
            {preview ? (
              <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-400 text-center">
                <span className="text-xl block">+</span>
                <span className="text-[10px] uppercase font-bold">Photo</span>
              </div>
            )}
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept="image/*"
              onChange={(e) => onChange('avatar', e.target.files[0])}
            />
          </div>
          {preview && (
            <button 
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-sm hover:bg-red-600"
              onClick={() => onChange('avatar', null)}
            >
              ×
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest font-bold">Employee Profile Picture</p>
      </div>

      <div className="ae-form-grid">
        <FormField label="First Name *" type="text" required value={data.firstName} onChange={(e) => onChange('firstName', e.target.value)} />
        <FormField label="Last Name *" type="text" required value={data.lastName} onChange={(e) => onChange('lastName', e.target.value)} />
        <FormField label="Middle Name" type="text" value={data.middleName} onChange={(e) => onChange('middleName', e.target.value)} />
        <FormField label="Suffix" type="text" value={data.suffix} onChange={(e) => onChange('suffix', e.target.value)} />
        <FormField label="Date of Birth *" type="date" required hint="Age will be auto-calculated (18-45 required)" value={data.dob} onChange={(e) => onChange('dob', e.target.value)} />
        <FormField label="Gender *" type="select" options={['Select gender', 'Male', 'Female']} required value={data.gender} onChange={(e) => onChange('gender', e.target.value)} />
        <FormField label="Height *" type="text" placeholder="e.g., 170 cm" required hint={"Min: 163 cm / 5'4\" (M), 157 cm / 5'2\" (F)"} value={data.height} onChange={(e) => onChange('height', e.target.value)} />
        <FormField label="Marital Status *" type="select" options={['Select status', 'Single', 'Married', 'Widowed']} required value={data.civilStatus} onChange={(e) => onChange('civilStatus', e.target.value)} />
        <FormField label="Citizenship *" type="text" value="Filipino" readOnly />
        <FormField label="Educational Attainment *" type="select" options={['Select level', 'High School', 'College Level', 'Degree Holder']} required value={data.educationalLevel} onChange={(e) => onChange('educationalLevel', e.target.value)} />
        <FormField label="Mobile Number *" type="tel" placeholder="912 345 6789" prefix="+63" span2 required value={data.mobile} onChange={(e) => onChange('mobile', e.target.value)} />
        <FormField label="Email Address *" type="email" span2 required value={data.email} onChange={(e) => onChange('email', e.target.value)} />

        <div className="ae-form-group span-2">
          <label>Residential Address *</label>
          <AddressAutofill
            accessToken={MAPBOX_TOKEN}
            onRetrieve={(res) => {
              const feature = res.features[0];
              if (feature) {
                 const [lng, lat] = feature.geometry.coordinates;
                 const fullAddress = feature.properties?.full_address || feature.place_name || feature.properties?.name || '';
                 onChange('latitude', lat);
                 onChange('longitude', lng);
                 // We use a small timeout to let the internal AddressAutofill "magic" finish 
                 // before we force our full_address into the controlled state.
                 setTimeout(() => {
                   onChange('address', fullAddress);
                 }, 50);
              }
            }}
          >
            <input
              type="text"
              autoComplete="address-line1"
              className="ae-input"
              placeholder="Start typing your address..."
              required
              value={data.address}
              onChange={(e) => {
                onChange('address', e.target.value);
                // If they clear or change the address manually after selecting, we might want to clear lat/lng
                // But for now, we leave it simple.
              }}
            />
          </AddressAutofill>
          <p className="ae-hint">Select a validated address to automatically save geographical coordinates for deployment distance calculations.</p>
        </div>

        <FormField label="Emergency Contact Name *" type="text" required value={data.emergencyName} onChange={(e) => onChange('emergencyName', e.target.value)} />
        <FormField label="Emergency Contact Number *" type="tel" placeholder="912 345 6789" prefix="+63" required value={data.emergencyContact} onChange={(e) => onChange('emergencyContact', e.target.value)} />
        <FormField label="Relationship" type="text" placeholder="e.g., Spouse, Parent" value={data.emergencyRelationship} onChange={(e) => onChange('emergencyRelationship', e.target.value)} />
      </div>
    </div>
  );
}

/* Step 2: Employment */
function Step2Employment({ data, onChange, clients }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Employment Details</h3>
      <div className="ae-form-grid">
        <FormField label="Employee ID *" type="text" value={data.employeeId} readOnly />
        <FormField label="Date Hired *" type="date" required value={data.hireDate} onChange={(e) => onChange('hireDate', e.target.value)} />
        <FormField label="Position/Rank *" type="select" options={['Security Guard', 'Lady Guard', 'Security Officer I', 'Security Officer II', 'Detachment Commander']} required value={data.position} onChange={(e) => onChange('position', e.target.value)} />
        <FormField label="Employment Status *" type="select" options={[{label: 'Regular', value: 'regular'}, {label: 'Reliever', value: 'reliever'}]} required value={data.employmentType} onChange={(e) => onChange('employmentType', e.target.value)} />
        <FormField label="Initial Assignment" type="select" options={['Floating Status (No Assignment)', ...clients.map(c => c.company)]} span2 value={data.initialAssignment} onChange={(e) => onChange('initialAssignment', e.target.value)} />
        <FormField label="Basic Rate (Monthly)" type="number" placeholder="0.00" prefix="₱" value={data.basicRate} onChange={(e) => onChange('basicRate', e.target.value)} />
        <FormField label="Pay Frequency" type="text" value="Semi-monthly" readOnly />
        
        <div className="ae-form-group span-2 mt-2">
          <h4 className="text-sm font-bold text-gray-700 border-b pb-2">Government IDs</h4>
        </div>
        <FormField label="TIN Number" type="text" placeholder="000-000-000-000" value={data.tinNumber} onChange={(e) => onChange('tinNumber', e.target.value)} />
        <FormField label="SSS Number" type="text" placeholder="00-0000000-0" value={data.sssNumber} onChange={(e) => onChange('sssNumber', e.target.value)} />
        <FormField label="Pag-IBIG Number" type="text" placeholder="0000-0000-0000" value={data.pagibigNumber} onChange={(e) => onChange('pagibigNumber', e.target.value)} />
        <FormField label="PhilHealth Number" type="text" placeholder="00-000000000-0" value={data.philhealthNumber} onChange={(e) => onChange('philhealthNumber', e.target.value)} />
      </div>
    </div>
  );
}

/* Step 3: Documents */
function Step3Documents({ data, onChange }) {
  const docs = [
    { id: 'biodata', label: '201 File / Bio-data' },
    { id: 'les', label: 'Security License (LES)' },
    { id: 'nbi', label: 'NBI Clearance' },
    { id: 'police', label: 'Police Clearance' },
    { id: 'neuro', label: 'Neuro-Psychiatric Test Result' },
    { id: 'drugtest', label: 'Drug Test Result' },
  ];

  const handleFileChange = (id, file) => {
    onChange('documents', { ...data.documents, [id]: file });
  };

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Requirements & File Uploads</h3>
      <p className="ae-hint mb-4">Attach image or PDF files for the mandatory clearances.</p>
      <div className="ae-checklist">
        {docs.map((doc) => {
          const file = data.documents[doc.id];
          return (
            <div key={doc.id} className="ae-check-item flex items-center justify-between">
              <span className="font-semibold text-sm">{doc.label}</span>
              <div className="flex items-center gap-2">
                {file && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded truncate max-w-[150px]">{file.name}</span>}
                <label className="ae-btn ae-btn-secondary !py-1 !px-3 !text-xs cursor-pointer m-0 inline-block">
                  {file ? 'Change' : 'Upload'}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*,.pdf" 
                    onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Step 4: Review */
function Step4Review({ data }) {
  const isComplete = data.firstName && data.lastName && data.employeeId;
  const docsAttached = Object.keys(data.documents).filter(k => data.documents[k]);
  const docLabels = {
    biodata: '201 File / Bio-data',
    les: 'Security License (LES)',
    nbi: 'NBI Clearance',
    police: 'Police Clearance',
    neuro: 'Neuro-Psychiatric Test',
    drugtest: 'Drug Test Result',
  };

  const ReviewSection = ({ title, icon, children }) => (
    <div className="ae-review-section">
      <div className="ae-review-section-header">
        <span className="ae-review-section-icon">{icon}</span>
        <span className="ae-review-section-title">{title}</span>
      </div>
      <div className="ae-review-section-body">{children}</div>
    </div>
  );

  const ReviewField = ({ label, value, highlight }) => (
    <div className="ae-review-field">
      <span className="ae-review-field-label">{label}</span>
      <span className={`ae-review-field-value ${highlight ? 'highlight' : ''}`}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="ae-step-content">
      {/* Header Banner */}
      <div className="ae-review-banner">
        <div className="ae-review-banner-icon">
          <FaCheck />
        </div>
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
        {/* Identity */}
        <ReviewSection title="Personal Identity" icon="👤">
          <ReviewField label="Full Name" value={`${toProperCase(data.firstName)} ${toProperCase(data.middleName || '')} ${toProperCase(data.lastName)}`.trim()} />
          <ReviewField label="Date of Birth" value={data.dob} />
          <ReviewField label="Gender" value={data.gender} />
          <ReviewField label="Marital Status" value={data.civilStatus} />
          <ReviewField label="Height" value={data.height ? `${data.height} cm` : null} />
          <ReviewField label="Education" value={data.educationalLevel} />
        </ReviewSection>

        {/* Contact */}
        <ReviewSection title="Contact & Location" icon="📞">
          <ReviewField label="Mobile" value={data.mobile ? `+63 ${data.mobile}` : null} />
          <ReviewField label="Email" value={data.email} />
          <ReviewField label="Address" value={data.address} />
          <ReviewField label="Emergency Contact" value={data.emergencyName} />
          <ReviewField label="Emergency Number" value={data.emergencyContact ? `+63 ${data.emergencyContact}` : null} />
          <ReviewField label="Relationship" value={data.emergencyRelationship} />
        </ReviewSection>

        {/* Employment */}
        <ReviewSection title="Employment Details" icon="💼">
          <ReviewField label="Position" value={data.position} />
          <ReviewField label="Type" value={data.employmentType === 'regular' ? 'Regular' : 'Reliever'} />
          <ReviewField label="Date Hired" value={data.hireDate} />
          <ReviewField label="Assignment" value={data.initialAssignment || 'Floating'} />
          <ReviewField label="Basic Rate" value={data.basicRate ? `₱${parseFloat(data.basicRate).toLocaleString()}` : null} highlight={!!data.basicRate} />
          <ReviewField label="Pay Frequency" value="Semi-monthly" />
        </ReviewSection>

        {/* Gov IDs */}
        <ReviewSection title="Government IDs" icon="🪪">
          <ReviewField label="TIN" value={data.tinNumber} />
          <ReviewField label="SSS Number" value={data.sssNumber} />
          <ReviewField label="Pag-IBIG" value={data.pagibigNumber} />
          <ReviewField label="PhilHealth" value={data.philhealthNumber} />
        </ReviewSection>
      </div>

      {/* Documents */}
      <div className="ae-review-docs">
        <div className="ae-review-docs-header">
          <span>📎</span>
          <span>Attached Documents ({docsAttached.length})</span>
        </div>
        {docsAttached.length > 0 ? (
          <div className="ae-review-docs-list">
            {docsAttached.map(docId => (
              <span key={docId} className="ae-review-doc-tag">
                <FaCheck /> {docLabels[docId] || docId}
              </span>
            ))}
          </div>
        ) : (
          <p className="ae-review-docs-empty"><FaTimes /> No documents attached — this is optional but recommended.</p>
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

/* Reusable form field */
function FormField({ label, type, options, placeholder, required, hint, value, onChange, readOnly, span2, prefix }) {
  const wrapClass = `ae-form-group ${span2 ? 'span-2' : ''}`;

  if (type === 'select') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <select className="ae-input" required={required} value={value} onChange={onChange}>
          {options?.map((opt) => {
            const isObj = typeof opt === 'object';
            const val = isObj ? opt.value : opt;
            const lbl = isObj ? opt.label : opt;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <textarea className="ae-input ae-textarea" rows="2" placeholder={placeholder} required={required} value={value} onChange={onChange} />
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
