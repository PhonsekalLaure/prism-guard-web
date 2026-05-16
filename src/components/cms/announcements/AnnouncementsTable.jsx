import { useState, useMemo } from 'react';
import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
} from 'react-icons/fa';

const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ANN-2026-025',
    subject: 'Emergency Protocol Update — All Sites',
    message:
      'Effective immediately, all guards must follow the revised emergency evacuation procedures. A mandatory briefing will be conducted at each site. Please acknowledge receipt of this announcement to your site supervisor.',
    priority: 'Urgent',
    priorityClass: 'ann-badge ann-badge--urgent',
    audience: 'All',
    audienceClass: 'ann-aud ann-aud--all',
    date: 'May 14, 2026',
    status: 'Active',
    statusClass: 'ann-status ann-status--active',
    publishedBy: 'Admin (President)',
  },
  {
    id: 'ANN-2026-024',
    subject: 'Scheduled System Maintenance — May 18, 2026',
    message:
      'The client portal will undergo scheduled maintenance on May 18, 2026 from 12:00 AM to 4:00 AM. During this window, the system may be temporarily unavailable. We apologize for any inconvenience.',
    priority: 'Important',
    priorityClass: 'ann-badge ann-badge--important',
    audience: 'Clients Only',
    audienceClass: 'ann-aud ann-aud--clients',
    date: 'May 12, 2026',
    status: 'Active',
    statusClass: 'ann-status ann-status--active',
    publishedBy: 'System Administrator',
  },
  {
    id: 'ANN-2026-023',
    subject: 'New Guard Deployment — Makati District',
    message:
      'Additional security personnel have been deployed across all Makati District client sites effective May 10, 2026. Deployment schedules have been updated in the Guard Roster section.',
    priority: 'Normal',
    priorityClass: 'ann-badge ann-badge--normal',
    audience: 'Clients Only',
    audienceClass: 'ann-aud ann-aud--clients',
    date: 'May 10, 2026',
    status: 'Active',
    statusClass: 'ann-status ann-status--active',
    publishedBy: 'Operations Manager',
  },
  {
    id: 'ANN-2026-022',
    subject: 'Holiday Duty Schedule — Independence Day',
    message:
      'All guard assignments have been adjusted for the Independence Day holiday on June 12, 2026. The modified duty roster is now available. Guards on holiday duty will receive the applicable holiday pay premium.',
    priority: 'Important',
    priorityClass: 'ann-badge ann-badge--important',
    audience: 'All',
    audienceClass: 'ann-aud ann-aud--all',
    date: 'May 8, 2026',
    status: 'Active',
    statusClass: 'ann-status ann-status--active',
    publishedBy: 'HR Department',
  },
  {
    id: 'ANN-2026-021',
    subject: 'Security Awareness Training — May 2026',
    message:
      'Annual security awareness training is scheduled for all on-duty guards. Training sessions will be conducted at each site in rotating batches. Check your schedule for your assigned training slot.',
    priority: 'Normal',
    priorityClass: 'ann-badge ann-badge--normal',
    audience: 'Guards Only',
    audienceClass: 'ann-aud ann-aud--guards',
    date: 'May 5, 2026',
    status: 'Active',
    statusClass: 'ann-status ann-status--active',
    publishedBy: 'Training Department',
  },
  {
    id: 'ANN-2026-020',
    subject: 'Uniform Policy Reminder',
    message:
      'All guards are reminded to adhere strictly to the prescribed uniform policy. Proper attire including complete uniform, ID lace, and service sidearm (if applicable) is mandatory during duty hours.',
    priority: 'Normal',
    priorityClass: 'ann-badge ann-badge--normal',
    audience: 'Guards Only',
    audienceClass: 'ann-aud ann-aud--guards',
    date: 'Apr 30, 2026',
    status: 'Archived',
    statusClass: 'ann-status ann-status--archived',
    publishedBy: 'Operations Manager',
  },
  {
    id: 'ANN-2026-019',
    subject: 'Q2 Service Review Survey',
    message:
      'We value your feedback! Please take a moment to complete the Q2 Service Review survey through the Service Reviews section of this portal. Your responses help us continuously improve our services.',
    priority: 'Normal',
    priorityClass: 'ann-badge ann-badge--normal',
    audience: 'Clients Only',
    audienceClass: 'ann-aud ann-aud--clients',
    date: 'Apr 25, 2026',
    status: 'Archived',
    statusClass: 'ann-status ann-status--archived',
    publishedBy: 'Admin (President)',
  },
];

const ITEMS_PER_PAGE = 5;

const PRIORITY_ORDER = { Urgent: 0, Important: 1, Normal: 2 };

function PriorityIcon({ priority }) {
  if (priority === 'Urgent')    return <FaExclamationCircle className="ann-priority-icon ann-priority-icon--urgent" />;
  if (priority === 'Important') return <FaExclamationTriangle className="ann-priority-icon ann-priority-icon--important" />;
  return <FaInfoCircle className="ann-priority-icon ann-priority-icon--normal" />;
}

export default function AnnouncementsTable({ filters, onViewDetail }) {
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = [...MOCK_ANNOUNCEMENTS];

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.subject.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
      );
    }

    if (filters?.priority && filters.priority !== 'all') {
      const p = filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1);
      list = list.filter((a) => a.priority === p);
    }

    if (filters?.date) {
      list = list.filter((a) => {
        const rowDate = new Date(a.date);
        const filterDate = new Date(filters.date);
        return (
          rowDate.getFullYear() === filterDate.getFullYear() &&
          rowDate.getMonth() === filterDate.getMonth() &&
          rowDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (filters?.sort === 'oldest') {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (filters?.sort === 'priority') {
      list.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));
    } else {
      // newest first (default)
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    return list;
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

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
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="ann-table-empty">
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
                      <span>{ann.subject}</span>
                    </div>
                  </td>
                  <td>
                    <span className={ann.priorityClass}>{ann.priority}</span>
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

      {filtered.length > 0 && (
        <div className="ir-pagination">
          <span className="ir-pagination-info">
            Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–
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
