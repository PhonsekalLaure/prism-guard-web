import {
  FaUserShield, FaEye, FaEdit, FaLock, FaEllipsisV,
  FaCrown, FaKey, FaRedo, FaTrash,
} from 'react-icons/fa';

const admins = [
  {
    id: 'ADMIN-001',
    name: 'President',
    email: 'president@prismguard.com',
    initials: null,
    role: 'president',
    roleLabel: 'SUPER ADMIN',
    status: 'active',
    isSuperAdmin: true,
    created: 'Jan 01, 2026',
    lastLogin: 'Today, 08:30 AM',
    lastLoginColor: 'text-green',
    permissions: [
      { label: 'Full Access', color: 'tag-green' },
      { label: 'User Mgmt', color: 'tag-green' },
      { label: 'All Modules', color: 'tag-green' },
    ],
  },
  {
    id: 'ADMIN-002',
    name: 'Maria Aquino',
    email: 'maria.a@prismguard.com',
    initials: 'MA',
    role: 'operations',
    roleLabel: 'OPERATIONS MANAGER',
    status: 'active',
    created: 'Jan 15, 2026',
    lastLogin: 'Yesterday, 5:45 PM',
    lastLoginColor: 'text-gray',
    permissions: [
      { label: 'Employees', color: 'tag-blue' },
      { label: 'Deployment', color: 'tag-blue' },
      { label: 'Incidents', color: 'tag-blue' },
      { label: 'Attendance', color: 'tag-blue' },
    ],
  },
  {
    id: 'ADMIN-003',
    name: 'Jose Santos',
    email: 'jose.s@prismguard.com',
    initials: 'JS',
    role: 'hr',
    roleLabel: 'HR MANAGER',
    status: 'active',
    created: 'Jan 20, 2026',
    lastLogin: 'Today, 09:15 AM',
    lastLoginColor: 'text-gray',
    permissions: [
      { label: 'Employees', color: 'tag-purple' },
      { label: 'Applicants', color: 'tag-purple' },
      { label: 'Leave Mgmt', color: 'tag-purple' },
    ],
  },
  {
    id: 'ADMIN-004',
    name: 'Linda Reyes',
    email: 'linda.r@prismguard.com',
    initials: 'LR',
    role: 'finance',
    roleLabel: 'FINANCE MANAGER',
    status: 'active',
    created: 'Jan 22, 2026',
    lastLogin: 'Today, 08:00 AM',
    lastLoginColor: 'text-gray',
    permissions: [
      { label: 'Payroll', color: 'tag-green' },
      { label: 'Billing', color: 'tag-green' },
      { label: 'Cash Advance', color: 'tag-green' },
    ],
  },
  {
    id: 'ADMIN-005',
    name: 'Anna Cruz',
    email: 'anna.c@prismguard.com',
    initials: 'AC',
    role: 'secretary',
    roleLabel: 'SECRETARY',
    status: 'pending',
    created: 'Feb 01, 2026',
    lastLogin: 'Never',
    lastLoginColor: 'text-yellow',
    permissions: [
      { label: 'Clients', color: 'tag-pink' },
      { label: 'Documents', color: 'tag-pink' },
      { label: 'Communications', color: 'tag-pink' },
    ],
  },
  {
    id: 'ADMIN-006',
    name: 'Mark Torres',
    email: 'mark.t@prismguard.com',
    initials: 'MT',
    role: 'it',
    roleLabel: 'IT ADMINISTRATOR',
    status: 'inactive',
    created: null,
    deactivated: 'Jan 30, 2026',
    reason: 'Resigned',
    lastLogin: null,
    permissions: [],
  },
];

function AdminCard({ admin }) {
  const isSuperAdmin = admin.isSuperAdmin;
  const isInactive = admin.status === 'inactive';
  const isPending = admin.status === 'pending';

  const avatarClass = isSuperAdmin
    ? 'admin-card-avatar super'
    : isInactive
      ? 'admin-card-avatar inactive'
      : 'admin-card-avatar default';

  const statusClass =
    admin.status === 'active'
      ? 'admin-status-badge status-active'
      : admin.status === 'inactive'
        ? 'admin-status-badge status-inactive'
        : 'admin-status-badge status-pending';

  const statusLabel =
    admin.status === 'active'
      ? 'ACTIVE'
      : admin.status === 'inactive'
        ? 'INACTIVE'
        : 'PENDING PWD CHANGE';

  return (
    <div className={`admin-card${isSuperAdmin ? ' super-admin' : ''}${isInactive ? ' inactive' : ''}`}>
      {/* Header strip */}
      <div className={`admin-card-header ${isSuperAdmin ? 'super-admin-header' : 'default-header'}`}>
        <span className={`admin-role-badge role-${admin.role}`}>
          {isSuperAdmin && <FaCrown style={{ marginRight: '0.3rem', fontSize: '0.6rem' }} />}
          {admin.roleLabel}
        </span>
        <span className={statusClass}>{statusLabel}</span>
      </div>

      {/* Body */}
      <div className="admin-card-body">
        {/* User info */}
        <div className="admin-card-user">
          <div className={avatarClass}>
            {isSuperAdmin ? <FaUserShield style={{ fontSize: '1.3rem' }} /> : admin.initials}
          </div>
          <div>
            <p className="admin-card-name">{admin.name}</p>
            <p className="admin-card-email">{admin.email}</p>
          </div>
        </div>

        {/* Info rows */}
        <div className="admin-card-info">
          {!isInactive && (
            <>
              <div className="admin-info-row">
                <span className="info-label">User ID:</span>
                <span className="info-value">{admin.id}</span>
              </div>
              <div className="admin-info-row">
                <span className="info-label">Created:</span>
                <span className="info-value">{admin.created}</span>
              </div>
              <div className="admin-info-row">
                <span className="info-label">Last Login:</span>
                <span className={`info-value ${admin.lastLoginColor}`}>{admin.lastLogin}</span>
              </div>
            </>
          )}
          {isInactive && (
            <>
              <div className="admin-info-row">
                <span className="info-label">User ID:</span>
                <span className="info-value">{admin.id}</span>
              </div>
              <div className="admin-info-row">
                <span className="info-label">Deactivated:</span>
                <span className="info-value text-red">{admin.deactivated}</span>
              </div>
              <div className="admin-info-row">
                <span className="info-label">Reason:</span>
                <span className="info-value text-gray">{admin.reason}</span>
              </div>
            </>
          )}
        </div>

        {/* Permissions */}
        {!isInactive ? (
          <div className="admin-permissions-box">
            <p className="admin-permissions-label">PERMISSIONS</p>
            <div className="admin-permission-tags">
              {admin.permissions.map((p) => (
                <span key={p.label} className={`admin-permission-tag ${p.color}`}>{p.label}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="admin-permissions-box suspended">
            <p className="admin-permissions-label suspended">ACCOUNT SUSPENDED</p>
            <p className="admin-suspended-text">All access permissions revoked</p>
          </div>
        )}

        {/* Footer */}
        <div className="admin-card-footer">
          {isSuperAdmin && (
            <>
              <button className="admin-action-link link-primary">
                <FaEye /> View Details
              </button>
              <button className="admin-action-link link-disabled" disabled title="Cannot modify super admin">
                <FaLock />
              </button>
            </>
          )}
          {!isSuperAdmin && !isInactive && !isPending && (
            <>
              <button className="admin-action-link link-primary">
                <FaEdit /> Edit Account
              </button>
              <button className="admin-more-btn">
                <FaEllipsisV />
              </button>
            </>
          )}
          {isPending && (
            <>
              <button className="admin-action-link link-primary">
                <FaKey /> Reset Password
              </button>
              <button className="admin-more-btn">
                <FaEllipsisV />
              </button>
            </>
          )}
          {isInactive && (
            <>
              <button className="admin-action-link link-green">
                <FaRedo /> Reactivate
              </button>
              <button className="admin-action-link link-red">
                <FaTrash /> Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminMgmtGrid() {
  return (
    <div className="admin-cards-grid">
      {admins.map((admin) => (
        <AdminCard key={admin.id} admin={admin} />
      ))}
    </div>
  );
}
