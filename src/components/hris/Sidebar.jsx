import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBuilding, FaFileInvoiceDollar, FaHeadset, FaStar,
  FaUsers, FaFingerprint, FaCalendarAlt, FaHandHoldingUsd, FaMoneyBillWave,
  FaUserPlus, FaExclamationTriangle, FaBullhorn, FaUserShield, FaSignOutAlt,
} from 'react-icons/fa';
import logo from '@assets/logo.png';
import authService from '@services/authService';

const navGroups = [
  {
    label: null, // No group header for Dashboard
    items: [
      { to: '/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    ],
  },
  {
    label: 'Client Management',
    items: [
      { to: '/clients', icon: FaBuilding, label: 'Clients' },
      { to: '/billing', icon: FaFileInvoiceDollar, label: 'Billing & Payments' },
      { to: '/service-request', icon: FaHeadset, label: 'Service Request' },
      { to: '/service-reviews', icon: FaStar, label: 'Service Reviews' },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { to: '/employees', icon: FaUsers, label: 'Employees' },
      { to: '/attendance', icon: FaFingerprint, label: 'Attendance' },
      { to: '/leaves', icon: FaCalendarAlt, label: 'Leave Requests' },
      { to: '/cash-advance', icon: FaHandHoldingUsd, label: 'Cash Advance' },
      { to: '/payroll', icon: FaMoneyBillWave, label: 'Payroll' },
      { to: '/applicants', icon: FaUserPlus, label: 'Applicants' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/incidents', icon: FaExclamationTriangle, label: 'Incidents' },
      { to: '/announcements', icon: FaBullhorn, label: 'Announcements' },
    ],
  },
];

// ─── Header Navigation Support ─────────────────────────────────

export default function Sidebar({ onLogoutClick, isOpen, onClose }) {
  const profile = authService.getProfile() || {};
  const fullName = profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'John Juan';
  const position = profile.position || profile.role || 'President';

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <img src={logo} alt="PRISM-Guard" />
        <div>
          <div className="brand-name">PRISM-Guard</div>
          <div className="brand-sub">Admin Portal</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navGroups.map((group, gi) => (
          <div key={group.label || 'main'}>
            {gi > 0 && <div className="nav-divider" />}
            {group.label && <div className="nav-group-header">{group.label}</div>}
            {group.items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="nav-divider" />
        <NavLink to="/admin-management" className="nav-item">
          <FaUserShield />
          <span>Admin Management</span>
        </NavLink>

        {/* User profile */}
        <div className="sidebar-user">
          <NavLink to="/profile" className="nav-item">
          <div className="user-avatar">
            <FaUsers />
          </div>
          <div className="user-info">
            <span className="user-name">{fullName}</span>
            <span className="user-role">{position}</span>
          </div>
          </NavLink>
        </div>

        <button className="nav-item logout-item" onClick={onLogoutClick}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
