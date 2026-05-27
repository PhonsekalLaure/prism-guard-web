import { FaSearch, FaBuilding, FaFilter } from 'react-icons/fa';

export default function HrisPayrollFilterBar() {
  return (
    <div className="filter-bar three-cols">
      <div className="filter-group">
        <label className="filter-label">
          <FaSearch /> Search Employee
        </label>
        <input
          type="text"
          className="filter-input"
          placeholder="Search by employee name or ID..."
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaBuilding /> Assigned Client
        </label>
        <select className="filter-select">
          <option>All Clients</option>
          <option>FEU Institute of Tech</option>
          <option>SM Mall of Asia</option>
          <option>SM North Edsa</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <FaFilter /> Status
        </label>
        <select className="filter-select">
          <option>All Status</option>
          <option>Processing</option>
          <option>Ready</option>
          <option>Paid</option>
        </select>
      </div>
    </div>
  );
}
