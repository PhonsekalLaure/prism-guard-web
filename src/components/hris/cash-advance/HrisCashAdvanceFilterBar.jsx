import { FaFilter, FaSearch, FaTag } from 'react-icons/fa';

export default function HrisCashAdvanceFilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by employee name, ID, location, or reason..."
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaTag /> Reason
        </label>
        <select
          className="filter-select"
          value={filters.reason}
          onChange={(event) => onChange('reason', event.target.value)}
        >
          <option value="all">All Reasons</option>
          <option value="medical">Medical</option>
          <option value="emergency">Emergency</option>
          <option value="tuition">Tuition</option>
          <option value="misc">Miscellaneous</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Status
        </label>
        <select
          className="filter-select"
          value={filters.status}
          onChange={(event) => onChange('status', event.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="released">Released</option>
          <option value="rejected">Rejected</option>
          <option value="settled">Settled</option>
        </select>
      </div>
    </div>
  );
}
