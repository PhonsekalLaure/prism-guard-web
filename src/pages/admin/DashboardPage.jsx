import Topbar from '../../components/admin/Topbar';
import StatCards from '../../components/admin/StatCards';
import IncidentFeed from '../../components/admin/IncidentFeed';
import ManpowerTable from '../../components/admin/ManpowerTable';
import LeaveRequests from '../../components/admin/LeaveRequests';
import CashAdvances from '../../components/admin/CashAdvances';

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
