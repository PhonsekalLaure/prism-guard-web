import { useNavigate } from 'react-router-dom';
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaRobot,
  FaList,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { IncidentCardSkeleton, SkeletonList } from '@components/ui/Skeleton';

const severityIcon = {
  high: FaExclamationTriangle,
  medium: FaExclamationCircle,
  low: FaInfoCircle,
};

function titleCase(value) {
  return String(value || '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDateTime(value) {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getIncidentStatusMeta(incident = {}) {
  const value = incident.status === 'resolved' ? 'resolved' : (incident.reviewStatus || incident.status || 'pending');
  const className = {
    pending: 'status-new',
    in_review: 'status-reviewing',
    approved: 'status-approved',
    rejected: 'status-rejected',
    resolved: 'status-resolved',
  }[value] || 'status-logged';

  return {
    label: value === 'resolved' ? 'Resolved' : titleCase(value),
    className,
  };
}

function getRequestStatusClass(status) {
  return {
    pending: 'status-new',
    approved: 'status-approved',
    rejected: 'status-rejected',
    sent: 'status-resolved',
  }[status] || 'status-logged';
}

export default function HrisIncidentsFeed({
  incidents = [],
  loading = false,
  metadata = {},
  onPageChange,
  onResetFilters,
}) {
  const navigate = useNavigate();
  const page = metadata.page || 1;
  const totalPages = metadata.totalPages || 1;
  const total = metadata.total || 0;
  const limit = metadata.limit || incidents.length || 1;
  const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = Math.min(start + incidents.length - 1, total);

  return (
    <div className="ir-feed-container">
      <div className="ir-feed-header">
        <h3><FaList /> Incident Reports</h3>
        <span className="ir-badge status-reviewing">{loading ? '...' : `${total} total`}</span>
      </div>

      <div className="ir-feed">
        {loading && <SkeletonList count={4}>{(index) => (
          <IncidentCardSkeleton key={index} detailColumns={3} showSummary delay={`${index * 0.07}s`} />
        )}</SkeletonList>}

        {!loading && incidents.length === 0 && (
          <EmptyState
            title="No incident reports found"
            description="We couldn't find any incident reports matching your current search or filter criteria. Try adjusting your settings to view more incidents."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
            compact
          />
        )}

        {!loading && incidents.map((inc, index) => {
          const severity = inc.status === 'resolved' ? 'resolved' : (inc.severity || 'medium');
          const Icon = severity === 'resolved' ? FaCheckCircle : (severityIcon[severity] || FaInfoCircle);
          const activeClientRequest = (inc.clientReportRequests || []).find((r) =>
            ['pending', 'approved'].includes(r.status)
          );
          const aiStatus = inc.aiProcessingStatus || 'completed';
          const summaryLabel = aiStatus === 'completed' ? 'AI-Generated Summary' : `AI ${titleCase(aiStatus)}`;
          const statusMeta = getIncidentStatusMeta(inc);

          return (
            <div
              key={inc.id}
              className={`ir-card ${severity}`}
              style={{ animationDelay: `${index * 0.06}s` }}
              onClick={() => navigate(`/incidents/${inc.id}`)}
            >
              <div className="ir-card-header">
                <div className="ir-card-left">
                  <div className={`ir-icon-box ${severity}`}>
                    <Icon />
                  </div>
                  <div>
                    <div className="ir-badges-row">
                      <span className={`ir-badge priority-${severity}`}>
                        {titleCase(inc.severity)} Priority
                      </span>
                      {activeClientRequest && (
                        <span className={`ir-badge ${getRequestStatusClass(activeClientRequest.status)}`}>
                          Full Report {titleCase(activeClientRequest.status)}
                        </span>
                      )}
                      {aiStatus !== 'completed' && (
                        <span className="ir-badge status-reviewing">
                          AI {titleCase(aiStatus)}
                        </span>
                      )}
                    </div>
                    <p className={`ir-card-title ${severity}`}>{inc.title}</p>
                    <p className="ir-card-location">
                      <FaMapMarkerAlt className={severity} /> {inc.siteName}
                    </p>
                  </div>
                </div>

                <div className="ir-card-right">
                  <span className={`ir-badge ${statusMeta.className}`}>{statusMeta.label}</span>
                  <p><FaClock /> {formatDateTime(inc.occurredAt || inc.createdAt)}</p>
                </div>
              </div>

              <div className="ir-card-details">
                <div>
                  <p className="ir-detail-label">Reported By</p>
                  <p className="ir-detail-value">{inc.reporterName}</p>
                </div>
                <div>
                  <p className="ir-detail-label">Client</p>
                  <p className="ir-detail-value">{inc.clientName}</p>
                </div>
                <div>
                  <p className="ir-detail-label">Category</p>
                  <p className="ir-detail-value">{titleCase(inc.category)}</p>
                </div>
              </div>

              <div className={`ir-nlp-box ${severity}`}>
                <p className={`ir-nlp-label ${severity}`}>
                  <FaRobot /> {summaryLabel}
                </p>
                <p className={`ir-nlp-text ${severity}`}>{inc.summary || 'No summary available.'}</p>
              </div>

              <div className="ir-card-footer">
                <div className="ir-attachment">
                  {inc.reportId}
                </div>
                <button
                  className="ir-view-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${inc.id}`); }}
                >
                  Review Incident <FaArrowRight />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={total}
          label="incidents"
          disabled={loading}
        />
      )}
    </div>
  );
}
