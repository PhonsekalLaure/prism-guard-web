import { FaCrown, FaUserShield, FaChevronRight } from 'react-icons/fa';
import { getAdminRoleLabel } from '@utils/adminPermissions';

function formatPermissionLabel(permission) {
  return permission
    .replace(/\./g, ' ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function AdminCard({ admin, onAdminClick }) {
  const isPresident = admin.admin_role === 'president';
  const statusClass = `admin-status-badge status-${admin.status || 'active'}`;
  const initials = `${admin.first_name?.[0] || ''}${admin.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div
      className={`admin-card${isPresident ? ' super-admin' : ''}`}
      onClick={() => onAdminClick?.(admin)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onAdminClick?.(admin)}
    >
      <div className={`admin-card-header ${isPresident ? 'super-admin-header' : 'default-header'}`}>
        <span className={`admin-role-badge role-${admin.admin_role || 'admin'}`}>
          {isPresident && <FaCrown style={{ marginRight: '0.3rem', fontSize: '0.6rem' }} />}
          {String(getAdminRoleLabel(admin.admin_role, 'Administrator')).toUpperCase()}
        </span>
        <span className={statusClass}>{String(admin.status || 'active').toUpperCase()}</span>
      </div>

      <div className="admin-card-body">
        <div className="admin-card-user">
          <div className={`admin-card-avatar ${isPresident ? 'super' : 'default'}`}>
            {isPresident ? <FaUserShield style={{ fontSize: '1.3rem' }} /> : initials}
          </div>
          <div>
            <p className="admin-card-name">{admin.full_name}</p>
            <p className="admin-card-email">{admin.contact_email}</p>
          </div>
        </div>

        <div className="admin-card-info">
          <div className="admin-info-row">
            <span className="info-label">User ID</span>
            <span className="info-value">{admin.employee_id_number || 'N/A'}</span>
          </div>
          <div className="admin-info-row">
            <span className="info-label">Phone</span>
            <span className="info-value">{admin.phone_number || 'N/A'}</span>
          </div>
        </div>

        <div className="admin-permissions-box">
          <p className="admin-permissions-label">PERMISSIONS</p>
          <div className="admin-permission-tags">
            {(admin.permissions || []).slice(0, 3).map((permission) => (
              <span key={permission} className="admin-permission-tag tag-blue">
                {formatPermissionLabel(permission)}
              </span>
            ))}
            {(admin.permissions || []).length > 3 && (
              <span className="admin-permission-tag tag-blue">
                +{admin.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="admin-card-footer">
        <span className="admin-action-link link-primary">
          View Profile
        </span>
        <FaChevronRight className="admin-card-arrow" />
      </div>
    </div>
  );
}

export default function AdminMgmtGrid({ admins = [], loading = false, error = '', onAdminClick }) {
  if (loading) {
    return (
      <div className="admin-cards-grid">
        {[1, 2, 3].map((i) => (
          <div key={i} className="admin-card admin-card-skeleton">
            <div className="skeleton-header" />
            <div className="admin-card-body">
              <div className="admin-card-user">
                <div className="skeleton-avatar" />
                <div className="skeleton-lines">
                  <div className="skeleton-line long" />
                  <div className="skeleton-line short" />
                </div>
              </div>
              <div className="skeleton-block" />
              <div className="skeleton-block short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="admin-alert-box admin-alert-error">{error}</div>;
  }

  if (admins.length === 0) {
    return <div className="admin-alert-box">No administrator accounts found.</div>;
  }

  return (
    <div className="admin-cards-grid">
      {admins.map((admin) => (
        <AdminCard key={admin.id} admin={admin} onAdminClick={onAdminClick} />
      ))}
    </div>
  );
}
