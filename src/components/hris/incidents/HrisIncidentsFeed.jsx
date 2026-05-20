import { useState } from 'react';
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
  FaTimes,
  FaCheck,
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

function getInitials(name) {
  return String(name || 'Unknown')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';
}

function IncidentModal({ incident, onClose, onReview, actionLoading }) {
  if (!incident) return null;
  const severity = incident.status === 'resolved' ? 'resolved' : (incident.severity || 'medium');
  const Icon = severity === 'resolved' ? FaCheckCircle : (severityIcon[severity] || FaInfoCircle);

  return (
    <div className="ir-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ir-modal">
        <div className={`ir-modal-header ${severity}`}>
          <div>
            <h2>Incident Report Details</h2>
            <p>Report ID: {incident.reportId}</p>
          </div>
          <button className="ir-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="ir-modal-body">
          <div className="ir-modal-badges">
            <span className={`ir-badge priority-${severity}`}>{titleCase(incident.severity)} Priority</span>
            <span className="ir-badge cat-unauth">{titleCase(incident.category)}</span>
            <span className="ir-badge status-reviewing">{titleCase(incident.reviewStatus)}</span>
          </div>

          <div className="ir-modal-grid">
            <div className="ir-modal-cell">
              <label>Location</label>
              <p>{incident.siteName}</p>
              <span>{incident.siteAddress || incident.clientName}</span>
            </div>
            <div className="ir-modal-cell">
              <label>Date &amp; Time</label>
              <p>{formatDateTime(incident.createdAt)}</p>
              <span>{titleCase(incident.status)}</span>
            </div>
          </div>

          <div className="ir-modal-reporter">
            <p className="ir-modal-reporter-label">Reported By</p>
            <div className="ir-modal-reporter-row">
              <div className="ir-modal-reporter-avatar">{getInitials(incident.reporterName)}</div>
              <div className="ir-modal-reporter-info">
                <h4>{incident.reporterName}</h4>
                <p>
                  {incident.reporterRole}
                  {incident.reporterEmployeeNumber ? ` - ${incident.reporterEmployeeNumber}` : ''}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="ir-modal-section-label">
              <FaRobot />
              AI-Generated Summary
            </p>
            <div className={`ir-nlp-box ${severity}`}>
              <p className={`ir-nlp-text ${severity}`}>{incident.summary || 'No summary available.'}</p>
            </div>
          </div>

          {incident.translatedText && (
            <div>
              <p className="ir-modal-section-label">Translated Report</p>
              <div className="ir-modal-narrative">{incident.translatedText}</div>
            </div>
          )}

          <div>
            <p className="ir-modal-section-label">Original Report</p>
            <div className="ir-modal-narrative">{incident.rawText || 'No original report available.'}</div>
          </div>

          {incident.reviewNotes && (
            <div>
              <p className="ir-modal-section-label">Review Notes</p>
              <div className="ir-modal-narrative">{incident.reviewNotes}</div>
            </div>
          )}

          <div className="ir-modal-actions">
            <button
              className="ir-modal-btn resolve"
              disabled={actionLoading}
              onClick={() => onReview(incident, 'approved')}
            >
              <FaCheck /> Approve
            </button>
            <button
              className="ir-modal-btn print"
              disabled={actionLoading}
              onClick={() => onReview(incident, 'rejected')}
            >
              <Icon /> Reject
            </button>
            {incident.status !== 'resolved' && (
              <button
                className="ir-modal-btn share"
                disabled={actionLoading}
                onClick={() => onReview(incident, 'resolved')}
              >
                <FaCheckCircle /> Mark Resolved
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisIncidentsFeed({
  incidents = [],
  loading = false,
  metadata = {},
  onPageChange,
  onReview,
  actionLoading = false,
}) {
  const [selected, setSelected] = useState(null);
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

          return (
            <div
              key={inc.id}
              className={`ir-card ${severity}`}
              style={{ animationDelay: `${index * 0.06}s` }}
              onClick={() => setSelected(inc)}
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
                    </div>
                    <p className={`ir-card-title ${severity}`}>{inc.title}</p>
                    <p className="ir-card-location">
                      <FaMapMarkerAlt className={severity} /> {inc.siteName}
                    </p>
                  </div>
                </div>

                <div className="ir-card-right">
                  <span className="ir-badge status-reviewing">{titleCase(inc.reviewStatus)}</span>
                  <p><FaClock /> {formatDateTime(inc.createdAt)}</p>
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
                  <FaRobot /> AI-GENERATED SUMMARY
                </p>
                <p className={`ir-nlp-text ${severity}`}>{inc.summary || 'No summary available.'}</p>
              </div>

              <div className="ir-card-footer">
                <div className="ir-attachment">
                  <span>{inc.reportId}</span>
                </div>
                <button
                  className="ir-view-btn"
                  onClick={(e) => { e.stopPropagation(); setSelected(inc); }}
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

      {selected && (
        <IncidentModal
          incident={selected}
          onClose={() => setSelected(null)}
          onReview={async (incident, status) => {
            await onReview?.(incident, status);
            setSelected(null);
          }}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}
