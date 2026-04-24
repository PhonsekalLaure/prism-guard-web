import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisLeaveRequestsFilterBar() {
  return (
    <div className="hlr-filter-bar">
      <div className="hlr-filter-group" style={{ gridColumn: 'span 2' }}>
        <label className="hlr-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
          className="hlr-filter-input" 
        />
      </div>

      <div className="hlr-filter-group">
        <label className="hlr-filter-label">
          <FaTag /> Leave Type
        </label>
        <select className="hlr-filter-select">
          <option>All Types</option>
          <option>Sick Leave (SL)</option>
          <option>Vacation Leave (VL)</option>
          <option>Personal Leave (PL)</option>
          <option>Emergency Leave (EL)</option>
        </select>
      </div>

      <div className="hlr-filter-group">
        <label className="hlr-filter-label">
          <FaFilter /> Status
        </label>
        <select className="hlr-filter-select">
          <option>All Status</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Needs Revision</option>
        </select>
      </div>
    </div>
  );
}
