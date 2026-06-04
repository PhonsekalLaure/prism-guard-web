import { useRef } from 'react';
import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function EmployeesFilterBar({ filters, onFilterChange, clients = [] }) {
  const searchTimerRef = useRef(null);

  const handleSearchChange = (event) => {
    const search = event.target.value;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      onFilterChange({ ...filters, search });
    }, 500);
  };

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
          key={filters.search || ''}
          defaultValue={filters.search || ''}
          onChange={handleSearchChange}
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
