import { useState } from 'react';
import ServiceRequestsTopbar from '@cms-components/service-requests/ServiceRequestsTopbar';
import ServiceRequestsStatCards from '@cms-components/service-requests/ServiceRequestsStatCards';
import ServiceRequestsFilterBar from '@cms-components/service-requests/ServiceRequestsFilterBar';
import ServiceRequestsTable from '@cms-components/service-requests/ServiceRequestsTable';
import NewRequestModal from '@cms-components/service-requests/NewRequestModal';
import RequestDetailModal from '@cms-components/service-requests/RequestDetailModal';

export default function ServiceRequestsPage() {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <>
      <ServiceRequestsTopbar onNewRequest={() => setIsNewRequestOpen(true)} />

      <div className="cms-content">
        <ServiceRequestsStatCards />
        <ServiceRequestsFilterBar />
        <ServiceRequestsTable onViewRequest={(req) => setSelectedRequest(req)} />
      </div>

      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
      />

      <RequestDetailModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </>
  );
}