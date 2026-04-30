import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function HrisAttendanceFilterBar() {
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
        />
      </div>

      <div className="ha-filter-group">
        <label className="ha-filter-label">
          <FaBuilding /> Location/Client
        </label>
        <select className="ha-filter-select">
          <option>All Locations</option>
          <option>FEU Institute of Tech</option>
          <option>SM Mall of Asia</option>
          <option>SM North Edsa</option>
        </select>
      </div>

      <div className="ha-filter-group">
        <label className="ha-filter-label">
          <FaFilter /> Status Filter
        </label>
        <select className="ha-filter-select">
          <option>All Status</option>
          <option>Active</option>
          <option>Late</option>
          <option>Absent</option>
          <option>Off Duty</option>
        </select>
      </div>
    </div>
  );
}
