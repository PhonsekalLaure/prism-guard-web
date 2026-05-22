import { FaExclamationTriangle, FaFileAlt, FaTimes, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import authService from '@services/authService';
import { formatIncidentDate, titleCase } from './incidentReportFormatters';

function getSeverity(inc) {
  if (inc.status === 'resolved') return 'resolved';
  return inc.severity || 'low';
}

export default function IncidentDetailModal({ incident, onClose, onRequestReport }) {
  if (!incident) return null;

  const severity = getSeverity(incident);
  const requestLocked = ['pending', 'approved', 'sent'].includes(incident.requestStatus);

  return (
    <div className="cir-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cir-detail-modal">
        {/* Header */}
        <div className={`cir-detail-modal__header cir-header-${severity}`}>
          <div>
            <div className="cir-modal-badges">
              <span className={`cir-badge cir-badge-severity cir-badge-${severity}`}>
                {titleCase(incident.severity)} Priority
              </span>
              <span className={`cir-badge cir-badge-status-${incident.status}`}>
                {titleCase(incident.status)}
              </span>
            </div>
            <h3>{incident.title || titleCase(incident.category)}</h3>
            <p className="cir-modal-report-id">{incident.reportId}</p>
          </div>
          <button className="cir-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="cir-modal-body">
          {/* Info grid */}
          <div className="cir-modal-grid">
            <div className="cir-modal-cell">
              <label><FaClock /> Date</label>
              <p>{formatIncidentDate(incident.occurredAt || incident.createdAt, {
                hour: 'numeric',
                minute: '2-digit',
              })}</p>
            </div>
            <div className="cir-modal-cell">
              <label><FaMapMarkerAlt /> Site</label>
              <p>{incident.siteName}</p>
            </div>
            <div className="cir-modal-cell">
              <label>Category</label>
              <p>{titleCase(incident.category)}</p>
            </div>
            <div className="cir-modal-cell">
              <label>Severity</label>
              <p>{titleCase(incident.severity)}</p>
            </div>
          </div>

          {/* Summary */}
          <div className={`cir-nlp-box cir-nlp-${severity}`}>
            <p className={`cir-nlp-label cir-nlp-label-${severity}`}>
              <FaExclamationTriangle /> Reviewed Summary
            </p>
            <p className={`cir-nlp-text cir-nlp-text-${severity}`}>
              {incident.summary || 'No summary available.'}
            </p>
          </div>

          {/* Actions */}
          <div className="cir-modal-actions">
            {incident.clientReportUrl && (
              <button
                className="cir-modal-btn cir-modal-btn-link"
                onClick={() => authService.openFileUrl(incident.clientReportUrl)}
              >
                <FaFileAlt /> Open Full Report
              </button>
            )}
            <button
              className="cir-modal-btn cir-modal-btn-confirm"
              disabled={requestLocked}
              onClick={() => onRequestReport?.(incident)}
            >
              {incident.requestStatus
                ? titleCase(incident.requestStatus)
                : 'Request Full Report'}
            </button>
            <button className="cir-modal-btn cir-modal-btn-cancel" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
