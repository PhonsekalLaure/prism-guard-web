import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaExclamationCircle, FaCalendar } from 'react-icons/fa';

export default function IncidentReportsFilterBar({ onFilterChange, sites = [] }) {
  const [localSearch, setLocalSearch] = useState('');
  const [site, setSite] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [date, setDate] = useState('');
  const latestRef = useRef({ onFilterChange, site, severity, date });

  useEffect(() => {
    latestRef.current = { onFilterChange, site, severity, date };
  }, [onFilterChange, site, severity, date]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const { onFilterChange: fn, site: s, severity: sv, date: d } = latestRef.current;
      fn?.({ search: localSearch, site: s, severity: sv, date: d });
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const notify = (patch) =>
    onFilterChange?.({ search: localSearch, site, severity, date, ...patch });

  return (
    <div className="filter-bar cir-filter-bar">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search
        </label>
        <input
          type="text"
          placeholder="Search by incident ID, site, or type..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="filter-input"
        />
      </div>

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
          {sites.map((s) => (
            <option key={s.id} value={s.id}>{s.site_name}</option>
          ))}
        </select>
      </div>

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
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaCalendar className="filter-icon" />
          Incident Date
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
