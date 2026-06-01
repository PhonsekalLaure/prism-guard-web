import { FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';

const STATUS_ICONS = {
  pending: FaHourglassHalf,
  published: FaCheckCircle,
  rejected: FaTimesCircle,
};

export default function ServiceReviewStatusBadge({ review }) {
  const Icon = STATUS_ICONS[review.status] || FaHourglassHalf;

  return (
    <span className={`sr-review-badge sr-review-badge-status sr-review-badge-status--${review.status}`}>
      <Icon style={{ marginRight: '4px' }} /> {review.statusLabel}
    </span>
  );
}
