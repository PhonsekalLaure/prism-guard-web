import { useState } from 'react';
import {
  FaListUl, FaCheckCircle, FaTimesCircle, FaMinusCircle,
  FaCircle, FaEye, FaChevronLeft, FaChevronRight, FaTimes,
  FaMapMarkerAlt, FaClock, FaUserShield, FaIdBadge
} from 'react-icons/fa';

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

export default function HrisAttendanceTable({
  records = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  onPageChange,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const currentPage = metadata.page || 1;
  const totalPages = Math.max(metadata.totalPages || 1, 1);
  const from = metadata.total === 0 ? 0 : ((currentPage - 1) * (metadata.limit || 8)) + 1;
  const to = Math.min(currentPage * (metadata.limit || 8), metadata.total || 0);

  const openModal = (row) => setSelectedRow(row);
  const closeModal = () => setSelectedRow(null);

  return (
    <div className="ha-table-container">
      <div className="ha-table-header">
        <h3><FaListUl /> Today's Attendance Records</h3>
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
                      <div className="ha-avatar">{row.initials}</div>
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
            <div className="ha-modal-header">
              <div>
                <h2>Attendance Record</h2>
                <p>{selectedRow.empId}</p>
              </div>
              <button className="ha-modal-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>

            <div className="ha-modal-body">
              <div className="ha-modal-emp-box">
                <div className="ha-avatar ha-modal-avatar">{selectedRow.initials}</div>
                <div className="ha-modal-emp-info">
                  <h3>{selectedRow.name}</h3>
                  <p><FaUserShield style={{ marginRight: '4px' }} />{selectedRow.role}</p>
                  <span className="ha-modal-location">
                    <FaMapMarkerAlt /> {selectedRow.location} - {selectedRow.area}
                  </span>
                </div>
                <span
                  className={`ha-status-badge ${(STATUS_META[selectedRow.status] || STATUS_META.absent).className}`}
                  style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}
                >
                  {(STATUS_META[selectedRow.status] || STATUS_META.absent).label}
                </span>
              </div>

              <div className="ha-modal-grid">
                <div className="ha-modal-cell">
                  <label><FaClock style={{ marginRight: '4px' }} />Clock In</label>
                  <p className={selectedRow.status === 'late' ? 'ha-modal-late' : ''}>{selectedRow.clockIn || '-'}</p>
                  <span className={`ha-time-sub ${getClockInNoteClass(selectedRow)}`}>{selectedRow.clockInNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label><FaClock style={{ marginRight: '4px' }} />Clock Out</label>
                  <p>{selectedRow.clockOut || '-'}</p>
                  <span className={`ha-time-sub ${getClockOutNoteClass(selectedRow)}`}>{selectedRow.clockOutNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label>Work Hours</label>
                  <p className={selectedRow.hoursNote === 'Completed' ? 'ha-modal-full' : ''}>{selectedRow.hours}</p>
                  <span className={`ha-time-sub ${getHoursNoteClass(selectedRow)}`}>{selectedRow.hoursNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label>Scheduled Shift</label>
                  <p>{selectedRow.shift}</p>
                </div>
              </div>

              <div className="ha-modal-info-row">
                <div className="ha-modal-gps-box">
                  <span className="ha-modal-section-label">GPS Verification</span>
                  <span className={`ha-gps ha-modal-gps-value ${selectedRow.gpsClass}`}>
                    {(() => {
                      const GpsIcon = GPS_ICONS[selectedRow.gpsClass] || FaMinusCircle;
                      return <GpsIcon />;
                    })()} {selectedRow.gps}
                  </span>
                </div>
                <div className="ha-modal-id-box">
                  <span className="ha-modal-section-label"><FaIdBadge style={{ marginRight: '4px' }} />Employee ID</span>
                  <span className="ha-modal-id-value">{selectedRow.empId}</span>
                </div>
              </div>

              <div>
                <span className="ha-modal-section-label">Notes</span>
                <div className="ha-modal-notes-box">
                  {selectedRow.notes}
                </div>
              </div>
            </div>

            <div className="ha-modal-footer">
              <button className="ha-modal-btn secondary" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
