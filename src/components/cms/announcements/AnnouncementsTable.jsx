import {
  FaBullhorn,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEye,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { TableSkeletonRows } from '@components/ui/Skeleton';

const ITEMS_PER_PAGE = 10;

function PriorityIcon({ priority }) {
  if (priority === 'Urgent') return <FaExclamationCircle className="ann-priority-icon ann-priority-icon--urgent" />;
  if (priority === 'Important') return <FaExclamationTriangle className="ann-priority-icon ann-priority-icon--important" />;
  return <FaInfoCircle className="ann-priority-icon ann-priority-icon--normal" />;
}

function buildPreview(message) {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
}

const getSkeletonCellStyle = (column) => {
  if (column === 0) return { width: '55%' };
  if (column === 1) return { width: '68%' };
  if (column === 2) return { width: '82%', height: 28 };
  if (column === 3 || column === 4) return { width: 80, height: 22, borderRadius: 20 };
  return { width: 54, height: 28 };
};

export default function AnnouncementsTable({
  announcements = [],
  metadata,
  loading = false,
  onPageChange,
  onViewDetail,
  onResetFilters,
}) {
  const page = metadata?.page || 1;
  const total = metadata?.total || 0;
  const limit = metadata?.limit || ITEMS_PER_PAGE;
  const totalPages = metadata?.totalPages || 0;
  const start = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

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
              ? <TableSkeletonRows rows={5} columns={6} getCellStyle={getSkeletonCellStyle} />
              : announcements.length === 0
              ? (
                <tr>
                  <td colSpan={6} className="ann-table-empty">
                    <EmptyState
                      icon={FaBullhorn}
                      title="No announcements found"
                      description="We couldn't find any announcements matching your current search or filter criteria. Try adjusting your settings to view more announcements."
                      actionLabel="Reset All Filters"
                      onAction={onResetFilters}
                      compact
                    />
                  </td>
                </tr>
              ) : announcements.map((ann) => (
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
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={total}
          label={`announcement${total !== 1 ? 's' : ''}`}
        />
      )}
    </div>
  );
}
