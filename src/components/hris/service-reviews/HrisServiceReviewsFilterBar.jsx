import { FaClipboardCheck, FaFilter, FaBuilding, FaTag, FaSort } from 'react-icons/fa';

export default function HrisServiceReviewsFilterBar({ filters, clients = [], onChange }) {
  return (
    <div className="filter-bar five-cols">
      <div className="filter-group">
        <label className="filter-label"><FaFilter /> Status</label>
        <select className="filter-select" value={filters.status} onChange={(e) => onChange?.('status', e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label"><FaBuilding /> Client</label>
        <select className="filter-select" value={filters.clientId} onChange={(e) => onChange?.('clientId', e.target.value)}>
          <option value="all">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>{client.label}</option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label"><FaTag /> Category</label>
        <select className="filter-select" value={filters.category} onChange={(e) => onChange?.('category', e.target.value)}>
          <option value="all">All Categories</option>
          <option value="guard-performance">Guard Performance</option>
          <option value="incident-response">Incident Response</option>
          <option value="communication">Communication</option>
          <option value="overall-service">Overall Service</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label"><FaClipboardCheck /> Submission</label>
        <select className="filter-select" value={filters.submissionType} onChange={(e) => onChange?.('submissionType', e.target.value)}>
          <option value="all">All Types</option>
          <option value="monthly_required">Monthly Required</option>
          <option value="ad_hoc">Ad Hoc</option>
        </select>
      </div>
      <div className="filter-group">
        <label className="filter-label"><FaSort /> Sort</label>
        <select className="filter-select" value={filters.sort} onChange={(e) => onChange?.('sort', e.target.value)}>
          <option value="most_recent">Most Recent</option>
          <option value="highest_rated">Highest Rated</option>
          <option value="lowest_rated">Lowest Rated</option>
        </select>
      </div>
    </div>
  );
}
