import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisLeaveRequestsFilterBar({ filters, onChange }) {
  return (
    <div className="hlr-filter-bar">
      <div className="hlr-filter-group">
        <label className="hlr-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          placeholder="Search by name or ID..."
          className="hlr-filter-input"
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
        />
      </div>

      <div className="hlr-filter-group">
        <label className="hlr-filter-label">
          <FaTag /> Leave Type
        </label>
        <select
          className="hlr-filter-select"
          value={filters.leaveType}
          onChange={(event) => onChange('leaveType', event.target.value)}
        >
          <option value="all">All Types</option>
          <option value="sick">Sick Leave</option>
          <option value="emergency">Emergency Leave</option>
          <option value="maternity_paternity">Maternity / Paternity Leave</option>
        </select>
      </div>

      <div className="hlr-filter-group">
        <label className="hlr-filter-label">
          <FaFilter /> Status
        </label>
        <select
          className="hlr-filter-select"
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
