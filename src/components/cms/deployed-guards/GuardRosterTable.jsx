import { FaUsers, FaEye } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';

const statusConfig = {
  active: { label: 'Active', className: 'dg-status-badge dg-status-badge--active' },
  inactive: { label: 'Inactive', className: 'dg-status-badge dg-status-badge--inactive' },
  terminated: { label: 'Terminated', className: 'dg-status-badge dg-status-badge--terminated' },
  archived: { label: 'Archived', className: 'dg-status-badge dg-status-badge--archived' },
  unknown: { label: 'Unknown', className: 'dg-status-badge dg-status-badge--unknown' },
};

export default function GuardRosterTable({
  guards = [],
  loading = false,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  limit = 6,
  onPageChange,
  onViewGuard,
}) {
  const pageStart = totalCount === 0 ? 0 : (currentPage - 1) * limit + 1;
  const pageEnd = Math.min(currentPage * limit, totalCount);

  return (
    <div className="dg-table-panel">
      <div className="dg-table-header">
        <h3 className="dg-table-title">
          <FaUsers /> Guard Roster
        </h3>
      </div>

      <div className="dg-table-wrapper">
        <table className="dg-table">
          <thead>
            <tr>
              <th>Guard</th>
              <th>Employee ID</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
                  Loading guards...
                </td>
              </tr>
            ) : guards.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
                  No deployed guards found.
                </td>
              </tr>
            ) : (
              guards.map((guard) => {
                const badge = statusConfig[guard.status] || statusConfig.unknown;
                return (
                  <tr
                    key={guard.id}
                    className="dg-table-row"
                    onClick={() => onViewGuard?.(guard)}
                  >
                    <td>
                      <div className="dg-guard-cell">
                        {guard.avatar_url ? (
                          <img
                            src={guard.avatar_url}
                            alt={guard.name}
                            className="dg-guard-avatar-sm"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div className="dg-guard-avatar-sm">
                            {guard.initials}
                          </div>
                        )}
                        <div>
                          <p className="dg-guard-name">{guard.name}</p>
                          <p className="dg-guard-since">{guard.since}</p>
                        </div>
                      </div>
                    </td>
                    <td className="dg-td-mono">{guard.employee_id_number}</td>
                    <td className="dg-td-muted">{guard.shift}</td>
                    <td>
                      <span className={badge.className}>{badge.label}</span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button
                        className="dg-view-btn"
                        onClick={() => onViewGuard?.(guard)}
                      >
                        <FaEye /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalCount > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={pageStart - 1}
          endIndex={pageEnd}
          totalItems={totalCount}
          label={`guard${totalCount !== 1 ? 's' : ''}`}
          disabled={loading}
        />
      )}
    </div>
  );
}
