import { FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function DeactivateClientDialog({ isOpen, clientName, isSaving, onCancel, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserMinus />
          </div>
          <div>
            <h3 className="term-title">Deactivate Client</h3>
            <p className="term-subtitle">This keeps the record but removes it from active operations</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to deactivate <strong>{clientName}</strong>. Their status will be
              changed to <strong>Inactive</strong> and their sites will no longer accept new guard
              deployments.
            </p>
          </div>
          <p className="term-note">
            Deactivation is only allowed when all currently assigned guards have already been
            relieved or transferred away from this client.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Client
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
