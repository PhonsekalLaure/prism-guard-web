import { FaSearch, FaBriefcase, FaFilter } from 'react-icons/fa';

export default function ApplicantsFilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Applicant
        </label>
        <input
          type="text"
          placeholder="Search by name or contact..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBriefcase className="filter-icon" />
          Position
        </label>
        <select value={filters.position} onChange={(e) => onChange({ position: e.target.value })} className="filter-select">
          <option value="all">All Positions</option>
          <option value="Security Guard">Security Guard</option>
          <option value="Lady Guard">Lady Guard</option>
          <option value="Security Officer">Security Officer</option>
          <option value="Detachment Commander">Detachment Commander</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Status
        </label>
        <select value={filters.status} onChange={(e) => onChange({ status: e.target.value })} className="filter-select">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="interview">For Interview</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
  );
}
