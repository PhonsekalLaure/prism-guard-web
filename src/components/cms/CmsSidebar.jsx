import { createElement } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaUsers, FaHeadset, FaExclamationTriangle,
  FaCreditCard, FaStar, FaBuilding, FaSignOutAlt,
  FaBullhorn, FaBell,
} from 'react-icons/fa';
import logo from '@assets/logo.png';
import {
  formatNotificationBadgeCount,
  getNotificationBadgeCount,
} from '@utils/notificationBadges';
import { NOTIFICATION_PREFIXES } from '@utils/notificationRouting';
import EntityAvatar from '@components/ui/EntityAvatar';

const navItems = [
  { to: '/cms/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
  { to: '/cms/deployed-guards', icon: FaUsers, label: 'Deployed Guards' },
  { to: '/cms/service-requests', icon: FaHeadset, label: 'Service Request', notificationPrefixes: NOTIFICATION_PREFIXES.serviceRequest },
  { to: '/cms/notifications', icon: FaBell, label: 'Notifications', notificationUncategorized: true, dividerBefore: true },
  { to: '/cms/incident-reports', icon: FaExclamationTriangle, label: 'Incidents', notificationPrefixes: NOTIFICATION_PREFIXES.incident },
  { to: '/cms/announcements', icon: FaBullhorn, label: 'Announcements', notificationPrefixes: NOTIFICATION_PREFIXES.announcement },
  { to: '/cms/billing', icon: FaCreditCard, label: 'Billing & Payments', dividerBefore: true },
  { to: '/cms/reviews', icon: FaStar, label: 'Service Reviews', notificationPrefixes: NOTIFICATION_PREFIXES.serviceReview },
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

export default function CmsSidebar({ profile, onLogoutClick, isOpen, onClose, notificationStats }) {
  const displayName = profile
    ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim()
    : '-';
  const displayCompany = profile?.company || '-';

  return (
    <aside className={`cms-sidebar${isOpen ? ' open' : ''}`}>
      <div className="cms-sidebar-header">
        <img src={logo} alt="PRISM-Guard" className="cms-sidebar-logo" />
        <div>
          <p className="cms-sidebar-brand-name">PRISM-Guard</p>
          <p className="cms-sidebar-brand-sub">Client Portal</p>
        </div>
      </div>

      <nav className="cms-sidebar-nav">
        {navItems.map((item) => {
          const { to, icon: Icon, label } = item;
          const badgeCount = getNotificationBadgeCount(item, notificationStats);

          return (
            <div key={to} className="cms-nav-row">
              {item.dividerBefore && <div className="cms-nav-divider" />}
              <NavLink
                to={to}
                onClick={onClose}
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
            </div>
          );
        })}

        <div className="cms-nav-spacer" />
      </nav>

      <div className="cms-sidebar-footer">
        <NavLink to="/cms/profile" className="cms-sidebar-user" onClick={onClose}>
          <SidebarAvatar profile={profile} />
          <div className="cms-sidebar-user-info">
            <p className="cms-sidebar-user-name">{displayName}</p>
            <p className="cms-sidebar-user-role">{displayCompany}</p>
          </div>
        </NavLink>

        <button className="cms-logout-btn" type="button" onClick={onLogoutClick}>
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
}
