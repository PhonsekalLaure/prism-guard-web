import { useState, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';

export default function ClientsFilterBar({ filters, onFilterChange }) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        onFilterChange({ ...filters, search: localSearch });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, onFilterChange, filters]);

  // Sync local search with props (in case filters are reset externally)
  useEffect(() => {
    setLocalSearch(filters.search || '');
  }, [filters.search]);

  return (
    <div className="filter-bar two-cols">
      <div className="filter-group">
        <label className="filter-label"><FaSearch className="filter-icon" /> Search Client</label>
        <input
          type="text"
          placeholder="Search by company name"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
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
