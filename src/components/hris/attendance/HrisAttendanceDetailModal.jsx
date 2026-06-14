import { useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaMinusCircle, FaTimes, FaUserShield } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import attendanceService from '@services/hris/attendanceService';
import {
  GPS_ICONS,
  STATUS_META,
  formatDistance,
  formatGeofenceEvidence,
  formatReasonCode,
  getClockInNoteClass,
  getClockOutNoteClass,
  getHoursNoteClass,
} from './attendanceUi';

function AttendanceDetailSkeleton() {
  return (
    <>
      <div className="ha-modal-grid">
        <SkeletonList count={4}>{(index) => (
          <div key={index} className="ha-modal-cell">
            <SkeletonBlock height="0.65rem" width="50%" style={{ marginBottom: '0.45rem' }} />
            <SkeletonBlock height="1rem" width="72%" style={{ marginBottom: '0.25rem' }} />
            <SkeletonBlock height="0.65rem" width="58%" />
          </div>
        )}</SkeletonList>
      </div>

      {[0, 1].map((sectionIndex) => (
        <div key={sectionIndex} className="ha-modal-section">
          <SkeletonBlock height="0.75rem" width={sectionIndex === 0 ? 130 : 100} />
          <div className="ha-detail-grid">
            <SkeletonList count={8}>{(index) => (
              <div key={index}>
                <SkeletonBlock height="0.65rem" width="56%" style={{ marginBottom: '0.35rem' }} />
                <SkeletonBlock height="0.85rem" width="78%" />
              </div>
            )}</SkeletonList>
          </div>
        </div>
      ))}

      <div className="ha-modal-section">
        <SkeletonBlock height="0.75rem" width={64} />
        <SkeletonBlock height={70} radius={12} />
      </div>
    </>
  );
}

export default function HrisAttendanceDetailModal({
  row,
  detail,
  loading = false,
  error = null,
  onClose,
  onDetailUpdated,
}) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const displayRow = detail?.summary || row;
  const statusMeta = STATUS_META[displayRow.status] || STATUS_META.absent;
  const missedClockOutReview = detail?.missedClockOutReview;
  const canApproveScheduledEnd = Boolean(missedClockOutReview?.canApproveScheduledEnd);

  const handleApproveScheduledEnd = async () => {
    const notes = reviewNotes.trim();
    if (!notes) {
      setReviewError('Review notes are required.');
      return;
    }

    try {
      setReviewLoading(true);
      setReviewError(null);
      const updatedDetail = await attendanceService.approveMissedClockOutScheduledEnd(
        displayRow.attendanceLogId,
        notes
      );
      setReviewNotes('');
      onDetailUpdated?.(updatedDetail);
    } catch (err) {
      setReviewError(err?.response?.data?.error || 'Failed to approve missed clock-out.');
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="ha-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose?.()}>
      <div className="ha-modal-content">
        <div className="ha-modal-header">
          <div>
            <h2>Attendance Log Details</h2>
            <p>{detail?.log?.logDate || 'Attendance record'}</p>
          </div>
          <button className="ha-modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ha-modal-body">
          <div className="ha-modal-emp-box">
            <EntityAvatar
              avatarUrl={displayRow.avatarUrl}
              initials={displayRow.initials}
              className="ha-avatar ha-modal-avatar"
              alt={displayRow.name || displayRow.initials}
            />
            <div className="ha-modal-emp-info">
              <h3>{displayRow.name}</h3>
              <p><FaUserShield style={{ marginRight: '4px' }} />{displayRow.role}</p>
              <span className="ha-modal-location">
                <FaMapMarkerAlt /> {displayRow.location} - {displayRow.area}
              </span>
            </div>
            <span className={`ha-status-badge ${statusMeta.className}`}>
              {statusMeta.label}
            </span>
          </div>

          {loading ? (
            <AttendanceDetailSkeleton />
          ) : (
            <>
              {error && (
                <div className="ha-modal-alert">{error}</div>
              )}

              {!displayRow.attendanceLogId && (
                <div className="ha-modal-alert neutral">
                  No attendance log exists for this expected attendance row. This record is derived from the active deployment and schedule for the selected date.
                </div>
              )}

          <div className="ha-modal-grid">
            <div className="ha-modal-cell">
              <label><FaClock style={{ marginRight: '4px' }} />Clock In</label>
              <p className={displayRow.status === 'late' ? 'ha-modal-late' : ''}>{detail?.log?.clockIn || displayRow.clockIn || '-'}</p>
              <span className={`ha-time-sub ${getClockInNoteClass(displayRow)}`}>{displayRow.clockInNote}</span>
            </div>
            <div className="ha-modal-cell">
              <label><FaClock style={{ marginRight: '4px' }} />Clock Out</label>
              <p>{detail?.log?.clockOut || displayRow.clockOut || '-'}</p>
              <span className={`ha-time-sub ${getClockOutNoteClass(displayRow)}`}>{displayRow.clockOutNote}</span>
            </div>
            <div className="ha-modal-cell">
              <label>Work Hours</label>
              <p className={displayRow.hoursNote === 'Completed' ? 'ha-modal-full' : ''}>{displayRow.hours}</p>
              <span className={`ha-time-sub ${getHoursNoteClass(displayRow)}`}>{displayRow.hoursNote}</span>
            </div>
            <div className="ha-modal-cell">
              <label>Scheduled Shift</label>
              <p>{detail?.schedule?.shift || displayRow.shift}</p>
            </div>
          </div>

          <div className="ha-modal-section">
            <span className="ha-modal-section-label">Attendance Details</span>
            <div className="ha-detail-grid">
              <div><span>Employee ID</span><strong>{detail?.employee?.employeeIdNumber || displayRow.empId}</strong></div>
              <div><span>Log Date</span><strong>{detail?.log?.logDate || 'N/A'}</strong></div>
              <div><span>Assignment Type</span><strong>{displayRow.deploymentTypeLabel || 'Regular Assignment'}</strong></div>
              {displayRow.isTemporaryReplacement && (
                <div><span>Covering For</span><strong>{displayRow.coveringForName || 'N/A'}</strong></div>
              )}
              <div><span>Attendance Status</span><strong>{displayRow.attendanceStatusLabel || statusMeta.label}</strong></div>
            </div>
          </div>

          {(missedClockOutReview?.status || displayRow.missedClockOutReviewStatus) && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Missed Clock-out Review</span>
              <div className="ha-detail-grid">
                <div><span>Review Status</span><strong>{missedClockOutReview?.statusLabel || displayRow.missedClockOutReviewStatus}</strong></div>
                <div><span>Approved Clock-out</span><strong>{missedClockOutReview?.approvedClockOut || 'N/A'}</strong></div>
                <div><span>Reviewed By</span><strong>{missedClockOutReview?.reviewedBy || 'N/A'}</strong></div>
                <div><span>Reviewed At</span><strong>{missedClockOutReview?.reviewedAt || 'N/A'}</strong></div>
              </div>
              <div className="ha-modal-notes-box">
                {missedClockOutReview?.notes || 'No review notes yet.'}
              </div>

              {canApproveScheduledEnd && (
                <div className="ha-review-action">
                  <label htmlFor="missed-clock-out-review-notes">Review Notes</label>
                  <textarea
                    id="missed-clock-out-review-notes"
                    value={reviewNotes}
                    onChange={(event) => setReviewNotes(event.target.value)}
                    placeholder="Explain why the scheduled shift end is being approved."
                    rows={3}
                    disabled={reviewLoading}
                  />
                  {reviewError && <div className="ha-modal-alert">{reviewError}</div>}
                  <button
                    type="button"
                    className="ha-modal-btn primary"
                    onClick={handleApproveScheduledEnd}
                    disabled={reviewLoading}
                  >
                    {reviewLoading ? 'Approving...' : 'Approve Scheduled End'}
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="ha-modal-section">
            <span className="ha-modal-section-label">GPS Evidence</span>
            <div className="ha-detail-grid">
              <div>
                <span>GPS Status</span>
                <strong className={`ha-gps ${detail?.gps?.statusClass || displayRow.gpsClass}`}>
                  {(() => {
                    const GpsIcon = GPS_ICONS[detail?.gps?.statusClass || displayRow.gpsClass] || FaMinusCircle;
                    return <GpsIcon />;
                  })()} {detail?.gps?.status || displayRow.gps}
                </strong>
              </div>
              <div><span>Clock-in Check</span><strong>{formatGeofenceEvidence(detail?.log?.clockInEvidence)}</strong></div>
              <div><span>Clock-out Check</span><strong>{formatGeofenceEvidence(detail?.log?.clockOutEvidence)}</strong></div>
              <div><span>Geofence Radius</span><strong>{detail?.assignment?.geofenceRadiusMeters ? `${detail.assignment.geofenceRadiusMeters}m` : 'N/A'}</strong></div>
              <div><span>Latest Ping Time</span><strong>{detail?.gps?.latestPing?.pingTime || 'N/A'}</strong></div>
              <div><span>Latest Ping</span><strong>{formatGeofenceEvidence(detail?.gps?.latestPing)}</strong></div>
              <div><span>Ping Summary</span><strong>{`${detail?.gps?.pingCount || 0} checks, ${detail?.gps?.outsidePingCount || 0} outside`}</strong></div>
              <div><span>Review Required</span><strong>{detail?.gps?.reviewRequiredAt ? detail.gps.reviewRequiredAt : 'No'}</strong></div>
              <div>
                <span>Risk Reasons</span>
                <strong>
                  {detail?.gps?.riskReasons?.length
                    ? detail.gps.riskReasons.map(formatReasonCode).join(', ')
                    : 'None'}
                </strong>
              </div>
            </div>
          </div>

          {detail?.gps?.attempts?.length > 0 && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Location Evidence Attempts</span>
              <div className="ha-ping-list">
                {detail.gps.attempts.map((attempt) => (
                  <div key={attempt.id} className={`ha-ping-row ${attempt.decision === 'review' || attempt.decision === 'blocked' ? 'outside' : ''}`}>
                    <div>
                      <strong>{attempt.createdAt}</strong>
                      <span>
                        {attempt.action?.replace(/_/g, ' ') || 'location'} - {attempt.decision}
                      </span>
                    </div>
                    <span>
                      {attempt.reasonCodes?.length
                        ? attempt.reasonCodes.map(formatReasonCode).join(', ')
                        : `${attempt.accuracyMeters ?? 'N/A'}m accuracy`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {detail?.gps?.pings?.length > 0 && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Location Ping History</span>
              <div className="ha-ping-list">
                {detail.gps.pings.map((ping) => (
                  <div key={ping.id} className={`ha-ping-row ${ping.isWithinGeofence === false ? 'outside' : ''}`}>
                    <div>
                      <strong>{ping.pingTime}</strong>
                      <span>{formatDistance(ping.distanceMeters)}</span>
                    </div>
                    <span>{ping.result || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="ha-modal-section">
            <span className="ha-modal-section-label">Notes</span>
            <div className="ha-modal-notes-box">
              {displayRow.notes}
            </div>
          </div>
            </>
          )}
        </div>

        <div className="ha-modal-footer">
          <button className="ha-modal-btn secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
