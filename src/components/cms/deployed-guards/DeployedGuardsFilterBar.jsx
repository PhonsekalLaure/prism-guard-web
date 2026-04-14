import { useState } from 'react';
import { FaSearch, FaClock, FaFilter } from 'react-icons/fa';

export default function DeployedGuardsFilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [shift, setShift] = useState('all');
  const [status, setStatus] = useState('all');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onFilterChange?.({ search: e.target.value, shift, status });
  };

  const handleShift = (e) => {
    setShift(e.target.value);
    onFilterChange?.({ search, shift: e.target.value, status });
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    onFilterChange?.({ search, shift, status: e.target.value });
  };

  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Guards
        </label>
        <input
          type="text"
          placeholder="Search by name or ID..."
          value={search}
          onChange={handleSearch}
          className="filter-input dg-search-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaClock className="filter-icon" />
          Shift
        </label>
        <select value={shift} onChange={handleShift} className="filter-select">
          <option value="all">All Shifts</option>
          <option value="day">Day (6AM-6PM)</option>
          <option value="night">Night (6PM-6AM)</option>
          <option value="24hr">24-Hour</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Status
        </label>
        <select value={status} onChange={handleStatus} className="filter-select">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="suspended">Suspended</option>
          <option value="replaced">Temporarily Replaced</option>
        </select>
      </div>
    </div>
  );
}