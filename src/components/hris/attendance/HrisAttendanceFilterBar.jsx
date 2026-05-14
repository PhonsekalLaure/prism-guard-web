import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function HrisAttendanceFilterBar({ clients = [], filters, onFilterChange }) {
  const currentFilters = filters || { search: '', clientId: 'all', status: 'all' };

  const updateFilter = (field, value) => {
    onFilterChange?.({
      ...currentFilters,
      [field]: value,
    });
  };

  return (
    <div className="ha-filter-bar">
      <div className="ha-filter-group">
        <label className="ha-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="ha-filter-input"
          value={currentFilters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
        />
      </div>

      <div className="ha-filter-group">
        <label className="ha-filter-label">
          <FaBuilding /> Location/Client
        </label>
        <select
          className="ha-filter-select"
          value={currentFilters.clientId}
          onChange={(event) => updateFilter('clientId', event.target.value)}
        >
          <option value="all">All Locations</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.company}</option>
          ))}
        </select>
      </div>

      <div className="ha-filter-group">
        <label className="ha-filter-label">
          <FaFilter /> Status Filter
        </label>
        <select
          className="ha-filter-select"
          value={currentFilters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
          <option value="off_duty">Off Duty</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>
    </div>
  );
}
