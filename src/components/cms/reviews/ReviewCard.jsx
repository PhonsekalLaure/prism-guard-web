import { FaStar, FaStarHalfAlt, FaRegStar, FaMapMarkerAlt, FaCalendar, FaCheckCircle, FaHourglassHalf, FaClock } from 'react-icons/fa';

/**
 * Map category string → badge CSS class
 */
const CATEGORY_CLASS = {
  'Guard Performance': 'srv-category-badge--guard',
  'Incident Response': 'srv-category-badge--incident',
  'Communication':     'srv-category-badge--communication',
  'Overall Service':   'srv-category-badge--overall',
};

/**
 * Render filled / half / empty stars from a numeric score (0–5, supports .5)
 */
function ReviewStars({ score }) {
  const full  = Math.floor(score);
  const half  = score % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="srv-review-stars">
      {Array.from({ length: full  }).map((_, i) => <FaStar        key={`f${i}`} className="srv-star-icon" />)}
      {half                                      && <FaStarHalfAlt             className="srv-star-icon" />}
      {Array.from({ length: empty }).map((_, i) => <FaRegStar     key={`e${i}`} className="srv-star-icon srv-star-icon--empty" />)}
    </div>
  );
}

/**
 * ReviewCard — renders a single past review entry.
 *
 * Props:
 *   review — {
 *     category, status, date,
 *     score, text,
 *     site, period, reviewer
 *   }
 */
export default function ReviewCard({ review }) {
  const {
    category, status, date,
    score, text,
    site, period, reviewer,
  } = review;

  const categoryClass = CATEGORY_CLASS[category] ?? 'srv-category-badge--overall';
  const isPublished   = status === 'Published';

  return (
    <div className="srv-review-card">
      {/* Top Row */}
      <div className="srv-review-card-top">
        <div className="srv-review-meta">
          <div className="srv-review-badges">
            <span className={`srv-category-badge ${categoryClass}`}>{category}</span>
            <span className={`srv-status-badge ${isPublished ? 'srv-status-badge--published' : 'srv-status-badge--pending'}`}>
              {isPublished
                ? <><FaCheckCircle /> Published</>
                : <><FaHourglassHalf /> Pending</>}
            </span>
          </div>
          <p className="srv-review-date">
            <FaClock /> {date}
          </p>
        </div>

        <div className="srv-review-score">
          <ReviewStars score={score} />
          <p className="srv-score-label">{score.toFixed(1)} / 5</p>
        </div>
      </div>

      {/* Review text */}
      <p className="srv-review-text">{text}</p>

      {/* Footer */}
      <div className="srv-review-footer">
        <div className="srv-review-footer-meta">
          <span className="srv-footer-tag">
            <FaMapMarkerAlt /> {site}
          </span>
          <span className="srv-footer-tag">
            <FaCalendar /> Service Period: {period}
          </span>
        </div>
        <span className="srv-reviewed-by">Reviewed by: {reviewer}</span>
      </div>
    </div>
  );
}