import { useState } from 'react';
import {
  FaExclamationTriangle, FaExclamationCircle, FaInfoCircle, FaCheckCircle,
  FaMapMarkerAlt, FaClock, FaPaperclip, FaArrowRight, FaChevronLeft,
  FaChevronRight, FaTimes, FaCheck, FaShare, FaPrint, FaRobot,
} from 'react-icons/fa';

const incidents = [
  {
    id: 1,
    priority: 'high',
    icon: FaExclamationTriangle,
    priorityLabel: 'HIGH PRIORITY',
    categoryLabel: 'THEFT ATTEMPT',
    categoryClass: 'cat-theft',
    title: 'Theft Attempt Intercepted',
    location: 'FEU Institute of Tech',
    area: 'Main Gate',
    statusBadge: 'NEW',
    statusClass: 'status-new',
    timeAgo: '12 mins ago',
    reportedBy: 'Juan Cruz',
    reporterRole: 'Security Officer I',
    reporterInitials: 'JC',
    reporterEmpId: 'PRISM-2024-001',
    incidentTime: 'Feb 09, 12:25 PM',
    incidentDate: 'February 09, 2026',
    incidentClock: '12:25 PM',
    statusText: 'Under Investigation',
    statusColor: '#dc2626',
    nlpSummary:
      '"Unidentified male suspect, approximately 30-35 years old, wearing black hoodie and blue jeans, attempted to bypass security checkpoint. Guard intercepted individual trying to access restricted area without proper authorization. Item recovered, suspect fled the scene. No injuries reported."',
    originalReport:
      '"May nakita po akong lalaking nakasuot ng itim na hoodie at asul na maong. Mukhang 30-35 years old. Sinubukan niyang pumasok sa gate nang walang ID. Hinarang ko siya at tinanong kung saan siya pupunta. Hindi niya masagot ng maayos kaya hinuli ko. Tumakbong paalis ang suspek pero nakuha ko yung bag niya. Walang nasaktan."',
    attachments: '2 Attachments • CCTV Footage',
    reportId: 'INC-2026-0089',
    borderColor: '#ef4444',
  },
  {
    id: 2,
    priority: 'medium',
    icon: FaExclamationCircle,
    priorityLabel: 'MEDIUM PRIORITY',
    categoryLabel: 'UNAUTHORIZED ACCESS',
    categoryClass: 'cat-unauth',
    title: 'Unauthorized Vehicle Entry',
    location: 'SM Mall of Asia',
    area: 'Parking Level 3',
    statusBadge: 'REVIEWING',
    statusClass: 'status-reviewing',
    timeAgo: '1 hour ago',
    reportedBy: 'Mario Dela Cruz',
    reporterRole: 'Security Guard',
    reporterInitials: 'MD',
    reporterEmpId: 'PRISM-2024-006',
    incidentTime: 'Feb 09, 11:15 AM',
    incidentDate: 'February 09, 2026',
    incidentClock: '11:15 AM',
    statusText: 'Monitoring',
    statusColor: '#d97706',
    nlpSummary:
      '"Driver attempted entry without presenting valid parking pass. Vehicle plate number ABC-1234 recorded. Individual was redirected to proper entrance and issued temporary pass after verification. Situation resolved without incident."',
    originalReport:
      '"May pumasok na sasakyan sa parking level 3 na walang parking pass. Kinuha ko yung plate number: ABC-1234. Pina-redirect ko sa tamang entrance at binigyan ng temporary pass pagkatapos i-verify. Wala naman nangyaring masama."',
    attachments: '1 Attachment',
    reportId: 'INC-2026-0088',
    borderColor: '#f59e0b',
  },
  {
    id: 3,
    priority: 'low',
    icon: FaInfoCircle,
    priorityLabel: 'LOW PRIORITY',
    categoryLabel: 'LOST & FOUND',
    categoryClass: 'cat-lost',
    title: 'Lost Item Reported - Student ID Card',
    location: 'FEU Institute of Tech',
    area: 'Lobby Area',
    statusBadge: 'LOGGED',
    statusClass: 'status-logged',
    timeAgo: '3 hours ago',
    reportedBy: 'Richielle Gutierrez',
    reporterRole: 'Security Guard',
    reporterInitials: 'RG',
    reporterEmpId: 'PRISM-2024-005',
    incidentTime: 'Feb 09, 09:30 AM',
    incidentDate: 'February 09, 2026',
    incidentClock: '09:30 AM',
    statusText: 'Routine',
    statusColor: '#4b5563',
    nlpSummary:
      '"Student ID card found near main entrance, secured at security office. Item logged in lost and found registry. Owner may claim with proper identification."',
    originalReport: null,
    attachments: 'Photo attached',
    reportId: 'INC-2026-0087',
    borderColor: '#6b7280',
  },
  {
    id: 4,
    priority: 'resolved',
    icon: FaCheckCircle,
    priorityLabel: 'RESOLVED',
    categoryLabel: 'MAINTENANCE',
    categoryClass: 'cat-maint',
    title: 'Gate Maintenance Completed',
    location: 'SM North Edsa',
    area: 'Gate 3',
    statusBadge: null,
    statusClass: '',
    timeAgo: 'Yesterday',
    reportedBy: 'System',
    reporterRole: '',
    reporterInitials: 'SY',
    reporterEmpId: '',
    incidentTime: 'Feb 08, 02:00 PM',
    incidentDate: 'February 08, 2026',
    incidentClock: '02:00 PM',
    statusText: 'Completed',
    statusColor: '#16a34a',
    nlpSummary:
      '"Electric gate repair scheduled for 14:00 completed successfully. Gate operational and tested. No issues detected."',
    originalReport: null,
    attachments: null,
    reportId: 'INC-2026-0086',
    borderColor: '#22c55e',
    opacity: 0.75,
  },
];

function IncidentModal({ incident, onClose }) {
  if (!incident) return null;
  const p = incident.priority;

  return (
    <div
      className="ir-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ir-modal">
        {/* Coloured header */}
        <div className={`ir-modal-header ${p}`}>
          <div>
            <h2>Incident Report Details</h2>
            <p>Report ID: {incident.reportId}</p>
          </div>
          <button className="ir-modal-close" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="ir-modal-body">
          {/* Badges */}
          <div className="ir-modal-badges">
            <span className={`ir-badge priority-${p}`}>{incident.priorityLabel}</span>
            <span className={`ir-badge ${incident.categoryClass}`}>{incident.categoryLabel}</span>
            {incident.statusBadge && (
              <span className={`ir-badge ${incident.statusClass}`}>{incident.statusBadge}</span>
            )}
          </div>

          {/* Location & Time */}
          <div className="ir-modal-grid">
            <div className="ir-modal-cell">
              <label>Location</label>
              <p>{incident.location}</p>
              <span>{incident.area}</span>
            </div>
            <div className="ir-modal-cell">
              <label>Date &amp; Time</label>
              <p>{incident.incidentDate}</p>
              <span>{incident.incidentClock}</span>
            </div>
          </div>

          {/* Reporter */}
          <div className="ir-modal-reporter">
            <p className="ir-modal-reporter-label">Reported By</p>
            <div className="ir-modal-reporter-row">
              <div className="ir-modal-reporter-avatar">{incident.reporterInitials}</div>
              <div className="ir-modal-reporter-info">
                <h4>{incident.reportedBy}</h4>
                <p>{incident.reporterRole}{incident.reporterEmpId ? ` • ${incident.reporterEmpId}` : ''}</p>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div>
            <p className="ir-modal-section-label">
              <FaRobot style={{ color: p === 'high' ? '#dc2626' : p === 'medium' ? '#d97706' : '#6b7280' }} />
              AI-Generated Summary
            </p>
            <div className={`ir-nlp-box ${p}`}>
              <p className={`ir-nlp-text ${p}`}>{incident.nlpSummary}</p>
            </div>
          </div>

          {/* Original report (if available) */}
          {incident.originalReport && (
            <div>
              <p className="ir-modal-section-label">Original Report (Tagalog)</p>
              <div className="ir-modal-narrative">{incident.originalReport}</div>
            </div>
          )}

          {/* Actions */}
          <div className="ir-modal-actions">
            {p !== 'resolved' && (
              <button className="ir-modal-btn resolve" onClick={onClose}>
                <FaCheck /> Mark as Resolved
              </button>
            )}
            <button className="ir-modal-btn share" onClick={onClose}>
              <FaShare /> Share with Client
            </button>
            <button className="ir-modal-btn print" onClick={onClose}>
              <FaPrint /> Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisIncidentsFeed() {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {/* Incident cards */}
      <div className="ir-feed">
        {incidents.map((inc) => {
          const Icon = inc.icon;
          const p = inc.priority;
          return (
            <div
              key={inc.id}
              className={`ir-card ${p}`}
              style={{ animationDelay: `${inc.id * 0.06}s`, opacity: inc.opacity || 1 }}
              onClick={() => setSelected(inc)}
            >
              {/* Header */}
              <div className="ir-card-header">
                <div className="ir-card-left">
                  <div className={`ir-icon-box ${p}`}>
                    <Icon />
                  </div>
                  <div>
                    <div className="ir-badges-row">
                      <span className={`ir-badge priority-${p}`}>{inc.priorityLabel}</span>
                    </div>
                    <p className={`ir-card-title ${p}`}>{inc.title}</p>
                    <p className="ir-card-location">
                      <FaMapMarkerAlt className={p} /> {inc.location}
                    </p>
                  </div>
                </div>

                <div className="ir-card-right">
                  {inc.statusBadge && (
                    <span className={`ir-badge ${inc.statusClass}`}>{inc.statusBadge}</span>
                  )}
                  <p><FaClock /> {inc.timeAgo}</p>
                </div>
              </div>

              {/* Details grid (hide for resolved summary cards) */}
              {p !== 'resolved' && (
                <div className="ir-card-details">
                  <div>
                    <p className="ir-detail-label">Reported By</p>
                    <p className="ir-detail-value">{inc.reportedBy}</p>
                  </div>
                  <div>
                    <p className="ir-detail-label">Time of Incident</p>
                    <p className="ir-detail-value">{inc.incidentTime}</p>
                  </div>
                  <div>
                    <p className="ir-detail-label">Location</p>
                    <p className="ir-detail-value">{inc.location}</p>
                  </div>
                </div>
              )}

              {/* NLP Summary */}
              <div className={`ir-nlp-box ${p}`}>
                {p !== 'resolved' && (
                  <p className={`ir-nlp-label ${p}`}>
                    <FaRobot /> NLP-ENHANCED SUMMARY
                  </p>
                )}
                <p className={`ir-nlp-text ${p}`}>{inc.nlpSummary}</p>
              </div>

              {/* Footer */}
              {(inc.attachments || p !== 'resolved') && (
                <div className="ir-card-footer">
                  <div className="ir-attachment">
                    {inc.attachments && <><FaPaperclip /> <span>{inc.attachments}</span></>}
                  </div>
                  <button
                    className="ir-view-btn"
                    onClick={(e) => { e.stopPropagation(); setSelected(inc); }}
                  >
                    View Full Report <FaArrowRight />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="ir-pagination">
        <p className="ir-pagination-text">Showing 1-4 of 46 incidents</p>
        <div className="ir-pagination-controls">
          <button className="ir-page-btn" disabled>
            <FaChevronLeft /> Previous
          </button>
          <button className="ir-page-btn active">1</button>
          <button className="ir-page-btn">2</button>
          <button className="ir-page-btn">3</button>
          <button className="ir-page-btn">
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <IncidentModal incident={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
