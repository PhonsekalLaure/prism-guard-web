import ServiceRequestStatCards from '@components/service-requests/ServiceRequestStatCards';
import { BASE_STATS, HRIS_EXTRA_STATS } from '@components/service-requests/serviceRequestUi';

const HRIS_STATS = [...BASE_STATS, ...HRIS_EXTRA_STATS];

export default function HrisSRStatCards({ stats, loading = false }) {
  return (
    <ServiceRequestStatCards
      stats={stats}
      loading={loading}
      cards={HRIS_STATS}
      columns={5}
    />
  );
}
