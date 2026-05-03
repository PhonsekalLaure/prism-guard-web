import { FaSpinner, FaUserMinus } from 'react-icons/fa';

export default function RelieveAllClientGuardsDialog({
  isOpen,
  clientName,
  guardCount,
  isSaving,
  onCancel,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card term-card" onClick={(e) => e.stopPropagation()}>
        <div className="term-hero">
          <div className="term-icon-ring">
            <FaUserMinus />
          </div>
          <div>
            <h3 className="term-title">Relieve All Guards</h3>
            <p className="term-subtitle">This closes every active assignment for this client</p>
          </div>
        </div>

        <div className="term-body">
          <div className="term-warning-box">
            <p>
              You are about to relieve <strong>{guardCount}</strong> active guard(s) currently
              deployed to <strong>{clientName}</strong>.
            </p>
          </div>
          <p className="term-note">
            Each guard will be returned to floating status using the same relief workflow as the
            employee detail page.
          </p>
        </div>

        <div className="dlg-footer">
          <button className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Keep Assignments
          </button>
          <button className="dlg-btn dlg-btn-danger" onClick={onConfirm} disabled={isSaving}>
            {isSaving ? <FaSpinner className="animate-spin" /> : <FaUserMinus />}
            {isSaving ? 'Relieving...' : 'Yes, Relieve All'}
          </button>
        </div>
      </div>
    </div>
  );
}
