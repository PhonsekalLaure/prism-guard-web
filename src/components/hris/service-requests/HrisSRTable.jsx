import { useState } from 'react';
import {
  FaListAlt, FaBuilding, FaUserPlus, FaExchangeAlt,
  FaQuestionCircle, FaReply, FaChevronLeft, FaChevronRight,
  FaTimes, FaPaperPlane, FaEye, FaCheck, FaComments,
} from 'react-icons/fa';

function typeIcon(ticketType = '') {
  if (ticketType === 'additional_guard') return { Icon: FaUserPlus, className: 'blue' };
  if (ticketType === 'guard_replacement') return { Icon: FaExchangeAlt, className: 'yellow' };
  return { Icon: FaQuestionCircle, className: 'purple' };
}

function timelineIcon(dotClass) {
  if (dotClass === 'blue') return <FaPaperPlane />;
  if (dotClass === 'yellow') return <FaEye />;
  return <FaCheck />;
}

function SkeletonRows() {
  return Array.from({ length: 4 }).map((_, index) => (
    <tr key={index}>
      <td colSpan={8} style={{ padding: '1rem' }}>
        <div style={{ height: '14px', background: '#f0f0f0', borderRadius: '4px' }} />
      </td>
    </tr>
  ));
}

function ThreadMessage({ message }) {
  const roleClass = message.sender_role === 'admin' ? 'admin' : 'client';

  return (
    <div className={`sr-thread-msg ${roleClass}`}>
      <div className="sr-thread-msg-header">
        <div className="sr-thread-msg-avatar">{message.sender_initials}</div>
        <div>
          <p className="sr-thread-msg-name">
            {message.sender_name} <span className="sr-thread-msg-role">{message.sender_label}</span>
          </p>
          <p className="sr-thread-msg-time">{message.date}</p>
        </div>
      </div>
      <p className="sr-thread-msg-text">{message.message}</p>
    </div>
  );
}

function SRDetailModal({
  request,
  loading,
  actionLoading,
  onClose,
  onStatusChange,
  onSendMessage,
  messageLoading = false,
  onFulfillAdditionalGuard,
}) {
  const [resolutionNotes, setResolutionNotes] = useState(request?.resolution_notes || '');
  const [resolutionError, setResolutionError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [messageError, setMessageError] = useState(null);

  if (!request && !loading) return null;

  const canMessage = ['open', 'in_progress'].includes(request?.status);
  const messages = request?.messages || [];
  const canFulfillAdditionalGuard = request?.ticket_type === 'additional_guard' && canMessage;

  const handleStatusChange = (status) => {
    if (status === 'resolved' && !resolutionNotes.trim()) {
      setResolutionError('Resolution notes are required before resolving this request.');
      return;
    }

    setResolutionError(null);
    onStatusChange(status, status === 'resolved' ? resolutionNotes.trim() : undefined);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setMessageError('Message is required.');
      return;
    }

    try {
      setMessageError(null);
      await onSendMessage?.(messageText.trim());
      setMessageText('');
    } catch (err) {
      setMessageError(err?.response?.data?.error || 'Failed to send message.');
    }
  };

  return (
    <div className="sr-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sr-modal-content">
        {loading ? (
          <div className="sr-modal-body">
            <p className="sr-description-text">Loading service request...</p>
          </div>
        ) : (
          <>
            <div className="sr-modal-header">
              <div>
                <h2>Service Request Details</h2>
                <p>{request.request_id} - {request.client}</p>
              </div>
              <button className="sr-modal-close-btn" onClick={onClose}><FaTimes /></button>
            </div>

            <div className="sr-modal-body">
              <div className="sr-modal-badges">
                <span className={`sr-modal-badge ${request.statusClass || request.status}`}>{request.statusLabel}</span>
                <span className={`sr-modal-badge ${request.urgency}`}>{request.urgencyLabel}</span>
                <span className="sr-modal-badge type">{request.type}</span>
              </div>

              <div className="sr-client-box">
                <p className="sr-client-box-label">Client Information</p>
                <div className="sr-client-box-inner">
                  <div className="sr-client-box-avatar">
                    {request.clientInitials}
                  </div>
                  <div>
                    <p className="sr-client-box-name">{request.client}</p>
                    <p className="sr-client-box-sub">{request.site}</p>
                  </div>
                </div>
              </div>

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

              <div className="sr-description-box">
                <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Request Description</p>
                <p className="sr-description-text">{request.description || 'No description provided.'}</p>
              </div>

              {request.resolution_notes && (
                <div className="sr-description-box">
                  <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Resolution Notes</p>
                  <p className="sr-description-text">{request.resolution_notes}</p>
                </div>
              )}

              {request.modalActions?.includes('resolve') && (
                <div className="sr-description-box">
                  <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Response / Resolution Notes</p>
                  <textarea
                    className="sr-reply-textarea"
                    value={resolutionNotes}
                    onChange={(event) => setResolutionNotes(event.target.value)}
                    rows={4}
                    disabled={actionLoading}
                    placeholder="Write the response that the client will see when this request is resolved."
                  />
                  {resolutionError && <p className="sr-field-error">{resolutionError}</p>}
                </div>
              )}

              {request.timeline?.length > 0 && (
                <div>
                  <p className="sr-timeline-title">Request Timeline</p>
                  <div className="sr-timeline">
                    {request.timeline.map((item, index) => (
                      <div key={`${item.label}-${index}`} className={`sr-timeline-item${item.faded ? ' faded' : ''}`}>
                        <div className={`sr-timeline-dot ${item.dotClass}`}>
                          {timelineIcon(item.dotClass)}
                        </div>
                        <div>
                          <p className="sr-timeline-label">{item.label}</p>
                          {item.sub && <p className="sr-timeline-sub">{item.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="sr-thread-title">
                  <FaComments /> Conversation
                </p>
                {messages.length > 0 ? (
                  <div className="sr-thread">
                    {messages.map((message) => <ThreadMessage key={message.id} message={message} />)}
                  </div>
                ) : (
                  <p className="sr-description-text">No messages yet.</p>
                )}
                {canMessage && (
                  <div className="sr-reply-box">
                    <label className="sr-reply-label">Reply to client</label>
                    <textarea
                      className="sr-reply-textarea"
                      rows={3}
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      disabled={messageLoading}
                      placeholder="Write a message to the client..."
                    />
                    {messageError && <p className="sr-field-error">{messageError}</p>}
                    <div className="sr-reply-actions">
                      <span />
                      <button
                        type="button"
                        className="sr-modal-btn blue"
                        disabled={messageLoading}
                        onClick={handleSendMessage}
                      >
                        <FaPaperPlane /> {messageLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="sr-modal-actions">
                {canFulfillAdditionalGuard && (
                  <button className="sr-modal-btn blue" disabled={actionLoading} onClick={() => onFulfillAdditionalGuard?.(request)}>
                    <FaUserPlus /> Deploy Additional Guard
                  </button>
                )}
                {request.modalActions?.includes('resolve') && (
                  <button className="sr-modal-btn green" disabled={actionLoading} onClick={() => handleStatusChange('resolved')}>
                    Mark Resolved
                  </button>
                )}
                {request.modalActions?.includes('progress') && (
                  <button className="sr-modal-btn yellow" disabled={actionLoading} onClick={() => handleStatusChange('in_progress')}>
                    Set In Progress
                  </button>
                )}
                {request.modalActions?.includes('cancel') && (
                  <button className="sr-modal-btn red" disabled={actionLoading} onClick={() => handleStatusChange('cancelled')}>
                    Cancel Request
                  </button>
                )}
                <button className="sr-modal-btn gray" disabled={actionLoading} onClick={onClose}>Back</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function HrisSRTable({
  requests = [],
  metadata = { total: 0, page: 1, limit: 8, totalPages: 1 },
  loading = false,
  onOpenDetail,
  onPageChange,
}) {
  const { total, page, limit, totalPages } = metadata;
  const start = total === 0 ? 0 : ((page - 1) * limit) + 1;
  const end = Math.min(page * limit, total);

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
            {loading ? (
              <SkeletonRows />
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                  No service requests found.
                </td>
              </tr>
            ) : requests.map((request) => {
              const { Icon, className } = typeIcon(request.ticket_type);
              return (
                <tr key={request.id} onClick={() => onOpenDetail(request)}>
                  <td><span className="sr-request-id">{request.request_id}</span></td>
                  <td>
                    <div className="sr-client-cell">
                      <div className="sr-client-icon blue">
                        <FaBuilding />
                      </div>
                      <span className="sr-client-name">{request.client}</span>
                    </div>
                  </td>
                  <td>
                    <div className="sr-type-cell">
                      <Icon className={`sr-type-icon ${className}`} />
                      {request.type}
                    </div>
                  </td>
                  <td style={{ color: '#6b7280' }}>{request.site}</td>
                  <td><span className={`sr-urgency-badge ${request.urgency}`}>{request.urgencyLabel}</span></td>
                  <td style={{ color: '#6b7280' }}>{request.date}</td>
                  <td><span className={`sr-status-badge ${request.statusClass || request.status}`}>{request.statusLabel}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    {request.action === 'respond' ? (
                      <button className="sr-action-respond" onClick={() => onOpenDetail(request)}>
                        <FaReply /> Respond
                      </button>
                    ) : (
                      <button className="sr-action-view" onClick={() => onOpenDetail(request)}>View</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sr-table-footer">
        <p className="sr-showing-text">
          {total === 0 ? 'No requests' : `Showing ${start}-${end} of ${total} requests`}
        </p>
        <div className="sr-page-btns">
          <button className="sr-page-btn" disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>
            <FaChevronLeft />
          </button>
          <button className="sr-page-btn active" disabled>{page}</button>
          <button className="sr-page-btn" disabled={page >= totalPages || loading} onClick={() => onPageChange(page + 1)}>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export { SRDetailModal };
