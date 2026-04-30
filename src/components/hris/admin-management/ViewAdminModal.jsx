import {
  FaTimes,
  FaCrown,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaIdBadge,
  FaShieldAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaEdit,
  FaTrash,
  FaSave,
} from 'react-icons/fa';
import { useState } from 'react';
import { getAdminRoleLabel, getAdminRolePermissions } from '@utils/adminPermissions';
import AdminEditForm from './AdminEditForm';

function formatDate(dateString) {
  if (!dateString) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(new Date(dateString));
}

function formatPermissionLabel(permission) {
  return permission
    .replace(/\./g, ' › ')
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function StatusIcon({ status }) {
  if (status === 'active') return <FaCheckCircle className="va-status-icon icon-active" />;
  if (status === 'inactive') return <FaTimesCircle className="va-status-icon icon-inactive" />;
  return <FaClock className="va-status-icon icon-pending" />;
}

export default function ViewAdminModal({
  admin,
  onClose,
  onUpdateAdmin,
  isUpdating = false,
  onDelete,
  isDeleting = false,
  loading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [error, setError] = useState('');
  if (!admin && !loading) return null;

  const isPresident = admin.admin_role === 'president';
  const roleLabel = getAdminRoleLabel(admin.admin_role, 'Administrator');
  const permissions = admin.permissions?.length
    ? admin.permissions
    : getAdminRolePermissions(admin.admin_role);

  const initials = `${admin.first_name?.[0] || ''}${admin.last_name?.[0] || ''}`.toUpperCase();

  function startEditing() {
    setEditForm({
      firstName: admin.first_name || '',
      middleName: admin.middle_name || '',
      lastName: admin.last_name || '',
      suffix: admin.suffix || '',
      email: admin.contact_email || '',
      mobile: admin.phone_number ? String(admin.phone_number).replace(/^\+63/, '') : '',
      adminRole: admin.admin_role || '',
    });
    setError('');
    setIsEditing(true);
  }

  function handleField(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!editForm.firstName || !editForm.lastName || !editForm.email || !editForm.mobile || !editForm.adminRole) {
      setError('First name, last name, email, mobile number, and admin role are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!/^\d{10}$/.test(editForm.mobile)) {
      setError('Mobile number must be exactly 10 digits, excluding +63.');
      return;
    }

    try {
      setError('');
      await onUpdateAdmin?.(admin.id, editForm);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update admin account.');
    }
  }

  return (
    <div
      className="va-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="va-modal-content">
        {/* Header */}
        <div className={`va-modal-header ${isPresident ? 'va-header-president' : 'va-header-default'}`}>
          <div className="va-header-inner">
            <div className={`va-header-avatar ${isPresident ? 'va-avatar-president' : 'va-avatar-default'}`}>
              {isPresident ? <FaUserShield className="va-avatar-icon" /> : initials}
            </div>
            <div className="va-header-info">
              <div className="va-header-badges">
                {isPresident && (
                  <span className="va-badge va-badge-crown">
                    <FaCrown className="va-badge-icon" /> President
                  </span>
                )}
                <span className={`va-badge va-badge-status status-${admin.status || 'active'}`}>
                  <StatusIcon status={admin.status} />
                  {String(admin.status || 'active').toUpperCase()}
                </span>
              </div>
              <h2 className="va-admin-name">{admin.full_name}</h2>
              <p className="va-admin-role">{roleLabel}</p>
            </div>
          </div>
          <div className="va-header-actions">
            {!isEditing ? (
              <>
                {onUpdateAdmin && !isPresident && (
                  <button className="va-header-edit-btn" onClick={startEditing}>
                    <FaEdit /> Edit Details
                  </button>
                )}
                <button className="va-close-btn" onClick={onClose} aria-label="Close">
                  <FaTimes />
                </button>
              </>
            ) : (
              <div className="aef-edit-actions">
                <button className="aef-btn-save" onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? <><span className="va-spinner" /> Saving…</> : <><FaSave /> Save Changes</>}
                </button>
                <button className="aef-btn-cancel" onClick={() => setIsEditing(false)} disabled={isUpdating}>
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ padding: '1rem 2rem 0', color: '#ef4444', fontSize: '0.85rem', fontWeight: '500' }}>
            {error}
          </div>
        )}

        {/* Body */}
        <div className="va-modal-body">
          {loading ? (
            <div className="detail-skeleton">
              <div className="dsk-grid cols-2">
                {[1,2,3,4].map(i => <div key={i} className="dsk-info-card"><div className="dsk-icon-wrap" /><div style={{flex:1}}><div className="dsk-line sm" /><div className="dsk-line lg" /></div></div>)}
              </div>
              <div style={{ marginTop: '1.25rem' }}>
                <div className="dsk-line sm" style={{ width: '30%', marginBottom: '0.75rem' }} />
                <div className="dsk-role-banner" />
                <div className="dsk-grid cols-2" style={{ marginTop: '0.75rem' }}>
                  {[1,2,3,4,5,6].map(i => <div key={i} className="dsk-chip" />)}
                </div>
              </div>
            </div>
          ) : isEditing ? (
            <AdminEditForm editForm={editForm} onField={handleField} />
          ) : (
            <>
              {/* Contact & Identity */}
              <div className="va-section">
                <h3 className="va-section-title">
                  <FaIdBadge className="va-section-icon" />
                  Identity & Contact
                </h3>
                <div className="va-info-grid">
                  <div className="va-info-card">
                    <span className="va-info-icon-wrap">
                      <FaIdBadge className="va-info-icon" />
                    </span>
                    <div>
                      <p className="va-info-label">Employee ID</p>
                      <p className="va-info-value">{admin.employee_id_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="va-info-card">
                    <span className="va-info-icon-wrap">
                      <FaEnvelope className="va-info-icon" />
                    </span>
                    <div>
                      <p className="va-info-label">Email Address</p>
                      <p className="va-info-value">{admin.contact_email || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="va-info-card">
                    <span className="va-info-icon-wrap">
                      <FaPhone className="va-info-icon" />
                    </span>
                    <div>
                      <p className="va-info-label">Phone Number</p>
                      <p className="va-info-value">{admin.phone_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="va-info-card">
                    <span className="va-info-icon-wrap">
                      <FaCalendarAlt className="va-info-icon" />
                    </span>
                    <div>
                      <p className="va-info-label">Account Created</p>
                      <p className="va-info-value">{formatDate(admin.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Permissions */}
              <div className="va-section">
                <h3 className="va-section-title">
                  <FaShieldAlt className="va-section-icon" />
                  Role & Permissions
                </h3>

                <div className="va-role-banner">
                  <div className="va-role-banner-inner">
                    <span className={`va-role-pill role-${admin.admin_role}`}>
                      {isPresident && <FaCrown style={{ marginRight: '0.35rem', fontSize: '0.7rem' }} />}
                      {roleLabel.toUpperCase()}
                    </span>
                    <p className="va-role-desc">
                      {isPresident
                        ? 'Full system access with authority to manage all administrators, clients, and employees.'
                        : `Role-based access with permissions scoped to ${roleLabel.toLowerCase()} responsibilities.`}
                    </p>
                  </div>
                </div>

                <div className="va-permissions-grid">
                  {permissions.length > 0 ? (
                    permissions.map((permission) => (
                      <div key={permission} className="va-permission-chip">
                        <FaCheckCircle className="va-chip-icon" />
                        <span>{formatPermissionLabel(permission)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="va-empty-text">No permissions assigned to this role.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="va-modal-footer">
          {onDelete && !isPresident && (
            <button
              className="va-btn va-btn-danger"
              onClick={() => onDelete(admin)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <><span className="va-spinner" /> Deleting...</>
              ) : (
                <><FaTrash /> Delete Admin</>
              )}
            </button>
          )}
          <button className="va-btn va-btn-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
