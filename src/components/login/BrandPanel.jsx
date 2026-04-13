import { FaUsers, FaClock, FaFileInvoiceDollar, FaAddressBook, FaFileContract } from 'react-icons/fa';
import logo from '@assets/logo.png';

const features = [
  { icon: FaUsers, label: 'Workforce Management' },
  { icon: FaClock, label: 'Attendance Monitoring' },
  { icon: FaAddressBook, label: 'Service Requests' },
  { icon: FaFileContract, label: 'Reports & Billing' },
];

export default function BrandPanel() {
  return (
    <div className="login-brand">
      {/* Background decorations */}
      <div className="bg-dots" />
      <div className="shape shape-1" />
      <div className="shape shape-2" />
      <div className="shape shape-3" />

      {/* Brand content */}
      <div className="brand-content">
        <img src={logo} alt="PRISM-Guard Logo" className="brand-logo" />
        <h1>PRISM-Guard</h1>
        <p className="tagline">HRIS & CMS</p>

        <div className="brand-features">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="feature-pill">
              <Icon className="icon" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
