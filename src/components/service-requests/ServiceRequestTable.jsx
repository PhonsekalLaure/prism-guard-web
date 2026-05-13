import {
  FaBuilding,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaListAlt,
  FaReply,
} from 'react-icons/fa';
import {
  getServiceRequestTypeIcon,
  getStatusBadgeClass,
  getUrgencyBadgeClass,
} from './serviceRequestUi';

const BADGE_SKEL = { width: 62, height: 22, borderRadius: 20, flexShrink: 0 };
const BTN_SKEL   = { width: 54, height: 28, borderRadius: 6,  flexShrink: 0 };

function SkeletonRows({ showClient }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="sr-skel-row">
      <td><div className="dsk-line md" /></td>
      {showClient && <td><div className="dsk-line lg" /></td>}
      <td><div className="dsk-line md" /></td>
      <td><div className="dsk-line sm" /></td>
      <td><div className="dsk-btn" style={BADGE_SKEL} /></td>
      <td><div className="dsk-line sm" /></td>
      <td><div className="dsk-btn" style={BADGE_SKEL} /></td>
      <td><div className="dsk-btn" style={BTN_SKEL} /></td>
    </tr>
  ));
}

function paginationWindow(page, totalPages) {
  return Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
    const half = 2;
    let first = Math.max(1, page - half);
    const last = Math.min(totalPages, first + 4);
    first = Math.max(1, last - 4);
    return first + index;
  }).filter((candidate) => candidate >= 1 && candidate <= totalPages);
}

export default function ServiceRequestTable({
  requests = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  mode = 'cms',
  title,
  onOpenRequest,
  onPageChange,
}) {
  const { total, page, limit, totalPages } = metadata;
  const showClient = mode === 'hris';
  const columns = showClient ? 8 : 7;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);
  const pages = paginationWindow(page, totalPages);

  return (
    <div className="sr-table-card">
      <div className="sr-table-header">
        <p className="sr-table-title">
          <FaListAlt /> {title || (showClient ? 'All Client Requests' : 'All Requests')}
        </p>
      </div>

      <div className="sr-table-wrap">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Request ID</th>
              {showClient && <th>Client</th>}
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
              <SkeletonRows showClient={showClient} />
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={columns} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No service requests found.
                </td>
              </tr>
            ) : requests.map((request) => {
              const { Icon, className } = getServiceRequestTypeIcon(request.ticket_type || request.type);
              const requestId = request.request_id || String(request.id).substring(0, 8).toUpperCase();
              const urgencyText = request.urgencyLabel || request.urgency;
              const isRespondAction = showClient && request.action === 'respond';

              return (
                <tr
                  key={request.id}
                  className="sr-table-row"
                  onClick={() => onOpenRequest?.(request)}
                >
                  <td>
                    <span className={showClient ? 'sr-request-id' : 'sr-td-id'}>{requestId}</span>
                  </td>
                  {showClient && (
                    <td>
                      <div className="sr-client-cell">
                        <div className="sr-client-icon blue">
                          <FaBuilding />
                        </div>
                        <span className="sr-client-name">{request.client}</span>
                      </div>
                    </td>
                  )}
                  <td className={showClient ? undefined : 'sr-td-type'}>
                    {showClient ? (
                      <div className="sr-type-cell">
                        <Icon className={`sr-type-icon ${className}`} />
                        {request.type}
                      </div>
                    ) : (
                      <>
                      <Icon className={`sr-type-icon ${className}`} />
                      {request.type}
                      </>
                    )}
                  </td>
                  <td className={showClient ? undefined : 'sr-td-muted'} style={showClient ? { color: '#6b7280' } : undefined}>
                    {request.site}
                  </td>
                  <td>
                    <span className={getUrgencyBadgeClass(request)}>{urgencyText}</span>
                  </td>
                  <td className={showClient ? undefined : 'sr-td-muted'} style={showClient ? { color: '#6b7280' } : undefined}>
                    {request.date}
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(request)}>{request.statusLabel}</span>
                  </td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <button
                      className={isRespondAction ? 'sr-action-respond' : (showClient ? 'sr-action-view' : 'sr-view-btn')}
                      onClick={() => onOpenRequest?.(request)}
                    >
                      {isRespondAction ? <><FaReply /> Respond</> : (showClient ? 'View' : <><FaEye /> View</>)}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sr-table-footer">
        <p className="sr-showing-text">
          {total === 0 ? 'No requests' : `Showing ${start}-${end} of ${total} request${total === 1 ? '' : 's'}`}
        </p>
        <div className="sr-page-btns">
          <button
            className="sr-page-btn"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            <FaChevronLeft />
          </button>
          {pages.map((candidate) => (
            <button
              key={candidate}
              className={`sr-page-btn${candidate === page ? ' active' : ''}`}
              disabled={loading || candidate === page}
              onClick={() => onPageChange?.(candidate)}
            >
              {candidate}
            </button>
          ))}
          <button
            className="sr-page-btn"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
