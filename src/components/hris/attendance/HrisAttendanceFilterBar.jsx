import { FaSearch, FaBuilding, FaFilter, FaCalendarAlt } from 'react-icons/fa';

export default function HrisAttendanceFilterBar({
  clients = [],
  filters,
  selectedDate,
  maxDate,
  onDateChange,
  onFilterChange,
}) {
  const currentFilters = filters || { search: '', clientId: 'all', status: 'all' };

  const updateFilter = (field, value) => {
    onFilterChange?.({
      ...currentFilters,
      [field]: value,
    });
  };

  return (
    <div className="filter-bar four-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="filter-input"
          value={currentFilters.search}
          onChange={(event) => updateFilter('search', event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaCalendarAlt /> Attendance Date
        </label>
        <input
          type="date"
          className="filter-input"
          value={selectedDate}
          max={maxDate}
          onChange={(event) => onDateChange?.(event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBuilding /> Location/Client
        </label>
        <select
          className="filter-select"
          value={currentFilters.clientId}
          onChange={(event) => updateFilter('clientId', event.target.value)}
        >
          <option value="all">All Locations</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.company}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Status Filter
        </label>
        <select
          className="filter-select"
          value={currentFilters.status}
          onChange={(event) => updateFilter('status', event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="location_review">Location Review</option>
          <option value="late">Late</option>
          <option value="absent">Absent</option>
          <option value="off_duty">Off Duty</option>
          <option value="on_leave">On Leave</option>
        </select>
      </div>
    </div>
  );
}
