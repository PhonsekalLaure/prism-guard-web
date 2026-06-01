import { useRef } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function ClientsFilterBar({ filters, onFilterChange }) {
  const searchTimerRef = useRef(null);

  const handleSearchChange = (event) => {
    const search = event.target.value;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      onFilterChange({ ...filters, search });
    }, 500);
  };

  return (
    <div className="filter-bar two-cols">
      <div className="filter-group">
        <label className="filter-label"><FaSearch className="filter-icon" /> Search Client</label>
        <input
          type="text"
          placeholder="Search by company name"
          key={filters.search || ''}
          defaultValue={filters.search || ''}
          onChange={handleSearchChange}
          className="filter-input"
        />
      </div>
      <div className="filter-group">
        <label className="filter-label"><FaFilter className="filter-icon" /> Status</label>
        <select
          value={filters.status || 'all'}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>
  );
}
