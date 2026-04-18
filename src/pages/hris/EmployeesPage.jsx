import { useState, useEffect } from 'react';
import EmployeesTopbar from '@hris-components/employees/EmployeesTopbar';
import EmployeesStatCards from '@hris-components/employees/EmployeesStatCards';
import EmployeesFilterBar from '@hris-components/employees/EmployeesFilterBar';
import EmployeesGrid from '@hris-components/employees/EmployeesGrid';
import ViewEmployeeModal from '@hris-components/employees/ViewEmployeeModal';
import AddEmployeeModal from '@hris-components/employees/AddEmployeeModal';
import employeeService from '../../services/employeeService';

export default function EmployeesPage() {
  const [viewEmployee, setViewEmployee] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        const response = await employeeService.getAllEmployees(currentPage, itemsPerPage);
        // The backend now returns { data: [...], metadata: { total: ... } }
        setEmployees(response.data);
        setTotalItems(response.metadata.total);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, [currentPage]);

  return (
    <>
      <EmployeesTopbar onAddEmployee={() => setIsAddOpen(true)} />

      <div className="dashboard-content">
        <EmployeesStatCards />
        <EmployeesFilterBar />
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <svg className="animate-spin h-10 w-10 text-brand-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">Error loading employees: {error}</div>
        ) : (
          <EmployeesGrid 
            employees={employees} 
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onViewEmployee={(emp) => setViewEmployee(emp)} 
          />
        )}
      </div>

      <ViewEmployeeModal
        isOpen={!!viewEmployee}
        employee={viewEmployee}
        onClose={() => setViewEmployee(null)}
      />

      <AddEmployeeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
      />
    </>
  );
}
