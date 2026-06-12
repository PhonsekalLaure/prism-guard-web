import { FaSpinner, FaUserCheck } from 'react-icons/fa';

export default function ReactivateAccountDialog({
  isOpen,
  entityLabel,
  entityName,
  detailMessage,
  isSaving,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(event) => event.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring term-icon-ring-success">
            <FaUserCheck />
          </div>
          <div>
            <h3 className="term-title">Reactivate {entityLabel}</h3>
            <p className="term-subtitle">Restore this account to active status</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box term-success-box">
            <p>
              You are about to reactivate <strong>{entityName}</strong>. Their account status will
              be changed to <strong>Active</strong>.
            </p>
          </div>
          <p className="term-note">
            {detailMessage || (
              'Previous contracts, schedules, and deployments remain unchanged. Renew or configure them separately before resuming operations.'
            )}
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button className="dlg-btn dlg-btn-success" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserCheck />}
            {isSaving ? 'Reactivating...' : 'Yes, Reactivate'}
          </button>
        </div>
      </div>
    </div>
  );
}
