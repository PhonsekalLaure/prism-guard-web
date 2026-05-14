import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaEye, FaListUl, FaMinusCircle } from 'react-icons/fa';
import attendanceService from '@services/hris/attendanceService';
import HrisAttendanceAvatar from './HrisAttendanceAvatar';
import HrisAttendanceDetailModal from './HrisAttendanceDetailModal';
import {
  GPS_ICONS,
  STATUS_META,
  getClockInClass,
  getClockInNoteClass,
  getClockOutNoteClass,
  getHoursNoteClass,
} from './attendanceUi';

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
  selectedDate = null,
  onPageChange,
}) {
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const currentPage = metadata.page || 1;
  const pageLimit = metadata.limit || 8;
  const totalRecords = metadata.total || 0;
  const totalPages = Math.max(metadata.totalPages || 1, 1);
  const from = totalRecords === 0 ? 0 : ((currentPage - 1) * pageLimit) + 1;
  const to = Math.min(currentPage * pageLimit, totalRecords);

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
                      <HrisAttendanceAvatar row={row} />
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
        <p className="ha-pagination-text">Showing {from}-{to} of {totalRecords} records</p>
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
        <HrisAttendanceDetailModal
          row={selectedRow}
          detail={selectedDetail}
          loading={detailLoading}
          error={detailError}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
