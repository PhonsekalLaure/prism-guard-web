import ServiceRequestFilterBar from '@components/service-requests/ServiceRequestFilterBar';

const DEFAULT_FILTERS = { status: 'all', type: 'all', urgency: 'all' };

export default function ServiceRequestsFilterBar({ filters = DEFAULT_FILTERS, onFilterChange }) {
  const handleFilterChange = (nextFilters) => {
    onFilterChange?.(nextFilters);
  };

  return (
    <ServiceRequestFilterBar
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
}
