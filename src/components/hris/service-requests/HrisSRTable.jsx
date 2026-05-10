import {
  FaListAlt, FaBuilding, FaUserPlus, FaExchangeAlt,
  FaQuestionCircle, FaReply, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

function typeIcon(ticketType = '') {
  if (ticketType === 'additional_guard') return { Icon: FaUserPlus, className: 'blue' };
  if (ticketType === 'guard_replacement') return { Icon: FaExchangeAlt, className: 'yellow' };
  return { Icon: FaQuestionCircle, className: 'purple' };
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, index) => (
    <tr key={index}>
      <td colSpan={8} style={{ padding: '1rem' }}>
        <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px' }} />
      </td>
    </tr>
  ));
}


export default function HrisSRTable({
  requests = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  onOpenDetail,
  onPageChange,
}) {
  const { total, page, limit, totalPages } = metadata;
  const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="sr-table-card">
      <div className="sr-table-header">
        <p className="sr-table-title">
          <FaListAlt /> All Client Requests
        </p>
      </div>

      <div className="sr-table-wrap">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Client</th>
              <th>Type</th>
              <th>Site</th>
              <th>Urgency</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows />
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No service requests found.
                </td>
              </tr>
            ) : requests.map((request) => {
              const { Icon, className } = typeIcon(request.ticket_type);
              return (
                <tr key={request.id} onClick={() => onOpenDetail(request)}>
                  <td><span className="sr-request-id">{request.request_id}</span></td>
                  <td>
                    <div className="sr-client-cell">
                      <div className="sr-client-icon blue">
                        <FaBuilding />
                      </div>
                      <span className="sr-client-name">{request.client}</span>
                    </div>
                  </td>
                  <td>
                    <div className="sr-type-cell">
                      <Icon className={`sr-type-icon ${className}`} />
                      {request.type}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{request.site}</td>
                  <td><span className={`sr-urgency-badge ${request.urgency}`}>{request.urgencyLabel}</span></td>
                  <td style={{ color: '#6b7280' }}>{request.date}</td>
                  <td><span className={`sr-status-badge ${request.statusClass || request.status}`}>{request.statusLabel}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    {request.action === 'respond' ? (
                      <button className="sr-action-respond" onClick={() => onOpenDetail(request)}>
                        <FaReply /> Respond
                      </button>
                    ) : (
                      <button className="sr-action-view" onClick={() => onOpenDetail(request)}>View</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sr-table-footer">
        <p className="sr-showing-text">
          {total === 0 ? 'No requests' : `Showing ${start}-${end} of ${total} requests`}
        </p>
        <div className="sr-page-btns">
          <button className="sr-page-btn" disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>
            <FaChevronLeft />
          </button>
          <button className="sr-page-btn active" disabled>{page}</button>
          <button className="sr-page-btn" disabled={page >= totalPages || loading} onClick={() => onPageChange(page + 1)}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

