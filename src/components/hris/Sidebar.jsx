import { createElement, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaBuilding, FaFileInvoiceDollar, FaHeadset, FaStar,
  FaUsers, FaFingerprint, FaCalendarAlt, FaHandHoldingUsd, FaMoneyBillWave,
  FaUserPlus, FaExclamationTriangle, FaBullhorn, FaUserShield, FaSignOutAlt,
  FaBell, FaChevronDown,
  FaImages,
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
      { to: '/billing', icon: FaFileInvoiceDollar, label: 'Billing & Payments', permissions: ['billing.read'] },
      { to: '/service-request', icon: FaHeadset, label: 'Service Request', permissions: ['servicerequests.read'], notificationPrefixes: NOTIFICATION_PREFIXES.serviceRequest },
      { to: '/service-reviews', icon: FaStar, label: 'Service Reviews', permissions: ['servicereviews.read'], notificationPrefixes: NOTIFICATION_PREFIXES.serviceReview },
    ],
  },
  {
    label: 'Workforce',
    items: [
      { to: '/employees', icon: FaUsers, label: 'Employees', permissions: ['employees.read'] },
      { to: '/attendance', icon: FaFingerprint, label: 'Attendance', permissions: ['attendance.read'] },
      { to: '/leaves', icon: FaCalendarAlt, label: 'Leave Requests', permissions: ['leaves.read'], notificationPrefixes: NOTIFICATION_PREFIXES.leave },
      { to: '/cash-advance', icon: FaHandHoldingUsd, label: 'Cash Advance', permissions: ['cashadvance.read'], notificationPrefixes: NOTIFICATION_PREFIXES.cashAdvance },
      { to: '/payroll', icon: FaMoneyBillWave, label: 'Payroll', permissions: ['payroll.read'] },
      { to: '/applicants', icon: FaUserPlus, label: 'Applicants', permissions: ['applicants.read'], notificationPrefixes: NOTIFICATION_PREFIXES.applicant },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/notifications', icon: FaBell, label: 'Notifications', permissions: ['notifications.read'], notificationUncategorized: true },
      { to: '/incidents', icon: FaExclamationTriangle, label: 'Incidents', permissions: ['incidents.read'], notificationPrefixes: NOTIFICATION_PREFIXES.incident },
      { to: '/announcements', icon: FaBullhorn, label: 'Announcements', permissions: ['announcements.read'], notificationPrefixes: NOTIFICATION_PREFIXES.announcement },
      { to: '/promo-carousel', icon: FaImages, label: 'Promo Carousel', permissions: ['promocarousel.read'] },
    ],
  },
];

export default function Sidebar({ onLogoutClick, isOpen, notificationStats }) {
  const location = useLocation();
  const profile = useMemo(() => authService.getProfile() || {}, []);
  const [openGroups, setOpenGroups] = useState({});
  const fullName = profile.first_name ? `${profile.first_name} ${profile.last_name}` : 'John Juan';
  const roleLabel = profile.role === 'admin'
    ? getAdminRoleLabel(profile.admin_role, profile.role || 'Administrator')
    : (profile.position || profile.role || 'Client');
  const visibleGroups = useMemo(() => (
    navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter(({ permissions }) => (
          !permissions || hasAllPermissions(profile, permissions)
        )),
      }))
      .filter((group) => group.items.length > 0)
  ), [profile]);

  const toggleGroup = (groupKey) => {
    setOpenGroups((current) => ({ ...current, [groupKey]: !current[groupKey] }));
  };

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
        {visibleGroups.map((group, gi) => {
          const groupKey = group.label || 'main';
          const isDirectGroup = !group.label;
          const isGroupActive = group.items.some((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));
          const isGroupOpen = isDirectGroup || openGroups[groupKey] || isGroupActive;
          const groupBadgeCount = group.items.reduce((total, item) => (
            total + getNotificationBadgeCount(item, notificationStats)
          ), 0);

          return (
            <div
              key={groupKey}
              className={`nav-group${isGroupOpen ? ' open' : ''}${isGroupActive ? ' active' : ''}`}
            >
            {gi > 0 && <div className="nav-divider" />}
            {group.label && (
              <button
                type="button"
                className="nav-group-header"
                onClick={() => toggleGroup(groupKey)}
                aria-expanded={isGroupOpen}
              >
                <span>{group.label}</span>
                {groupBadgeCount > 0 && (
                  <span className="nav-group-badge" aria-label={`${groupBadgeCount} unread notifications`}>
                    {formatNotificationBadgeCount(groupBadgeCount)}
                  </span>
                )}
                <FaChevronDown className="nav-group-chevron" />
              </button>
            )}
            <div className="nav-group-menu">
              <div>
                {group.items.map((item) => {
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
            </div>
          </div>
          );
        })}
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
        <NavLink to="/profile" className="sidebar-user">
          <div className="user-avatar">
            <FaUsers />
          </div>
          <div className="user-info">
            <span className="user-name">{fullName}</span>
            <span className="user-role">{roleLabel}</span>
          </div>
        </NavLink>

        <button className="nav-item logout-item" onClick={onLogoutClick}>
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
