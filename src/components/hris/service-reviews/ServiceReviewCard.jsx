import {
  FaCalendar,
  FaCheck,
  FaClock,
  FaEye,
  FaInfoCircle,
  FaMapMarkerAlt,
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

export default function ServiceReviewCard({ review, index, onOpenModal }) {
  return (
    <div
      className="sr-review-card"
      style={{ animationDelay: `${index * 0.05}s`, borderLeftColor: review.borderColor }}
    >
      <div className="sr-review-card-header">
        <div className="sr-review-card-client">
          <EntityAvatar
            avatarUrl={review.avatarUrl}
            initials={review.clientInitials}
            alt={review.clientName}
            className="sr-review-card-avatar"
          />
          <div>
            <h4 className="sr-review-card-client-name">{review.clientName}</h4>
            <p className="sr-review-card-meta">
              Submitted by: {review.submittedBy} <span aria-hidden="true">-</span> <FaClock style={{ display: 'inline', marginBottom: '2px', marginRight: '2px' }} /> {review.date}
            </p>
          </div>
        </div>
        <div className="sr-review-card-rating">
          <div className="sr-review-card-stars">
            <ServiceReviewStars rating={review.rating} />
          </div>
          <p className="sr-review-card-score">{Number(review.rating || 0).toFixed(1)} / 5</p>
        </div>
      </div>

      <div className="sr-review-card-badges">
        <span className="sr-review-badge sr-review-badge-category">{review.category}</span>
        <span className={`sr-review-badge sr-review-badge-submission sr-review-badge-submission--${review.submissionType}`}>
          {review.submissionTypeLabel}
        </span>
        <ServiceReviewStatusBadge review={review} />
      </div>

      <p className="sr-review-card-text">{review.content}</p>

      <div className="sr-review-card-footer">
        <div className="sr-review-card-info">
          <span><FaMapMarkerAlt /> {review.site}</span>
          {review.reviewedEmployeeName && (
            <span>
              <FaInfoCircle /> Reviewed Guard: {reviewedGuardLabel(review)}
            </span>
          )}
          <span><FaCalendar /> Service Period: {review.period || 'N/A'}</span>
        </div>
        <div className="sr-review-card-actions">
          <button className="sr-review-btn sr-review-btn-view" onClick={() => onOpenModal('detail', review)} type="button">
            <FaEye /> View
          </button>
          {review.status === 'pending' && (
            <>
              <button className="sr-review-btn sr-review-btn-publish" onClick={() => onOpenModal('publish', review)} type="button">
                <FaCheck /> Publish
              </button>
              <button className="sr-review-btn sr-review-btn-reject" onClick={() => onOpenModal('reject', review)} type="button">
                <FaTimes /> Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
