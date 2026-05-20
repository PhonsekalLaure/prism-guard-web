import { useState } from 'react';
import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisIncidentsFilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');

  const notify = (patch) => onFilterChange?.({ search, status, severity, ...patch });

  return (
    <div className="ir-filter-bar">
      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="ir-filter-input"
          placeholder="Search by employee, site, or report"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            notify({ search: e.target.value });
          }}
        />
      </div>

      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaTag /> Category
        </label>
        <select
          className="ir-filter-select"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            notify({ status: e.target.value });
          }}
        >
          <option value="all">All Review Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaFilter /> Priority
        </label>
        <select
          className="ir-filter-select"
          value={severity}
          onChange={(e) => {
            setSeverity(e.target.value);
            notify({ severity: e.target.value });
          }}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
}
