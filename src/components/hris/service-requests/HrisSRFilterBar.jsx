import ServiceRequestFilterBar from '@components/service-requests/ServiceRequestFilterBar';

export default function HrisSRFilterBar({ clients = [], filters, onFilterChange }) {
  return (
    <ServiceRequestFilterBar
      clients={clients}
      filters={filters}
      onFilterChange={onFilterChange}
    />
  );
}
