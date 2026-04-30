import { FaInfoCircle } from 'react-icons/fa';

export default function AdminMgmtAlertBox() {
  return (
    <div className="admin-alert-box">
      <FaInfoCircle className="admin-alert-icon" />
      <div>
        <p className="admin-alert-title">Admin Account Security</p>
        <p className="admin-alert-text">
          Only Super Administrators can create, modify, or deactivate admin accounts.
          For now, new admin accounts are provisioned with a president-set temporary
          password and role-based access.
        </p>
      </div>
    </div>
  );
}
