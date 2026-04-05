import Topbar from '../components/dashboard/Topbar';
import StatCards from '../components/dashboard/StatCards';
import IncidentFeed from '../components/dashboard/IncidentFeed';
import ManpowerTable from '../components/dashboard/ManpowerTable';
import LeaveRequests from '../components/dashboard/LeaveRequests';
import CashAdvances from '../components/dashboard/CashAdvances';

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
