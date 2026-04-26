import { FaDownload, FaCalendarAlt } from 'react-icons/fa';

export default function HrisAttendanceTopbar() {
  return (
    <header className="ha-topbar">
      <div className="ha-title-group">
        <h2>Attendance Dashboard</h2>
        <p>Real-time monitoring of guard attendance with GPS verification</p>
      </div>
      <div className="ha-topbar-right">
        <span className="ha-date-display">
          <FaCalendarAlt />
          <span>February 09, 2026</span>
        </span>
        <button className="ha-export-btn">
          <FaDownload /> Export Report
        </button>
      </div>
    </header>
  );
}
