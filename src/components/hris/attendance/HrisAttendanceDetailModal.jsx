import { useState } from 'react';
import { FaClock, FaMapMarkerAlt, FaMinusCircle, FaTimes, FaUserShield } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import attendanceService, { resolveGeofencePayrollReview as resolveGeofencePayrollReviewRequest } from '@services/hris/attendanceService';
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

const BUSINESS_UTC_OFFSET_MINUTES = 8 * 60;

function toDateTimeLocalValue(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const businessTime = new Date(date.getTime() + BUSINESS_UTC_OFFSET_MINUTES * 60000);
  return businessTime.toISOString().slice(0, 19);
}

function fromDateTimeLocalValue(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second = '0'] = match;
  const utcMs = Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  ) - BUSINESS_UTC_OFFSET_MINUTES * 60000;
  const date = new Date(utcMs);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getGeofenceIntervalKey(interval) {
  return `${interval?.detectedStartAt || ''}:${interval?.detectedEndAt || ''}`;
}
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
  const [contestReviewNotes, setContestReviewNotes] = useState('');
  const [contestReviewLoading, setContestReviewLoading] = useState(false);
  const [contestReviewError, setContestReviewError] = useState(null);
  const [geofenceReviewNotes, setGeofenceReviewNotes] = useState('');
  const [geofenceIntervalEdits, setGeofenceIntervalEdits] = useState({});
  const [geofenceReviewLoadingKey, setGeofenceReviewLoadingKey] = useState(null);
  const [geofenceReviewError, setGeofenceReviewError] = useState(null);
  const displayRow = detail?.summary || row;
  const statusMeta = STATUS_META[displayRow.status] || STATUS_META.absent;
  const missedClockOutReview = detail?.missedClockOutReview;
  const geofencePayrollReview = detail?.geofencePayrollReview;
  const geofenceReviewIntervals = geofencePayrollReview?.intervals || [];
  const canApproveScheduledEnd = Boolean(missedClockOutReview?.canApproveScheduledEnd);
  const attendanceContest = detail?.attendanceContest || (displayRow.attendanceContestId ? {
    id: displayRow.attendanceContestId,
    status: displayRow.attendanceContestStatus,
    reasonCode: displayRow.attendanceContestReasonCode,
    reasonText: displayRow.attendanceContestReasonText,
    reviewNotes: displayRow.attendanceContestReviewNotes,
  } : null);
  const canReviewContest = attendanceContest?.id && attendanceContest.status === 'pending';


  const handleContestDecision = async (decision) => {
    const notes = contestReviewNotes.trim();
    if (!notes) {
      setContestReviewError('Review notes are required.');
      return;
    }

    try {
      setContestReviewLoading(true);
      setContestReviewError(null);
      if (decision === 'approve') {
        await attendanceService.approveAttendanceContest(attendanceContest.id, notes);
      } else {
        await attendanceService.rejectAttendanceContest(attendanceContest.id, notes);
      }
      setContestReviewNotes('');
      onDetailUpdated?.();
      onClose?.();
    } catch (err) {
      setContestReviewError(err?.response?.data?.error || 'Failed to update attendance contest.');
    } finally {
      setContestReviewLoading(false);
    }
  };
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

  const getGeofenceIntervalEdit = (interval) => {
    const intervalKey = getGeofenceIntervalKey(interval);
    return geofenceIntervalEdits[intervalKey] || {
      approvedStartLocal: toDateTimeLocalValue(interval.approvedStartAt || interval.proposedStartAt),
      approvedEndLocal: toDateTimeLocalValue(interval.approvedEndAt || interval.proposedEndAt),
    };
  };

  const handleGeofenceIntervalEdit = (interval, field, value) => {
    const intervalKey = getGeofenceIntervalKey(interval);
    setGeofenceIntervalEdits((previous) => ({
      ...previous,
      [intervalKey]: {
        ...getGeofenceIntervalEdit(interval),
        [field]: value,
      },
    }));
  };

  const handleGeofencePayrollDecision = async (interval, action) => {
    const notes = geofenceReviewNotes.trim();
    if (!notes) {
      setGeofenceReviewError('Review notes are required.');
      return;
    }

    const intervalKey = getGeofenceIntervalKey(interval);
    const loadingKey = `${intervalKey}:${action}`;
    const edit = getGeofenceIntervalEdit(interval);
    const defaultStartLocal = toDateTimeLocalValue(interval.approvedStartAt || interval.proposedStartAt);
    const defaultEndLocal = toDateTimeLocalValue(interval.approvedEndAt || interval.proposedEndAt);
    const approvedStartAt = action === 'approve'
      ? edit.approvedStartLocal === defaultStartLocal
        ? interval.proposedStartAt
        : fromDateTimeLocalValue(edit.approvedStartLocal) || interval.proposedStartAt
      : null;
    const approvedEndAt = action === 'approve'
      ? edit.approvedEndLocal === defaultEndLocal
        ? interval.proposedEndAt
        : fromDateTimeLocalValue(edit.approvedEndLocal) || interval.proposedEndAt
      : null;

    if (action === 'approve' && (!approvedStartAt || !approvedEndAt)) {
      setGeofenceReviewError('Approved start and end are required.');
      return;
    }

    try {
      setGeofenceReviewLoadingKey(loadingKey);
      setGeofenceReviewError(null);
      const updatedDetail = await resolveGeofencePayrollReviewRequest(
        displayRow.attendanceLogId,
        {
          action,
          detectedStartAt: interval.detectedStartAt,
          detectedEndAt: interval.detectedEndAt,
          approvedStartAt,
          approvedEndAt,
          reviewNotes: notes,
        }
      );
      setGeofenceReviewNotes('');
      setGeofenceIntervalEdits((previous) => {
        const next = { ...previous };
        delete next[intervalKey];
        return next;
      });
      onDetailUpdated?.(updatedDetail);
    } catch (err) {
      setGeofenceReviewError(err?.response?.data?.error || 'Failed to update geofence payroll review.');
    } finally {
      setGeofenceReviewLoadingKey(null);
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
                  <div className="ha-review-action-row">
                    <button
                      type="button"
                      className="ha-modal-btn primary"
                      onClick={handleApproveScheduledEnd}
                      disabled={reviewLoading}
                    >
                      {reviewLoading ? 'Approving...' : 'Approve Scheduled End'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {attendanceContest && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Attendance Contest</span>
              <div className="ha-detail-grid">
                <div><span>Contest Status</span><strong>{attendanceContest.status || 'N/A'}</strong></div>
                <div><span>Reason</span><strong>{attendanceContest.reasonCode?.replace(/_/g, ' ') || 'N/A'}</strong></div>
              </div>
              <div className="ha-modal-notes-box">
                {attendanceContest.reasonText || 'No reason provided.'}
              </div>
              {attendanceContest.reviewNotes && (
                <div className="ha-modal-notes-box">
                  {attendanceContest.reviewNotes}
                </div>
              )}

              {canReviewContest && (
                <div className="ha-review-action">
                  <label htmlFor="attendance-contest-review-notes">Review Notes</label>
                  <textarea
                    id="attendance-contest-review-notes"
                    value={contestReviewNotes}
                    onChange={(event) => setContestReviewNotes(event.target.value)}
                    placeholder="Explain the approval or rejection decision."
                    rows={3}
                    disabled={contestReviewLoading}
                  />
                  {contestReviewError && <div className="ha-modal-alert">{contestReviewError}</div>}
                  <div className="ha-review-action-row">
                    <button
                      type="button"
                      className="ha-modal-btn primary"
                      onClick={() => handleContestDecision('approve')}
                      disabled={contestReviewLoading}
                    >
                      {contestReviewLoading ? 'Reviewing...' : 'Approve Contest'}
                    </button>
                    <button
                      type="button"
                      className="ha-modal-btn secondary"
                      onClick={() => handleContestDecision('reject')}
                      disabled={contestReviewLoading}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {geofenceReviewIntervals.length > 0 && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Geofence Payroll Review</span>
              <div className="ha-detail-grid">
                <div><span>Pending Intervals</span><strong>{geofencePayrollReview?.pendingCount || 0}</strong></div>
                <div><span>Approved Deductions</span><strong>{geofencePayrollReview?.approvedCount || 0}</strong></div>
                <div><span>Voided Intervals</span><strong>{geofencePayrollReview?.voidedCount || 0}</strong></div>
              </div>

              {geofenceReviewIntervals.some((interval) => interval.status === 'pending') && (
                <div className="ha-review-action">
                  <label htmlFor="geofence-payroll-review-notes">Review Notes</label>
                  <textarea
                    id="geofence-payroll-review-notes"
                    value={geofenceReviewNotes}
                    onChange={(event) => setGeofenceReviewNotes(event.target.value)}
                    placeholder="Explain the payroll deduction or why it should be voided."
                    rows={3}
                    disabled={Boolean(geofenceReviewLoadingKey)}
                  />
                  {geofenceReviewError && <div className="ha-modal-alert">{geofenceReviewError}</div>}
                </div>
              )}

              <div className="ha-geofence-review-list">
                {geofenceReviewIntervals.map((interval) => {
                  const intervalKey = getGeofenceIntervalKey(interval);
                  const approveKey = `${intervalKey}:approve`;
                  const voidKey = `${intervalKey}:void`;
                  const intervalEdit = getGeofenceIntervalEdit(interval);
                  return (
                    <div key={intervalKey} className={`ha-geofence-review-card ${interval.status}`}>
                      <div className="ha-geofence-review-head">
                        <div>
                          <strong>{interval.detectedStart} - {interval.detectedEnd}</strong>
                          <span>{interval.proposedAwayMinutes} min proposed away time</span>
                        </div>
                        <span className={`ha-geofence-review-status ${interval.status}`}>
                          {interval.statusLabel || interval.status}
                        </span>
                      </div>
                      <div className="ha-detail-grid compact">
                        <div><span>Proposed Start</span><strong>{interval.proposedStart || 'N/A'}</strong></div>
                        <div><span>Proposed End</span><strong>{interval.proposedEnd || 'N/A'}</strong></div>
                        <div><span>Approved Minutes</span><strong>{interval.awayMinutes || 0} min</strong></div>
                        <div><span>Reviewed By</span><strong>{interval.reviewedBy || 'N/A'}</strong></div>
                      </div>
                      {interval.reviewNotes && (
                        <div className="ha-modal-notes-box">{interval.reviewNotes}</div>
                      )}
                      {interval.status === 'pending' && (
                        <>
                          <div className="ha-geofence-edit-grid">
                            <label>
                              Approved Start
                              <input
                                type="datetime-local"
                                step="1"
                                value={intervalEdit.approvedStartLocal}
                                onChange={(event) => handleGeofenceIntervalEdit(interval, 'approvedStartLocal', event.target.value)}
                                disabled={Boolean(geofenceReviewLoadingKey)}
                              />
                            </label>
                            <label>
                              Approved End
                              <input
                                type="datetime-local"
                                step="1"
                                value={intervalEdit.approvedEndLocal}
                                onChange={(event) => handleGeofenceIntervalEdit(interval, 'approvedEndLocal', event.target.value)}
                                disabled={Boolean(geofenceReviewLoadingKey)}
                              />
                            </label>
                          </div>
                          <div className="ha-review-action-row">
                            <button
                              type="button"
                              className="ha-modal-btn primary"
                              onClick={() => handleGeofencePayrollDecision(interval, 'approve')}
                              disabled={Boolean(geofenceReviewLoadingKey)}
                            >
                              {geofenceReviewLoadingKey === approveKey ? 'Approving...' : 'Approve Deduction'}
                            </button>
                            <button
                              type="button"
                              className="ha-modal-btn secondary"
                              onClick={() => handleGeofencePayrollDecision(interval, 'void')}
                              disabled={Boolean(geofenceReviewLoadingKey)}
                            >
                              {geofenceReviewLoadingKey === voidKey ? 'Voiding...' : 'Void'}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
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
