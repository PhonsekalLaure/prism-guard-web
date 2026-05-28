import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaHandHoldingUsd,
  FaReceipt,
  FaTimesCircle,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import EntityAvatar from '@components/ui/EntityAvatar';
import { IncidentCardSkeleton, SkeletonList } from '@components/ui/Skeleton';

const tabs = [
  { label: 'All', value: 'all', countKey: 'total', icon: FaReceipt },
  { label: 'Pending', value: 'pending', countKey: 'pending', icon: FaClock },
  { label: 'Approved', value: 'approved', countKey: 'approved', icon: FaCheckCircle },
  { label: 'Released', value: 'released', countKey: 'released', icon: FaHandHoldingUsd },
  { label: 'Rejected', value: 'rejected', countKey: 'rejected', icon: FaTimesCircle },
  { label: 'Settled', value: 'settled', countKey: 'settled', icon: FaReceipt },
];

const STATUS_ICONS = {
  pending: FaClock,
  approved: FaCheckCircle,
  released: FaHandHoldingUsd,
  rejected: FaTimesCircle,
  settled: FaReceipt,
};

function getStatusIcon(status) {
  const Icon = STATUS_ICONS[status] || FaClock;
  return <Icon />;
}

export default function HrisCashAdvanceList({
  requests = [],
  metadata = {},
  stats = {},
  loading = false,
  statusFilter = 'all',
  onStatusChange,
  onPageChange,
  onResetFilters,
}) {
  const navigate = useNavigate();
  const currentPage = metadata.page || 1;
  const totalPages = metadata.totalPages || 0;
  const totalRequests = metadata.total || 0;
  const pageLimit = metadata.limit || 8;
  const start = totalRequests === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const end = Math.min(currentPage * pageLimit, totalRequests);
  const tabStats = {
    ...stats,
    total: ['pending', 'approved', 'released', 'rejected', 'settled']
      .reduce((sum, key) => sum + Number(stats?.[key] || 0), 0),
  };
  const openRequest = (id) => navigate(`/cash-advance/${id}`);

  if (loading && requests.length === 0) {
    return (
      <div className="ca-list-container">
        <div className="ca-tabs-bar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.value} className={`ca-tab-btn ${statusFilter === tab.value ? 'active' : ''}`} type="button" disabled>
                <Icon /> {tab.label} (...)
              </button>
            );
          })}
        </div>
        <div className="ca-feed-header">
          <h3><FaHandHoldingUsd /> Cash Advance Requests</h3>
        </div>
        <div className="ca-feed-body">
          <SkeletonList count={4}>{(index) => (
            <IncidentCardSkeleton key={index} detailColumns={4} showSummary delay={`${index * 0.07}s`} />
          )}</SkeletonList>
        </div>
      </div>
    );
  }

  return (
    <div className="ca-list-container">
      <div className="ca-tabs-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const count = tabStats[tab.countKey] || 0;
          return (
            <button
              key={tab.value}
              className={`ca-tab-btn ${statusFilter === tab.value ? 'active' : ''}`}
              onClick={() => onStatusChange?.(tab.value)}
              type="button"
            >
              <Icon /> {tab.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="ca-feed-header">
        <h3><FaHandHoldingUsd /> Cash Advance Requests</h3>
        {totalRequests > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {totalRequests} total
          </span>
        )}
      </div>

      <div className="ca-feed-body">
        {requests.length === 0 ? (
          <EmptyState
            title="No cash advance requests found"
            description="No cash advance requests match the current search or filters."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
            compact
          />
        ) : (
          requests.map((request) => (
            <div
              key={request.id}
              className="ca-card"
              style={{ borderLeftColor: request.borderColor, opacity: request.opacity || 1 }}
              onClick={() => openRequest(request.id)}
            >
              <div className="ca-card-header">
                <div className="ca-card-emp">
                  <EntityAvatar avatarUrl={request.avatarUrl} initials={request.initials} className="ca-avatar" />
                  <div>
                    <p className="ca-emp-name">
                      {request.name}
                      {request.reasonType !== 'misc' && (
                        <span className={`ca-reason-tag ${request.reasonType}`}>
                          {request.reasonType}
                        </span>
                      )}
                    </p>
                    <p className="ca-emp-meta">{request.empId} - {request.role}</p>
                    <p className="ca-emp-location">{request.location}</p>
                  </div>
                </div>

                <div className="ca-card-status">
                  <span className={`ca-badge ${request.status}`}>{request.statusLabel}</span>
                  <p>{getStatusIcon(request.status)} {request.statusMeta}</p>
                </div>
              </div>

              <div className="ca-card-info">
                <div>
                  <p className="ca-info-label">Amount Requested</p>
                  <p className="ca-info-value amount">{request.amountRequestedLabel}</p>
                </div>
                <div>
                  <p className="ca-info-label">Reason</p>
                  <p className="ca-info-value">{request.reason}</p>
                </div>
                <div>
                  <p className="ca-info-label">Deduction</p>
                  <p className="ca-info-value">{request.deductionPerPaycheckLabel}</p>
                </div>
                <div>
                  <p className="ca-info-label">Remaining Balance</p>
                  <p className="ca-info-value">{request.remainingBalanceLabel}</p>
                </div>
              </div>

              <div className="ca-card-footer">
                <div className="ca-attachment">
                  <FaReceipt /> <span>{request.requestId}</span>
                </div>
                <button
                  className="ca-review-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    openRequest(request.id);
                  }}
                  type="button"
                >
                  View Request <FaArrowRight style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {totalRequests > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={totalRequests}
          label="requests"
          disabled={loading}
        />
      )}

    </div>
  );
}
