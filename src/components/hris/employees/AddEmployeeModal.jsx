import { useState } from 'react';
import {
  FaTimes, FaArrowRight, FaArrowLeft, FaCheck,
} from 'react-icons/fa';

const STEPS = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Employment' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Review' },
];

export default function AddEmployeeModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const nextStep = () => { if (currentStep < 4) setCurrentStep(currentStep + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  return (
    <div className="ae-modal-overlay" onClick={handleClose}>
      <div className="ae-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ae-modal-header">
          <div>
            <h2>Add New Employee</h2>
            <p>Complete employee onboarding process</p>
          </div>
          <button className="ae-close-btn" onClick={handleClose}>
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
        <div className="ae-modal-body">
          {currentStep === 1 && <Step1Personal />}
          {currentStep === 2 && <Step2Employment />}
          {currentStep === 3 && <Step3Documents />}
          {currentStep === 4 && <Step4Review />}

          {/* Navigation */}
          <div className="ae-nav-buttons">
            {currentStep === 1 ? (
              <button type="button" className="ae-btn ae-btn-secondary" onClick={handleClose}>
                Cancel
              </button>
            ) : (
              <button type="button" className="ae-btn ae-btn-secondary" onClick={prevStep}>
                <FaArrowLeft /> Back
              </button>
            )}

            {currentStep < 4 ? (
              <button type="button" className="ae-btn ae-btn-primary" onClick={nextStep}>
                Next: {STEPS[currentStep]?.label} <FaArrowRight />
              </button>
            ) : (
              <button type="button" className="ae-btn ae-btn-success" onClick={handleClose}>
                <FaCheck /> Confirm &amp; Add Employee
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Step 1: Personal Info */
function Step1Personal() {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Basic Personal Information</h3>
      <div className="ae-form-grid">
        <FormField label="First Name *" type="text" required />
        <FormField label="Last Name *" type="text" required />
        <FormField label="Middle Name" type="text" />
        <FormField label="Suffix" type="select" options={['None', 'Jr.', 'Sr.', 'II', 'III']} />
        <FormField label="Date of Birth *" type="date" required hint="Age will be auto-calculated (18-45 required)" />
        <FormField label="Gender *" type="select" options={['Select gender', 'Male', 'Female', 'Others (Please specify)']} required />
        <FormField label="Height *" type="text" placeholder="e.g., 5 ft 8 in" required hint="Min: 5 ft 4 in (M), 5 ft 2 in (F)" />
        <FormField label="Weight (lbs)" type="number" />
        <FormField label="Blood Type *" type="select" options={['Select blood type', 'A', 'B', 'O', 'AB']} required />
        <FormField label="Marital Status *" type="select" options={['Select status', 'Single', 'Married', 'Widowed']} required />
        <FormField label="Citizenship *" type="text" value="Filipino" readOnly />
        <FormField label="Educational Attainment *" type="select" options={['Select level', 'High School', 'College Level', 'Degree Holder']} required />
        <FormField label="Mobile Number *" type="tel" placeholder="+63 912 345 6789" span2 required />
        <FormField label="Email Address *" type="email" span2 required />
        <FormField label="Residential Address *" type="textarea" span2 required />
        <FormField label="Emergency Contact Name *" type="text" required />
        <FormField label="Emergency Contact Number *" type="tel" placeholder="+63 912 345 6789" required />
        <FormField label="Relationship" type="text" placeholder="e.g., Spouse, Parent" />
      </div>
    </div>
  );
}

/* Step 2: Employment */
function Step2Employment() {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Employment Details</h3>
      <div className="ae-form-grid">
        <FormField label="Employee ID *" type="text" value="PRISM-2026-XXX" readOnly />
        <FormField label="Date Hired *" type="date" required />
        <FormField label="Position/Rank *" type="select" options={['Security Guard', 'Lady Guard', 'Security Officer I', 'Security Officer II', 'Detachment Commander']} required />
        <FormField label="Employment Status *" type="select" options={['Probationary', 'Regular', 'Contractual']} required />
        <FormField label="Initial Assignment" type="select" options={['Select Client/Location', 'FEU Institute of Tech', 'SM Mall of Asia', 'SM North Edsa', 'Floating Status (No Assignment)']} span2 />
        <FormField label="Basic Rate (Daily)" type="number" placeholder="0.00" prefix="₱" />
        <FormField label="COLA (Daily)" type="number" placeholder="0.00" prefix="₱" />
      </div>
    </div>
  );
}

/* Step 3: Documents */
function Step3Documents() {
  const docs = [
    '201 File / Bio-data',
    'Security License (LES)',
    'NBI Clearance',
    'Police Clearance',
    'Neuro-Psychiatric Test Result',
    'Drug Test Result',
  ];

  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">Requirements Checklist</h3>
      <div className="ae-checklist">
        {docs.map((doc) => (
          <label key={doc} className="ae-check-item">
            <input type="checkbox" />
            <span>{doc}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* Step 4: Review */
function Step4Review() {
  return (
    <div className="ae-step-content">
      <div className="ae-review-center">
        <div className="ae-review-icon">
          <FaCheck />
        </div>
        <h3>Ready to Add Employee</h3>
        <p>Please review all information before confirming.</p>
      </div>
    </div>
  );
}

/* Reusable form field */
function FormField({ label, type, options, placeholder, required, hint, value, readOnly, span2, prefix }) {
  const wrapClass = `ae-form-group ${span2 ? 'span-2' : ''}`;

  if (type === 'select') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <select className="ae-input" required={required} defaultValue={options?.[0]}>
          {options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className={wrapClass}>
        <label>{label}</label>
        <textarea className="ae-input ae-textarea" rows="2" placeholder={placeholder} required={required} />
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
          defaultValue={value}
          readOnly={readOnly}
        />
      </div>
      {hint && <p className="ae-hint">{hint}</p>}
    </div>
  );
}
