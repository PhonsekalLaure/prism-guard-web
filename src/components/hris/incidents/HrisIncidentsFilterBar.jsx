import { FaSearch, FaTag, FaFilter } from 'react-icons/fa';

export default function HrisIncidentsFilterBar() {
  return (
    <div className="ir-filter-bar">
      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="ir-filter-input"
          placeholder="Search by employee name"
        />
      </div>

      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaTag /> Category
        </label>
        <select className="ir-filter-select">
          <option>All Categories</option>
          <option>Theft/Security Breach</option>
          <option>Medical Emergency</option>
          <option>Property Damage</option>
          <option>Disturbance</option>
          <option>Suspicious Activity</option>
          <option>Lost &amp; Found</option>
        </select>
      </div>

      <div className="ir-filter-group">
        <label className="ir-filter-label">
          <FaFilter /> Priority
        </label>
        <select className="ir-filter-select">
          <option>All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>
    </div>
  );
}
