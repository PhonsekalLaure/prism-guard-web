import { useNavigate } from 'react-router-dom';
import {
  FaBriefcase, FaBuilding, FaCalendarAlt, FaExclamationTriangle, FaEye, FaSearch
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { EntityCardSkeleton, SkeletonList } from '@components/ui/Skeleton';

export default function EmployeesGrid({ 
  employees = [], 
  totalItems = 0,
  currentPage = 1,
  onPageChange,
  onResetFilters,
  loading = false,
}) {
  const navigate = useNavigate();
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Note: currentEmployees is now just the employees prop because the backend already paginated it
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + employees.length, totalItems);

  if (loading) {
    return (
      <div className="employees-grid">
        <SkeletonList count={6}>{(index) => (
          <EntityCardSkeleton key={index} variant="employee" />
        )}</SkeletonList>
      </div>
    );
  }

  return (
    <>
      <div className="employees-grid">
        {employees.length === 0 ? (
          <EmptyState
            icon={FaSearch}
            title="No employees found"
            description="We couldn't find any employees matching your current search or filter criteria. Try adjusting your settings or reset to view all employees."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
          />
        ) : (
          employees.map((emp, i) => (
            <div key={emp.id || i} className="employee-card">
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
                  <span className={`employee-badge badge-${emp.status || 'unknown'}`}>
                    {emp.status?.toUpperCase() || 'UNKNOWN'}
                  </span>

                </div>

                <div className="employee-info-section">
                  {emp.employment_contract_needs_renewal && (
                    <div className="employee-contract-alert">
                      <FaExclamationTriangle />
                      <span>{emp.admin_action_message || 'Employment contract needs renewal'}</span>
                    </div>
                  )}
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
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <FaEye />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {employees.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          label="employees"
        />
      )}
    </>
  );
}
