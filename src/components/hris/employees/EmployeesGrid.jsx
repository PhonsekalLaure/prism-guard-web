import { useState } from 'react';
import {
  FaBriefcase, FaBuilding, FaCalendarAlt, FaEye
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';

export default function EmployeesGrid({ 
  employees = [], 
  totalItems = 0,
  currentPage = 1,
  onPageChange,
  onViewEmployee 
}) {
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Note: currentEmployees is now just the employees prop because the backend already paginated it
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + employees.length, totalItems);

  return (
    <>
      <div className="employees-grid">
        {employees.map((emp, i) => (
          <div key={emp.id || i} className="employee-card">
            {/* ... card content remains same ... */}
            <div className="employee-card-body">
              <div className="employee-card-header-row">
                <div className="employee-header-left">
                  {emp.avatar_url ? (
                    <img src={emp.avatar_url} alt={emp.initials} className="employee-avatar min-w-[40px]" />
                  ) : (
                    <div className="employee-avatar">{emp.initials}</div>
                  )}
                  <div>
                    <h4 className="employee-name">{emp.name}</h4>
                    <p className="employee-id">{emp.employee_id_number}</p>
                  </div>
                </div>
                <span className={`employee-badge badge-${emp.status}`}>
                  {emp.status.toUpperCase()}
                </span>
              </div>

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

      {/* Reusable Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        label="employees"
      />
    </>
  );
}
