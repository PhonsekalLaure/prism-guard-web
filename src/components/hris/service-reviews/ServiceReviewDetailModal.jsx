import {
  FaBuilding,
  FaCheck,
  FaCheckCircle,
  FaInfoCircle,
  FaStar,
  FaTimes,
} from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import ServiceReviewStars from './ServiceReviewStars';
import ServiceReviewStatusBadge from './ServiceReviewStatusBadge';

function reviewedGuardLabel(review) {
  return [
    review.reviewedEmployeeNumber,
    review.reviewedEmployeeName,
  ].filter(Boolean).join(' - ');
}

export default function ServiceReviewDetailModal({
  review,
  onClose,
  onOpenAction,
}) {
  if (!review) return null;

  return (
    <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sr-review-modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="sr-review-modal-header">
          <div className="sr-review-header-text">
            <h2>Review Details</h2>
            <p>Full review information and client feedback</p>
          </div>
          <button className="sr-review-close-btn" onClick={onClose} type="button">
            <FaTimes />
          </button>
        </div>

        <div className="sr-review-modal-body">
          <div className="sr-review-form-section">
            <h3 className="sr-review-section-title">
              <FaBuilding className="sr-review-icon-primary" />
              Client Information
            </h3>

            <div className="sr-review-form-grid">
              <div className="sr-review-form-group sr-review-col-span-2 sr-review-client-summary">
                <EntityAvatar
                  avatarUrl={review.avatarUrl}
                  initials={review.clientInitials}
                  alt={review.clientName}
                  className="sr-review-card-avatar sr-review-card-avatar--large"
                />
                <div style={{ flex: 1 }}>
                  <h4>{review.clientName}</h4>
                  <p>{review.submittedBy}</p>
                </div>
                <ServiceReviewStatusBadge review={review} />
              </div>

              <div className="sr-review-form-group">
                <label>Site</label>
                <p className="sr-review-info-value">{review.site}</p>
              </div>
              <div className="sr-review-form-group">
                <label>Reviewed Guard</label>
                <p className="sr-review-info-value">
                  {review.reviewedEmployeeName ? reviewedGuardLabel(review) : 'N/A'}
                </p>
              </div>
              <div className="sr-review-form-group">
                <label>Service Period</label>
                <p className="sr-review-info-value">{review.period || 'N/A'}</p>
              </div>
              <div className="sr-review-form-group">
                <label>Submitted On</label>
                <p className="sr-review-info-value">{review.date}</p>
              </div>
              <div className="sr-review-form-group">
                <label>Category</label>
                <p className="sr-review-info-value">{review.category}</p>
              </div>
              <div className="sr-review-form-group">
                <label>Submission Type</label>
                <p className="sr-review-info-value">{review.submissionTypeLabel}</p>
              </div>
            </div>
          </div>

          <hr className="sr-review-divider" />

          <div className="sr-review-form-section">
            <h3 className="sr-review-section-title">
              <FaStar className="sr-review-icon-primary" />
              Ratings & Performance
            </h3>

            <div className="sr-review-form-grid">
              <div className="sr-review-form-group sr-review-col-span-2 sr-review-rating-summary">
                <div className="sr-review-rating-summary__overall">
                  <span>Overall Rating</span>
                  <div>
                    <ServiceReviewStars rating={review.rating} />
                    <strong>{Number(review.rating || 0).toFixed(1)} / 5.0</strong>
                  </div>
                </div>
                <div className="sr-review-form-grid">
                  {[
                    ['Guard Quality', review.detailedRatings?.guardQuality],
                    ['Punctuality', review.detailedRatings?.punctuality],
                    ['Communication', review.detailedRatings?.communication],
                    ['Responsiveness', review.detailedRatings?.responsiveness],
                  ].map(([label, value]) => (
                    <div key={label} className="sr-review-form-group">
                      <label>{label}</label>
                      <p className="sr-review-info-value sr-review-rating-value"><FaStar /> {value || '0.0'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <hr className="sr-review-divider" />

          <div className="sr-review-form-section">
            <h3 className="sr-review-section-title">
              <FaInfoCircle className="sr-review-icon-primary" />
              Client Feedback
            </h3>
            <textarea className="sr-review-textarea" readOnly value={review.content} rows={4} />
          </div>

          {review.status !== 'pending' && (
            <>
              <hr className="sr-review-divider" />
              <div className="sr-review-form-section">
                <h3 className="sr-review-section-title">
                  <FaCheckCircle className="sr-review-icon-primary" />
                  HRIS Review
                </h3>
                <div className="sr-review-form-grid">
                  <div className="sr-review-form-group">
                    <label>Reviewed By</label>
                    <p className="sr-review-info-value">{review.reviewedBy || 'N/A'}</p>
                  </div>
                  <div className="sr-review-form-group">
                    <label>Reviewed On</label>
                    <p className="sr-review-info-value">{review.reviewedAtLabel || 'N/A'}</p>
                  </div>
                  <div className="sr-review-form-group sr-review-col-span-2">
                    <label>Notes</label>
                    <p className="sr-review-info-value">{review.reviewNotes || 'No notes provided.'}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          <hr className="sr-review-divider" />

          <div className="sr-review-modal-actions">
            <button className="sr-review-btn-secondary" onClick={onClose} type="button">
              Close
            </button>
            {review.status === 'pending' && (
              <>
                <button className="sr-review-btn-danger" onClick={() => onOpenAction('reject', review)} type="button">
                  <FaTimes /> Reject
                </button>
                <button className="sr-review-btn-success" onClick={() => onOpenAction('publish', review)} type="button">
                  <FaCheck /> Publish
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
