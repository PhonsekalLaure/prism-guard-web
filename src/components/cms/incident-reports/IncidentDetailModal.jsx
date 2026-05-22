import { FaExclamationTriangle, FaFileAlt, FaTimes } from 'react-icons/fa';
import authService from '@services/authService';
import { formatIncidentDate, titleCase } from './incidentReportFormatters';

export default function IncidentDetailModal({ incident, onClose, onRequestReport }) {
  if (!incident) return null;

  const requestLocked = ['pending', 'approved', 'sent'].includes(incident.requestStatus);

  return (
    <div className="ir-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ir-detail-modal">
        <div className="ir-detail-modal__header">
          <div>
            <h3>{incident.title}</h3>
            <p>{incident.reportId}</p>
          </div>
          <button className="ir-detail-modal__close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ir-detail-modal__body">
          <div className="ir-detail-grid">
            <div>
              <span>Date</span>
              <strong>{formatIncidentDate(incident.occurredAt || incident.createdAt, {
                hour: 'numeric',
                minute: '2-digit',
              })}</strong>
            </div>
            <div>
              <span>Site</span>
              <strong>{incident.siteName}</strong>
            </div>
            <div>
              <span>Category</span>
              <strong>{titleCase(incident.category)}</strong>
            </div>
            <div>
              <span>Severity</span>
              <strong>{titleCase(incident.severity)}</strong>
            </div>
          </div>

          <div className="ir-detail-summary">
            <p className="ir-detail-label">
              <FaExclamationTriangle /> Reviewed Summary
            </p>
            <p>{incident.summary || 'No summary available.'}</p>
          </div>

          <div className="ir-modal-actions">
            <button
              className="ir-btn-confirm"
              disabled={requestLocked}
              onClick={() => onRequestReport?.(incident)}
            >
              {incident.requestStatus
                ? titleCase(incident.requestStatus)
                : 'Request Full Report'}
            </button>
            {incident.clientReportUrl && (
              <button
                className="ir-btn-confirm"
                onClick={() => authService.openFileUrl(incident.clientReportUrl)}
              >
                <FaFileAlt /> Open Full Report
              </button>
            )}
            <button className="ir-btn-cancel" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
