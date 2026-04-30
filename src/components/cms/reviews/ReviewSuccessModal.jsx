import { FaCheckCircle } from 'react-icons/fa';

/**
 * ReviewSuccessModal — shown after a review is successfully submitted.
 *
 * Props:
 *   isOpen  — boolean
 *   onClose — () => void
 */
export default function ReviewSuccessModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="srv-success-modal-overlay" onClick={onClose}>
      <div
        className="srv-success-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="srv-success-icon">
          <FaCheckCircle />
        </div>
        <h3>Review Submitted!</h3>
        <p>
          Thank you for your feedback. Your review has been submitted and will
          be published after moderation.
        </p>
        <button className="srv-success-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}