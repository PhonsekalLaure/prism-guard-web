import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisLeaveRequestsFilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="filter-input"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaTag /> Leave Type
        </label>
        <select
          className="filter-select"
          value={filters.leaveType}
          onChange={(event) => onChange('leaveType', event.target.value)}
        >
          <option value="all">All Types</option>
          <option value="sick">Sick Leave</option>
          <option value="emergency">Emergency Leave</option>
          <option value="maternity">Maternity Leave</option>
          <option value="paternity">Paternity Leave</option>
          <option value="service_incentive">Service Incentive Leave</option>
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
          <option value="rejected">Rejected</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
