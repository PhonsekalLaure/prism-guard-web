import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeesTopbar from '@hris-components/employees/EmployeesTopbar';
import EmployeesStatCards from '@hris-components/employees/EmployeesStatCards';
import EmployeesFilterBar from '@hris-components/employees/EmployeesFilterBar';
import EmployeesGrid from '@hris-components/employees/EmployeesGrid';
import employeeService from '@services/hris/employeeService';
import clientService from '@services/hris/clientService';
import authService from '@services/authService';
import { hasPermission } from '@utils/adminPermissions';

export default function EmployeesPage() {
  const navigate = useNavigate();
  const profile = authService.getProfile() || {};
  const canWriteEmployees = hasPermission(profile, 'employees.write');
  const [employees,    setEmployees]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [refreshKey,   setRefreshKey]   = useState(0);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [totalItems,   setTotalItems]   = useState(0);
  const [clientsList,  setClientsList]  = useState([]);
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({ search: '', status: 'all', client: 'all' });

  useEffect(() => {
    clientService.getClientsList()
      .then(data => setClientsList(data))
      .catch(err  => console.error('Failed to fetch clients:', err));
  }, []);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); setCurrentPage(1); };
  const handleResetFilters = () => { setFilters({ search: '', status: 'all', client: 'all' }); setCurrentPage(1); };

  useEffect(() => {
    async function fetchEmployees() {
      try {
        setLoading(true);
        setError(null);
        const response = await employeeService.getAllEmployees(currentPage, itemsPerPage, filters);
        setEmployees(response.data);
        setTotalItems(response.metadata.total);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, [currentPage, filters, refreshKey]);

  return (
    <>
      <EmployeesTopbar canAddEmployee={canWriteEmployees} />

      <div className="dashboard-content">
        <EmployeesStatCards refreshKey={refreshKey} />
        <EmployeesFilterBar filters={filters} onFilterChange={handleFilterChange} clients={clientsList} />
        {error ? (
          <div className="admin-alert-box admin-alert-error" style={{ marginTop: '1rem' }}>Error loading employees: {error}</div>
        ) : (
          <EmployeesGrid
            employees={employees}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onResetFilters={handleResetFilters}
            onViewEmployee={(emp) => navigate(`/employees/${emp.id}`)}
            loading={loading}
          />
        )}
      </div>
    </>
  );
}
