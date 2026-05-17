import { useMemo } from 'react';
import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from 'react-icons/fa';

const ITEMS_PER_PAGE = 10;

function PriorityIcon({ priority }) {
  if (priority === 'Urgent')    return <FaExclamationCircle className="ann-priority-icon ann-priority-icon--urgent" />;
  if (priority === 'Important') return <FaExclamationTriangle className="ann-priority-icon ann-priority-icon--important" />;
  return <FaInfoCircle className="ann-priority-icon ann-priority-icon--normal" />;
}

function buildPreview(message) {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
}

function buildPageNumbers(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) { pages.add(2); pages.add(3); pages.add(4); }
  if (page >= totalPages - 2) { pages.add(totalPages - 1); pages.add(totalPages - 2); pages.add(totalPages - 3); }

  const sorted = [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
  return sorted.reduce((result, item, index) => {
    if (index > 0 && item - sorted[index - 1] > 1) result.push(`gap-${sorted[index - 1]}-${item}`);
    result.push(item);
    return result;
  }, []);
}

function SkeletonRow() {
  return (
    <tr className="ann-skel-row">
      <td><span className="ann-skel ann-skel-text" /></td>
      <td><span className="ann-skel ann-skel-id" /></td>
      <td>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span className="ann-skel ann-skel-icon-sm" style={{ marginTop: 2 }} />
          <div>
            <span className="ann-skel ann-skel-text-lg" />
            <span className="ann-skel ann-skel-text-sm" style={{ marginTop: 4 }} />
          </div>
        </div>
      </td>
      <td><span className="ann-skel ann-skel-badge" /></td>
      <td><span className="ann-skel ann-skel-badge" /></td>
      <td><span className="ann-skel ann-skel-btn" /></td>
    </tr>
  );
}

export default function AnnouncementsTable({
  announcements = [],
  metadata,
  loading = false,
  onPageChange,
  onViewDetail,
}) {
  const page = metadata?.page || 1;
  const total = metadata?.total || 0;
  const limit = metadata?.limit || ITEMS_PER_PAGE;
  const totalPages = metadata?.totalPages || 0;
  const paginated = useMemo(() => announcements, [announcements]);
  const pageNumbers = useMemo(() => buildPageNumbers(page, totalPages), [page, totalPages]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) onPageChange?.(p);
  };

  return (
    <div className="ann-table-panel">
      <div className="ann-table-header">
        <h3 className="ann-table-title">
          <FaBullhorn /> Announcement Records
        </h3>
        <span className="ann-table-count">{total} announcement{total !== 1 ? 's' : ''}</span>
      </div>

      <div className="ann-table-wrapper">
        <table className="ann-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Announcement ID</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Audience</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={`skel-${i}`} />)
              : paginated.length === 0
              ? (
                <tr>
                  <td colSpan={6} className="ann-table-empty">
                    <div className="ann-empty-state">
                      <FaBullhorn className="ann-empty-icon" />
                      <p>No announcements found</p>
                      <span>Try adjusting your search or filters</span>
                    </div>
                  </td>
                </tr>
              ) : paginated.map((ann) => (
                <tr key={ann.id} className="ann-table-row">
                  <td className="ann-td-muted">{ann.date}</td>
                  <td className="ann-td-id">{ann.id}</td>
                  <td className="ann-td-subject">
                    <div className="ann-subject-wrap">
                      <PriorityIcon priority={ann.priority} />
                      <div className="ann-subject-content">
                        <span className="ann-subject-title">{ann.subject}</span>
                        <span className="ann-subject-preview">{buildPreview(ann.message)}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className={ann.priorityClass}>{ann.priority}</span></td>
                  <td><span className={ann.audienceClass}>{ann.audience}</span></td>
                  <td>
                    <button className="ann-view-btn" onClick={() => onViewDetail?.(ann)}>
                      <FaEye /> View
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {!loading && total > 0 && (
        <div className="ann-pagination">
          <span className="ann-pagination-info">
            Showing {Math.min((page - 1) * limit + 1, total)}–
            {Math.min(page * limit, total)} of {total} announcement{total !== 1 ? 's' : ''}
          </span>
          <div className="ann-pagination-btns">
            <button
              className="ann-page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>
            {pageNumbers.map((p) =>
              typeof p === 'number' ? (
                <button
                  key={p}
                  className={`ann-page-btn${p === page ? ' active' : ''}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ) : (
                <span key={p} className="ann-page-gap">…</span>
              )
            )}
            <button
              className="ann-page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
