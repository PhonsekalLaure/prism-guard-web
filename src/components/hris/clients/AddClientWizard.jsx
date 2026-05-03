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
import Step6Review         from './wizard/Step6Review';

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
  avatar: null,
  contractStartDate: new Date().toISOString().split('T')[0], contractEndDate: '',
  ratePerGuard: '', billingType: 'semi_monthly', contractUrl: null,
  sites: [],
  initialDeployment: {
    siteIndex: '',
    assignments: [],
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
    if (formData.initialDeployment.assignments.length === 0) return;
    const validEmployeeIds = new Set(deployableEmployees.map((employee) => employee.id));
    const nextAssignments = formData.initialDeployment.assignments
      .filter((assignment) => validEmployeeIds.has(assignment.employeeId))
      .map((assignment) => {
        const matchedEmployee = deployableEmployees.find((employee) => employee.id === assignment.employeeId);
        return matchedEmployee
          ? { ...assignment, employeeName: matchedEmployee.name }
          : assignment;
      });
    if (nextAssignments.length === formData.initialDeployment.assignments.length
      && nextAssignments.every((assignment, index) => assignment.employeeName === formData.initialDeployment.assignments[index].employeeName)) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        assignments: nextAssignments,
      },
    }));
  }, [deployableEmployees, formData.initialDeployment.assignments]);

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
        assignments: [],
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
        nextDeployment.assignments = [];
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
        const isSelected = prev.initialDeployment.assignments.some((assignment) => assignment.employeeId === employee.id);
        const nextAssignments = isSelected
          ? prev.initialDeployment.assignments.filter((assignment) => assignment.employeeId !== employee.id)
          : [
            ...prev.initialDeployment.assignments,
            {
              employeeId: employee.id,
              employeeName: employee.name,
              baseSalary: employee.base_salary || '',
              contractStartDate: prev.contractStartDate || '',
              contractEndDate: prev.contractEndDate || '',
              daysOfWeek: [],
              shiftStart: '',
              shiftEnd: '',
              deploymentOrderFile: null,
            },
          ];

        return {
          ...prev.initialDeployment,
          assignments: nextAssignments,
        };
      })(),
    }));
  };
  const handleAssignmentField = (employeeId, field, value) => {
    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        assignments: prev.initialDeployment.assignments.map((assignment) => (
          assignment.employeeId === employeeId
            ? { ...assignment, [field]: value }
            : assignment
        )),
      },
    }));
  };
  const toggleAssignmentScheduleDay = (employeeId, dayValue) => {
    setFormData((prev) => ({
      ...prev,
      initialDeployment: {
        ...prev.initialDeployment,
        assignments: prev.initialDeployment.assignments.map((assignment) => (
          assignment.employeeId === employeeId
            ? {
              ...assignment,
              daysOfWeek: assignment.daysOfWeek.includes(dayValue)
                ? assignment.daysOfWeek.filter((day) => day !== dayValue)
                : [...assignment.daysOfWeek, dayValue].sort((a, b) => a - b),
            }
            : assignment
        )),
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
        if (formData.initialDeployment.assignments.length === 0) {
          return true;
        }
        if (formData.initialDeployment.siteIndex === '') {
          showNotification('Please select the deployment site for the guard.', 'error'); return false;
        }
        for (const assignment of formData.initialDeployment.assignments) {
          if (!assignment.baseSalary) {
            showNotification(`Please set the base pay for ${assignment.employeeName || 'each selected guard'}.`, 'error'); return false;
          }
          if (!assignment.contractStartDate || !assignment.contractEndDate) {
            showNotification(`Please set the assignment contract dates for ${assignment.employeeName || 'each selected guard'}.`, 'error'); return false;
          }
          if (assignment.daysOfWeek.length === 0) {
            showNotification(`Please select at least one schedule day for ${assignment.employeeName || 'each selected guard'}.`, 'error'); return false;
          }
          if (!assignment.shiftStart || !assignment.shiftEnd) {
            showNotification(`Please set both shift start and shift end for ${assignment.employeeName || 'each selected guard'}.`, 'error'); return false;
          }
          if (!assignment.deploymentOrderFile) {
            showNotification(`Please upload the deployment order for ${assignment.employeeName || 'each selected guard'}.`, 'error'); return false;
          }
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
        initialDeployment: formData.initialDeployment.assignments.length > 0
          ? {
            siteIndex: Number(formData.initialDeployment.siteIndex),
            assignments: formData.initialDeployment.assignments.map((assignment) => ({
              employeeId: assignment.employeeId,
              employeeName: assignment.employeeName,
              baseSalary: assignment.baseSalary,
              contractStartDate: assignment.contractStartDate,
              contractEndDate: assignment.contractEndDate,
              daysOfWeek: assignment.daysOfWeek,
              shiftStart: assignment.shiftStart,
              shiftEnd: assignment.shiftEnd,
            })),
          }
          : null,
      };
      const requestData = new FormData();

      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'avatar' || key === 'contractUrl') {
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

      formData.initialDeployment.assignments.forEach((assignment) => {
        if (assignment.deploymentOrderFile instanceof File) {
          requestData.append(`deployment_order_${assignment.employeeId}`, assignment.deploymentOrderFile);
        }
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
                onAssignmentField={handleAssignmentField}
                onAssignmentScheduleDay={toggleAssignmentScheduleDay}
              />
            )}
            {currentStep === 6 && <Step6Review data={formData} />}

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
