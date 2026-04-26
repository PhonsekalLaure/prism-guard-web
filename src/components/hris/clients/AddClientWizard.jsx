import { useEffect, useState } from 'react';
import { FaArrowRight, FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';
import clientService from '@services/clientService';
import employeeService from '@services/employeeService';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';

import Step1ContactInfo    from './wizard/Step1ContactInfo';
import Step2CompanyDetails from './wizard/Step2CompanyDetails';
import Step3Contract       from './wizard/Step3Contract';
import Step4Sites          from './wizard/Step4Sites';
import Step5InitialDeployment from './wizard/Step5InitialDeployment';
import Step5Review         from './wizard/Step5Review';

const STEPS = [
  { num: 1, label: 'Contact Info'    },
  { num: 2, label: 'Company Details' },
  { num: 3, label: 'Contract'        },
  { num: 4, label: 'Sites'           },
  { num: 5, label: 'Initial Guard'   },
  { num: 6, label: 'Review'          },
];

const INITIAL_FORM_DATA = {
  firstName: '', lastName: '', middleName: '', suffix: '',
  mobile: '', email: '', company: '', billingAddress: '',
  contractStartDate: new Date().toISOString().split('T')[0], contractEndDate: '',
  ratePerGuard: '', billingType: 'semi_monthly', contractUrl: null,
  sites: [],
  initialDeployment: {
    siteIndex: '',
    employeeIds: [],
    employeeNames: [],
    baseSalary: '',
    contractStartDate: '',
    contractEndDate: '',
    daysOfWeek: [],
    shiftStart: '',
    shiftEnd: '',
    filters: {
      tallOnly: false,
      experiencedOnly: false,
    },
  },
};

export default function AddClientWizard({ isOpen, onClose, onSaved, pageMode = false }) {
  const [currentStep,  setCurrentStep]  = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [loadingDeployable, setLoadingDeployable] = useState(false);
  const [formData,     setFormData]     = useState(INITIAL_FORM_DATA);
  const { notification, showNotification, closeNotification } = useNotification();

  useEffect(() => {
    if (!isOpen || currentStep !== 5) return;

    const selectedSite = formData.initialDeployment.siteIndex === ''
      ? null
      : formData.sites[Number(formData.initialDeployment.siteIndex)];

    if (selectedSite?.latitude === '' || selectedSite?.latitude == null || selectedSite?.longitude === '' || selectedSite?.longitude == null) {
      setDeployableEmployees([]);
      return;
    }

    let cancelled = false;

    const loadDeployableEmployees = async () => {
      setLoadingDeployable(true);
      try {
        const employees = await employeeService.getDeployableEmployees({
          siteLatitude: selectedSite.latitude,
          siteLongitude: selectedSite.longitude,
          tallOnly: formData.initialDeployment.filters.tallOnly,
          experiencedOnly: formData.initialDeployment.filters.experiencedOnly,
        });
        if (!cancelled) {
          setDeployableEmployees(employees);
        }
      } catch (err) {
        if (!cancelled) {
          setDeployableEmployees([]);
          showNotification(err.response?.data?.error || 'Failed to load deployable guards.', 'error');
        }
      } finally {
        if (!cancelled) {
          setLoadingDeployable(false);
        }
      }
    };

    loadDeployableEmployees();

    return () => {
      cancelled = true;
    };
  }, [
    isOpen,
    currentStep,
    formData.sites,
    formData.initialDeployment.siteIndex,
    formData.initialDeployment.filters.tallOnly,
    formData.initialDeployment.filters.experiencedOnly,
    showNotification,
  ]);

  useEffect(() => {
    if (formData.initialDeployment.employeeIds.length === 0) return;
    const validEmployees = deployableEmployees.filter((employee) => formData.initialDeployment.employeeIds.includes(employee.id));
    if (validEmployees.length === formData.initialDeployment.employeeIds.length) return;

    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        employeeIds: validEmployees.map((employee) => employee.id),
        employeeNames: validEmployees.map((employee) => employee.name),
        baseSalary: '',
      },
    }));
  }, [deployableEmployees, formData.initialDeployment.employeeIds]);

  if (!isOpen) return null;

  const resetForm = () => { setCurrentStep(1); setIsSubmitting(false); setFormData(INITIAL_FORM_DATA); };

  const handleClose = () => { if (isSubmitting) return; resetForm(); onClose(); };

  const handleChange  = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const addSite       = () => setFormData((prev) => ({ ...prev, sites: [...prev.sites, { siteName: '', siteAddress: '', latitude: '', longitude: '', geofenceRadius: 50 }] }));
  const removeSite    = (i) => setFormData((prev) => {
    const nextSites = prev.sites.filter((_, idx) => idx !== i);
    const selectedSiteIndex = prev.initialDeployment.siteIndex === '' ? null : Number(prev.initialDeployment.siteIndex);
    let nextDeployment = prev.initialDeployment;

    if (selectedSiteIndex === i) {
      nextDeployment = {
        ...prev.initialDeployment,
        siteIndex: '',
        employeeIds: [],
        employeeNames: [],
      };
    } else if (selectedSiteIndex !== null && selectedSiteIndex > i) {
      nextDeployment = {
        ...prev.initialDeployment,
        siteIndex: String(selectedSiteIndex - 1),
      };
    }

    return {
      ...prev,
      sites: nextSites,
      initialDeployment: nextDeployment,
    };
  });
  const updateSite    = (i, field, value) => setFormData((prev) => ({ ...prev, sites: prev.sites.map((s, idx) => idx === i ? { ...s, [field]: value } : s) }));
  const handleDeploymentField = (field, value) => {
    setFormData((prev) => {
      const nextDeployment = {
        ...prev.initialDeployment,
        [field]: value,
      };

      if (field === 'siteIndex') {
        nextDeployment.employeeIds = [];
        nextDeployment.employeeNames = [];
        nextDeployment.baseSalary = '';
        nextDeployment.contractStartDate = prev.initialDeployment.contractStartDate || prev.contractStartDate || '';
        nextDeployment.contractEndDate = prev.initialDeployment.contractEndDate || prev.contractEndDate || '';
      }

      return {
        ...prev,
        initialDeployment: nextDeployment,
      };
    });
  };
  const handleDeploymentFilterChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        filters: {
          ...prev.initialDeployment.filters,
          [field]: value,
        },
      },
    }));
  };
  const handleDeploymentEmployeeSelect = (employee) => {
    setFormData((prev) => ({
      ...prev,
      initialDeployment: (() => {
        const isSelected = prev.initialDeployment.employeeIds.includes(employee.id);
        const nextEmployeeIds = isSelected
          ? prev.initialDeployment.employeeIds.filter((id) => id !== employee.id)
          : [...prev.initialDeployment.employeeIds, employee.id];
        const nextEmployeeNames = nextEmployeeIds
          .map((id) => {
            if (id === employee.id) return employee.name;
            const matchedEmployee = deployableEmployees.find((item) => item.id === id);
            return matchedEmployee?.name || prev.initialDeployment.employeeNames[prev.initialDeployment.employeeIds.indexOf(id)] || id;
          });

        return {
          ...prev.initialDeployment,
          employeeIds: nextEmployeeIds,
          employeeNames: nextEmployeeNames,
          baseSalary: prev.initialDeployment.baseSalary || employee.base_salary || '',
          contractStartDate: prev.initialDeployment.contractStartDate || prev.contractStartDate || '',
          contractEndDate: prev.initialDeployment.contractEndDate || prev.contractEndDate || '',
        };
      })(),
    }));
  };
  const toggleDeploymentScheduleDay = (dayValue) => {
    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        daysOfWeek: prev.initialDeployment.daysOfWeek.includes(dayValue)
          ? prev.initialDeployment.daysOfWeek.filter((day) => day !== dayValue)
          : [...prev.initialDeployment.daysOfWeek, dayValue].sort((a, b) => a - b),
      },
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.mobile.trim()) {
          showNotification('Please fill in all required contact information fields.', 'error'); return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          showNotification('Please enter a valid email address.', 'error'); return false;
        }
        if (formData.mobile.replace(/\D/g, '').length !== 10) {
          showNotification('Mobile number must be exactly 10 digits (excluding +63).', 'error'); return false;
        }
        return true;
      case 2:
        if (!formData.company.trim() || !formData.billingAddress.trim()) {
          showNotification('Please fill in all required company information fields.', 'error'); return false;
        }
        return true;
      case 3:
        if (!formData.contractStartDate || !formData.contractEndDate) {
          showNotification('Please select contract start and end dates.', 'error'); return false;
        }
        if (new Date(formData.contractStartDate) >= new Date(formData.contractEndDate)) {
          showNotification('Contract end date must be after start date.', 'error'); return false;
        }
        return true;
      case 4:
        for (let i = 0; i < formData.sites.length; i++) {
          const site = formData.sites[i];
          const hasAny = [site.siteName, site.siteAddress, site.geofenceRadius].some((v) => String(v || '').trim() !== '');
          if (!hasAny) continue;
          if (!site.siteName?.trim() || !site.siteAddress?.trim()) {
            showNotification(`Site ${i + 1} needs both a site name and address.`, 'error'); return false;
          }
          if (site.latitude === '' || site.latitude == null || site.longitude === '' || site.longitude == null) {
            showNotification(`Please select a validated address for Site ${i + 1} from the Google suggestions.`, 'error'); return false;
          }
        }
        return true;
      case 5:
        if (formData.initialDeployment.employeeIds.length === 0) {
          return true;
        }
        if (formData.initialDeployment.siteIndex === '') {
          showNotification('Please select the deployment site for the guard.', 'error'); return false;
        }
        if (!formData.initialDeployment.baseSalary) {
          showNotification('Please set the guard base pay.', 'error'); return false;
        }
        if (!formData.initialDeployment.contractStartDate || !formData.initialDeployment.contractEndDate) {
          showNotification('Please set the assignment contract start and end dates.', 'error'); return false;
        }
        if (formData.initialDeployment.daysOfWeek.length === 0) {
          showNotification('Please select at least one schedule day for the initial deployment.', 'error'); return false;
        }
        if (!formData.initialDeployment.shiftStart || !formData.initialDeployment.shiftEnd) {
          showNotification('Please set both shift start and shift end for the initial deployment.', 'error'); return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => { if (validateStep() && currentStep < STEPS.length) setCurrentStep((p) => p + 1); };
  const prevStep = () => { if (currentStep > 1) setCurrentStep((p) => p - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        initialDeployment: formData.initialDeployment.employeeIds.length > 0
          ? {
            siteIndex: Number(formData.initialDeployment.siteIndex),
            employeeIds: formData.initialDeployment.employeeIds,
            baseSalary: formData.initialDeployment.baseSalary,
            contractStartDate: formData.initialDeployment.contractStartDate,
            contractEndDate: formData.initialDeployment.contractEndDate,
            daysOfWeek: formData.initialDeployment.daysOfWeek,
            shiftStart: formData.initialDeployment.shiftStart,
            shiftEnd: formData.initialDeployment.shiftEnd,
          }
          : null,
      };
      const requestData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'contractUrl') {
          if (value instanceof File) {
            requestData.append(key, value);
          }
          return;
        }

        if (key === 'sites' || key === 'initialDeployment') {
          requestData.append(key, JSON.stringify(value));
          return;
        }

        requestData.append(key, value == null ? '' : String(value));
      });

      await clientService.createClient(requestData);
      showNotification('Client created successfully! An invitation email has been sent.', 'success');
      onSaved?.();
      setTimeout(() => { resetForm(); onClose(); }, 1200);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to create client. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Layout classes: identical approach to AddEmployeeWizard ── */
  const outerClass   = pageMode ? 'ap-page-wrapper'    : 'ae-modal-overlay';
  const contentClass = pageMode ? 'ap-page-container'  : 'ae-modal-content';

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}

      <div className={outerClass} onClick={pageMode ? undefined : handleClose}>
        <div className={contentClass} onClick={pageMode ? undefined : (e) => e.stopPropagation()}>

          {/* Header */}
          <div className="ae-modal-header">
            <div>
              <h2>Add New Client</h2>
              <p>Complete client onboarding process</p>
            </div>
            {!pageMode && (
              <button className="ae-close-btn" onClick={handleClose} disabled={isSubmitting}>✕</button>
            )}
          </div>

          {/* Step bar */}
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

          {/* Step body */}
          <form className="ae-modal-body" onSubmit={(e) => e.preventDefault()}>
            {currentStep === 1 && <Step1ContactInfo    data={formData} onChange={handleChange} />}
            {currentStep === 2 && <Step2CompanyDetails data={formData} onChange={handleChange} />}
            {currentStep === 3 && <Step3Contract       data={formData} onChange={handleChange} />}
            {currentStep === 4 && (
              <Step4Sites
                data={formData}
                onAddSite={addSite}
                onUpdateSite={updateSite}
                onRemoveSite={removeSite}
              />
            )}
            {currentStep === 5 && (
              <Step5InitialDeployment
                data={formData}
                deployableEmployees={deployableEmployees}
                loadingDeployable={loadingDeployable}
                onDeploymentField={handleDeploymentField}
                onFilterChange={handleDeploymentFilterChange}
                onSelectEmployee={handleDeploymentEmployeeSelect}
                toggleScheduleDay={toggleDeploymentScheduleDay}
              />
            )}
            {currentStep === 6 && <Step5Review data={formData} />}

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
