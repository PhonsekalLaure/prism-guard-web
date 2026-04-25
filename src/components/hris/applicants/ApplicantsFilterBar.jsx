import { useState } from 'react';
import { FaSearch, FaBriefcase, FaFilter } from 'react-icons/fa';

export default function ApplicantsFilterBar() {
  const [search, setSearch]     = useState('');
  const [position, setPosition] = useState('all');
  const [status, setStatus]     = useState('all');

  return (
    <div className="applicants-filter-bar">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search Applicant
        </label>
        <input
          type="text"
          placeholder="Search by name or contact..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBriefcase className="filter-icon" />
          Position
        </label>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className="filter-select">
          <option value="all">All Positions</option>
          <option value="guard">Security Guard</option>
          <option value="lady">Lady Guard</option>
          <option value="officer">Security Officer</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Status
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="filter-select">
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
