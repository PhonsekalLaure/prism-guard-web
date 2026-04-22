import { useState } from 'react';
import HrisSRTopbar from '@hris-components/service-requests/HrisSRTopbar';
import HrisSRStatCards from '@hris-components/service-requests/HrisSRStatCards';
import HrisSRFilterBar from '@hris-components/service-requests/HrisSRFilterBar';
import HrisSRTable, { SRDetailModal } from '@hris-components/service-requests/HrisSRTable';
import '../../styles/hris/HrisServiceRequests.css';

export default function HrisServiceRequestsPage() {
  const [activeRequest, setActiveRequest] = useState(null);

  return (
    <>
      <HrisSRTopbar />

      <div className="dashboard-content">
        <HrisSRStatCards />
        <HrisSRFilterBar />
        <HrisSRTable onOpenDetail={setActiveRequest} />
      </div>

      <SRDetailModal
        request={activeRequest}
        onClose={() => setActiveRequest(null)}
      />
    </>
  );
}
