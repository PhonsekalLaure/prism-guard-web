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
  'Guard Performance': 'srv-category-badge--guard',
  'Incident Response': 'srv-category-badge--incident',
  Communication: 'srv-category-badge--communication',
  'overall-service': 'srv-category-badge--overall',
  'Overall Service': 'srv-category-badge--overall',
};

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
  const reviewedGuardLabel = [
    review.reviewedEmployeeNumber,
    review.reviewedEmployeeName,
  ].filter(Boolean).join(' - ');

  return (
    <div className="srv-review-card">
      <div className="srv-review-card-top">
        <div className="srv-review-meta">
          <div className="srv-review-badges">
            <span className={`srv-category-badge ${categoryClass}`}>{category}</span>
            {review.submissionTypeLabel && (
              <span className={`srv-submission-badge srv-submission-badge--${review.submissionType}`}>
                {review.submissionTypeLabel}
              </span>
            )}
            <span className={`srv-status-badge ${
              status === 'Published'
                ? 'srv-status-badge--published'
                : status === 'Not Published'
                  ? 'srv-status-badge--rejected'
                  : 'srv-status-badge--pending'
            }`}
            >
              {status === 'Published' && <><FaCheckCircle /> Published</>}
              {status === 'Not Published' && <><FaTimesCircle /> Not Published</>}
              {status === 'Pending' && <><FaHourglassHalf /> Pending</>}
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
