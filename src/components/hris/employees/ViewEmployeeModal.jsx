import { useState } from 'react';
import {
  FaTimes, FaUser, FaBriefcase, FaShieldAlt, FaMoneyCheckAlt,
  FaIdCard, FaAddressBook, FaFileContract, FaCalendarCheck,
  FaUserTimes, FaEdit, FaCertificate, FaFileAlt, FaHistory,
} from 'react-icons/fa';

const tabs = [
  { key: 'personal', label: 'Personal Info', icon: FaUser },
  { key: 'employment', label: 'Employment', icon: FaBriefcase },
  { key: 'compliance', label: 'Compliance', icon: FaShieldAlt },
  { key: 'payroll', label: 'Payroll', icon: FaMoneyCheckAlt },
];

export default function ViewEmployeeModal({ isOpen, employee, onClose }) {
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen || !employee) return null;

  return (
    <div className="ve-modal-overlay" onClick={onClose}>
      <div className="ve-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="ve-modal-header">
          <div>
            <h2>Employee Details</h2>
            <p>{employee.id} • {employee.name}</p>
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
        <div className="ve-modal-body">
          {activeTab === 'personal' && <PersonalTab employee={employee} />}
          {activeTab === 'employment' && <EmploymentTab employee={employee} />}
          {activeTab === 'compliance' && <ComplianceTab />}
          {activeTab === 'payroll' && <PayrollTab />}

          {/* Action Buttons */}
          <div className="ve-action-buttons">
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
          <div className="ve-profile-avatar">{employee.initials}</div>
          <div>
            <h3 className="ve-profile-name">{employee.name}</h3>
            <p className="ve-profile-position">{employee.position}</p>
            <div className="ve-profile-meta">
              <span className={`ve-profile-badge badge-${employee.statusType}`}>
                {employee.status}
              </span>
              <span className="ve-profile-id">ID: {employee.id}</span>
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
          <InfoCell label="Full Name" value="Juan Dela Cruz" />
          <InfoCell label="Date of Birth" value="March 15, 1995 (Age 30)" />
          <InfoCell label="Gender" value="Male" />
          <InfoCell label="Citizenship" value="Filipino" />
          <InfoCell label="Marital Status" value="Married" />
          <InfoCell label="Blood Type" value="O+" />
          <InfoCell label="Height" value={'5\'8"'} />
          <InfoCell label="Weight" value="165 lbs" />
          <InfoCell label="Educational Attainment" value="College Level" />
        </div>
      </div>

      {/* Contact Information */}
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaAddressBook className="ve-section-icon" /> Contact Information
        </h3>
        <div className="ve-info-grid cols-2">
          <InfoCell label="Mobile Number" value="+63 917 123 4567" />
          <InfoCell label="Email Address" value="juan.cruz@prismguard.com" />
          <InfoCell label="Residential Address" value="123 Sampaguita St., Brgy. San Roque, Manila" span2 />
          <InfoCell label="Emergency Contact" value="Maria Cruz (Wife)" />
          <InfoCell label="Emergency Number" value="+63 918 765 4321" />
        </div>
      </div>
    </div>
  );
}

/* ── Employment Tab ── */
function EmploymentTab({ employee }) {
  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaBriefcase className="ve-section-icon" /> Employment Details
        </h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Employee ID" value={employee.id} variant="blue" />
          <InfoCell label="Date Started" value="January 15, 2024" variant="blue" />
          <InfoCell label="Tenure" value="1 year, 1 month" variant="blue" />
          <InfoCell label="Position" value={employee.position} />
          <InfoCell label="Employment Type" value="Full-time" />
          <InfoCell label="Status" value="Active" valueColor="#16a34a" />
          <InfoCell label="Assigned Company" value="SM Mall of Asia - Main Entrance" span3 />
        </div>
      </div>
    </div>
  );
}

/* ── Compliance Tab ── */
function ComplianceTab() {
  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaCertificate className="ve-section-icon" /> Security Licenses &amp; Certifications
        </h3>
        <div className="ve-compliance-list">
          <ComplianceRow
            title="PNP-SOSIA License"
            sub="PSG-2024-5678"
            badge="VALID"
            expires="Expires: Dec 31, 2026"
          />
          <ComplianceRow title="NBI Clearance" sub="Verified & Uploaded" badge="CLEAR" />
          <ComplianceRow title="Training Certification" sub="Security Guard Training" badge="VERIFIED" />
        </div>
      </div>

      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaFileAlt className="ve-section-icon" /> Government IDs
        </h3>
        <div className="ve-info-grid cols-2">
          <InfoCell label="TIN" value="123-456-789-000" />
          <InfoCell label="SSS Number" value="12-3456789-0" />
          <InfoCell label="PhilHealth Number" value="12-345678901-2" />
          <InfoCell label="Pag-IBIG MID" value="1234-5678-9012" />
        </div>
      </div>
    </div>
  );
}

/* ── Payroll Tab ── */
function PayrollTab() {
  return (
    <div className="ve-tab-content">
      <div className="ve-section">
        <h3 className="ve-section-title">
          <FaMoneyCheckAlt className="ve-section-icon" /> Payroll Information
        </h3>
        <div className="ve-info-grid cols-3">
          <InfoCell label="Base Pay" value="₱7,500/cutoff" variant="green" valueSize="xl" />
          <InfoCell label="Meal Allowance" value="₱500/cutoff" />
          <InfoCell label="Cash Bond Deduction" value="₱200/cutoff" />
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
                <th>Pay Date</th>
                <th className="text-right">Gross</th>
                <th className="text-right">Deductions</th>
                <th className="text-right">Net Pay</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="fw-600">Feb 10, 2026</td>
                <td className="text-right text-green">₱9,500</td>
                <td className="text-right text-red">₱1,850</td>
                <td className="text-right fw-700">₱8,850</td>
                <td><span className="ve-pay-badge">PAID</span></td>
              </tr>
              <tr>
                <td className="fw-600">Jan 25, 2026</td>
                <td className="text-right text-green">₱9,500</td>
                <td className="text-right text-red">₱1,850</td>
                <td className="text-right fw-700">₱8,850</td>
                <td><span className="ve-pay-badge">PAID</span></td>
              </tr>
              <tr>
                <td className="fw-600">Jan 10, 2026</td>
                <td className="text-right text-green">₱9,500</td>
                <td className="text-right text-red">₱1,850</td>
                <td className="text-right fw-700">₱8,850</td>
                <td><span className="ve-pay-badge">PAID</span></td>
              </tr>
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
      <div className="ve-compliance-right">
        <span className="ve-compliance-badge">{badge}</span>
        {expires && <p className="ve-compliance-expires">{expires}</p>}
      </div>
    </div>
  );
}
