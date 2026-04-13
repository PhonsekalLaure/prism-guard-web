import CmsTopbar from '../../components/cms/dashboard/CmsTopbar';
import CmsStatCards from '../../components/cms/dashboard/CmsStatCards';
import RecentIncidents from '../../components/cms/dashboard/RecentIncidents';
import RecentServiceRequests from '../../components/cms/dashboard/RecentServiceRequests';
import UpcomingBilling from '../../components/cms/dashboard/UpcomingBilling';
import ContractOverview from '../../components/cms/dashboard/ContractOverview';

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