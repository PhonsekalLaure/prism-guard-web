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
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <CmsStatCards />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <RecentIncidents />
            <RecentServiceRequests />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <UpcomingBilling />
            <ContractOverview />
          </div>
        </div>
      </div>
    </>
  );
}