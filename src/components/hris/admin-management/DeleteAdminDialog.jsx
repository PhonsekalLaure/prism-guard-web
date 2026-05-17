import { FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function DeleteAdminDialog({ isOpen, adminName, isDeleting, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>

        {/* Hero */}
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserMinus />
          </div>
          <div>
            <h3 className="term-title">Delete Administrator</h3>
            <p className="term-subtitle">This action cannot be undone</p>
          </div>
        </div>

        {/* Body */}
        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to permanently delete <strong>{adminName}</strong>. This account
              will be removed from the system and they will lose all administrative access.
            </p>
          </div>
          <p className="term-note">
            All associated permissions and audit history will be retained for compliance
            purposes, but this account will no longer be able to log in.
          </p>
        </div>

        {/* Footer */}
        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isDeleting}>
            Keep Admin
          </button>
          <button className="dlg-btn dlg-btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <FaSpinner className="animate-spin" /> : <FaUserMinus />}
            {isDeleting ? 'Deleting…' : 'Yes, Delete'}
          </button>
        </div>

      </div>
    </div>
  );
}
