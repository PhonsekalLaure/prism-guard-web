import ServiceRequestTable from '@components/service-requests/ServiceRequestTable';

export default function HrisSRTable({
  requests = [],
  metadata,
  loading,
  onOpenDetail,
  onPageChange,
}) {
  return (
    <ServiceRequestTable
      requests={requests}
      metadata={metadata}
      loading={loading}
      mode="hris"
      onOpenRequest={onOpenDetail}
      onPageChange={onPageChange}
    />
  );
}
