import { useMemo } from 'react';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import AddEmployeeWizard from '@hris-components/employees/AddEmployeeWizard';

function stripPhilippinePrefix(value = '') {
  return String(value).replace(/^\+63/, '').replace(/\D/g, '').slice(0, 10);
}

function normalizePosition(position = '') {
  if (position === 'Security Officer') return 'Security Officer I';
  return position || 'Security Guard';
}

function buildApplicantInitialData(applicant) {
  if (!applicant) return null;

  return {
    firstName: applicant.first_name || '',
    lastName: applicant.last_name || '',
    middleName: applicant.middle_name || '',
    suffix: applicant.suffix || '',
    dob: applicant.date_of_birth || '',
    gender: applicant.gender || '',
    height: applicant.height_cm ? String(applicant.height_cm) : '',
    civilStatus: applicant.civil_status || '',
    citizenship: applicant.citizenship || 'Filipino',
    educationalLevel: applicant.educational_level || '',
    mobile: stripPhilippinePrefix(applicant.phone_number),
    email: applicant.email || '',
    address: applicant.residential_address || '',
    latitude: applicant.latitude ?? null,
    longitude: applicant.longitude ?? null,
    emergencyName: applicant.emergency_contact_name || '',
    emergencyContact: stripPhilippinePrefix(applicant.emergency_contact_number),
    emergencyRelationship: applicant.emergency_contact_relationship || '',
    position: normalizePosition(applicant.position_applied),
    badgeNumber: applicant.badge_number || '',
    licenseNumber: applicant.license_number || '',
    licenseExpiryDate: applicant.license_expiry_date || '',
    avatarUrl: applicant.profile_photo_url || applicant.avatarUrl || '',
    sourceApplicantId: applicant.id || '',
  };
}

export default function AddEmployeePage() {
  const navigate          = useNavigate();
  const location          = useLocation();
  const { toggleSidebar } = useOutletContext();
  const sourceApplicant   = location.state?.sourceApplicant || null;
  const initialData       = useMemo(() => buildApplicantInitialData(sourceApplicant), [sourceApplicant]);

  const handleSaved = async () => {
    navigate('/employees');
  };

  return (
    <>
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/employees')}>
              <FaArrowLeft /> Back to Employees
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ep-page-body">
        <AddEmployeeWizard
          isOpen={true}
          onClose={() => navigate('/employees')}
          onSaved={handleSaved}
          initialData={initialData}
          pageMode
        />
      </div>
    </>
  );
}
