import { FaBullhorn, FaEye, FaShieldAlt, FaUsers } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { TableSkeletonRows } from '@components/ui/Skeleton';

const ITEMS_PER_PAGE = 10;

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function buildPreview(message) {
  const normalized = String(message || '').replace(/\s+/g, ' ').trim();
  if (normalized.length <= 120) return normalized;
  return `${normalized.slice(0, 117)}...`;
}

const getSkeletonCellStyle = (column) => {
  if (column === 0) return { width: '55%' };
  if (column === 1) return { width: '75%', height: 28 };
  if (column === 2) return { width: 80, height: 22, borderRadius: 20 };
  return { width: 54, height: 28 };
};

export default function ClientAnnouncementsTable({
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
  const start = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <div className="ann-table-panel client-ann-table-panel">
      {/* Header */}
      <div className="ann-table-header client-ann-table-header">
        <h3 className="ann-table-title client-ann-table-title">
          <FaShieldAlt />
          My Guard Announcements
        </h3>
        <span className="ann-table-count">
          {total} announcement{total !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="ann-table-wrapper">
        <table className="ann-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Recipients</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <TableSkeletonRows rows={4} columns={4} getCellStyle={getSkeletonCellStyle} />
              : announcements.length === 0
              ? (
                <tr>
                  <td colSpan={4} className="ann-table-empty">
                    <EmptyState
                      icon={FaBullhorn}
                      title="No announcements published yet"
                      description="Click '+ Create Announcement' above to broadcast a message to your deployed guards."
                      compact
                    />
                  </td>
                </tr>
              ) : announcements.map((ann) => (
                <tr key={ann.id} className="ann-table-row">
                  <td className="ann-td-muted">{formatDate(ann.published_at)}</td>
                  <td className="ann-td-subject">
                    <div className="ann-subject-wrap">
                      <FaBullhorn className="ann-priority-icon client-ann-icon" />
                      <div className="ann-subject-content">
                        <span className="ann-subject-title">{ann.title}</span>
                        <span className="ann-subject-preview">{buildPreview(ann.message)}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="client-ann-recipient-badge">
                      <FaUsers />
                      {ann.recipient_count ?? '—'} guard{ann.recipient_count !== 1 ? 's' : ''}
                    </span>
                  </td>
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
