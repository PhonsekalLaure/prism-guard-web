import { useState } from 'react';
import {
  FaListUl, FaCheckCircle, FaTimesCircle, FaMinusCircle,
  FaCircle, FaEye, FaChevronLeft, FaChevronRight, FaTimes,
  FaMapMarkerAlt, FaClock, FaUserShield, FaIdBadge
} from 'react-icons/fa';

const attendanceData = [
  {
    id: 1,
    name: 'Juan Cruz',
    initials: 'JC',
    empId: 'PRISM-2024-001',
    role: 'Security Officer I',
    location: 'SM Mall of Asia',
    area: 'Main Entrance',
    clockIn: '07:00 AM',
    clockInNote: 'On time',
    clockInNoteClass: 'on-time',
    clockInClass: '',
    clockOut: '—',
    clockOutNote: 'Still on duty',
    clockOutNoteClass: 'on-time',
    hours: '5h 34m',
    hoursNote: 'In progress',
    hoursNoteClass: 'on-time',
    hoursClass: '',
    gps: 'Verified',
    gpsIcon: FaCheckCircle,
    gpsClass: 'verified',
    status: 'ACTIVE',
    statusClass: 'active',
    statusIcon: FaCircle,
    rowClass: '',
    shift: '7:00 AM – 3:00 PM',
    notes: 'No issues reported.',
  },
  {
    id: 2,
    name: 'Mario Dela Cruz',
    initials: 'MD',
    empId: 'PRISM-2024-006',
    role: 'Security Guard',
    location: 'SM North Edsa',
    area: 'Parking Level 2',
    clockIn: '08:25 AM',
    clockInNote: 'Late by 25 min',
    clockInNoteClass: 'late',
    clockInClass: 'late',
    clockOut: '—',
    clockOutNote: 'Still on duty',
    clockOutNoteClass: 'on-time',
    hours: '4h 09m',
    hoursNote: 'In progress',
    hoursNoteClass: 'on-time',
    hoursClass: '',
    gps: 'Verified',
    gpsIcon: FaCheckCircle,
    gpsClass: 'verified',
    status: 'LATE',
    statusClass: 'late',
    statusIcon: null,
    rowClass: '',
    shift: '8:00 AM – 4:00 PM',
    notes: 'Tardiness flagged for supervisor review.',
  },
  {
    id: 3,
    name: 'Richielle Gutierrez',
    initials: 'RG',
    empId: 'PRISM-2024-005',
    role: 'Lady Guard',
    location: 'FEU Institute of Tech',
    area: 'Main Gate',
    clockIn: '06:00 PM',
    clockInNote: 'On time (Night Shift)',
    clockInNoteClass: 'on-time',
    clockInClass: '',
    clockOut: '06:00 AM',
    clockOutNote: 'Completed',
    clockOutNoteClass: 'completed',
    hours: '12h 00m',
    hoursNote: 'Full shift',
    hoursNoteClass: 'on-time',
    hoursClass: 'full',
    gps: 'Verified',
    gpsIcon: FaCheckCircle,
    gpsClass: 'verified',
    status: 'OFF DUTY',
    statusClass: 'off-duty',
    statusIcon: null,
    rowClass: 'ha-row-completed',
    shift: '6:00 PM – 6:00 AM',
    notes: 'Full night shift completed.',
  },
  {
    id: 4,
    name: 'Christabelle Acedillo',
    initials: 'CA',
    empId: 'PRISM-2024-004',
    role: 'Security Guard',
    location: 'FEU Institute of Tech',
    area: 'Lobby Area',
    clockIn: '—',
    clockInNote: 'No clock-in',
    clockInNoteClass: 'no-clock',
    clockInClass: 'dash',
    clockOut: '—',
    clockOutNote: '—',
    clockOutNoteClass: 'on-time',
    hours: '0h 00m',
    hoursNote: 'No activity',
    hoursNoteClass: 'no-activity',
    hoursClass: 'dash',
    gps: 'No GPS',
    gpsIcon: FaTimesCircle,
    gpsClass: 'no-gps',
    status: 'ABSENT',
    statusClass: 'absent',
    statusIcon: null,
    rowClass: 'ha-row-absent',
    shift: '7:00 AM – 3:00 PM',
    notes: 'No clock-in detected. Marked absent.',
  },
  {
    id: 5,
    name: 'Quervie Manrique',
    initials: 'QM',
    empId: 'PRISM-2024-003',
    role: 'Lady Guard',
    location: 'SM North Edsa',
    area: 'Main Entrance',
    clockIn: '07:00 AM',
    clockInNote: 'On time',
    clockInNoteClass: 'on-time',
    clockInClass: '',
    clockOut: '—',
    clockOutNote: '+2h OT expected',
    clockOutNoteClass: 'overtime',
    hours: '5h 34m',
    hoursNote: 'Overtime shift',
    hoursNoteClass: 'overtime',
    hoursClass: '',
    gps: 'Verified',
    gpsIcon: FaCheckCircle,
    gpsClass: 'verified',
    status: 'ACTIVE',
    statusClass: 'active',
    statusIcon: FaCircle,
    rowClass: '',
    shift: '7:00 AM – 5:00 PM (OT)',
    notes: 'Overtime pre-approved by supervisor.',
  },
  {
    id: 6,
    name: 'Ronn Rosarito',
    initials: 'RR',
    empId: 'PRISM-2024-002',
    role: 'Security Guard',
    location: 'FEU Institute of Tech',
    area: 'Building B',
    clockIn: '—',
    clockInNote: 'On approved leave',
    clockInNoteClass: 'leave',
    clockInClass: 'dash',
    clockOut: '—',
    clockOutNote: '—',
    clockOutNoteClass: 'on-time',
    hours: '0h 00m',
    hoursNote: 'Leave day',
    hoursNoteClass: 'leave',
    hoursClass: 'dash',
    gps: 'N/A',
    gpsIcon: FaMinusCircle,
    gpsClass: 'na',
    status: 'ON LEAVE',
    statusClass: 'on-leave',
    statusIcon: null,
    rowClass: 'ha-row-leave',
    shift: 'N/A',
    notes: 'Personal leave approved.',
  },
];

export default function HrisAttendanceTable() {
  const [selectedRow, setSelectedRow] = useState(null);

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
            {attendanceData.map((row) => {
              const GpsIcon = row.gpsIcon;
              const StatusIcon = row.statusIcon;
              return (
                <tr key={row.id} className={row.rowClass}>
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
                    <p className={`ha-time-main ${row.clockInClass}`}>{row.clockIn}</p>
                    <p className={`ha-time-sub ${row.clockInNoteClass}`}>{row.clockInNote}</p>
                  </td>
                  <td>
                    <p className={`ha-time-main ${row.clockOut === '—' ? 'dash' : ''}`}>{row.clockOut}</p>
                    <p className={`ha-time-sub ${row.clockOutNoteClass}`}>{row.clockOutNote}</p>
                  </td>
                  <td>
                    <p className={`ha-hours ${row.hoursClass}`}>{row.hours}</p>
                    <p className={`ha-time-sub ${row.hoursNoteClass}`}>{row.hoursNote}</p>
                  </td>
                  <td>
                    <span className={`ha-gps ${row.gpsClass}`}>
                      {GpsIcon && <GpsIcon />} {row.gps}
                    </span>
                  </td>
                  <td>
                    <span className={`ha-status-badge ${row.statusClass}`}>
                      {StatusIcon && <StatusIcon style={{ fontSize: '0.5rem' }} />} {row.status}
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

      {/* Pagination */}
      <div className="ha-pagination">
        <p className="ha-pagination-text">Showing 1-6 of 126 records</p>
        <div className="ha-pagination-controls">
          <button className="ha-page-btn"><FaChevronLeft /></button>
          <button className="ha-page-btn active">1</button>
          <button className="ha-page-btn">2</button>
          <button className="ha-page-btn">3</button>
          <button className="ha-page-btn"><FaChevronRight /></button>
        </div>
      </div>

      {/* Attendance Detail Modal */}
      {selectedRow && (
        <div className="ha-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="ha-modal-content">

            {/* Modal Header */}
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

              {/* Employee Info */}
              <div className="ha-modal-emp-box">
                <div className="ha-avatar ha-modal-avatar">{selectedRow.initials}</div>
                <div className="ha-modal-emp-info">
                  <h3>{selectedRow.name}</h3>
                  <p><FaUserShield style={{ marginRight: '4px' }} />{selectedRow.role}</p>
                  <span className="ha-modal-location">
                    <FaMapMarkerAlt /> {selectedRow.location} • {selectedRow.area}
                  </span>
                </div>
                <span className={`ha-status-badge ${selectedRow.statusClass}`} style={{ marginLeft: 'auto', alignSelf: 'flex-start' }}>
                  {selectedRow.statusIcon && <selectedRow.statusIcon style={{ fontSize: '0.5rem' }} />} {selectedRow.status}
                </span>
              </div>

              {/* Time Details Grid */}
              <div className="ha-modal-grid">
                <div className="ha-modal-cell">
                  <label><FaClock style={{ marginRight: '4px' }} />Clock In</label>
                  <p className={selectedRow.clockInClass === 'late' ? 'ha-modal-late' : ''}>{selectedRow.clockIn}</p>
                  <span className={`ha-time-sub ${selectedRow.clockInNoteClass}`}>{selectedRow.clockInNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label><FaClock style={{ marginRight: '4px' }} />Clock Out</label>
                  <p>{selectedRow.clockOut}</p>
                  <span className={`ha-time-sub ${selectedRow.clockOutNoteClass}`}>{selectedRow.clockOutNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label>Work Hours</label>
                  <p className={selectedRow.hoursClass === 'full' ? 'ha-modal-full' : ''}>{selectedRow.hours}</p>
                  <span className={`ha-time-sub ${selectedRow.hoursNoteClass}`}>{selectedRow.hoursNote}</span>
                </div>
                <div className="ha-modal-cell">
                  <label>Scheduled Shift</label>
                  <p>{selectedRow.shift}</p>
                </div>
              </div>

              {/* GPS & Notes */}
              <div className="ha-modal-info-row">
                <div className="ha-modal-gps-box">
                  <span className="ha-modal-section-label">GPS Verification</span>
                  <span className={`ha-gps ha-modal-gps-value ${selectedRow.gpsClass}`}>
                    {selectedRow.gpsIcon && <selectedRow.gpsIcon />} {selectedRow.gps}
                  </span>
                </div>
                <div className="ha-modal-id-box">
                  <span className="ha-modal-section-label"><FaIdBadge style={{ marginRight: '4px' }} />Employee ID</span>
                  <span className="ha-modal-id-value">{selectedRow.empId}</span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <span className="ha-modal-section-label">Notes</span>
                <div className="ha-modal-notes-box">
                  {selectedRow.notes}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="ha-modal-footer">
              <button className="ha-modal-btn secondary" onClick={closeModal}>Close</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
