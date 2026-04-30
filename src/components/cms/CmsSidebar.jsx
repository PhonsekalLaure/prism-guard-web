import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaHeadset, FaExclamationTriangle,
  FaCreditCard, FaStar, FaBuilding, FaSignOutAlt,
  FaUserShield, FaFileInvoiceDollar, FaBars,
} from 'react-icons/fa';
import logo from '@assets/logo.png';

const navGroups = [
  {
    label: null,
    labelIcon: null,
    items: [
      { to: '/cms/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    ],
  },
  {
    label: 'Guard Management',
    labelIcon: FaUserShield,
    items: [
      { to: '/cms/deployed-guards', icon: FaUsers, label: 'Deployed Guards' },
    ],
  },
  {
    label: 'Services',
    labelIcon: FaHeadset,
    items: [
      { to: '/cms/service-requests', icon: FaHeadset, label: 'Service Request' },
    ],
  },
  {
    label: 'Reports',
    labelIcon: FaBars,
    items: [
      { to: '/cms/incident-reports', icon: FaExclamationTriangle, label: 'Incidents' },
    ],
  },
  {
    label: 'Billing',
    labelIcon: FaFileInvoiceDollar,
    items: [
      { to: '/cms/billing', icon: FaCreditCard, label: 'Billing & Payments' },
    ],
  },
];

const bottomItems = [
  { to: '/cms/reviews', icon: FaStar, label: 'Service Reviews' },
];

function SidebarAvatar({ profile }) {
  if (profile?.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.first_name}
        className="cms-sidebar-avatar cms-sidebar-avatar--img"
      />
    );
  }

  // Show first letter of the company name, or first letter of the user's name as fallback
  const initial = profile?.company
    ? profile.company.charAt(0).toUpperCase()
    : profile?.first_name?.charAt(0).toUpperCase() || <FaBuilding />;

  return (
    <div className="cms-sidebar-avatar">
      {initial}
    </div>
  );
}

export default function CmsSidebar({ profile, onLogoutClick }) {
  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
    : '—';

  const displayCompany = profile?.company || '—';

  return (
    <aside className="cms-sidebar">

      {/* ── Logo ── */}
      <div className="cms-sidebar-header">
        <img src={logo} alt="PRISM-Guard" className="cms-sidebar-logo" />
        <div>
          <p className="cms-sidebar-brand-name">PRISM-Guard</p>
          <p className="cms-sidebar-brand-sub">Client Portal</p>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav className="cms-sidebar-nav">
        {navGroups.map((group, gi) => {
          const LabelIcon = group.labelIcon;
          return (
            <div key={gi}>
              {gi > 0 && <div className="cms-nav-divider" />}
              {group.label && (
                <p className="cms-nav-group-label">
                  {LabelIcon && <LabelIcon className="cms-nav-group-icon" />}
                  {group.label}
                </p>
              )}
              {group.items.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    isActive ? 'cms-nav-item active' : 'cms-nav-item'
                  }
                >
                  <Icon className="cms-nav-icon" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}

        {/* ── Service Reviews ── */}
        <div className="cms-nav-divider" />
        {bottomItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'cms-nav-item active' : 'cms-nav-item'
            }
          >
            <Icon className="cms-nav-icon" />
            <span>{label}</span>
          </NavLink>
        ))}

        {/* ── Spacer ── */}
        <div className="cms-nav-spacer" />
      </nav>

      {/* ── User Footer ── */}
      <div className="cms-sidebar-footer">
        <NavLink to="/cms/profile" className="cms-sidebar-user">
          <SidebarAvatar profile={profile} />
          <div className="cms-sidebar-user-info">
            <p className="cms-sidebar-user-name">{displayName}</p>
            <p className="cms-sidebar-user-role">{displayCompany}</p>
          </div>
        </NavLink>

        <button className="cms-logout-btn" onClick={onLogoutClick}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>

    </aside>
  );
}