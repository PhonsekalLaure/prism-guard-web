import { useState } from 'react';
import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function EmployeesFilterBar() {
  const [search, setSearch] = useState('');
  const [client, setClient] = useState('all');
  const [status, setStatus] = useState('all');

  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by employee name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBuilding className="filter-icon" />
          Assigned Client
        </label>
        <select value={client} onChange={(e) => setClient(e.target.value)} className="filter-select">
          <option value="all">All Clients</option>
          <option value="feu">FEU Institute of Tech</option>
          <option value="sm-moa">SM Mall of Asia</option>
          <option value="sm-north">SM North Edsa</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Status
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="absent">Absent</option>
        </select>
      </div>
    </div>
  );
}
