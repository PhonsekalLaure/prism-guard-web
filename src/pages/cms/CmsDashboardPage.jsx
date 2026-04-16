import CmsTopbar from '@cms-components/dashboard/CmsTopbar';
import CmsStatCards from '@cms-components/dashboard/CmsStatCards';
import RecentIncidents from '@cms-components/dashboard/RecentIncidents';
import RecentServiceRequests from '@cms-components/dashboard/RecentServiceRequests';
import UpcomingBilling from '@cms-components/dashboard/UpcomingBilling';
import ContractOverview from '@cms-components/dashboard/ContractOverview';

export default function CmsDashboardPage() {
  return (
    <>
      <CmsTopbar />
      <div className="cms-content">
        <CmsStatCards />
        <div className="cms-grid">
          <div className="cms-left-col">
            <RecentIncidents />
            <RecentServiceRequests />
          </div>
          <div className="cms-right-col">
            <UpcomingBilling />
            <ContractOverview />
          </div>
        </div>
      </div>
    </>
  );
}