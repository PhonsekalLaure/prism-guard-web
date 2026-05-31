import { useState } from 'react';
import { FaSearch, FaFilter, FaCalendar, FaTag } from 'react-icons/fa';

export default function AnnouncementsFilterBar({ onFilterChange }) {
  const [search, setSearch]     = useState('');
  const [priority, setPriority] = useState('all');
  const [sort, setSort]         = useState('newest');
  const [date, setDate]         = useState('');

  const notify = (patch) =>
    onFilterChange?.({ search, priority, sort, date, ...patch });

  return (
    <div className="filter-bar ann-filter-bar">
      {/* Search */}
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch className="filter-icon" />
          Search
        </label>
        <input
          type="text"
          placeholder="Search announcements..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); notify({ search: e.target.value }); }}
          className="filter-input"
        />
      </div>

      {/* Priority */}
      <div className="filter-group">
        <label className="filter-label">
          <FaTag className="filter-icon" />
          Priority
        </label>
        <select
          value={priority}
          onChange={(e) => { setPriority(e.target.value); notify({ priority: e.target.value }); }}
          className="filter-select"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="important">Important</option>
          <option value="normal">Normal</option>
        </select>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label">
          <FaFilter className="filter-icon" />
          Sort By
        </label>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); notify({ sort: e.target.value }); }}
          className="filter-select"
        >
          <option value="newest">Most Recent</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
        </select>
      </div>

      {/* Date */}
      <div className="filter-group">
        <label className="filter-label">
          <FaCalendar className="filter-icon" />
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => { setDate(e.target.value); notify({ date: e.target.value }); }}
          className="filter-input"
        />
      </div>
    </div>
  );
}
