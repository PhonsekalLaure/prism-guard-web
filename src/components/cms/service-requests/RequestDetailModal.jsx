import { useState } from 'react';
import {
  FaTimes, FaHistory, FaPaperPlane, FaEye, FaCheck, FaBan, FaComments,
} from 'react-icons/fa';
import serviceRequestsService from '@services/cms/serviceRequestsService';

// ─── Timeline builder ─────────────────────────────────────────────────────────

function buildTimeline(request) {
  if (!request) return [];

  const events = [];

  // 1. Submitted
  events.push({
    icon: <FaPaperPlane />,
    bg: '#3b82f6',
    title: 'Request Submitted',
    time: request.date,
    faded: false,
  });

  // 2. Under review (if status is not just open)
  if (['in_progress', 'resolved', 'cancelled'].includes(request.status)) {
    events.push({
      icon: <FaEye />,
      bg: '#e6b215',
      title: 'Under Review by Admin',
      time: null,
      faded: false,
    });
  }

  // 3. Final state
  if (request.status === 'resolved') {
    events.push({
      icon: <FaCheck />,
      bg: '#10b981',
      title: 'Resolved',
      time: null,
      faded: false,
    });
  } else if (request.status === 'cancelled') {
    events.push({
      icon: <FaBan />,
      bg: '#dc2626',
      title: 'Request Cancelled',
      time: null,
      faded: false,
    });
  } else {
    events.push({
      icon: <FaCheck />,
      bg: '#9ca3af',
      title: 'Awaiting Resolution…',
      time: null,
      faded: true,
    });
  }

  return events;
}

// ─── Component ────────────────────────────────────────────────────────────────

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

export default function RequestDetailModal({ isOpen, request, onClose, onCancelSuccess, onMessageSent }) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState(null);

  if (!isOpen || !request) return null;

  const timeline = buildTimeline(request);
  const canCancel = ['open', 'in_progress'].includes(request.status);
  const canMessage = canCancel;
  const messages = request.messages || [];

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this request?')) return;
    try {
      setCancelling(true);
      setCancelError(null);
      await serviceRequestsService.cancelServiceRequest(request.id);
      onCancelSuccess?.();
    } catch (err) {
      setCancelError(err?.response?.data?.error || 'Failed to cancel request.');
    } finally {
      setCancelling(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setMessageError('Message is required.');
      return;
    }

    try {
      setSendingMessage(true);
      setMessageError(null);
      await serviceRequestsService.sendMessage(request.id, messageText.trim());
      setMessageText('');
      await onMessageSent?.();
    } catch (err) {
      setMessageError(err?.response?.data?.error || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div
        className="sr-modal-content sr-modal-content--wide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sr-modal-header">
          <div>
            <h2>Service Request Details</h2>
            <p>{String(request.id).substring(0, 8).toUpperCase()}</p>
          </div>
          <button className="sr-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">
          {/* Badges */}
          <div className="sr-detail-badges">
            <span className={`sr-status-badge ${request.statusClass}`}>{request.statusLabel}</span>
            <span className={`sr-urgency-badge ${request.urgencyClass}`}>{request.urgency}</span>
            <span className="sr-type-pill">{request.type}</span>
          </div>

          {cancelError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.7rem 1rem', color: '#dc2626', fontSize: '0.82rem', fontWeight: 500 }}>
              {cancelError}
            </div>
          )}

          {/* Timeline */}
          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaHistory /> Request Timeline
            </h4>
            <div className="sr-timeline">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`sr-timeline-item${item.faded ? ' sr-timeline-item--faded' : ''}`}
                >
                  <div className="sr-timeline-dot" style={{ background: item.bg }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="sr-timeline-title">{item.title}</p>
                    {item.time && <p className="sr-timeline-time">{item.time}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Grid */}
          <div className="sr-detail-grid">
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Site / Location</p>
              <p className="sr-detail-info-value">{request.site}</p>
            </div>
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Date Submitted</p>
              <p className="sr-detail-info-value">{request.date}</p>
            </div>
          </div>

          {/* Description */}
          <div className="sr-detail-desc-box">
            <p className="sr-detail-info-label">Description</p>
            <p className="sr-detail-desc-text">
              {request.description || 'No description provided.'}
            </p>
          </div>

          {/* Resolution notes (if resolved) */}
          {request.resolution_notes && (
            <div className="sr-detail-desc-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <p className="sr-detail-info-label" style={{ color: '#15803d' }}>Resolution Notes</p>
              <p className="sr-detail-desc-text" style={{ color: '#15803d' }}>
                {request.resolution_notes}
              </p>
            </div>
          )}

          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaComments /> Conversation
            </h4>
            {messages.length > 0 ? (
              <div className="sr-thread">
                {messages.map((message) => <ThreadMessage key={message.id} message={message} />)}
              </div>
            ) : (
              <p className="sr-empty-thread">No messages yet.</p>
            )}
            {canMessage && (
              <div className="sr-reply-box">
                <label className="sr-reply-label">Reply</label>
                <textarea
                  className="sr-reply-textarea"
                  rows={3}
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  disabled={sendingMessage}
                  placeholder="Write a message to HRIS..."
                />
                {messageError && <p className="sr-field-error">{messageError}</p>}
                <div className="sr-reply-actions">
                  <span />
                  <button
                    type="button"
                    className="sr-reply-send-btn"
                    onClick={handleSendMessage}
                    disabled={sendingMessage}
                  >
                    <FaPaperPlane /> {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="sr-modal-actions sr-detail-actions">
            {canCancel && (
              <button
                className="sr-btn-cancel-req"
                onClick={handleCancel}
                disabled={cancelling}
              >
                <FaTimes /> {cancelling ? 'Cancelling…' : 'Cancel Request'}
              </button>
            )}
            <button className="sr-btn-back" onClick={onClose}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
