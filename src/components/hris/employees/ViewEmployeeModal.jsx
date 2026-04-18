import { useState, useEffect } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaShieldAlt, FaMoneyCheckAlt,
  FaIdCard, FaAddressBook, FaFileContract, FaCalendarCheck,
  FaUserTimes, FaEdit, FaCertificate, FaFileAlt, FaHistory,
} from 'react-icons/fa';
import employeeService from '@services/employeeService';

const tabs = [
  { key: 'personal', label: 'Personal Info', icon: FaUser },
  { key: 'employment', label: 'Employment', icon: FaBriefcase },
  { key: 'compliance', label: 'Compliance', icon: FaShieldAlt },
  { key: 'payroll', label: 'Payroll', icon: FaMoneyCheckAlt },
];

export default function ViewEmployeeModal({ isOpen, employee: previewEmployee, onClose }) {
  const [activeTab, setActiveTab] = useState('personal');
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && previewEmployee?.id) {
      setLoading(true);
      employeeService.getEmployeeDetails(previewEmployee.id)
        .then(data => {
          setEmployeeDetails(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setEmployeeDetails(null);
      setActiveTab('personal');
    }
  }, [isOpen, previewEmployee]);

  if (!isOpen || !previewEmployee) return null;

  const data = employeeDetails || previewEmployee; // fallback to preview before load

  return (
    <div className="ve-modal-overlay" onClick={onClose}>
      <div className="ve-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ve-modal-header">
          <div>
            <h2>Employee Details</h2>
            <p>{data.employee_id_number} • {data.name}</p>
          </div>
          <button className="ve-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Tabs */}
        <div className="ve-tabs-bar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`ve-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="ve-modal-body relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 z-10 flex justify-center items-center bg-white/70">
              <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {!loading && employeeDetails && (
            <>
              {activeTab === 'personal' && <PersonalTab employee={employeeDetails} />}
              {activeTab === 'employment' && <EmploymentTab employee={employeeDetails} />}
              {activeTab === 'compliance' && <ComplianceTab employee={employeeDetails} />}
              {activeTab === 'payroll' && <PayrollTab employee={employeeDetails} />}
            </>
          )}

          {/* Action Buttons */}
          <div className="ve-action-buttons mt-6">
            <button className="ve-btn ve-btn-gold">
              <FaFileContract /> View Contract
            </button>
            <button className="ve-btn ve-btn-blue">
              <FaCalendarCheck /> View Attendance
            </button>
            <button className="ve-btn ve-btn-red">
              <FaUserTimes /> Terminate Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Personal Info Tab ── */
function PersonalTab({ employee }) {
  return (
    <div className="ve-tab-content">
      {/* Employee header card */}
      <div className="ve-profile-card">
        <div className="ve-profile-left">
          {employee.avatar_url ? (
            <img src={employee.avatar_url} alt={employee.initials} className="ve-profile-avatar object-cover" />
          ) : (
            <div className="ve-profile-avatar">{employee.initials}</div>
          )}
          <div>
            <h3 className="ve-profile-name">{employee.full_name || employee.name}</h3>
            <p className="ve-profile-position">{employee.position}</p>
            <div className="ve-profile-meta">
              <span className={`ve-profile-badge badge-${employee.status}`}>
                {employee.status.toUpperCase()}
              </span>
              <span className="ve-profile-id">ID: {employee.employee_id_number}</span>
            </div>
          </div>
        </div>
        <button className="ve-edit-btn">
          <FaEdit /> Edit Details
        </button>
      </div>

      {/* Basic Information */}
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaIdCard className="ve-section-icon" /> Basic Information
        </h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Full Name" value={employee.full_name || employee.name} />
          <InfoCell label="Date of Birth" value={`${employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}${employee.age ? ` (Age ${employee.age})` : ''}`} />
          <InfoCell label="Gender" value={employee.gender || 'N/A'} />
          <InfoCell label="Citizenship" value={employee.citizenship || 'Filipino'} />
          <InfoCell label="Marital Status" value={employee.civil_status || 'N/A'} />
          <InfoCell label="Height" value={employee.height_cm ? `${employee.height_cm} cm` : 'N/A'} />
          <InfoCell label="Educational Attainment" value={employee.educational_level || 'N/A'} />
        </div>
      </div>

      {/* Contact Information */}
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaAddressBook className="ve-section-icon" /> Contact Information
        </h3>
        <div className="ve-info-grid cols-2">
          <InfoCell label="Mobile Number" value={employee.phone_number || 'N/A'} />
          <InfoCell label="Email Address" value={employee.contact_email || 'N/A'} />
          <InfoCell label="Residential Address" value={employee.residential_address || 'N/A'} span2 />
          <InfoCell label="Emergency Contact" value={employee.emergency_contact_name || 'N/A'} />
          <InfoCell label="Emergency Number" value={employee.emergency_contact_number || 'N/A'} />
        </div>
      </div>
    </div>
  );
}

/* ── Employment Tab ── */
function EmploymentTab({ employee }) {
  let tenureStr = 'N/A';
  if (employee.hire_date) {
    const diff = new Date() - new Date(employee.hire_date);
    const years = diff / (1000 * 60 * 60 * 24 * 365.25);
    if (years >= 1) {
      tenureStr = `${Math.floor(years)} year(s)`;
      const months = Math.floor((years - Math.floor(years)) * 12);
      if (months > 0) tenureStr += `, ${months} month(s)`;
    } else {
      const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
      tenureStr = `${months} month(s)`;
    }
  }

  const hireDateStr = employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A';

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaBriefcase className="ve-section-icon" /> Employment Details
        </h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Employee ID" value={employee.employee_id_number} variant="blue" />
          <InfoCell label="Date Started" value={hireDateStr} variant="blue" />
          <InfoCell label="Tenure" value={tenureStr} variant="blue" />
          <InfoCell label="Position" value={employee.position || 'N/A'} />
          <InfoCell label="Employment Type" value={employee.employment_type || 'N/A'} />
          <InfoCell label="Status" value={employee.status.toUpperCase()} valueColor={employee.status === 'active' ? '#16a34a' : '#d97706'} />
          <InfoCell label="Assigned Company" value={`${employee.current_company} - ${employee.current_site}`} span3 />
        </div>
      </div>
    </div>
  );
}

/* ── Compliance Tab ── */
function ComplianceTab({ employee }) {
  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaCertificate className="ve-section-icon" /> Security Licenses &amp; Certifications
        </h3>
        <div className="ve-compliance-list">
          {employee.clearances?.length > 0 ? (
            employee.clearances.map((c, i) => (
              <ComplianceRow
                key={i}
                title={c.clearance_type}
                sub={`Issued: ${new Date(c.issue_date).toLocaleDateString()}`}
                badge={c.status.toUpperCase()}
                expires={c.expiry_date ? `Expires: ${new Date(c.expiry_date).toLocaleDateString()}` : null}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm py-4">No clearances recorded.</p>
          )}
        </div>
      </div>

      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaFileAlt className="ve-section-icon" /> Government IDs
        </h3>
        <div className="ve-info-grid cols-2">
          <InfoCell label="TIN" value={employee.tin_number || 'N/A'} />
          <InfoCell label="SSS Number" value={employee.sss_number || 'N/A'} />
          <InfoCell label="PhilHealth Number" value={employee.philhealth_number || 'N/A'} />
          <InfoCell label="Pag-IBIG MID" value={employee.pagibig_number || 'N/A'} />
        </div>
      </div>
    </div>
  );
}

/* ── Payroll Tab ── */
function PayrollTab({ employee }) {
  // Format currency
  const formatMoney = (val) => {
    if (val == null) return 'N/A';
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val);
  };

  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaMoneyCheckAlt className="ve-section-icon" /> Payroll Information
        </h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Base Pay" value={`${formatMoney(employee.base_salary)}/${employee.pay_frequency === 'semi_monthly' ? 'mo' : (employee.pay_frequency || 'mo')}`} variant="green" valueSize="xl" />
          <InfoCell label="Pay Frequency" value={employee.pay_frequency === 'semi_monthly' ? 'Semi-Monthly' : 'N/A'} />
        </div>
      </div>

      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaHistory className="ve-section-icon" /> Recent Payroll History
        </h3>
        <div className="ve-table-wrap">
          <table className="ve-payroll-table">
            <thead>
              <tr>
                <th>Pay Period</th>
                <th className="text-right">Basic Pay</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {employee.payroll_records?.length > 0 ? (
                employee.payroll_records.map(pr => {
                  const totalDeductions = (pr.statutory_deductions || 0) + (pr.cash_advance_deduction || 0) + (pr.absences_deduction || 0);
                  return (
                    <tr key={pr.id}>
                      <td className="fw-600">{new Date(pr.period_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})} - {new Date(pr.period_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'})}</td>
                      <td className="text-right text-green">{formatMoney(pr.basic_pay)}</td>
                      <td className="text-right text-red">{formatMoney(totalDeductions)}</td>
                      <td className="text-right fw-700">{formatMoney(pr.net_pay)}</td>
                      <td><span className={`ve-pay-badge ${pr.status === 'paid' ? '' : 'bg-gray-200 text-gray-700'}`}>{pr.status.toUpperCase()}</span></td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No payroll records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */
function InfoCell({ label, value, variant, span2, span3, valueColor, valueSize }) {
  const cellClass = [
    've-info-cell',
    variant === 'blue' ? 'blue' : '',
    variant === 'green' ? 'green' : '',
    span2 ? 'span-2' : '',
    span3 ? 'span-3' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={cellClass}>
      <p className="ve-info-label">{label}</p>
      <p
        className={`ve-info-value ${valueSize === 'xl' ? 'xl' : ''}`}
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function ComplianceRow({ title, sub, badge, expires }) {
  return (
    <div className="ve-compliance-row">
      <div>
        <p className="ve-compliance-title">{title}</p>
        <p className="ve-compliance-sub">{sub}</p>
      </div>
      <div className="ve-compliance-right flex flex-col items-end">
        <span className={`ve-compliance-badge ${badge === 'VALID' ? '' : 'bg-red-100 text-red-700 border-red-200'}`}>{badge}</span>
        {expires && <p className="ve-compliance-expires mt-1">{expires}</p>}
      </div>
    </div>
  );
}
