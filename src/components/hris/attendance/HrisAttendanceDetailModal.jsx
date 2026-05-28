import { FaClock, FaMapMarkerAlt, FaMinusCircle, FaTimes, FaUserShield } from 'react-icons/fa';
import EntityAvatar from '@components/ui/EntityAvatar';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import {
  GPS_ICONS,
  STATUS_META,
  formatBoolean,
  formatCoordinate,
  formatRawStatus,
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
}) {
  const displayRow = detail?.summary || row;
  const statusMeta = STATUS_META[displayRow.status] || STATUS_META.absent;

  return (
    <div className="ha-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose?.()}>
      <div className="ha-modal-content">
        <div className="ha-modal-header">
          <div>
            <h2>Attendance Log Details</h2>
            <p>{displayRow.attendanceLogId || 'No attendance log for this date'}</p>
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
            <span className="ha-modal-section-label">Raw Log Evidence</span>
            <div className="ha-detail-grid">
              <div><span>Attendance Log ID</span><strong>{detail?.log?.id || displayRow.attendanceLogId || 'N/A'}</strong></div>
              <div><span>Deployment ID</span><strong>{detail?.assignment?.deploymentId || displayRow.deploymentId || 'N/A'}</strong></div>
              <div><span>Employee ID</span><strong>{detail?.employee?.employeeIdNumber || displayRow.empId}</strong></div>
              <div><span>Log Date</span><strong>{detail?.log?.logDate || 'N/A'}</strong></div>
              <div><span>Derived Status</span><strong>{statusMeta.label}</strong></div>
              <div><span>Raw DB Status</span><strong>{formatRawStatus(detail?.log?.rawStatus || displayRow.rawStatus)}</strong></div>
              <div><span>Schedule ID</span><strong>{detail?.schedule?.id || 'N/A'}</strong></div>
              <div><span>Site ID</span><strong>{detail?.assignment?.siteId || displayRow.siteId || 'N/A'}</strong></div>
            </div>
          </div>

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
              <div><span>Clock-in Coordinates</span><strong>{formatCoordinate(detail?.log?.clockInCoordinates)}</strong></div>
              <div><span>Clock-out Coordinates</span><strong>{formatCoordinate(detail?.log?.clockOutCoordinates)}</strong></div>
              <div><span>Site Coordinates</span><strong>{formatCoordinate(detail?.assignment?.siteCoordinates)}</strong></div>
              <div><span>Geofence Radius</span><strong>{detail?.assignment?.geofenceRadiusMeters ? `${detail.assignment.geofenceRadiusMeters}m` : 'N/A'}</strong></div>
              <div><span>Latest Ping Time</span><strong>{detail?.gps?.latestPing?.pingTime || 'N/A'}</strong></div>
              <div><span>Latest Ping Coordinates</span><strong>{formatCoordinate(detail?.gps?.latestPing)}</strong></div>
              <div><span>Latest Ping Result</span><strong>{formatBoolean(detail?.gps?.latestPing?.isWithinGeofence)}</strong></div>
            </div>
          </div>

          {detail?.gps?.pings?.length > 0 && (
            <div className="ha-modal-section">
              <span className="ha-modal-section-label">Location Ping History</span>
              <div className="ha-ping-list">
                {detail.gps.pings.map((ping) => (
                  <div key={ping.id} className={`ha-ping-row ${ping.isWithinGeofence === false ? 'outside' : ''}`}>
                    <div>
                      <strong>{ping.pingTime}</strong>
                      <span>{formatCoordinate(ping)}</span>
                    </div>
                    <span>{formatBoolean(ping.isWithinGeofence)}</span>
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
