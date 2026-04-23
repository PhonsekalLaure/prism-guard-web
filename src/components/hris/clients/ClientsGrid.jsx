import {
  FaMapMarkerAlt, FaUsers, FaEnvelope, FaEye, FaUser,
  FaSearch
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';

export default function ClientsGrid({
  clients = [],
  totalItems = 0,
  currentPage = 1,
  onPageChange,
  onResetFilters,
  onViewClient
}) {
  const itemsPerPage = 6;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + clients.length, totalItems);

  return (
    <>
      <div className="clients-grid">
        {clients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <FaSearch />
            </div>
            <h3 className="empty-state-title">No clients found</h3>
            <p className="empty-state-desc">
              We couldn't find any clients matching your current search or filter criteria.
              Try adjusting your settings or reset to view all clients.
            </p>
            <button
              onClick={() => onResetFilters?.()}
              className="empty-state-reset"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          clients.map((client, i) => (
            <div key={client.id || i} className="client-card">
              {/* Colored header */}
              <div className="client-card-header">
                {/* Avatar / Initials — matches employee-avatar style */}
                <div className="client-avatar">
                  {client.initials || '??'}
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
