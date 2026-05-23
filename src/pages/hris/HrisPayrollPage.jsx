import { useState } from 'react';
import HrisPayrollTopbar from '@hris-components/payroll/HrisPayrollTopbar';
import HrisPayrollStatCards from '@hris-components/payroll/HrisPayrollStatCards';
import HrisPayrollOngoingAlert from '@hris-components/payroll/HrisPayrollOngoingAlert';
import HrisPayrollFilterBar from '@hris-components/payroll/HrisPayrollFilterBar';
import HrisPayrollTable from '@hris-components/payroll/HrisPayrollTable';
import '../../styles/hris/HrisPayroll.css';

export default function HrisPayrollPage() {
  const [mode, setMode] = useState('finalized'); // 'finalized' | 'ongoing'

  return (
    <>
      <HrisPayrollTopbar mode={mode} onModeChange={setMode} />

      <div className="dashboard-content">
        <HrisPayrollStatCards />
        {mode === 'ongoing' && <HrisPayrollOngoingAlert />}
        <HrisPayrollFilterBar />
        <HrisPayrollTable mode={mode} />
      </div>
    </>
  );
}
