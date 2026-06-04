import ServiceRequestTable from '@components/service-requests/ServiceRequestTable';

export default function ServiceRequestsTable({
  tickets = [],
  metadata,
  loading,
  onViewRequest,
  onPageChange,
  onResetFilters,
}) {
  return (
    <ServiceRequestTable
      requests={tickets}
      metadata={metadata}
      loading={loading}
      mode="cms"
      onOpenRequest={onViewRequest}
      onPageChange={onPageChange}
      onResetFilters={onResetFilters}
    />
  );
}
