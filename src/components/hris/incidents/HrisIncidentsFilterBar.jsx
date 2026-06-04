import { useEffect, useRef, useState } from 'react';
import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisIncidentsFilterBar({ onFilterChange }) {
  const [localSearch, setLocalSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const latestFiltersRef = useRef({ onFilterChange, status, severity });

  useEffect(() => {
    latestFiltersRef.current = { onFilterChange, status, severity };
  }, [onFilterChange, status, severity]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const latest = latestFiltersRef.current;
      latest.onFilterChange?.({
        search: localSearch,
        status: latest.status,
        severity: latest.severity,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [localSearch]);

  const handleStatus = (e) => {
    const val = e.target.value;
    setStatus(val);
    onFilterChange?.({ search: localSearch, status: val, severity });
  };

  const handleSeverity = (e) => {
    const val = e.target.value;
    setSeverity(val);
    onFilterChange?.({ search: localSearch, status, severity: val });
  };

  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Incident
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by employee, site, or report ID..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaTag className="filter-icon" />
          Review Status
        </label>
        <select className="filter-select" value={status} onChange={handleStatus}>
          <option value="all">All Review Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Priority
        </label>
        <select className="filter-select" value={severity} onChange={handleSeverity}>
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
