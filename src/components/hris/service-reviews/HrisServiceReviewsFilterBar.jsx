import { useState } from 'react';
import { FaFilter, FaBuilding, FaTag, FaSort } from 'react-icons/fa';

export default function HrisServiceReviewsFilterBar() {
  const [status, setStatus] = useState('Pending');
  const [client, setClient] = useState('All Clients');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('Most Recent');

  return (
    <div className="sr-review-filter-bar">
      <div className="sr-review-filter-group">
        <label className="sr-review-filter-label"><FaFilter /> Status:</label>
        <select className="sr-review-filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Published</option>
          <option>Rejected</option>
        </select>
      </div>
      <div className="sr-review-filter-group">
        <label className="sr-review-filter-label"><FaBuilding /> Client:</label>
        <select className="sr-review-filter-select" value={client} onChange={(e) => setClient(e.target.value)}>
          <option>All Clients</option>
          <option>FEU Institute of Technology</option>
          <option>Ayala Corporation</option>
          <option>SM Prime Holdings</option>
        </select>
      </div>
      <div className="sr-review-filter-group">
        <label className="sr-review-filter-label"><FaTag /> Category:</label>
        <select className="sr-review-filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All Categories</option>
          <option>Guard Performance</option>
          <option>Incident Response</option>
          <option>Communication</option>
          <option>Overall Service</option>
        </select>
      </div>
      <div className="sr-review-filter-group-right">
        <label className="sr-review-filter-label"><FaSort /> Sort:</label>
        <select className="sr-review-filter-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option>Most Recent</option>
          <option>Highest Rated</option>
          <option>Lowest Rated</option>
        </select>
      </div>
    </div>
  );
}
