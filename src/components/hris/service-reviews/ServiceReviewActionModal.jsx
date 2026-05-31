import { FaCheck, FaCheckCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

const ACTION_CONFIG = {
  publish: {
    icon: FaCheckCircle,
    iconClass: 'green',
    title: 'Publish Review',
    description: 'Publish this review for approved use.',
    placeholder: 'Optional moderation notes...',
    buttonClass: 'sr-review-btn-success',
    buttonIcon: FaCheck,
    buttonLabel: 'Publish',
    loadingLabel: 'Publishing...',
  },
  reject: {
    icon: FaTimesCircle,
    iconClass: 'red',
    title: 'Reject Review',
    description: 'Please provide a reason for rejecting this review.',
    placeholder: 'Enter reason for rejection...',
    buttonClass: 'sr-review-btn-danger',
    buttonIcon: FaTimes,
    buttonLabel: 'Reject',
    loadingLabel: 'Rejecting...',
  },
};

export default function ServiceReviewActionModal({
  action,
  review,
  reviewNotes,
  actionLoadingId,
  onClose,
  onNotesChange,
  onConfirm,
}) {
  const config = ACTION_CONFIG[action];
  if (!config || !review) return null;

  const Icon = config.icon;
  const ButtonIcon = config.buttonIcon;
  const loading = actionLoadingId === review.id;
  const disabled = Boolean(actionLoadingId) || (action === 'reject' && !reviewNotes.trim());

  return (
    <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sr-review-modal-content medium" onClick={(e) => e.stopPropagation()}>
        <div className="sr-review-action-modal-body">
          <div className="sr-review-action-modal-flex">
            <div className={`sr-review-action-icon ${config.iconClass}`}>
              <Icon />
            </div>
            <div style={{ flex: 1 }}>
              <h3 className="sr-review-action-title">{config.title}</h3>
              <p className="sr-review-action-desc">{config.description}</p>
              <textarea
                className="sr-review-textarea"
                rows={3}
                placeholder={config.placeholder}
                value={reviewNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                style={{ marginTop: '0.75rem' }}
              />
            </div>
          </div>
          <div className="sr-review-modal-actions" style={{ paddingTop: '1.5rem' }}>
            <button className="sr-review-btn-secondary" onClick={onClose} disabled={Boolean(actionLoadingId)} type="button">Cancel</button>
            <button className={config.buttonClass} onClick={onConfirm} disabled={disabled} type="button">
              <ButtonIcon /> {loading ? config.loadingLabel : config.buttonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
