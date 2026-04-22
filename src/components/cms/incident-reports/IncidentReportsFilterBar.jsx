import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaExclamationCircle, FaCalendar } from 'react-icons/fa';

export default function IncidentReportsFilterBar({ onFilterChange }) {
  const [search, setSearch]     = useState('');
  const [site, setSite]         = useState('all');
  const [severity, setSeverity] = useState('all');
  const [date, setDate]         = useState('');

  const notify = (patch) => onFilterChange?.({ search, site, severity, date, ...patch });

  return (
    <div className="filter-bar ir-filter-bar">
      {/* Search */}
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search
        </label>
        <input
          type="text"
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); notify({ search: e.target.value }); }}
          className="filter-input"
        />
      </div>

      {/* Site */}
      <div className="filter-group">
        <label className="filter-label">
          <FaMapMarkerAlt className="filter-icon" />
          Site
        </label>
        <select
          value={site}
          onChange={(e) => { setSite(e.target.value); notify({ site: e.target.value }); }}
          className="filter-select"
        >
          <option value="all">All Sites</option>
          <option value="main-gate">Main Gate</option>
          <option value="parking">Parking Area</option>
          <option value="back-gate">Back Gate</option>
          <option value="building-lobby">Building Lobby</option>
        </select>
      </div>

      {/* Severity */}
      <div className="filter-group">
        <label className="filter-label">
          <FaExclamationCircle className="filter-icon" />
          Severity
        </label>
        <select
          value={severity}
          onChange={(e) => { setSeverity(e.target.value); notify({ severity: e.target.value }); }}
          className="filter-select"
        >
          <option value="all">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="filter-group">
        <label className="filter-label">
          <FaCalendar className="filter-icon" />
          Date Range
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); notify({ date: e.target.value }); }}
          className="filter-input"
        />
      </div>
    </div>
  );
}