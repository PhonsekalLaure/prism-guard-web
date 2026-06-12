import { useEffect, useState } from 'react';
import {
  FaTimes, FaHistory, FaPaperPlane, FaEye, FaCheck, FaBan, FaComments,
  FaTicketAlt,
} from 'react-icons/fa';
import CancelServiceRequestDialog from '@components/service-requests/CancelServiceRequestDialog';
import ServiceRequestThread from '@components/service-requests/ServiceRequestThread';
import ServiceRequestReplyBox from '@components/service-requests/ServiceRequestReplyBox';
import ServiceRequestTypeDetails from '@components/service-requests/ServiceRequestTypeDetails';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import serviceRequestsService from '@services/cms/serviceRequestsService';


function buildTimeline(request) {
  if (!request) return [];

  const events = [];

  events.push({
    icon: <FaPaperPlane />,
    bg: '#3b82f6',
    title: 'Request Submitted',
    time: request.date,
    faded: false,
  });

  if (['in_progress', 'resolved'].includes(request.status)) {
    events.push({
      icon: <FaEye />,
      bg: '#e6b215',
      title: 'Under Review by Admin',
      time: null,
      faded: false,
    });
  }

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


export default function RequestDetailModal({ isOpen, request, loadingDetail = false, onClose, onCancelSuccess, onMessageSent }) {
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState(null);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState(null);

  useEffect(() => {
    setConfirmingCancel(false);
    setCancelError(null);
  }, [isOpen, request?.id]);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.05rem', flexShrink: 0,
            }}>
              <FaTicketAlt />
            </div>
            <div>
              <h2>Service Request Details</h2>
              <p style={{ fontFamily: 'Courier New, monospace', letterSpacing: '0.05em' }}>
                #{String(request.id).substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <button className="sr-modal-close" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body — skeleton while full detail loads, real content after */}
        {loadingDetail ? (
          <div className="sr-modal-body">
            {/* Badge row */}
            <div className="sr-detail-skeleton__badges">
              {[72, 72, 108].map((w, i) => (
                <SkeletonBlock key={i} className="dsk-btn" style={{ width: w, height: 24, borderRadius: 20 }} />
              ))}
            </div>
            {/* Info grid */}
            <div className="dsk-grid cols-2">
              <div className="dsk-info-cell">
                <SkeletonBlock className="dsk-line sm" />
                <SkeletonBlock className="dsk-line md" />
              </div>
              <div className="dsk-info-cell">
                <SkeletonBlock className="dsk-line sm" />
                <SkeletonBlock className="dsk-line md" />
              </div>
            </div>
            {/* Description */}
            <div className="dsk-info-cell" style={{ minHeight: 72 }}>
              <SkeletonBlock className="dsk-line sm" />
              <SkeletonBlock className="dsk-line lg" />
              <SkeletonBlock className="dsk-line md" />
            </div>
            {/* Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <SkeletonList count={3}>{(i) => (
                <div key={i} className="sr-detail-skeleton__timeline-item">
                  <SkeletonBlock className="dsk-btn" style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0 }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <SkeletonBlock className="dsk-line md" />
                    <SkeletonBlock className="dsk-line sm" />
                  </div>
                </div>
              )}</SkeletonList>
            </div>
            {/* Conversation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <SkeletonBlock className="dsk-line" style={{ height: 13, width: '32%' }} />
              <div className="dsk-info-cell" style={{ minHeight: 56 }}>
                <SkeletonBlock className="dsk-line md" />
                <SkeletonBlock className="dsk-line lg" />
              </div>
            </div>
            {/* Action buttons */}
            <div className="sr-detail-skeleton__actions">
              <SkeletonBlock className="dsk-btn" style={{ flex: 1, height: 38, borderRadius: 8 }} />
              <SkeletonBlock className="dsk-btn" style={{ flex: 1, height: 38, borderRadius: 8 }} />
            </div>
          </div>
        ) : (
        <div className="sr-modal-body">

          {/* Badges */}
          <div className="sr-detail-badges">
            <span className={`sr-status-badge ${request.statusClass}`}>{request.statusLabel}</span>
            <span className={`sr-urgency-badge ${request.urgencyClass}`}>{request.urgency}</span>
            <span className="sr-type-pill">{request.type}</span>
          </div>

          {/* Error */}
          {cancelError && (
            <div className="sr-inline-error">
              {cancelError}
            </div>
          )}

          {/* Info grid */}
          <div className="sr-detail-grid">
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Site / Location</p>
              <p className="sr-detail-info-value">{request.site || '—'}</p>
            </div>
            <div className="sr-detail-info-cell">
              <p className="sr-detail-info-label">Date Submitted</p>
              <p className="sr-detail-info-value">{request.date}</p>
            </div>
          </div>

          {/* Description */}
          <div className="sr-detail-desc-box">
            <p className="sr-detail-info-label">Request Description</p>
            <p className="sr-detail-desc-text">
              {request.description || 'No description provided.'}
            </p>
          </div>

          <ServiceRequestTypeDetails
            request={request}
            detailBoxClassName="sr-detail-desc-box"
            labelClassName="sr-detail-info-label"
            textClassName="sr-detail-desc-text"
            showCancellationLock
          />

          {/* Resolution notes (if resolved) */}
          {request.resolution_notes && (
            <div className="sr-detail-desc-box sr-resolution-note-box">
              <p className="sr-detail-info-label">Resolution Notes</p>
              <p className="sr-detail-desc-text">
                {request.resolution_notes}
              </p>
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

          {/* Conversation */}
          <div className="sr-detail-section">
            <h4 className="sr-detail-section-title">
              <FaComments /> Conversation
            </h4>
            <ServiceRequestThread messages={messages} emptyClassName="sr-empty-thread" />
            {canMessage && (
              <ServiceRequestReplyBox
                label="Reply"
                value={messageText}
                onChange={setMessageText}
                onSend={handleSendMessage}
                loading={sendingMessage}
                error={messageError}
                placeholder="Write a message to HRIS..."
                buttonClassName="sr-reply-send-btn"
              />
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
            <button className="sr-btn-back" onClick={onClose} disabled={cancelling}>
              Close
            </button>
          </div>

          <CancelServiceRequestDialog
            isOpen={confirmingCancel}
            requestId={request?.id}
            isSaving={cancelling}
            onCancel={() => setConfirmingCancel(false)}
            onConfirm={handleCancel}
          />

        </div>
        )} {/* end loadingDetail ternary */}
      </div>
    </div>
  );
}
