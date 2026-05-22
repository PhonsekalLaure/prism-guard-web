import { useNavigate } from 'react-router-dom';
import {
  FaExclamationTriangle,
  FaExclamationCircle,
  FaInfoCircle,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaRobot,
} from 'react-icons/fa';

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

export default function HrisIncidentsFeed({
  incidents = [],
  loading = false,
  metadata = {},
  onPageChange,
}) {
  const navigate = useNavigate();
  const page = metadata.page || 1;
  const totalPages = metadata.totalPages || 1;
  const total = metadata.total || 0;

  return (
    <div>
      <div className="ir-feed">
        {loading && <div className="ir-card low">Loading incident reports...</div>}

        {!loading && incidents.length === 0 && (
          <div className="ir-card low">No incident reports found.</div>
        )}

        {!loading && incidents.map((inc, index) => {
          const severity = inc.status === 'resolved' ? 'resolved' : (inc.severity || 'medium');
          const Icon = severity === 'resolved' ? FaCheckCircle : (severityIcon[severity] || FaInfoCircle);
          const activeClientRequest = (inc.clientReportRequests || []).find((request) =>
            ['pending', 'approved'].includes(request.status)
          );
          const aiStatus = inc.aiProcessingStatus || 'completed';
          const summaryLabel = aiStatus === 'completed' ? 'AI-GENERATED SUMMARY' : `AI ${titleCase(aiStatus)}`;

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
                        <span className="ir-badge status-reviewing">
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
                  <span className="ir-badge status-reviewing">{titleCase(inc.reviewStatus)}</span>
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
                  <span>{inc.reportId}</span>
                </div>
                <button
                  className="ir-view-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/incidents/${inc.id}`); }}
                >
                  View Full Report <FaArrowRight />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ir-pagination">
        <p className="ir-pagination-text">
          Showing {incidents.length} of {total} incidents
        </p>
        <div className="ir-pagination-controls">
          <button
            className="ir-page-btn"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            <FaChevronLeft /> Previous
          </button>
          <button className="ir-page-btn active">{page}</button>
          <button
            className="ir-page-btn"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            Next <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
