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

function SkeletonCard({ delay }) {
  return (
    <div className="ir-card-skeleton" style={{ animationDelay: delay }}>
      <div className="ir-sk-header">
        <div className="ir-sk-left">
          <div className="ir-skeleton ir-sk-icon" />
          <div className="ir-sk-lines">
            <div className="ir-skeleton" style={{ height: '0.65rem', width: '38%', borderRadius: '999px' }} />
            <div className="ir-skeleton" style={{ height: '1rem', width: '65%', marginTop: '0.1rem' }} />
            <div className="ir-skeleton" style={{ height: '0.68rem', width: '42%', marginTop: '0.15rem' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-end' }}>
          <div className="ir-skeleton" style={{ height: '1.3rem', width: '80px', borderRadius: '999px' }} />
          <div className="ir-skeleton" style={{ height: '0.65rem', width: '110px' }} />
        </div>
      </div>

      <div className="ir-sk-details">
        {[55, 45, 60].map((w, i) => (
          <div key={i} className="ir-sk-detail-col">
            <div className="ir-skeleton" style={{ height: '0.6rem', width: `${w}%` }} />
            <div className="ir-skeleton" style={{ height: '0.85rem', width: '80%' }} />
          </div>
        ))}
      </div>

      <div className="ir-sk-nlp">
        <div className="ir-skeleton" style={{ height: '0.65rem', width: '30%' }} />
        <div className="ir-skeleton" style={{ height: '0.75rem', width: '90%' }} />
        <div className="ir-skeleton" style={{ height: '0.75rem', width: '75%' }} />
      </div>

      <div className="ir-sk-footer">
        <div className="ir-skeleton" style={{ height: '0.7rem', width: '100px' }} />
        <div className="ir-skeleton" style={{ height: '0.7rem', width: '110px' }} />
      </div>
    </div>
  );
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
        {loading && [0, 1, 2, 3].map((i) => (
          <SkeletonCard key={i} delay={`${i * 0.07}s`} />
        ))}

        {!loading && incidents.length === 0 && (
          <div className="ir-feed-empty">No incident reports found.</div>
        )}

        {!loading && incidents.map((inc, index) => {
          const severity = inc.status === 'resolved' ? 'resolved' : (inc.severity || 'medium');
          const Icon = severity === 'resolved' ? FaCheckCircle : (severityIcon[severity] || FaInfoCircle);
          const activeClientRequest = (inc.clientReportRequests || []).find((r) =>
            ['pending', 'approved'].includes(r.status)
          );
          const aiStatus = inc.aiProcessingStatus || 'completed';
          const summaryLabel = aiStatus === 'completed' ? 'AI-Generated Summary' : `AI ${titleCase(aiStatus)}`;

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
