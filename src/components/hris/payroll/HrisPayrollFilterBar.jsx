import { FaFilter, FaSearch } from 'react-icons/fa';

export default function HrisPayrollFilterBar({ filters, onChange }) {
  return (
    <div className="filter-bar two-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by employee name or ID..."
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Record Status
        </label>
        <select
          className="filter-select"
          value={filters.status}
          onChange={(event) => onChange({ ...filters, status: event.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
