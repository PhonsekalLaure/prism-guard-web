import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaFileAlt,
  FaList,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import { IncidentCardSkeleton, SkeletonList } from '@components/ui/Skeleton';
import authService from '@services/authService';
import { formatIncidentDate, titleCase } from './incidentReportFormatters';

const severityIcon = {
  high: FaExclamationTriangle,
  medium: FaExclamationCircle,
  low: FaInfoCircle,
};

function getSeverityClass(severity, status) {
  if (status === 'resolved') return 'resolved';
  return severity || 'low';
}

function getRequestBtnLabel(inc) {
  if (inc.requestStatus === 'rejected') return 'Request Again';
  if (inc.requestStatus) return titleCase(inc.requestStatus);
  return 'Request Full Report';
}

export default function IncidentReportsTable({
  incidents = [],
  loading = false,
  metadata = {},
  onPageChange,
  onViewIncident,
  onRequestReport,
  onResetFilters,
}) {
  const page = metadata.page || 1;
  const totalPages = metadata.totalPages || 1;
  const total = metadata.total || 0;
  const limit = metadata.limit || incidents.length || 1;
  const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = Math.min(start + incidents.length - 1, total);

  return (
    <div className="cir-feed-container">
      <div className="cir-feed-header">
        <h3><FaList /> Incident Records</h3>
        <span className="cir-badge cir-badge-status">{loading ? '...' : `${total} total`}</span>
      </div>

      <div className="cir-feed">
        {loading && <SkeletonList count={4}>{(index) => (
          <IncidentCardSkeleton key={index} detailColumns={4} delay={`${index * 0.07}s`} />
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
          const severity = getSeverityClass(inc.severity, inc.status);
          const Icon = severity === 'resolved'
            ? FaCheckCircle
            : (severityIcon[severity] || FaInfoCircle);
          const requestLocked = ['pending', 'approved', 'sent'].includes(inc.requestStatus);

          return (
            <div
              key={inc.id}
              className={`cir-card ${severity}`}
              style={{ animationDelay: `${index * 0.06}s` }}
              onClick={() => onViewIncident?.(inc)}
            >
              {/* Card Header */}
              <div className="cir-card-header">
                <div className="cir-card-left">
                  <div className={`cir-icon-box ${severity}`}>
                    <Icon />
                  </div>
                  <div>
                    <div className="cir-badges-row">
                      <span className={`cir-badge cir-badge-severity cir-badge-${severity}`}>
                        {titleCase(inc.severity)} Priority
                      </span>
                      {inc.requestStatus && (
                        <span className={`cir-badge cir-badge-request cir-badge-req-${inc.requestStatus}`}>
                          {titleCase(inc.requestStatus)}
                        </span>
                      )}
                    </div>
                    <p className={`cir-card-title cir-card-title-${severity}`}>
                      {inc.title || titleCase(inc.category)}
                    </p>
                    <p className="cir-card-location">
                      <FaMapMarkerAlt className={severity} /> {inc.siteName}
                    </p>
                  </div>
                </div>

                <div className="cir-card-right">
                  <span className={`cir-badge cir-badge-status-${inc.status}`}>
                    {titleCase(inc.status)}
                  </span>
                  <p className="cir-card-time">
                    <FaClock /> {formatIncidentDate(inc.occurredAt || inc.createdAt)}
                  </p>
                </div>
              </div>

              {/* Details Row */}
              <div className="cir-card-details">
                <div>
                  <p className="cir-detail-label">Report ID</p>
                  <p className="cir-detail-value cir-detail-mono">{inc.reportId}</p>
                </div>
                <div>
                  <p className="cir-detail-label">Category</p>
                  <p className="cir-detail-value">{titleCase(inc.category)}</p>
                </div>
                <div>
                  <p className="cir-detail-label">Severity</p>
                  <p className="cir-detail-value" style={{ color: severity === 'high' ? '#dc2626' : severity === 'medium' ? '#d97706' : severity === 'resolved' ? '#16a34a' : '#4b5563' }}>
                    {titleCase(inc.severity)}
                  </p>
                </div>
                <div>
                  <p className="cir-detail-label">Date</p>
                  <p className="cir-detail-value">{formatIncidentDate(inc.occurredAt || inc.createdAt)}</p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="cir-card-footer" onClick={(e) => e.stopPropagation()}>
                <button
                  className="cir-view-btn"
                  onClick={(e) => { e.stopPropagation(); onViewIncident?.(inc); }}
                >
                  View Details <FaArrowRight />
                </button>
                <div className="cir-footer-actions">
                  {inc.clientReportUrl && (
                    <button
                      className="cir-action-btn cir-action-btn-link"
                      onClick={(e) => { e.stopPropagation(); authService.openFileUrl(inc.clientReportUrl); }}
                    >
                      <FaExternalLinkAlt /> Open Report
                    </button>
                  )}
                  <button
                    className="cir-action-btn cir-action-btn-request"
                    disabled={requestLocked}
                    onClick={(e) => { e.stopPropagation(); onRequestReport?.(inc); }}
                  >
                    <FaFileAlt />
                    {getRequestBtnLabel(inc)}
                  </button>
                </div>
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
