import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisCashAdvanceFilterBar() {
  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by employee name or ID..."
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaTag /> Reason
        </label>
        <select className="filter-select">
          <option>All Reasons</option>
          <option>Medical</option>
          <option>Emergency</option>
          <option>Tuition</option>
          <option>Miscellaneous</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Status
        </label>
        <select className="filter-select">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Released</option>
          <option>Rejected</option>
          <option>Settled</option>
        </select>
      </div>
    </div>
  );
}
