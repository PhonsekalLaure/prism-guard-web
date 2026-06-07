import { FaFilter, FaSearch } from 'react-icons/fa';

export default function BillingFilterBar({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange?.({ ...filters, [field]: value });
  };

  return (
    <div className="filter-bar two-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Client
        </label>
        <input
          type="text"
          placeholder="Search client or invoice"
          value={filters.search}
          onChange={(event) => handleChange('search', event.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Payment Status
        </label>
        <select
          value={filters.status}
          onChange={(event) => handleChange('status', event.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="verifying">For Review</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
        </select>
      </div>
    </div>
  );
}
