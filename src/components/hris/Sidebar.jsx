import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaBuilding, FaFileInvoiceDollar, FaHeadset, FaStar,
  FaUsers, FaFingerprint, FaCalendarAlt, FaHandHoldingUsd, FaMoneyBillWave,
  FaUserPlus, FaExclamationTriangle, FaBullhorn, FaUserShield, FaSignOutAlt,
  FaBell,
} from 'react-icons/fa';
import logo from '@assets/logo.png';
import authService from '@services/authService';
import { getAdminRoleLabel, hasAllPermissions } from '@utils/adminPermissions';
import {
  formatNotificationBadgeCount,
  getNotificationBadgeCount,
} from '@utils/notificationBadges';
import { NOTIFICATION_PREFIXES } from '@utils/notificationRouting';

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
      { to: '/clients', icon: FaBuilding, label: 'Clients', permissions: ['clients.read'] },
      { to: '/billing', icon: FaFileInvoiceDollar, label: 'Billing & Payments' },
      { to: '/service-request', icon: FaHeadset, label: 'Service Request', notificationPrefixes: NOTIFICATION_PREFIXES.serviceRequest },
      { to: '/service-reviews', icon: FaStar, label: 'Service Reviews', notificationPrefixes: NOTIFICATION_PREFIXES.serviceReview },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { to: '/employees', icon: FaUsers, label: 'Employees', permissions: ['employees.read'] },
      { to: '/attendance', icon: FaFingerprint, label: 'Attendance' },
      { to: '/leaves', icon: FaCalendarAlt, label: 'Leave Requests', permissions: ['employees.read'], notificationPrefixes: NOTIFICATION_PREFIXES.leave },
      { to: '/cash-advance', icon: FaHandHoldingUsd, label: 'Cash Advance' },
      { to: '/payroll', icon: FaMoneyBillWave, label: 'Payroll' },
      { to: '/applicants', icon: FaUserPlus, label: 'Applicants', notificationPrefixes: NOTIFICATION_PREFIXES.applicant },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/notifications', icon: FaBell, label: 'Notifications', notificationUncategorized: true },
      { to: '/incidents', icon: FaExclamationTriangle, label: 'Incidents', permissions: ['incidents.read'], notificationPrefixes: NOTIFICATION_PREFIXES.incident },
      { to: '/announcements', icon: FaBullhorn, label: 'Announcements', permissions: ['announcements.read'], notificationPrefixes: NOTIFICATION_PREFIXES.announcement },
    ],
  },
];

export default function Sidebar({ onLogoutClick, isOpen, notificationStats }) {
  const profile = authService.getProfile() || {};
  const fullName = profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'John Juan';
  const roleLabel = profile.role === 'admin'
    ? getAdminRoleLabel(profile.admin_role, profile.role || 'Administrator')
    : (profile.position || profile.role || 'Client');

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
            {group.items
              .filter(({ permissions }) => !permissions || hasAllPermissions(profile, permissions))
              .map((item) => {
                const badgeCount = getNotificationBadgeCount(item, notificationStats);
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  >
                    {createElement(item.icon)}
                    <span className="nav-label">{item.label}</span>
                    {badgeCount > 0 && item.notificationUncategorized && (
                      <span className="nav-badge-dot" aria-label="Unread uncategorized notifications" />
                    )}
                    {badgeCount > 0 && !item.notificationUncategorized && (
                      <span className="nav-badge" aria-label={`${badgeCount} unread notifications`}>
                        {formatNotificationBadgeCount(badgeCount)}
                      </span>
                    )}
                  </NavLink>
                );
              })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="nav-divider" />
        {hasAllPermissions(profile, ['admins.manage']) && (
          <NavLink to="/admin-management" className="nav-item">
            <FaUserShield />
            <span>Admin Management</span>
          </NavLink>
        )}

        {/* User profile */}
        <div className="sidebar-user">
          <NavLink to="/profile" className="nav-item">
          <div className="user-avatar">
            <FaUsers />
          </div>
          <div className="user-info">
            <span className="user-name">{fullName}</span>
            <span className="user-role">{roleLabel}</span>
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
