import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaMapMarkerAlt,
  FaCalendar,
  FaCheckCircle,
  FaHourglassHalf,
  FaClock,
  FaTimesCircle,
  FaShieldAlt,
} from 'react-icons/fa';

const CATEGORY_CLASS = {
  'guard-performance': 'srv-category-badge--guard',
  'Guard Performance': 'srv-category-badge--guard',
  'incident-response': 'srv-category-badge--incident',
  'Incident Response': 'srv-category-badge--incident',
  communication: 'srv-category-badge--communication',
  Communication: 'srv-category-badge--communication',
  'overall-service': 'srv-category-badge--overall',
  'Overall Service': 'srv-category-badge--overall',
};

const STATUS_META = {
  pending: { label: 'Pending', className: 'srv-status-badge--pending', icon: FaHourglassHalf },
  Pending: { label: 'Pending', className: 'srv-status-badge--pending', icon: FaHourglassHalf },
  published: { label: 'Published', className: 'srv-status-badge--published', icon: FaCheckCircle },
  Published: { label: 'Published', className: 'srv-status-badge--published', icon: FaCheckCircle },
  rejected: { label: 'Not Published', className: 'srv-status-badge--rejected', icon: FaTimesCircle },
  'Not Published': { label: 'Not Published', className: 'srv-status-badge--rejected', icon: FaTimesCircle },
};

function formatEnumLabel(value = '') {
  return String(value)
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function ReviewStars({ score }) {
  const safeScore = Number(score || 0);
  const full = Math.floor(safeScore);
  const half = safeScore % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="srv-review-stars">
      {Array.from({ length: full }).map((_, i) => <FaStar key={`f${i}`} className="srv-star-icon" />)}
      {half && <FaStarHalfAlt className="srv-star-icon" />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar key={`e${i}`} className="srv-star-icon srv-star-icon--empty" />)}
    </div>
  );
}

export default function ReviewCard({ review }) {
  const {
    category,
    status,
    date,
    score,
    text,
    site,
    period,
    reviewer,
  } = review;

  const categoryClass = CATEGORY_CLASS[category] ?? 'srv-category-badge--overall';
  const categoryLabel = formatEnumLabel(category);
  const statusMeta = STATUS_META[status] ?? {
    label: formatEnumLabel(status || 'pending'),
    className: 'srv-status-badge--pending',
    icon: FaHourglassHalf,
  };
  const StatusIcon = statusMeta.icon;
  const submissionClass = review.submissionType || 'ad_hoc';
  const submissionLabel = review.submissionTypeLabel || formatEnumLabel(submissionClass);
  const reviewedGuardLabel = [
    review.reviewedEmployeeNumber,
    review.reviewedEmployeeName,
  ].filter(Boolean).join(' - ');

  return (
    <div className="srv-review-card">
      <div className="srv-review-card-top">
        <div className="srv-review-meta">
          <div className="srv-review-badges">
            <span className={`srv-category-badge ${categoryClass}`}>{categoryLabel}</span>
            {submissionLabel && (
              <span className={`srv-submission-badge srv-submission-badge--${submissionClass}`}>
                {submissionLabel}
              </span>
            )}
            <span className={`srv-status-badge ${statusMeta.className}`}>
              <StatusIcon /> {statusMeta.label}
            </span>
          </div>
          <p className="srv-review-date">
            <FaClock /> {date}
          </p>
        </div>

        <div className="srv-review-score">
          <ReviewStars score={score} />
          <p className="srv-score-label">{Number(score || 0).toFixed(1)} / 5</p>
        </div>
      </div>

      <p className="srv-review-text">{text}</p>

      <div className="srv-review-footer">
        <div className="srv-review-footer-meta">
          <span className="srv-footer-tag">
            <FaMapMarkerAlt /> {site}
          </span>
          <span className="srv-footer-tag">
            <FaCalendar /> Service Period: {period || 'N/A'}
          </span>
          {reviewedGuardLabel && (
            <span className="srv-footer-tag">
              <FaShieldAlt /> Reviewed Guard: {reviewedGuardLabel}
            </span>
          )}
        </div>
        <span className="srv-reviewed-by">Reviewed by: {reviewer}</span>
      </div>
    </div>
  );
}
