import { useState, useEffect } from 'react';
import { FaTimes, FaArrowRight, FaArrowLeft, FaCheck } from 'react-icons/fa';
import { FaSpinner } from 'react-icons/fa';
import employeeService from '@services/employeeService';
import clientService   from '@services/clientService';
import Notification    from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

// Step fragments
import Step1Personal   from './tabs/Step1Personal';
import Step2Employment from './tabs/Step2Employment';
import Step3Documents  from './tabs/Step3Documents';
import Step4Review     from './tabs/Step4Review';

const STEPS = [
  { num: 1, label: 'Personal Info' },
  { num: 2, label: 'Employment'    },
  { num: 3, label: 'Documents'     },
  { num: 4, label: 'Review'        },
];

const INITIAL_FORM = () => ({
  // Step 1
  firstName: '', lastName: '', middleName: '', suffix: '',
  dob: '', gender: '', height: '', civilStatus: '', citizenship: 'Filipino',
  educationalLevel: '', mobile: '', email: '',
  address: '', latitude: null, longitude: null,
  bloodType: '', placeOfBirth: '', provincialAddress: '',
  emergencyName: '', emergencyContact: '', emergencyRelationship: '',
  // Step 2
  employeeId: '', hireDate: new Date().toISOString().split('T')[0],
  position: 'Security Guard', employmentType: 'regular',
  initialSiteId: '', initialSiteLabel: '', basicRate: '',
  tinNumber: '', sssNumber: '', pagibigNumber: '', philhealthNumber: '',
  badgeNumber: '', licenseNumber: '', licenseExpiryDate: '',
  // Step 3
  documents: {}, contractEndDate: '', avatar: null,
});

export default function AddEmployeeWizard({ isOpen, onClose, onSaved, pageMode = false }) {
  const [currentStep,  setCurrentStep]  = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sites,        setSites]        = useState([]);
  const [formData,     setFormData]     = useState(INITIAL_FORM);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    if (!isOpen) return;
    if (!formData.employeeId) {
      employeeService.getNextEmployeeId()
        .then(id  => setFormData(prev => ({ ...prev, employeeId: id })))
        .catch(()  => setFormData(prev => ({ ...prev, employeeId: 'PG-00001' })));
    }
    clientService.getAllSitesList()
      .then(data => setSites(data || []))
      .catch(()  => setSites([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentStep(1);
    setIsSubmitting(false);
    setFormData(INITIAL_FORM);
    onClose();
  };

  const handleChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSiteChange = (siteId) => {
    if (!siteId) { setFormData(prev => ({ ...prev, initialSiteId: '', initialSiteLabel: '', basicRate: '' })); return; }
    const site  = sites.find(s => s.id === siteId);
    const label = site ? `${site.site_name} - ${site.clients?.company || 'Unknown Client'}` : '';
    setFormData(prev => ({ ...prev, initialSiteId: siteId, initialSiteLabel: label }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      const { firstName, lastName, dob, gender, height, civilStatus, educationalLevel, mobile, email, address, emergencyName, emergencyContact } = formData;
      if (!firstName || !lastName || !dob || !gender || !height || !civilStatus || !educationalLevel || !mobile || !email || !address || !emergencyName || !emergencyContact) {
        showNotification('Please fill in all required fields marked with *', 'error'); return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showNotification('Please enter a valid email address', 'error'); return false;
      }
      if (formData.latitude == null || formData.longitude == null) {
        showNotification('Please select a validated address from the suggestions so coordinates are saved.', 'error'); return false;
      }
      if (mobile.replace(/\D/g, '').length !== 10 || emergencyContact.replace(/\D/g, '').length !== 10) {
        showNotification('Mobile numbers must be exactly 10 digits (excluding +63)', 'error'); return false;
      }
    } else if (currentStep === 2) {
      if (!formData.hireDate || !formData.position || !formData.employmentType) {
        showNotification('Please fill in all required employment fields', 'error'); return false;
      }
    } else if (currentStep === 3) {
      if (!formData.documents?.contract) {
        showNotification('Employee onboarding requires an employment contract document.', 'error'); return false;
      }
    }
    return true;
  };

  const nextStep = () => { if (validateStep() && currentStep < 4) setCurrentStep(s => s + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep(s => s - 1); };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!formData.documents?.contract) {
        showNotification('Employee onboarding requires an employment contract document.', 'error');
        setIsSubmitting(false);
        return;
      }
      const payload = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'documents') {
          Object.keys(formData.documents).forEach(docKey => {
            if (docKey === 'deployment_order' && !formData.initialSiteId) return;
            if (formData.documents[docKey]) payload.append(`document_${docKey}`, formData.documents[docKey]);
          });
        } else if (key === 'avatar') {
          if (formData.avatar) payload.append('avatar', formData.avatar);
        } else if (key === 'mobile' || key === 'emergencyContact') {
          payload.append(key, `+63${formData[key]?.replace(/\D/g, '') || ''}`);
        } else {
          payload.append(key, formData[key] || '');
        }
      });
      await employeeService.createEmployee(payload);
      showNotification('Employee added successfully and welcome email sent!', 'success');
      onSaved?.();
      setTimeout(handleClose, 1500);
    } catch (err) {
      console.error(err);
      showNotification(err.response?.data?.error || 'Failed to add employee. Please check inputs.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Render ── */
  return (
    <>
      {notification && (
        <Notification message={notification.message} type={notification.type} onClose={closeNotification} />
      )}

      <div className={pageMode ? 'ap-page-wrapper' : 'ae-modal-overlay'} onClick={pageMode ? undefined : handleClose}>
      <div className={pageMode ? 'ap-page-container' : 'ae-modal-content'} onClick={pageMode ? undefined : (e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ae-modal-header">
          <div>
            <h2>Add New Employee</h2>
            <p>Complete employee onboarding process</p>
          </div>
          {!pageMode && (
            <button className="ae-close-btn" onClick={handleClose} disabled={isSubmitting}>
              <FaTimes />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        <div className="ae-step-bar">
          <div className="ae-step-track">
            {STEPS.map((step, idx) => (
              <div key={step.num} className="ae-step-item">
                <div className={`ae-step-circle ${step.num < currentStep ? 'completed' : step.num === currentStep ? 'active' : ''}`}>
                  {step.num < currentStep ? <FaCheck /> : step.num}
                </div>
                <span className={`ae-step-label ${step.num === currentStep ? 'active' : ''}`}>{step.label}</span>
                {idx < STEPS.length - 1 && (
                  <div className={`ae-step-line ${step.num < currentStep ? 'completed' : ''}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <form className="ae-modal-body" onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && <Step1Personal   data={formData} onChange={handleChange} />}
          {currentStep === 2 && <Step2Employment data={formData} onChange={handleChange} sites={sites} onSiteChange={handleSiteChange} />}
          {currentStep === 3 && <Step3Documents  data={formData} onChange={handleChange} />}
          {currentStep === 4 && <Step4Review     data={formData} />}

          {/* Navigation */}
          <div className="ae-nav-buttons">
            {currentStep === 1 ? (
              <button type="button" className="ae-btn ae-btn-secondary" onClick={handleClose} disabled={isSubmitting}>Cancel</button>
            ) : (
              <button type="button" className="ae-btn ae-btn-secondary" onClick={prevStep} disabled={isSubmitting}><FaArrowLeft /> Back</button>
            )}

            {currentStep < 4 ? (
              <button type="button" className="ae-btn ae-btn-primary" onClick={nextStep}>
                Next: {STEPS[currentStep]?.label} <FaArrowRight />
              </button>
            ) : (
              <button type="button" className="ae-btn ae-btn-success" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? <FaSpinner className="animate-spin" /> : <FaCheck />}{' '}
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
