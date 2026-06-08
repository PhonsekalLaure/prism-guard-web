import { FaBars, FaDownload, FaCalendarAlt, FaSyncAlt } from 'react-icons/fa';
import { useOutletContext } from 'react-router-dom';

function formatDisplayDate(date) {
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });
}

export default function HrisAttendanceTopbar({
  date,
  loading = false,
  exporting = false,
  onRefresh,
  onExport,
}) {
  const { toggleSidebar } = useOutletContext() || {};

  return (
    <header className="ha-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-toggle" onClick={toggleSidebar} type="button">
          <FaBars />
        </button>
        <div className="ha-title-group">
          <h2>Attendance Dashboard</h2>
          <p>Live monitoring of guard attendance with GPS verification</p>
        </div>
      </div>
      <div className="ha-topbar-right">
        <span className="ha-date-display">
          <FaCalendarAlt />
          <span>{formatDisplayDate(date)}</span>
        </span>
        <button className="ha-refresh-btn" disabled={loading} onClick={onRefresh}>
          <FaSyncAlt className={loading ? 'spinning' : ''} /> Refresh
        </button>
        <button className="ha-export-btn" disabled={exporting} onClick={onExport}>
          <FaDownload /> {exporting ? 'Exporting...' : 'Export Report'}
        </button>
      </div>
    </header>
  );
}
