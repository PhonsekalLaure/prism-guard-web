import HrisAttendanceTopbar from '@hris-components/attendance/HrisAttendanceTopbar';
import HrisAttendanceStatCards from '@hris-components/attendance/HrisAttendanceStatCards';
import HrisAttendanceFilterBar from '@hris-components/attendance/HrisAttendanceFilterBar';
import HrisAttendanceTable from '@hris-components/attendance/HrisAttendanceTable';
import '../../styles/hris/HrisAttendance.css';

export default function HrisAttendancePage() {
  return (
    <>
      <HrisAttendanceTopbar />

      <div className="dashboard-content">
        <HrisAttendanceStatCards />
        <HrisAttendanceFilterBar />
        <HrisAttendanceTable />
      </div>
    </>
  );
}
