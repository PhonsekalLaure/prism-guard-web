import {
  FaBriefcase, FaBuilding, FaCalendarAlt, FaEye,
  FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

const employees = [
  {
    initials: 'JC',
    name: 'Juan Cruz',
    id: 'PRISM-2024-001',
    status: 'ACTIVE',
    statusType: 'active',
    position: 'Security Officer I',
    client: 'SM Mall of Asia',
    tenure: '2 years tenure',
  },
  {
    initials: 'RR',
    name: 'Ronn Rosarito',
    id: 'PRISM-2024-002',
    status: 'ON LEAVE',
    statusType: 'leave',
    position: 'Security Guard',
    client: 'FEU Institute of Tech',
    tenure: '1.5 years tenure',
  },
  {
    initials: 'QM',
    name: 'Quervie Manrique',
    id: 'PRISM-2024-003',
    status: 'ACTIVE',
    statusType: 'active',
    position: 'Security Officer I',
    client: 'SM North Edsa',
    tenure: '3 years tenure',
  },
  {
    initials: 'CA',
    name: 'Christabelle Acedillo',
    id: 'PRISM-2024-004',
    status: 'ABSENT',
    statusType: 'absent',
    position: 'Security Officer II',
    client: 'FEU Institute of Tech',
    tenure: '4 years tenure',
  },
  {
    initials: 'RG',
    name: 'Richielle Gutierrez',
    id: 'PRISM-2024-005',
    status: 'ACTIVE',
    statusType: 'active',
    position: 'Security Guard',
    client: 'SM Mall of Asia',
    tenure: '2.5 years tenure',
  },
  {
    initials: 'MD',
    name: 'Mario Dela Cruz',
    id: 'PRISM-2024-006',
    status: 'ACTIVE',
    statusType: 'active',
    position: 'Security Officer I',
    client: 'SM North Edsa',
    tenure: '1 years tenure',
  },
];

export default function EmployeesGrid({ onViewEmployee }) {
  return (
    <>
      <div className="employees-grid">
        {employees.map((emp, i) => (
          <div key={i} className="employee-card">
            <div className="employee-card-body">
              {/* Header: avatar + name + badge */}
              <div className="employee-card-header-row">
                <div className="employee-header-left">
                  <div className="employee-avatar">{emp.initials}</div>
                  <div>
                    <h4 className="employee-name">{emp.name}</h4>
                    <p className="employee-id">{emp.id}</p>
                  </div>
                </div>
                <span className={`employee-badge badge-${emp.statusType}`}>
                  {emp.status}
                </span>
              </div>

              {/* Info rows */}
              <div className="employee-info-section">
                <div className="employee-info-row">
                  <FaBriefcase />
                  <span>{emp.position}</span>
                </div>
                <div className="employee-info-row">
                  <FaBuilding />
                  <span>{emp.client}</span>
                </div>
                <div className="employee-info-row">
                  <FaCalendarAlt />
                  <span>{emp.tenure}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="employee-card-footer">
                <button
                  className="employee-view-link"
                  onClick={() => onViewEmployee?.(emp)}
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="employees-pagination">
        <p className="employees-pagination-info">Showing 1-6 of 126 employees</p>
        <div className="employees-page-btns">
          <button className="page-btn"><FaChevronLeft /></button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </>
  );
}
