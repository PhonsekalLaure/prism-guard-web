import Topbar from '@hris-components/dashboard/Topbar';
import StatCards from '@hris-components/dashboard/StatCards';
import IncidentFeed from '@hris-components/dashboard/IncidentFeed';
import ManpowerTable from '@hris-components/dashboard/ManpowerTable';
import LeaveRequests from '@hris-components/dashboard/LeaveRequests';
import CashAdvances from '@hris-components/dashboard/CashAdvances';

export default function DashboardPage() {
  return (
    <>
      <Topbar />

      <div className="dashboard-content">
        <StatCards />

        <div className="content-grid">
          <IncidentFeed />
          <LeaveRequests />
          <ManpowerTable />
          <CashAdvances />
        </div>
      </div>
    </>
  );
}
