import { useState } from 'react';
import { FaSearch, FaFilter, FaSort } from 'react-icons/fa';

export default function BillingFilterBar({ onFilterChange }) {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('amount-highest');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onFilterChange?.({ search: e.target.value, status, sortBy });
  };

  const handleStatus = (e) => {
    setStatus(e.target.value);
    onFilterChange?.({ search, status: e.target.value, sortBy });
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    onFilterChange?.({ search, status, sortBy: e.target.value });
  };

  return (
    <div className="billing-filter-bar">
      <div className="bfb-group bfb-group--wide">
        <label>
          <FaSearch className="bfb-icon" />
          Search Client
        </label>
        <input
          type="text"
          placeholder="Search by client name"
          value={search}
          onChange={handleSearch}
          className="bfb-input"
        />
      </div>

      <div className="bfb-group">
        <label>
          <FaFilter className="bfb-icon" />
          Payment Status
        </label>
        <select value={status} onChange={handleStatus} className="bfb-select">
          <option value="all">All Clients</option>
          <option value="paid">Paid</option>
          <option value="partial">Partially Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="bfb-group">
        <label>
          <FaSort className="bfb-icon" />
          Status
        </label>
        <select value={sortBy} onChange={handleSort} className="bfb-select">
          <option value="amount-highest">Amount (Highest)</option>
          <option value="amount-lowest">Amount (Lowest)</option>
          <option value="due-nearest">Due Date (Nearest)</option>
          <option value="name-az">Client Name (A-Z)</option>
        </select>
      </div>
    </div>
  );
}
