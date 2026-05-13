import { useState } from 'react';
import {
  FaTimes, FaHistory, FaPaperPlane, FaEye, FaCheck, FaBan, FaComments,
} from 'react-icons/fa';
import ServiceRequestThread from '@components/service-requests/ServiceRequestThread';
import serviceRequestsService from '@services/cms/serviceRequestsService';


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

  // 2. Under review
  if (['in_progress', 'resolved'].includes(request.status)) {
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
      title: 'Awaiting Resolution...',
      time: null,
      faded: true,
    });
  }

  return events;
}


export default function RequestDetailModal({ isOpen, request, onClose, onCancelSuccess, onMessageSent }) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState(null);

  if (!isOpen || !request) return null;

  const timeline = buildTimeline(request);
  const canCancel = request.status === 'open' && !request.has_fulfillments;
  const canMessage = ['open', 'in_progress'].includes(request.status);
  const messages = request.messages || [];

  const handleCancel = async () => {
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
            <div className="sr-inline-error">
              {cancelError}
            </div>
          )}

          {confirmingCancel && (
            <div className="sr-cancel-confirm">
              <p>Cancel this service request?</p>
              <div>
                <button
                  type="button"
                  className="sr-btn-back"
                  onClick={() => setConfirmingCancel(false)}
                  disabled={cancelling}
                >
                  Keep Request
                </button>
                <button
                  type="button"
                  className="sr-btn-cancel-req"
                  onClick={handleCancel}
                  disabled={cancelling}
                >
                  <FaTimes /> {cancelling ? 'Cancelling...' : 'Cancel Request'}
                </button>
              </div>
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

          {request.additional_guard_details && (
            <div className="sr-detail-desc-box">
              <p className="sr-detail-info-label">Additional Guard Progress</p>
              <p className="sr-detail-desc-text">
                {request.additional_guard_details.fulfilled_guard_count} of {request.additional_guard_details.requested_guard_count} guards deployed
              </p>
              {request.has_fulfillments && (
                <p className="sr-detail-desc-text">
                  Cancellation is locked because fulfillment has started.
                </p>
              )}
            </div>
          )}

          {request.replacement_details && (
            <div className="sr-detail-desc-box">
              <p className="sr-detail-info-label">Replacement Details</p>
              <p className="sr-detail-desc-text">
                Replace: {request.replacement_details.original_guard_name} ({request.replacement_details.original_employee_number})
              </p>
              <p className="sr-detail-desc-text">
                Site: {request.replacement_details.site_name || request.site}
              </p>
              {request.replacement_details.replacement_deployment_id && (
                <p className="sr-detail-desc-text">
                  Replacement: {request.replacement_details.replacement_guard_name} ({request.replacement_details.replacement_employee_number})
                </p>
              )}
            </div>
          )}

          {/* Resolution notes (if resolved) */}
          {request.resolution_notes && (
            <div className="sr-detail-desc-box sr-resolution-note-box">
              <p className="sr-detail-info-label">Resolution Notes</p>
              <p className="sr-detail-desc-text">
                {request.resolution_notes}
              </p>
            </div>
          )}

          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaComments /> Conversation
            </h4>
            <ServiceRequestThread messages={messages} emptyClassName="sr-empty-thread" />
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
                onClick={() => setConfirmingCancel(true)}
                disabled={cancelling}
              >
                <FaTimes /> {cancelling ? 'Cancelling...' : 'Cancel Request'}
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
