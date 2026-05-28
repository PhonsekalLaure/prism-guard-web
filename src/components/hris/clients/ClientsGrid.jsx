import {
  FaMapMarkerAlt, FaUsers, FaEnvelope, FaEye, FaUser,
  FaSearch, FaExclamationTriangle
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { EntityCardSkeleton, SkeletonList } from '@components/ui/Skeleton';

export default function ClientsGrid({
  clients = [],
  totalItems = 0,
  currentPage = 1,
  onPageChange,
  onResetFilters,
  onViewClient,
  loading = false,
}) {
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + clients.length, totalItems);

  if (loading) {
    return (
      <div className="clients-grid">
        <SkeletonList count={6}>{(index) => (
          <EntityCardSkeleton key={index} variant="client" />
        )}</SkeletonList>
      </div>
    );
  }

  return (
    <>
      <div className="clients-grid">
        {clients.length === 0 ? (
          <EmptyState
            icon={FaSearch}
            title="No clients found"
            description="We couldn't find any clients matching your current search or filter criteria. Try adjusting your settings or reset to view all clients."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
          />
        ) : (
          clients.map((client, i) => (
            <div key={client.id || i} className="client-card">
              {/* Colored header */}
              <div className="client-card-header">
                {/* Avatar / Initials — matches employee-avatar style */}
                <div className="client-avatar">
                  {client.avatar_url ? (
                    <img src={client.avatar_url} alt={client.initials || client.company} className="w-full h-full object-cover" />
                  ) : (
                    client.initials || '??'
                  )}
                </div>

                <span className={`client-badge badge-${client.status}`}>
                  {client.status?.toUpperCase()}
                </span>

                <h4 className="client-company">{client.company}</h4>
                <div className="client-contact-person">
                  <FaUser />
                  {client.contact_person || 'No contact set'}
                </div>
              </div>

              {/* Body */}
              <div className="client-card-body">
                {client.admin_action_required && (
                  <div className="client-contract-alert">
                    <FaExclamationTriangle />
                    <span>{client.admin_action_message || 'Contract needs attention'}</span>
                  </div>
                )}
                <div className="client-info-row">
                  <FaEnvelope />
                  <span>{client.contact_email || 'No email'}</span>
                </div>
                <div className="client-info-row">
                  <FaMapMarkerAlt />
                  <span>{client.contract_status || 'N/A'}</span>
                </div>
                <div className="client-info-row">
                  <FaUsers />
                  <span>{client.rate_per_guard ? `₱${Number(client.rate_per_guard).toLocaleString()}/guard` : 'Rate not set'}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="client-card-footer">
                <button
                  className="client-view-link"
                  onClick={() => onViewClient?.(client)}
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {clients.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={totalItems}
          label="clients"
        />
      )}
    </>
  );
}
