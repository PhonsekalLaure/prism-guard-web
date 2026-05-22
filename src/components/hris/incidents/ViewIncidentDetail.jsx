import {
  FaCheck,
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaFilePdf,
  FaFileAlt,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane,
  FaRobot,
  FaUserShield,
  FaClipboardList,
  FaLock,
} from 'react-icons/fa';
import authService from '@services/authService';

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

function getInitials(name) {
  return String(name || 'Unknown')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

export default function ViewIncidentDetail({
  incident,
  loading = false,
  error = '',
  actionLoading = false,
  onReview,
  onResolve,
  onGenerateReport,
  onSendPresident,
  onClientRequestAction,
}) {
  if (loading) {
    return (
      <div className="ir-detail-page-container">
        {/* Header shimmer */}
        <div className="ir-detail-skeleton-header" />

        <div className="ir-modal-body">
          {/* Badge row */}
          <div className="ir-sk-badges">
            {[90, 70, 80].map((w, i) => (
              <div key={i} className="ir-skeleton" style={{ height: '1.35rem', width: `${w}px`, borderRadius: '999px' }} />
            ))}
          </div>

          {/* 3-col info grid */}
          <div className="ir-modal-grid-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="ir-modal-cell">
                <div className="ir-skeleton" style={{ height: '0.6rem', width: '55%', marginBottom: '0.45rem' }} />
                <div className="ir-skeleton" style={{ height: '1rem', width: '80%', marginBottom: '0.25rem' }} />
                <div className="ir-skeleton" style={{ height: '0.65rem', width: '65%' }} />
              </div>
            ))}
          </div>

          {/* AI section */}
          <div className="ir-sk-section">
            <div className="ir-skeleton" style={{ height: '0.7rem', width: '140px' }} />
            <div className="ir-skeleton" style={{ height: '1.3rem', width: '90px', borderRadius: '999px' }} />
            <div className="ir-skeleton" style={{ height: '70px', borderRadius: '8px', marginTop: '0.2rem' }} />
          </div>

          {/* Narrative section */}
          <div className="ir-sk-section">
            <div className="ir-skeleton" style={{ height: '0.7rem', width: '110px' }} />
            <div className="ir-skeleton" style={{ height: '90px', borderRadius: '8px' }} />
          </div>

          {/* Action bar skeleton */}
          <div style={{ display: 'flex', gap: '0.65rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            {[120, 100, 90].map((w, i) => (
              <div key={i} className="ir-skeleton" style={{ height: '36px', width: `${w}px`, borderRadius: '8px' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }


  if (error || !incident) {
    return (
      <div className="ir-detail-page-container">
        <div className="ir-detail-page-state error">
          {error || 'Incident report not found.'}
        </div>
      </div>
    );
  }

  const severity = incident.status === 'resolved' ? 'resolved' : (incident.severity || 'medium');
  const Icon = severity === 'resolved' ? FaCheckCircle : (severityIcon[severity] || FaInfoCircle);
  const canReview = !['approved', 'rejected'].includes(incident.reviewStatus) && incident.status !== 'resolved';
  const canResolve = incident.reviewStatus === 'approved' && incident.status !== 'resolved';
  const canUseReports = incident.reviewStatus === 'approved' || incident.status === 'resolved';
  const hasInternalReport = Boolean(incident.internalReportUrl);
  const clientRequests = incident.clientReportRequests || [];
  const aiStatus = incident.aiProcessingStatus || 'completed';
  const aiFailed = aiStatus === 'failed';
  const aiPending = aiStatus === 'pending';
  const summaryLabel = aiStatus === 'completed' ? 'AI-Generated Summary' : 'Processing Summary';

  const openInternalReport = async () => {
    await authService.openFileUrl(incident.internalReportUrl);
  };

  return (
    <div className="ir-detail-page-container">
      <div className={`ir-modal-header ${severity}`}>
        <div>
          <h2><Icon style={{ marginRight: '0.4rem', opacity: 0.9 }} /> Incident Report Details</h2>
          <p>Report ID: {incident.reportId}</p>
        </div>
      </div>

      <div className="ir-modal-body">
        <div className="ir-modal-badges">
          <span className={`ir-badge priority-${severity}`}>{titleCase(incident.severity)} Priority</span>
          <span className="ir-badge cat-unauth">{titleCase(incident.category)}</span>
          <span className="ir-badge status-reviewing">{titleCase(incident.reviewStatus)}</span>
        </div>

        <div className="ir-modal-grid-3">
          <div className="ir-modal-cell">
            <label><FaMapMarkerAlt />Location</label>
            <p>{incident.siteName}</p>
            <span>{incident.siteAddress || incident.clientName}</span>
          </div>
          <div className="ir-modal-cell">
            <label><FaClock />Incident Time</label>
            <p>{formatDateTime(incident.occurredAt || incident.createdAt)}</p>
            <span>Submitted {formatDateTime(incident.createdAt)}</span>
          </div>
          <div className="ir-modal-cell ir-modal-cell-reporter">
            <label><FaUserShield />Reported By</label>
            <div className="ir-reporter-mini">
              <div className="ir-reporter-mini-avatar">{getInitials(incident.reporterName)}</div>
              <div className="ir-reporter-mini-info">
                <p>{incident.reporterName}</p>
                <span>
                  {incident.reporterRole}
                  {incident.reporterEmployeeNumber ? ` · ${incident.reporterEmployeeNumber}` : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="ir-modal-section-label">
            <FaRobot />
            {summaryLabel}
          </p>
          <div className="ir-modal-badges">
            <span className="ir-badge status-reviewing">
              AI {titleCase(aiStatus)}
            </span>
            {aiFailed && incident.aiProcessingError && (
              <span className="ir-badge priority-high">Manual review required</span>
            )}
          </div>
          <div className={`ir-nlp-box ${severity}`} style={{ marginTop: '0.6rem' }}>
            <p className={`ir-nlp-text ${severity}`}>{incident.summary || 'No summary available.'}</p>
          </div>
          {aiFailed && (
            <p className="ir-report-meta">
              AI processing failed. Review the original report manually before approval.
            </p>
          )}
          {aiPending && (
            <p className="ir-report-meta">
              AI processing is still running. Approval and formal report generation are temporarily disabled.
            </p>
          )}
        </div>

        <div>
          <p className="ir-modal-section-label"><FaClipboardList /> Original Report</p>
          <div className="ir-modal-narrative">{incident.rawText || 'No original report available.'}</div>
        </div>

        {incident.reviewNotes && (
          <div>
            <p className="ir-modal-section-label"><FaFileAlt /> Review Notes</p>
            <div className="ir-modal-narrative">{incident.reviewNotes}</div>
          </div>
        )}

        {canUseReports && (
          <div>
            <p className="ir-modal-section-label"><FaFilePdf /> Internal / President Report</p>
            <div className="ir-report-panel">
              <div>
                <p className="ir-report-title">
                  {hasInternalReport ? 'Internal formal report generated' : 'No internal formal report generated yet'}
                </p>
                <p className="ir-report-meta">
                  {incident.internalReportGeneratedAt
                    ? `Generated ${formatDateTime(incident.internalReportGeneratedAt)}`
                    : 'Generate a stored PDF before sending it to the president.'}
                </p>
              </div>
              <div className="ir-client-request-actions">
                <button
                  className="ir-mini-btn send"
                  disabled={actionLoading || aiPending || (aiFailed && !incident.manualReviewApproved)}
                  onClick={() => onGenerateReport?.(incident)}
                >
                  <FaFilePdf /> Generate Internal PDF
                </button>
                {hasInternalReport && (
                  <button
                    className="ir-mini-btn link"
                    type="button"
                    onClick={openInternalReport}
                  >
                    Open Internal PDF
                  </button>
                )}
                <button
                  className="ir-mini-btn approve"
                  type="button"
                  disabled={actionLoading || !hasInternalReport || aiPending || (aiFailed && !incident.manualReviewApproved)}
                  onClick={() => onSendPresident?.(incident)}
                >
                  <FaPaperPlane /> Send to President
                </button>
              </div>
            </div>
          </div>
        )}

        {clientRequests.length > 0 && (
          <div>
            <p className="ir-modal-section-label"><FaLock /> Client Full Report Request</p>
            <div className="ir-client-request-list">
              {clientRequests.map((request) => (
                <div key={request.id} className="ir-client-request-card">
                  <div>
                    <p className="ir-report-title">{request.clientName}</p>
                    <p className="ir-report-meta">
                      Requested {formatDateTime(request.createdAt)}
                      {request.requestNotes ? ` - ${request.requestNotes}` : ''}
                    </p>
                    {request.responseNotes && (
                      <p className="ir-report-meta">Response: {request.responseNotes}</p>
                    )}
                    {request.clientReportGeneratedAt && (
                      <p className="ir-report-meta">
                        Client PDF generated {formatDateTime(request.clientReportGeneratedAt)}
                      </p>
                    )}
                  </div>

                  <div className="ir-client-request-actions">
                    <span className="ir-badge status-reviewing">{titleCase(request.status)}</span>
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="ir-mini-btn approve"
                          disabled={actionLoading}
                          onClick={() => onClientRequestAction?.(request, 'approved')}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="ir-mini-btn reject"
                          disabled={actionLoading}
                          onClick={() => onClientRequestAction?.(request, 'rejected')}
                        >
                          <Icon /> Reject
                        </button>
                      </>
                    )}
                    {request.status === 'approved' && (
                      <>
                        <button
                          className="ir-mini-btn send"
                          disabled={actionLoading || aiPending || (aiFailed && !incident.manualReviewApproved)}
                          onClick={() => onClientRequestAction?.(request, 'generate')}
                        >
                          <FaFilePdf /> Generate Client PDF
                        </button>
                        {request.clientReportUrl && (
                          <button
                            className="ir-mini-btn link"
                            type="button"
                            onClick={() => authService.openFileUrl(request.clientReportUrl)}
                          >
                            Open Client PDF
                          </button>
                        )}
                        <button
                          className="ir-mini-btn approve"
                          disabled={actionLoading || !request.clientReportUrl || aiPending || (aiFailed && !incident.manualReviewApproved)}
                          onClick={() => onClientRequestAction?.(request, 'sent')}
                        >
                          <FaPaperPlane /> Publish to CMS
                        </button>
                      </>
                    )}
                    {request.status === 'sent' && request.clientReportUrl && (
                      <button
                        className="ir-mini-btn link"
                        type="button"
                        onClick={() => authService.openFileUrl(request.clientReportUrl)}
                      >
                        Open Client PDF
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(canReview || canResolve) && (
          <div className="ir-modal-actions">
            {canReview && (
              <>
                <button
                  className="ir-modal-btn resolve"
                  disabled={actionLoading || aiPending}
                  onClick={() => onReview?.(incident, 'approved')}
                >
                  <FaCheck /> {aiFailed ? 'Approve Manually' : 'Approve'}
                </button>
                <button
                  className="ir-modal-btn print"
                  disabled={actionLoading}
                  onClick={() => onReview?.(incident, 'rejected')}
                >
                  <Icon /> Reject
                </button>
              </>
            )}
            {canResolve && (
              <button
                className="ir-modal-btn share"
                disabled={actionLoading}
                onClick={() => onResolve?.(incident)}
              >
                <FaCheckCircle /> Mark Resolved
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
