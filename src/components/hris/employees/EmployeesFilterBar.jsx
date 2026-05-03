import { useState, useEffect } from 'react';
import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function EmployeesFilterBar({ filters, onFilterChange, clients = [] }) {
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
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by first or last name"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBuilding className="filter-icon" />
          Assigned Client
        </label>
        <select 
          value={filters.client || 'all'} 
          onChange={(e) => onFilterChange({ ...filters, client: e.target.value })} 
          className="filter-select"
        >
          <option value="all">All Clients</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.company}</option>
          ))}
          <option value="unassigned">Floating / Unassigned</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Status
        </label>
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
