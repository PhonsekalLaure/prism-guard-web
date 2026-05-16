import HrisLeaveRequestsTopbar from '@hris-components/leave-requests/HrisLeaveRequestsTopbar';
import HrisLeaveRequestsStatCards from '@hris-components/leave-requests/HrisLeaveRequestsStatCards';
import HrisLeaveRequestsFilterBar from '@hris-components/leave-requests/HrisLeaveRequestsFilterBar';
import HrisLeaveRequestsList from '@hris-components/leave-requests/HrisLeaveRequestsList';
import '../../styles/hris/HrisLeaveRequests.css';

export default function HrisLeaveRequestsPage() {
  return (
    <>
      <HrisLeaveRequestsTopbar />

      <div className="dashboard-content">
        <HrisLeaveRequestsStatCards />
        <HrisLeaveRequestsFilterBar />
        <HrisLeaveRequestsList />
      </div>
    </>
  );
}
