import ServiceRequestStatCards from '@components/service-requests/ServiceRequestStatCards';
import { BASE_STATS } from '@components/service-requests/serviceRequestUi';

export default function ServiceRequestsStatCards({ stats, loading }) {
  return (
    <ServiceRequestStatCards
      stats={stats}
      loading={loading}
      cards={BASE_STATS}
      className="stat-grid three-cols"
    />
  );
}
