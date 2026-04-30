import { FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function RelieveEmployeeDialog({ isOpen, employeeName, isSaving, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserMinus />
          </div>
          <div>
            <h3 className="term-title">Relieve From Post</h3>
            <p className="term-subtitle">This keeps the employee active but removes the current assignment</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to relieve <strong>{employeeName}</strong> from the current post. Their active deployment
              and schedule will be closed, but the employee will remain <strong>Active</strong> in the system.
            </p>
          </div>
          <p className="term-note">
            After this, the employee will return to floating status and can be assigned to another client site later.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Assigned
          </button>
          <button className="dlg-btn dlg-btn-deploy" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserMinus />}
            {isSaving ? 'Relieving...' : 'Yes, Relieve Guard'}
          </button>
        </div>
      </div>
    </div>
  );
}
