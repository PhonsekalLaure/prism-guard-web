import { FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import ReportActionButton from './ReportActionButton';
import '@styles/components/ReportActions.css';

const toneIcon = {
  warning: FaExclamationTriangle,
  danger: FaExclamationTriangle,
  info: FaInfoCircle,
};

export default function ReportConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  tone = 'info',
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  const Icon = toneIcon[tone] || FaInfoCircle;

  return (
    <div className="report-confirm-overlay" onClick={() => !loading && onCancel?.()}>
      <section
        className={`report-confirm-card report-confirm-card--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-confirm-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="report-confirm-header">
          <span className="report-confirm-icon">
            <Icon />
          </span>
          <div>
            <h2 id="report-confirm-title">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <button
            className="report-confirm-close"
            type="button"
            aria-label="Close"
            onClick={onCancel}
            disabled={loading}
          >
            <FaTimes />
          </button>
        </header>

        <footer className="report-confirm-actions">
          <button
            className="report-confirm-cancel"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <ReportActionButton
            label={confirmLabel}
            loadingLabel="Working..."
            icon={Icon}
            loading={loading}
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
          />
        </footer>
      </section>
    </div>
  );
}
