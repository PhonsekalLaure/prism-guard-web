import { FaUsers, FaEye } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import EntityAvatar from '@components/ui/EntityAvatar';
import { TableSkeletonRows } from '@components/ui/Skeleton';

const statusConfig = {
  active: { label: 'Active', className: 'dg-status-badge dg-status-badge--active' },
  inactive: { label: 'Inactive', className: 'dg-status-badge dg-status-badge--inactive' },
  terminated: { label: 'Terminated', className: 'dg-status-badge dg-status-badge--terminated' },
  archived: { label: 'Archived', className: 'dg-status-badge dg-status-badge--archived' },
  unknown: { label: 'Unknown', className: 'dg-status-badge dg-status-badge--unknown' },
};

const getGuardSkeletonCellStyle = (column) => {
  if (column === 0) return { width: '82%', height: 32 };
  if (column === 3) return { width: 78, height: 22, borderRadius: 20 };
  if (column === 4) return { width: 64, height: 30, borderRadius: 6 };
  return { width: '60%' };
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
  onResetFilters,
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
              <TableSkeletonRows
                rows={6}
                columns={5}
                getCellStyle={getGuardSkeletonCellStyle}
              />
            ) : guards.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '1.5rem' }}>
                  <EmptyState
                    icon={FaUsers}
                    title="No deployed guards found"
                    description="We couldn't find any deployed guards matching your current search or filter criteria. Try adjusting your settings to view more guards."
                    actionLabel="Reset All Filters"
                    onAction={onResetFilters}
                    compact
                  />
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
                        <EntityAvatar
                          avatarUrl={guard.avatar_url}
                          initials={guard.initials}
                          className="dg-guard-avatar-sm"
                          alt={guard.name}
                        />
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
