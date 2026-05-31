import { FaMapMarkerAlt, FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function DeactivateClientSiteDialog({
  isOpen,
  siteName,
  clientName,
  isSaving = false,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaMapMarkerAlt />
          </div>
          <div>
            <h3 className="term-title">Deactivate Site</h3>
            <p className="term-subtitle">This keeps the site visible but removes it from active deployment options</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to deactivate <strong>{siteName}</strong> for <strong>{clientName}</strong>.
              This site will stay in client details as inactive and can no longer receive new deployments.
            </p>
          </div>
          <p className="term-note">
            Deactivation is only allowed when all active guards assigned to this site have already been relieved or transferred.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Site
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
