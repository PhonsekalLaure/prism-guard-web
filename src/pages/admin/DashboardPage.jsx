import Topbar from '@/components/admin/dashboard/Topbar';
import StatCards from '@/components/admin/dashboard/StatCards';
import IncidentFeed from '@/components/admin/dashboard/IncidentFeed';
import ManpowerTable from '@/components/admin/dashboard/ManpowerTable';
import LeaveRequests from '@/components/admin/dashboard/LeaveRequests';
import CashAdvances from '@/components/admin/dashboard/CashAdvances';

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
