import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function HrisPayrollFilterBar() {
  return (
    <div className="pr-filter-bar">
      <div className="pr-filter-group">
        <label className="pr-filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="pr-filter-input"
          placeholder="Search by employee name or ID..."
        />
      </div>

      <div className="pr-filter-group">
        <label className="pr-filter-label">
          <FaBuilding /> Assigned Client
        </label>
        <select className="pr-filter-select">
          <option>All Clients</option>
          <option>FEU Institute of Tech</option>
          <option>SM Mall of Asia</option>
          <option>SM North Edsa</option>
        </select>
      </div>

      <div className="pr-filter-group">
        <label className="pr-filter-label">
          <FaFilter /> Status
        </label>
        <select className="pr-filter-select">
          <option>All Status</option>
          <option>Processing</option>
          <option>Ready</option>
          <option>Paid</option>
        </select>
      </div>
    </div>
  );
}
