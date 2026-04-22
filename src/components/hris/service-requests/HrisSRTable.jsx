import {
  FaListAlt, FaBuilding, FaUserPlus, FaExchangeAlt, FaClock,
  FaQuestionCircle, FaReply, FaChevronLeft, FaChevronRight,
} from 'react-icons/fa';

const requests = [
  {
    id: 'SR-2026-048',
    client: 'FEU Institute of Tech',
    clientInitials: 'FE',
    clientIconClass: 'blue',
    type: 'Additional Guard',
    typeIcon: FaUserPlus,
    typeIconClass: 'blue',
    site: 'Main Gate',
    urgency: 'emergency',
    urgencyLabel: 'Emergency',
    date: 'Feb 16, 2026',
    status: 'open',
    statusLabel: 'Open',
    action: 'respond',
    contractId: 'CTR-2024-001',
    description: 'Need one additional guard for the Main Gate due to increased foot traffic from upcoming university enrollment period. Preferably assigned starting Feb 18, 2026 for the day shift (6AM–6PM).',
    thread: [
      { from: 'client', initials: 'FE', color: '#2563eb', name: 'FEU Institute of Tech', role: 'Client', time: 'Feb 16 at 10:30 AM', text: 'Need one additional guard for the Main Gate due to increased foot traffic from upcoming university enrollment period.' },
      { from: 'admin',  initials: 'AD', color: '#093269', name: 'Admin', role: 'PRISM-GUARD', time: 'Feb 16 at 11:15 AM', text: 'We have received your request. We are currently checking available personnel. Will update within 24 hours.' },
    ],
    timeline: [
      { dotClass: 'blue',   icon: 'plane',  label: 'Request Submitted',      sub: 'February 16, 2026 at 10:30 AM' },
      { dotClass: 'yellow', icon: 'eye',    label: 'Under Review by Admin',   sub: 'February 16, 2026 at 11:00 AM' },
      { dotClass: 'gray',   icon: 'check',  label: 'Awaiting Resolution...', sub: null, faded: true },
    ],
    modalActions: ['resolve', 'progress', 'cancel'],
    avatarGradient: 'linear-gradient(135deg, #093269, #0a4080)',
  },
  {
    id: 'SR-2026-047',
    client: 'SM Mall of Asia',
    clientInitials: 'SM',
    clientIconClass: 'purple',
    type: 'Guard Replacement',
    typeIcon: FaExchangeAlt,
    typeIconClass: 'yellow',
    site: 'Parking Area',
    urgency: 'urgent',
    urgencyLabel: 'Urgent',
    date: 'Feb 15, 2026',
    status: 'in-progress',
    statusLabel: 'In Progress',
    action: 'respond',
    contractId: 'CTR-2024-005',
    description: 'Requesting immediate replacement for Guard Jose Santos (ID: PRISM-2024-032) who is on emergency leave. Parking area requires continuous coverage during mall operating hours (10AM–10PM).',
    thread: [
      { from: 'client', initials: 'SM', color: '#7c3aed', name: 'SM Mall of Asia', role: 'Client', time: 'Feb 15 at 9:00 AM', text: 'Guard Jose Santos called in for emergency leave. We need a replacement ASAP for the parking area.' },
      { from: 'admin',  initials: 'AD', color: '#093269', name: 'Admin', role: 'PRISM-GUARD', time: 'Feb 15 at 9:45 AM', text: 'Acknowledged. We are deploying Guard Mario Reyes as temporary replacement. He will arrive by 11:00 AM today.' },
    ],
    timeline: [],
    modalActions: ['resolve', 'cancel', 'back'],
    avatarGradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
  },
  {
    id: 'SR-2026-045',
    client: 'Ayala Corporation',
    clientInitials: 'AY',
    clientIconClass: 'green',
    type: 'Schedule Change',
    typeIcon: FaClock,
    typeIconClass: 'green',
    site: 'Lobby',
    urgency: 'normal',
    urgencyLabel: 'Normal',
    date: 'Feb 14, 2026',
    status: 'resolved',
    statusLabel: 'Resolved',
    action: 'view',
    contractId: 'CTR-2024-003',
    description: 'Requesting a schedule adjustment for the lobby guards from the current 8AM–8PM shift to 6AM–6PM to better align with office opening hours.',
    thread: [],
    timeline: [],
    modalActions: ['back'],
    avatarGradient: 'linear-gradient(135deg, #15803d, #166534)',
  },
  {
    id: 'SR-2026-042',
    client: 'BDO Unibank',
    clientInitials: 'BD',
    clientIconClass: 'orange',
    type: 'General Inquiry',
    typeIcon: FaQuestionCircle,
    typeIconClass: 'purple',
    site: 'All Sites',
    urgency: 'normal',
    urgencyLabel: 'Normal',
    date: 'Feb 12, 2026',
    status: 'resolved',
    statusLabel: 'Resolved',
    action: 'view',
    contractId: 'CTR-2024-007',
    description: 'General inquiry about guard rotation schedules across all BDO branch sites. Requesting updated deployment matrix for Q1 2026.',
    thread: [],
    timeline: [],
    modalActions: ['back'],
    avatarGradient: 'linear-gradient(135deg, #c2410c, #9a3412)',
  },
  {
    id: 'SR-2026-040',
    client: 'FEU Institute of Tech',
    clientInitials: 'FE',
    clientIconClass: 'blue',
    type: 'Additional Guard',
    typeIcon: FaUserPlus,
    typeIconClass: 'blue',
    site: 'Back Gate',
    urgency: 'urgent',
    urgencyLabel: 'Urgent',
    date: 'Feb 10, 2026',
    status: 'open',
    statusLabel: 'Open',
    action: 'respond',
    contractId: 'CTR-2024-001',
    description: 'Back Gate needs an additional guard post during the evening hours due to security concerns raised by campus security committee.',
    thread: [],
    timeline: [],
    modalActions: ['resolve', 'progress', 'cancel'],
    avatarGradient: 'linear-gradient(135deg, #093269, #0a4080)',
  },
];

function SRDetailModal({ request, onClose }) {
  if (!request) return null;
  return (
    <div className="sr-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sr-modal-content">
        <div className="sr-modal-header">
          <div>
            <h2>Service Request Details</h2>
            <p>{request.id} • {request.client}</p>
          </div>
          <button className="sr-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sr-modal-body">
          {/* Badge row */}
          <div className="sr-modal-badges">
            <span className={`sr-modal-badge ${request.status}`}>{request.statusLabel}</span>
            <span className={`sr-modal-badge ${request.urgency}`}>{request.urgencyLabel}</span>
            <span className="sr-modal-badge type">{request.type}</span>
          </div>

          {/* Client info */}
          <div className="sr-client-box">
            <p className="sr-client-box-label">Client Information</p>
            <div className="sr-client-box-inner">
              <div className="sr-client-box-avatar" style={{ background: request.avatarGradient }}>
                {request.clientInitials}
              </div>
              <div>
                <p className="sr-client-box-name">{request.client}</p>
                <p className="sr-client-box-sub">Contract: {request.contractId} • {request.site}</p>
              </div>
            </div>
          </div>

          {/* Details grid */}
          <div className="sr-detail-grid">
            <div className="sr-detail-cell">
              <p className="sr-detail-label">Site / Location</p>
              <p className="sr-detail-value">{request.site}</p>
            </div>
            <div className="sr-detail-cell">
              <p className="sr-detail-label">Date Submitted</p>
              <p className="sr-detail-value">{request.date}</p>
            </div>
          </div>

          {/* Description */}
          <div className="sr-description-box">
            <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Request Description</p>
            <p className="sr-description-text">{request.description}</p>
          </div>

          {/* Timeline */}
          {request.timeline.length > 0 && (
            <div>
              <p className="sr-timeline-title">📋 Request Timeline</p>
              <div className="sr-timeline">
                {request.timeline.map((t, i) => (
                  <div key={i} className={`sr-timeline-item${t.faded ? ' faded' : ''}`}>
                    <div className={`sr-timeline-dot ${t.dotClass}`}>
                      {t.dotClass === 'blue' ? '✈' : t.dotClass === 'yellow' ? '👁' : '✓'}
                    </div>
                    <div>
                      <p className="sr-timeline-label">{t.label}</p>
                      {t.sub && <p className="sr-timeline-sub">{t.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Thread */}
          {request.thread.length > 0 && (
            <div>
              <p className="sr-thread-title">💬 Communication Thread</p>
              <div className="sr-thread">
                {request.thread.map((msg, i) => (
                  <div key={i} className={`sr-thread-msg ${msg.from}`}>
                    <div className="sr-thread-msg-header">
                      <div className="sr-thread-msg-avatar" style={{ background: msg.color }}>
                        {msg.initials}
                      </div>
                      <div>
                        <p className="sr-thread-msg-name">
                          {msg.name} <span className="sr-thread-msg-role">({msg.role})</span>
                        </p>
                        <p className="sr-thread-msg-time">{msg.time}</p>
                      </div>
                    </div>
                    <p className="sr-thread-msg-text">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              <div className="sr-reply-box">
                <label className="sr-reply-label">
                  <FaReply className="sr-reply-icon" /> Send Reply
                </label>
                <textarea className="sr-reply-textarea" rows={3} placeholder="Type your response to the client..." />
                <div className="sr-reply-actions">
                  <button className="sr-attach-btn">📎 Attach</button>
                  <button className="sr-send-btn">✈ Send Reply</button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="sr-modal-actions">
            {request.modalActions.includes('resolve')   && <button className="sr-modal-btn green">✓ Mark Resolved</button>}
            {request.modalActions.includes('progress')  && <button className="sr-modal-btn yellow">⟳ Set In Progress</button>}
            {request.modalActions.includes('cancel')    && <button className="sr-modal-btn red">✕ Cancel Request</button>}
            {request.modalActions.includes('back')      && <button className="sr-modal-btn gray" onClick={onClose}>← Back</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisSRTable({ onOpenDetail }) {
  return (
    <div className="sr-table-card">
      <div className="sr-table-header">
        <p className="sr-table-title">
          <FaListAlt /> All Client Requests
        </p>
      </div>

      <div className="sr-table-wrap">
        <table className="sr-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Client</th>
              <th>Type</th>
              <th>Site</th>
              <th>Urgency</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => {
              const TypeIcon = r.typeIcon;
              return (
                <tr key={r.id} onClick={() => onOpenDetail(r)}>
                  <td><span className="sr-request-id">{r.id}</span></td>
                  <td>
                    <div className="sr-client-cell">
                      <div className={`sr-client-icon ${r.clientIconClass}`}>
                        <FaBuilding />
                      </div>
                      <span className="sr-client-name">{r.client}</span>
                    </div>
                  </td>
                  <td>
                    <div className="sr-type-cell">
                      <TypeIcon className={`sr-type-icon ${r.typeIconClass}`} />
                      {r.type}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{r.site}</td>
                  <td><span className={`sr-urgency-badge ${r.urgency}`}>{r.urgencyLabel}</span></td>
                  <td style={{ color: '#6b7280' }}>{r.date}</td>
                  <td><span className={`sr-status-badge ${r.status}`}>{r.statusLabel}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    {r.action === 'respond' ? (
                      <button className="sr-action-respond" onClick={() => onOpenDetail(r)}>
                        <FaReply /> Respond
                      </button>
                    ) : (
                      <button className="sr-action-view" onClick={() => onOpenDetail(r)}>View</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sr-table-footer">
        <p className="sr-showing-text">Showing 1–5 of 117 requests</p>
        <div className="sr-page-btns">
          <button className="sr-page-btn" disabled><FaChevronLeft /></button>
          <button className="sr-page-btn active">1</button>
          <button className="sr-page-btn">2</button>
          <button className="sr-page-btn">3</button>
          <button className="sr-page-btn"><FaChevronRight /></button>
        </div>
      </div>
    </div>
  );
}

export { SRDetailModal };
