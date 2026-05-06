import {
  FaListAlt, FaUserPlus, FaExchangeAlt, FaClock,
  FaQuestionCircle, FaChevronLeft, FaChevronRight, FaEye, FaWrench,
} from 'react-icons/fa';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function typeIcon(ticketType = '') {
  const t = ticketType.toLowerCase();
  if (t.includes('additional') || t.includes('guard')) return <FaUserPlus className="sr-type-icon sr-type-icon--blue" />;
  if (t.includes('replacement'))                          return <FaExchangeAlt className="sr-type-icon sr-type-icon--gold" />;
  if (t.includes('schedule'))                             return <FaClock className="sr-type-icon sr-type-icon--green" />;
  if (t.includes('inquiry') || t.includes('general'))    return <FaQuestionCircle className="sr-type-icon sr-type-icon--purple" />;
  return <FaWrench className="sr-type-icon sr-type-icon--blue" />;
}

function SkeletonRow() {
  return (
    <tr className="sr-table-row">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} style={{ padding: '1rem' }}>
          <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
        </td>
      ))}
    </tr>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceRequestsTable({
  tickets = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  onViewRequest,
  onPageChange,
}) {
  const { total, page, limit, totalPages } = metadata;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end   = Math.min(page * limit, total);

  const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
    // Sliding window around current page
    const half = 2;
    let first = Math.max(1, page - half);
    const last = Math.min(totalPages, first + 4);
    first = Math.max(1, last - 4);
    return first + i;
  }).filter((p) => p >= 1 && p <= totalPages);

  return (
    <div className="sr-table-panel">
      <div className="sr-table-header">
        <h3 className="sr-table-title">
          <FaListAlt /> All Requests
        </h3>
      </div>

      <div className="sr-table-wrapper">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Type</th>
              <th>Site</th>
              <th>Urgency</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
              : tickets.length === 0
                ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d', fontSize: '0.85rem' }}>
                      No service requests found
                    </td>
                  </tr>
                )
                : tickets.map((req) => (
                  <tr
                    key={req.id}
                    className="sr-table-row"
                    onClick={() => onViewRequest?.(req)}
                  >
                    <td className="sr-td-id">
                      {String(req.id).substring(0, 8).toUpperCase()}
                    </td>
                    <td className="sr-td-type">
                      {typeIcon(req.ticket_type || req.type)}
                      {req.type}
                    </td>
                    <td className="sr-td-muted">{req.site}</td>
                    <td>
                      <span className={req.urgencyClass}>{req.urgency}</span>
                    </td>
                    <td className="sr-td-muted">{req.date}</td>
                    <td>
                      <span className={req.statusClass}>{req.statusLabel}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="sr-view-btn"
                        onClick={() => onViewRequest?.(req)}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="sr-pagination">
        <span className="sr-pagination-info">
          {total === 0 ? 'No requests' : `Showing ${start}–${end} of ${total} request${total === 1 ? '' : 's'}`}
        </span>
        <div className="sr-page-btns">
          <button
            className="page-btn"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            <FaChevronLeft />
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`page-btn${p === page ? ' active' : ''}`}
              disabled={loading}
              onClick={() => p !== page && onPageChange?.(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="page-btn"
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