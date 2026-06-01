import { createElement, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaHeadset, FaExclamationTriangle,
  FaCreditCard, FaStar, FaBuilding, FaSignOutAlt,
  FaUserShield, FaFileInvoiceDollar, FaBars, FaBullhorn, FaBell,
  FaChevronDown,
} from 'react-icons/fa';
import logo from '@assets/logo.png';
import {
  formatNotificationBadgeCount,
  getNotificationBadgeCount,
} from '@utils/notificationBadges';
import { NOTIFICATION_PREFIXES } from '@utils/notificationRouting';
import EntityAvatar from '@components/ui/EntityAvatar';

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
      { to: '/cms/service-requests', icon: FaHeadset, label: 'Service Request', notificationPrefixes: NOTIFICATION_PREFIXES.serviceRequest },
    ],
  },
  {
    label: 'Reports',
    labelIcon: FaBars,
    items: [
      { to: '/cms/notifications',  icon: FaBell,                 label: 'Notifications', notificationUncategorized: true },
      { to: '/cms/incident-reports', icon: FaExclamationTriangle, label: 'Incidents', notificationPrefixes: NOTIFICATION_PREFIXES.incident },
      { to: '/cms/announcements',    icon: FaBullhorn,             label: 'Announcements', notificationPrefixes: NOTIFICATION_PREFIXES.announcement },
    ],
  },
  {
    label: 'Billing',
    labelIcon: FaFileInvoiceDollar,
    items: [
      { to: '/cms/billing', icon: FaCreditCard, label: 'Billing & Payments' },
    ],
  },
  {
    label: 'Feedback',
    labelIcon: FaStar,
    items: [
      { to: '/cms/reviews', icon: FaStar, label: 'Service Reviews', notificationPrefixes: NOTIFICATION_PREFIXES.serviceReview },
    ],
  },
];

function SidebarAvatar({ profile }) {
  const initial = profile?.company
    ? profile.company.charAt(0).toUpperCase()
    : profile?.first_name?.charAt(0).toUpperCase() || <FaBuilding />;

  return (
    <EntityAvatar
      avatarUrl={profile?.avatar_url}
      initials={typeof initial === 'string' ? initial : undefined}
      className="cms-sidebar-avatar"
      alt={profile?.company || profile?.first_name || 'Client avatar'}
      fallbackContent={typeof initial === 'string' ? undefined : initial}
    />
  );
}

export default function CmsSidebar({ profile, onLogoutClick, notificationStats }) {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState({});
  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
    : '—';

  const displayCompany = profile?.company || '—';
  const toggleGroup = (groupKey) => {
    setOpenGroups((current) => ({ ...current, [groupKey]: !current[groupKey] }));
  };

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
          const groupKey = group.label || 'main';
          const isDirectGroup = !group.label;
          const isGroupActive = group.items.some((item) => (
            location.pathname === item.to || location.pathname.startsWith(`${item.to}/`)
          ));
          const isGroupOpen = isDirectGroup || openGroups[groupKey] || isGroupActive;
          const groupBadgeCount = group.items.reduce((total, item) => (
            total + getNotificationBadgeCount(item, notificationStats)
          ), 0);

          return (
            <div
              key={groupKey}
              className={`cms-nav-group${isGroupOpen ? ' open' : ''}${isGroupActive ? ' active' : ''}`}
            >
              {gi > 0 && <div className="cms-nav-divider" />}
              {group.label && (
                <button
                  type="button"
                  className="cms-nav-group-label"
                  onClick={() => toggleGroup(groupKey)}
                  aria-expanded={isGroupOpen}
                >
                  <span className="cms-nav-group-title">
                    {LabelIcon && <LabelIcon className="cms-nav-group-icon" />}
                    {group.label}
                  </span>
                  {groupBadgeCount > 0 && (
                    <span className="cms-nav-group-badge" aria-label={`${groupBadgeCount} unread notifications`}>
                      {formatNotificationBadgeCount(groupBadgeCount)}
                    </span>
                  )}
                  <FaChevronDown className="cms-nav-group-chevron" />
                </button>
              )}
              <div className="cms-nav-group-menu">
                <div>
                  {group.items.map((item) => {
                    const { to, icon: Icon, label } = item;
                    const badgeCount = getNotificationBadgeCount(item, notificationStats);
                    return (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          isActive ? 'cms-nav-item active' : 'cms-nav-item'
                        }
                      >
                        {createElement(Icon, { className: 'cms-nav-icon' })}
                        <span className="cms-nav-label">{label}</span>
                        {badgeCount > 0 && item.notificationUncategorized && (
                          <span className="cms-nav-badge-dot" aria-label="Unread uncategorized notifications" />
                        )}
                        {badgeCount > 0 && !item.notificationUncategorized && (
                          <span className="cms-nav-badge" aria-label={`${badgeCount} unread notifications`}>
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
