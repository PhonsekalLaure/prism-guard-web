import { FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function DeactivateEmployeeDialog({ isOpen, employeeName, isSaving, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserMinus />
          </div>
          <div>
            <h3 className="term-title">Deactivate Employee</h3>
            <p className="term-subtitle">This keeps the record but removes it from operations</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to deactivate <strong>{employeeName}</strong>. Their status will be
              changed to <strong>Inactive</strong> and they will no longer be deployable or able
              to access protected systems. Their active employment contract will also be closed.
            </p>
          </div>
          <p className="term-note">
            The employee row will stay in the database. This action only marks the account as
            inactive, stamps the soft-delete timestamp, and ends the current employment contract.
            Deactivation is only allowed for floating guards.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Employee
          </button>
          <button className="dlg-btn dlg-btn-danger" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserMinus />}
            {isSaving ? 'Deactivating...' : 'Yes, Deactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}
