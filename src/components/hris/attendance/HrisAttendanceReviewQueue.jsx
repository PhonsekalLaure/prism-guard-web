import { FaExclamationTriangle, FaRedo, FaSearch } from 'react-icons/fa';

function formatReviewDate(value) {
  if (!value) return 'Unknown date';
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function getReviewReason(review) {
  if (review.type === 'missed_clock_out') return review.clockIn ? `Clock-in: ${review.clockIn}` : 'No clock-out recorded';
  if (review.type === 'geofence_payroll_review') {
    return review.detectedStart && review.detectedEnd
      ? `Away: ${review.detectedStart} - ${review.detectedEnd}`
      : review.reasonText || 'Outside geofence interval pending payroll review';
  }
  return review.reasonText || review.reasonCode || 'Attendance contest submitted';
}

export default function HrisAttendanceReviewQueue({
  reviews = [],
  metadata = null,
  loading = false,
  error = null,
  onRefresh,
  onOpenReview,
}) {
  const count = metadata?.count ?? reviews.length;
  const missedClockOutCount = metadata?.missedClockOutCount ?? reviews.filter((review) => review.type === 'missed_clock_out').length;
  const attendanceContestCount = metadata?.attendanceContestCount ?? reviews.filter((review) => review.type === 'attendance_contest').length;
  const geofencePayrollReviewCount = metadata?.geofencePayrollReviewCount ?? reviews.filter((review) => review.type === 'geofence_payroll_review').length;
  const visibleReviews = reviews.slice(0, 6);

  return (
    <section className="ha-review-queue" aria-labelledby="attendance-review-queue-title">
      <div className="ha-review-queue-header">
        <div>
          <h3 id="attendance-review-queue-title"><FaExclamationTriangle /> Needs Review</h3>
          <p>Pending attendance contests, missed clock-outs, and geofence payroll alerts across the recent review window.</p>
        </div>
        <button type="button" className="ha-review-refresh" onClick={onRefresh} disabled={loading}>
          <FaRedo className={loading ? 'spinning' : ''} /> Refresh
        </button>
      </div>

      <div className="ha-review-summary" aria-label="Attendance review totals">
        <div>
          <span>Total Pending</span>
          <strong>{loading ? '...' : count}</strong>
        </div>
        <div>
          <span>Missed Clock-outs</span>
          <strong>{loading ? '...' : missedClockOutCount}</strong>
        </div>
        <div>
          <span>Contests</span>
          <strong>{loading ? '...' : attendanceContestCount}</strong>
        </div>
        <div>
          <span>Geofence Payroll</span>
          <strong>{loading ? '...' : geofencePayrollReviewCount}</strong>
        </div>
      </div>

      {error && <div className="ha-review-error">{error}</div>}

      {!loading && !error && count === 0 && (
        <div className="ha-review-empty">No pending attendance reviews in the recent window.</div>
      )}

      {!error && visibleReviews.length > 0 && (
        <div className="ha-review-list">
          {visibleReviews.map((review) => (
            <button
              type="button"
              className="ha-review-item"
              key={`${review.type}:${review.attendanceLogId || review.contestId}`}
              onClick={() => onOpenReview?.(review)}
            >
              <span className={`ha-review-type is-${review.type}`}>{review.typeLabel}</span>
              <span className="ha-review-person">
                <strong>{review.employeeName}</strong>
                <small>{review.employeeNumber} / {review.clientName} / {review.siteName}</small>
              </span>
              <span className="ha-review-meta">
                <strong>{formatReviewDate(review.date)}</strong>
                <small>{review.shift}</small>
              </span>
              <span className="ha-review-reason">{getReviewReason(review)}</span>
              <span className="ha-review-action"><FaSearch /> Review</span>
            </button>
          ))}
        </div>
      )}

      {!error && count > visibleReviews.length && (
        <p className="ha-review-more">Showing first {visibleReviews.length} of {count}. Resolve the oldest items first.</p>
      )}
    </section>
  );
}
