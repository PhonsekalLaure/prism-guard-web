import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import ViewIncidentDetail from '@hris-components/incidents/ViewIncidentDetail';
import useNotification from '@hooks/useNotification';
import incidentsService from '@services/hris/incidentsService';
import '../../styles/hris/HrisIncidents.css';

export default function HrisIncidentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [showResolveNotes, setShowResolveNotes] = useState(false);
  const [resolveNotes, setResolveNotes] = useState('');
  const [showManualApproveNotes, setShowManualApproveNotes] = useState(false);
  const [manualApproveNotes, setManualApproveNotes] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  const loadIncident = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await incidentsService.getIncidentById(id);
      setIncident(data);
    } catch (err) {
      setIncident(null);
      setError(err.response?.data?.error || 'Failed to load incident report.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadIncident();
  }, [loadIncident]);

  const submitReview = async (status, reviewNotes, options = {}) => {
    setActionLoading(true);
    try {
      await incidentsService.updateReview(id, status, reviewNotes, options);
      showNotification('Incident report updated.', 'success');
      await loadIncident();
      return true;
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update incident report.', 'error');
      return false;
    } finally {
      setActionLoading(false);
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
    setActionLoading(true);
    try {
      await incidentsService.markResolved(id, resolveNotes.trim());
      showNotification('Incident report marked as resolved.', 'success');
      closeResolveNotes();
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to mark incident as resolved.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setActionLoading(true);
    showNotification('Generating PDF...', 'loading', 0);
    try {
      await incidentsService.generateInternalReport(id);
      showNotification('PDF generated. Review it before sending.', 'success');
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to generate formal report.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendPresident = async () => {
    setActionLoading(true);
    try {
      await incidentsService.sendInternalReportToPresident(id);
      showNotification('Formal incident report sent to the president.', 'success');
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to send report to the president.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClientRequestAction = async (request, action) => {
    setActionLoading(true);
    try {
      if (action === 'generate') {
        showNotification('Generating client PDF...', 'loading', 0);
        await incidentsService.generateClientReport(request.id);
        showNotification('Client PDF generated. Review it before publishing to CMS.', 'success');
      } else if (action === 'sent') {
        const result = await incidentsService.sendClientReport(request.id);
        showNotification(
          result.notificationEmailStatus === 'failed'
            ? 'Client report published to CMS, but the notification email failed.'
            : 'Client report published to CMS and notification email sent.',
          result.notificationEmailStatus === 'failed' ? 'warning' : 'success'
        );
      } else {
        await incidentsService.updateClientReportRequest(request.id, action);
        showNotification('Client report request updated.', 'success');
      }
      await loadIncident();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to update client report request.', 'error');
    } finally {
      setActionLoading(false);
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
                disabled={actionLoading}
                onClick={confirmResolve}
              >
                <FaCheckCircle /> Confirm Resolution
              </button>
              <button
                className="ir-modal-btn secondary"
                disabled={actionLoading}
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
                disabled={actionLoading}
                onClick={confirmManualApprove}
              >
                <FaUserCheck /> Confirm Manual Approval
              </button>
              <button
                className="ir-modal-btn secondary"
                disabled={actionLoading}
                onClick={closeManualApproveNotes}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
