import { useEffect, useMemo, useState } from 'react';
import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from 'react-icons/fa';

const ITEMS_PER_PAGE = 5;
const PRIORITY_ORDER = { Urgent: 0, Important: 1, Normal: 2 };

function PriorityIcon({ priority }) {
  if (priority === 'Urgent') return <FaExclamationCircle className="ann-priority-icon ann-priority-icon--urgent" />;
  if (priority === 'Important') return <FaExclamationTriangle className="ann-priority-icon ann-priority-icon--important" />;
  return <FaInfoCircle className="ann-priority-icon ann-priority-icon--normal" />;
}

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function buildPreview(message) {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
}

export default function AnnouncementsTable({
  announcements = [],
  filters,
  loading = false,
  onViewDetail,
}) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...announcements];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter((a) => (
        a.subject.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.publishedBy.toLowerCase().includes(q)
      ));
    }

    if (filters?.priority && filters.priority !== 'all') {
      const p = filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1);
      list = list.filter((a) => a.priority === p);
    }

    if (filters?.date) {
      list = list.filter((a) => {
        const rowDate = toDate(a.dateValue);
        const filterDate = new Date(filters.date);
        return (
          rowDate.getFullYear() === filterDate.getFullYear() &&
          rowDate.getMonth() === filterDate.getMonth() &&
          rowDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (filters?.sort === 'oldest') {
      list.sort((a, b) => toDate(a.dateValue) - toDate(b.dateValue));
    } else if (filters?.sort === 'priority') {
      list.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));
    } else {
      list.sort((a, b) => toDate(b.dateValue) - toDate(a.dateValue));
    }

    return list;
  }, [announcements, filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [announcements, filters]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  return (
    <div className="ann-table-panel">
      <div className="ann-table-header">
        <h3 className="ann-table-title">
          <FaBullhorn /> Announcement Records
        </h3>
        <span className="ann-table-count">{filtered.length} announcement{filtered.length !== 1 ? 's' : ''}</span>
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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="ann-table-empty">
                  <div className="ann-empty-state">
                    <FaBullhorn className="ann-empty-icon" />
                    <p>Loading announcements...</p>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="ann-table-empty">
                  <div className="ann-empty-state">
                    <FaBullhorn className="ann-empty-icon" />
                    <p>No announcements found</p>
                    <span>Try adjusting your search or filters</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((ann) => (
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
                  <td>
                    <span className={ann.priorityClass}>{ann.priority}</span>
                  </td>
                  <td>
                    <span className={ann.audienceClass}>{ann.audience}</span>
                  </td>
                  <td>
                    <span className={ann.statusClass}>{ann.status}</span>
                  </td>
                  <td>
                    <button
                      className="ann-view-btn"
                      onClick={() => onViewDetail?.(ann)}
                    >
                      <FaEye />
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && filtered.length > 0 && (
        <div className="ir-pagination">
          <span className="ir-pagination-info">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}-
            {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} announcement{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="ir-page-btns">
            <button
              className="page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              <FaChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn${p === page ? ' active' : ''}`}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </button>
            ))}
            <button
              className="page-btn"
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
