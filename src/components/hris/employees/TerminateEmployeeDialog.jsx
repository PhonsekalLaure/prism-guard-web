import { FaSpinner, FaUserTimes } from 'react-icons/fa';

export default function TerminateEmployeeDialog({ isOpen, employeeName, isSaving, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>

        {/* Hero */}
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserTimes />
          </div>
          <div>
            <h3 className="term-title">Terminate Employee</h3>
            <p className="term-subtitle">This action cannot be easily undone</p>
          </div>
        </div>

        {/* Body */}
        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to terminate <strong>{employeeName}</strong>. Their status will be
              changed to <strong>Terminated</strong> and they can no longer be assigned
              to any client site.
            </p>
          </div>
          <p className="term-note">
            All active deployments will be flagged. You can reactivate this employee
            later through system settings if needed.
          </p>
        </div>

        {/* Footer */}
        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Employee
          </button>
          <button className="dlg-btn dlg-btn-danger" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserTimes />}
            {isSaving ? 'Terminating…' : 'Yes, Terminate'}
          </button>
        </div>

      </div>
    </div>
  );
}
