import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import ReportConfirmDialog from '@components/ui/ReportConfirmDialog';
import ViewIncidentDetail from '@hris-components/incidents/ViewIncidentDetail';
import useNotification from '@hooks/useNotification';
import useReportAction from '@hooks/useReportAction';
import incidentsService from '@services/hris/incidentsService';
import '../../styles/hris/HrisIncidents.css';

function getErrorMessage(error, fallback) {
  return error?.response?.data?.error || error?.message || fallback;
}

export default function HrisIncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [manualActionLoading, setManualActionLoading] = useState('');
  const [reportActionKey, setReportActionKey] = useState('');
  const [confirmReportAction, setConfirmReportAction] = useState(null);
  const [showResolveNotes, setShowResolveNotes] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [showManualApproveNotes, setShowManualApproveNotes] = useState(false);
  const [manualApproveNotes, setManualApproveNotes] = useState('');
  const [messageText, setMessageText] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadIncident = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const data = await incidentsService.getIncidentById(id);
      setIncident(data);
    } catch (err) {
      if (!silent) setIncident(null);
      setError(err.response?.data?.error || 'Failed to load incident report.');
    } finally {
      if (!silent) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadIncident();
  }, [loadIncident]);

  const internalReportAction = useReportAction({
    loadingMessage: 'Generating PDF...',
    successMessage: 'PDF generated. Review it before sending.',
    errorFallback: 'Failed to generate formal report.',
    showNotification,
    getErrorMessage,
    run: async () => {
      setReportActionKey('internal:generate');
      return incidentsService.generateInternalReport(id);
    },
    afterSuccess: () => loadIncident({ silent: true }),
    afterSettled: async () => setReportActionKey(''),
  });

  const sendPresidentAction = useReportAction({
    loadingMessage: 'Sending report to president...',
    successMessage: 'Formal incident report sent to the president.',
    errorFallback: 'Failed to send report to the president.',
    showNotification,
    getErrorMessage,
    run: async () => {
      setReportActionKey('internal:send');
      return incidentsService.sendInternalReportToPresident(id);
    },
    afterSuccess: () => loadIncident({ silent: true }),
    afterSettled: async () => setReportActionKey(''),
  });

  const clientReportAction = useReportAction({
    loadingMessage: (_request, action) => (
      action === 'generate' ? 'Generating client PDF...' : 'Publishing report to CMS...'
    ),
    errorFallback: 'Failed to update client report request.',
    showNotification,
    getErrorMessage,
    run: async (request, action) => {
      setReportActionKey(`client:${request.id}:${action}`);
      if (action === 'generate') return incidentsService.generateClientReport(request.id);
      return incidentsService.sendClientReport(request.id);
    },
    afterSuccess: async (result, _request, action) => {
      await loadIncident({ silent: true });
      if (action === 'generate') {
        showNotification('Client PDF generated. Review it before publishing to CMS.', 'success');
        return;
      }
      showNotification(
        result.notificationEmailStatus === 'failed'
          ? 'Client report published to CMS, but the notification email failed.'
          : 'Client report published to CMS and notification email sent.',
        result.notificationEmailStatus === 'failed' ? 'warning' : 'success'
      );
    },
    afterSettled: async () => setReportActionKey(''),
  });

  const actionLoading = reportActionKey || manualActionLoading;

  const submitReview = async (status, reviewNotes, options = {}) => {
    setManualActionLoading('review');
    try {
      await incidentsService.updateReview(id, status, reviewNotes, options);
      showNotification('Incident report updated.', 'success');
      await loadIncident();
      return true;
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update incident report.', 'error');
      return false;
    } finally {
      setManualActionLoading('');
    }
  };

  const closeResolveNotes = () => {
    setShowResolveNotes(false);
    setResolveNotes('');
  };

  const closeManualApproveNotes = () => {
    setShowManualApproveNotes(false);
    setManualApproveNotes('');
  };

  const handleReview = async (targetIncident, status) => {
    if (status === 'approved' && targetIncident?.aiProcessingStatus === 'failed') {
      setShowResolveNotes(false);
      setShowManualApproveNotes(true);
      return;
    }

    await submitReview(status);
  };

  const confirmManualApprove = async () => {
    const notes = manualApproveNotes.trim();
    if (!notes) {
      showNotification('Manual review notes are required.', 'error');
      return;
    }

    const updated = await submitReview('approved', notes, { manualReview: true });
    if (updated) {
      closeManualApproveNotes();
    }
  };

  const confirmResolve = async () => {
    setManualActionLoading('resolve');
    try {
      await incidentsService.markResolved(id, resolveNotes.trim());
      showNotification('Incident report marked as resolved.', 'success');
      closeResolveNotes();
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to mark incident as resolved.', 'error');
    } finally {
      setManualActionLoading('');
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      setMessageError('Message is required.');
      return;
    }

    try {
      setMessageError(null);
      setMessageLoading(true);
      await incidentsService.sendMessage(id, messageText.trim());
      setMessageText('');
      await loadIncident({ silent: true });
    } catch (err) {
      setMessageError(err.response?.data?.error || 'Failed to send incident message.');
    } finally {
      setMessageLoading(false);
    }
  };

  const handleGenerateReport = () => internalReportAction.execute();

  const handleSendPresident = () => {
    setConfirmReportAction({
      type: 'sendPresident',
      title: 'Send Report to President?',
      description: 'This will send the generated internal incident report outside the HRIS workspace.',
      confirmLabel: 'Send to President',
      tone: 'warning',
    });
  };

  const handleClientRequestAction = async (request, action) => {
    if (action === 'generate') {
      await clientReportAction.execute(request, action);
      return;
    }

    if (action === 'sent') {
      setConfirmReportAction({
        type: 'publishClient',
        request,
        title: 'Publish Report to CMS?',
        description: `This will make the generated client report available to ${request.clientName || 'the client'}.`,
        confirmLabel: 'Publish to CMS',
        tone: 'warning',
      });
      return;
    }

    setManualActionLoading(`client:${request.id}:${action}`);
    try {
      await incidentsService.updateClientReportRequest(request.id, action);
      showNotification('Client report request updated.', 'success');
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update client report request.', 'error');
    } finally {
      setManualActionLoading('');
    }
  };

  const confirmReportDialogAction = async () => {
    if (!confirmReportAction) return;
    const current = confirmReportAction;
    setConfirmReportAction(null);
    if (current.type === 'sendPresident') {
      await sendPresidentAction.execute();
      return;
    }
    if (current.type === 'publishClient' && current.request) {
      await clientReportAction.execute(current.request, 'sent');
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/incidents')}>
              <FaArrowLeft /> Back to Incidents
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ir-detail-page-wrapper">
        <ViewIncidentDetail
          incident={incident}
          loading={loading}
          error={error}
          actionLoading={actionLoading}
          onReview={handleReview}
          onResolve={() => {
            setShowManualApproveNotes(false);
            setShowResolveNotes(true);
          }}
          onGenerateReport={handleGenerateReport}
          onSendPresident={handleSendPresident}
          onClientRequestAction={handleClientRequestAction}
          messageText={messageText}
          messageLoading={messageLoading}
          messageError={messageError}
          onMessageChange={setMessageText}
          onSendMessage={handleSendMessage}
        />
      </div>

      {showResolveNotes && (
        <div className="ir-modal-overlay" onClick={(e) => e.target === e.currentTarget && !actionLoading && closeResolveNotes()}>
          <div className="ir-note-modal">
            <h3><FaCheckCircle style={{ color: '#16a34a' }} /> Mark Incident Resolved</h3>
            <p>Add resolution notes to close this incident report.</p>
            <textarea
              className="ir-note-textarea"
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              placeholder="Add operations notes for the resolution..."
              rows={5}
            />
            <div className="ir-modal-actions">
              <button
                className="ir-modal-btn resolve"
                disabled={Boolean(actionLoading)}
                onClick={confirmResolve}
              >
                <FaCheckCircle /> Confirm Resolution
              </button>
              <button
                className="ir-modal-btn secondary"
                disabled={Boolean(actionLoading)}
                onClick={closeResolveNotes}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showManualApproveNotes && (
        <div className="ir-modal-overlay" onClick={(e) => e.target === e.currentTarget && !actionLoading && closeManualApproveNotes()}>
          <div className="ir-note-modal">
            <h3><FaUserCheck style={{ color: '#093269' }} /> Manual Incident Approval</h3>
            <p>AI processing failed. Confirm that you reviewed the original guard report manually before approval.</p>
            <textarea
              className="ir-note-textarea"
              value={manualApproveNotes}
              onChange={(e) => setManualApproveNotes(e.target.value)}
              placeholder="Add manual review notes..."
              rows={5}
            />
            <div className="ir-modal-actions">
              <button
                className="ir-modal-btn resolve"
                disabled={Boolean(actionLoading)}
                onClick={confirmManualApprove}
              >
                <FaUserCheck /> Confirm Manual Approval
              </button>
              <button
                className="ir-modal-btn secondary"
                disabled={Boolean(actionLoading)}
                onClick={closeManualApproveNotes}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ReportConfirmDialog
        open={Boolean(confirmReportAction)}
        title={confirmReportAction?.title || ''}
        description={confirmReportAction?.description || ''}
        confirmLabel={confirmReportAction?.confirmLabel || 'Confirm'}
        loading={sendPresidentAction.loading || clientReportAction.loading}
        tone={confirmReportAction?.tone || 'warning'}
        onCancel={() => setConfirmReportAction(null)}
        onConfirm={confirmReportDialogAction}
      />

    </>
  );
}
