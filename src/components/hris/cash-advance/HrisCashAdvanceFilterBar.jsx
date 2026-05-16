import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisCashAdvanceFilterBar() {
  return (
    <div className="ca-filter-bar">
      <div className="ca-filter-group">
        <label className="ca-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="ca-filter-input"
          placeholder="Search by employee name or ID..."
        />
      </div>

      <div className="ca-filter-group">
        <label className="ca-filter-label">
          <FaTag /> Reason
        </label>
        <select className="ca-filter-select">
          <option>All Reasons</option>
          <option>Medical</option>
          <option>Emergency</option>
          <option>Tuition</option>
          <option>Miscellaneous</option>
        </select>
      </div>

      <div className="ca-filter-group">
        <label className="ca-filter-label">
          <FaFilter /> Status
        </label>
        <select className="ca-filter-select">
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
