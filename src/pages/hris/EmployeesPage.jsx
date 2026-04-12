import { useState } from 'react';
import EmployeesTopbar from '@hris-components/employees/EmployeesTopbar';
import EmployeesStatCards from '@hris-components/employees/EmployeesStatCards';
import EmployeesFilterBar from '@hris-components/employees/EmployeesFilterBar';
import EmployeesGrid from '@hris-components/employees/EmployeesGrid';
import ViewEmployeeModal from '@hris-components/employees/ViewEmployeeModal';
import AddEmployeeModal from '@hris-components/employees/AddEmployeeModal';

export default function EmployeesPage() {
  const [viewEmployee, setViewEmployee] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <EmployeesTopbar onAddEmployee={() => setIsAddOpen(true)} />

      <div className="dashboard-content">
        <EmployeesStatCards />
        <EmployeesFilterBar />
        <EmployeesGrid onViewEmployee={(emp) => setViewEmployee(emp)} />
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
