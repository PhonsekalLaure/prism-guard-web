import { useState } from 'react';
import {
  FaListUl, FaCheckCircle, FaTimesCircle, FaMinusCircle,
  FaCircle, FaEye, FaChevronLeft, FaChevronRight, FaTimes,
  FaMapMarkerAlt, FaClock, FaUserShield
} from 'react-icons/fa';
import attendanceService from '@services/hris/attendanceService';

const STATUS_META = {
  active: { label: 'ACTIVE', className: 'active', icon: FaCircle, rowClass: '' },
  late: { label: 'LATE', className: 'late', icon: null, rowClass: '' },
  absent: { label: 'ABSENT', className: 'absent', icon: null, rowClass: 'ha-row-absent' },
  off_duty: { label: 'OFF DUTY', className: 'off-duty', icon: null, rowClass: 'ha-row-completed' },
  on_leave: { label: 'ON LEAVE', className: 'on-leave', icon: null, rowClass: 'ha-row-leave' },
};

const GPS_ICONS = {
  verified: FaCheckCircle,
  'no-gps': FaTimesCircle,
  na: FaMinusCircle,
};

function getClockInClass(row) {
  if (!row.clockIn) return 'dash';
  return row.status === 'late' ? 'late' : '';
}

function getClockInNoteClass(row) {
  if (row.status === 'late') return 'late';
  if (row.status === 'absent') return 'no-clock';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

function getClockOutNoteClass(row) {
  if (row.clockOut) return 'completed';
  if (row.status === 'on_leave') return 'leave';
  return 'on-time';
}

function getHoursNoteClass(row) {
  if (row.status === 'absent') return 'no-activity';
  if (row.status === 'on_leave') return 'leave';
  if (row.hoursNote === 'Overtime shift') return 'overtime';
  return 'on-time';
}

function renderPages(metadata, onPageChange) {
  const totalPages = Math.max(metadata?.totalPages || 1, 1);
  const currentPage = metadata?.page || 1;
  const pages = [];
  const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const end = Math.min(totalPages, start + 2);

  for (let page = start; page <= end; page += 1) {
    pages.push(
      <button
        key={page}
        className={`ha-page-btn ${page === currentPage ? 'active' : ''}`}
        onClick={() => onPageChange?.(page)}
      >
        {page}
      </button>
    );
  }

  return pages;
}

function formatCoordinate(coordinate) {
  if (!coordinate) return 'N/A';
  return `${Number(coordinate.latitude).toFixed(6)}, ${Number(coordinate.longitude).toFixed(6)}`;
}

function formatBoolean(value) {
  if (value === true) return 'Inside geofence';
  if (value === false) return 'Outside geofence';
  return 'N/A';
}

function formatRawStatus(value) {
  return value ? value.replace(/_/g, ' ') : 'N/A';
}

function EmployeeAvatar({ row, className = '' }) {
  return (
    <div className={`ha-avatar ${className}`}>
      {row.avatarUrl && (
        <img
          src={row.avatarUrl}
          alt={`${row.name} avatar`}
          onError={(event) => {
            event.currentTarget.remove();
          }}
        />
      )}
      <span>{row.initials}</span>
    </div>
  );
}

export default function HrisAttendanceTable({
  records = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  selectedDate = null,
  onPageChange,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const currentPage = metadata.page || 1;
  const totalPages = Math.max(metadata.totalPages || 1, 1);
  const from = metadata.total === 0 ? 0 : ((currentPage - 1) * (metadata.limit || 8)) + 1;
  const to = Math.min(currentPage * (metadata.limit || 8), metadata.total || 0);

  const openModal = async (row) => {
    setSelectedRow(row);
    setSelectedDetail(null);
    setDetailError(null);

    if (!row.attendanceLogId) {
      return;
    }

    try {
      setDetailLoading(true);
      const detail = await attendanceService.getAttendanceLogDetails(row.attendanceLogId);
      setSelectedDetail(detail);
    } catch (err) {
      setDetailError(err?.response?.data?.error || 'Failed to load attendance log details.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRow(null);
    setSelectedDetail(null);
    setDetailError(null);
    setDetailLoading(false);
  };

  return (
    <div className="ha-table-container">
      <div className="ha-table-header">
        <h3><FaListUl /> {selectedDate ? `Attendance Records for ${selectedDate}` : 'Attendance Records'}</h3>
      </div>

      <div className="ha-table-wrap">
        <table className="ha-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Assignment</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Work Hours</th>
              <th>GPS Status</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="ha-empty-cell">Loading attendance records...</td>
              </tr>
            )}
            {!loading && records.length === 0 && (
              <tr>
                <td colSpan="8" className="ha-empty-cell">No attendance records found.</td>
              </tr>
            )}
            {!loading && records.map((row) => {
              const statusMeta = STATUS_META[row.status] || STATUS_META.absent;
              const GpsIcon = GPS_ICONS[row.gpsClass] || FaMinusCircle;
              const StatusIcon = statusMeta.icon;
              return (
                <tr key={row.id} className={statusMeta.rowClass}>
                  <td>
                    <div className="ha-emp-cell">
                      <EmployeeAvatar row={row} />
                      <div>
                        <p className="ha-emp-name">{row.name}</p>
                        <p className="ha-emp-id">{row.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="ha-assign-name">{row.location}</p>
                    <p className="ha-assign-area">{row.area}</p>
                  </td>
                  <td>
                    <p className={`ha-time-main ${getClockInClass(row)}`}>{row.clockIn || '-'}</p>
                    <p className={`ha-time-sub ${getClockInNoteClass(row)}`}>{row.clockInNote}</p>
                  </td>
                  <td>
                    <p className={`ha-time-main ${!row.clockOut ? 'dash' : ''}`}>{row.clockOut || '-'}</p>
                    <p className={`ha-time-sub ${getClockOutNoteClass(row)}`}>{row.clockOutNote}</p>
                  </td>
                  <td>
                    <p className={`ha-hours ${row.clockIn ? (row.hoursNote === 'Completed' ? 'full' : '') : 'dash'}`}>{row.hours}</p>
                    <p className={`ha-time-sub ${getHoursNoteClass(row)}`}>{row.hoursNote}</p>
                  </td>
                  <td>
                    <span className={`ha-gps ${row.gpsClass}`}>
                      <GpsIcon /> {row.gps}
                    </span>
                  </td>
                  <td>
                    <span className={`ha-status-badge ${statusMeta.className}`}>
                      {StatusIcon && <StatusIcon style={{ fontSize: '0.5rem' }} />} {statusMeta.label}
                    </span>
                  </td>
                  <td>
                    <button className="ha-view-btn" title="View Details" onClick={() => openModal(row)}>
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ha-pagination">
        <p className="ha-pagination-text">Showing {from}-{to} of {metadata.total || 0} records</p>
        <div className="ha-pagination-controls">
          <button
            className="ha-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange?.(currentPage - 1)}
          >
            <FaChevronLeft />
          </button>
          {renderPages(metadata, onPageChange)}
          <button
            className="ha-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange?.(currentPage + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {selectedRow && (
        <div className="ha-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ha-modal-content">
            {(() => {
              const displayRow = selectedDetail?.summary || selectedRow;
              const detail = selectedDetail;
              const statusMeta = STATUS_META[displayRow.status] || STATUS_META.absent;

              return (
                <>
            <div className="ha-modal-header">
              <div>
                <h2>Attendance Log Details</h2>
                <p>{displayRow.attendanceLogId || 'No attendance log for this date'}</p>
              </div>
              <button className="ha-modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="ha-modal-body">
              <div className="ha-modal-emp-box">
                <EmployeeAvatar row={displayRow} className="ha-modal-avatar" />
                <div className="ha-modal-emp-info">
                  <h3>{displayRow.name}</h3>
                  <p><FaUserShield style={{ marginRight: '4px' }} />{displayRow.role}</p>
                  <span className="ha-modal-location">
                    <FaMapMarkerAlt /> {displayRow.location} - {displayRow.area}
                  </span>
                </div>
                <span
                  className={`ha-status-badge ${statusMeta.className}`}
                  style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}
                >
                  {statusMeta.label}
                </span>
              </div>

              {detailLoading && (
                <div className="ha-modal-notes-box">Loading complete log details...</div>
              )}

              {detailError && (
                <div className="ha-modal-alert">{detailError}</div>
              )}

              {!detailLoading && !displayRow.attendanceLogId && (
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
            </div>

            <div className="ha-modal-footer">
              <button className="ha-modal-btn secondary" onClick={closeModal}>Close</button>
            </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
