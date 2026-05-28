import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaCheck,
  FaExternalLinkAlt,
  FaFileUpload,
  FaMapMarkerAlt,
  FaPaperclip,
  FaSpinner,
  FaTimes,
  FaTimesCircle,
  FaUserShield,
} from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import EntityAvatar from '@components/ui/EntityAvatar';
import useNotification from '@hooks/useNotification';
import leaveRequestsService from '@services/hris/leaveRequestsService';
import '../../styles/hris/HrisLeaveRequests.css';

function LeaveRequestDetailSkeleton() {
  return (
    <section className="hlr-review-panel">
      <div className="hlr-modal-header">
        <div className="hlr-header-text" style={{ width: '100%' }}>
          <SkeletonBlock height="1rem" width={210} style={{ background: 'rgba(255,255,255,0.25)', marginBottom: '0.45rem' }} />
          <SkeletonBlock height="0.75rem" width={120} style={{ background: 'rgba(255,255,255,0.18)' }} />
        </div>
        <SkeletonBlock height={24} width={90} radius="999px" style={{ background: 'rgba(255,255,255,0.22)' }} />
      </div>

      <div className="hlr-modal-body">
        <div className="hlr-modal-emp-box">
          <SkeletonBlock className="entity-card-skeleton__avatar entity-card-skeleton__avatar--square" />
          <div className="entity-card-skeleton__lines">
            <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--long" />
            <SkeletonBlock className="entity-card-skeleton__line entity-card-skeleton__line--short" />
            <SkeletonBlock height="0.7rem" width="50%" />
          </div>
        </div>

        <div className="hlr-modal-grid">
          <SkeletonList count={4}>{(index) => (
            <div key={index} className="hlr-modal-cell">
              <SkeletonBlock height="0.65rem" width="42%" style={{ marginBottom: '0.45rem' }} />
              <SkeletonBlock height="1rem" width="72%" />
            </div>
          )}</SkeletonList>
        </div>

        {[150, 180, 120].map((width, index) => (
          <div key={index}>
            <SkeletonBlock height="0.75rem" width={width} style={{ marginBottom: '0.6rem' }} />
            <SkeletonBlock height={index === 0 ? 88 : 48} radius={10} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ReplacementGuardSkeletonList() {
  return (
    <div className="hlr-replacement-list">
      <SkeletonList count={3}>{(index) => (
        <div key={index} className="hlr-replacement-card">
          <SkeletonBlock className="hlr-replacement-avatar" />
          <div className="hlr-replacement-info">
            <div className="hlr-replacement-row">
              <SkeletonBlock height="0.9rem" width={150} />
              <SkeletonBlock height={22} width={84} radius="999px" />
            </div>
            <SkeletonBlock height="0.75rem" width={180} style={{ marginTop: '0.3rem' }} />
          </div>
          <SkeletonBlock height="0.8rem" width={72} />
        </div>
      )}</SkeletonList>
    </div>
  );
}

export default function HrisLeaveRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext() || {};
  const [leaveRequest, setLeaveRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [replacementLoading, setReplacementLoading] = useState(false);
  const [replacementGuards, setReplacementGuards] = useState([]);
  const [replacementLoaded, setReplacementLoaded] = useState(false);
  const [approvalMode, setApprovalMode] = useState(false);
  const [selectedRelieverId, setSelectedRelieverId] = useState('');
  const [deploymentOrderFile, setDeploymentOrderFile] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [cancelNotes, setCancelNotes] = useState('');
  const [noteAction, setNoteAction] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadLeaveRequest = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await leaveRequestsService.getLeaveRequestById(id);
      setLeaveRequest(data);
    } catch (err) {
      setLeaveRequest(null);
      setError(err.response?.data?.error || 'Failed to load leave request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadLeaveRequest();
  }, [loadLeaveRequest]);

  const loadReplacementGuards = async () => {
    if (replacementLoaded) return replacementGuards;

    setReplacementLoading(true);
    try {
      const guards = await leaveRequestsService.getReplacementGuards(id);
      setReplacementGuards(guards);
      setReplacementLoaded(true);
      return guards;
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to load replacement guards', 'error');
      return [];
    } finally {
      setReplacementLoading(false);
    }
  };

  const openApprovalMode = async () => {
    setNoteAction(null);
    setReviewNotes('');
    setCancelNotes('');
    setApprovalMode(true);
    await loadReplacementGuards();
  };

  const resetReviewInputs = () => {
    setApprovalMode(false);
    setSelectedRelieverId('');
    setDeploymentOrderFile(null);
    setApprovalNotes('');
    setReviewNotes('');
    setCancelNotes('');
    setNoteAction(null);
  };

  const handleOpenDocument = async () => {
    try {
      await leaveRequestsService.openSupportingDocument(id);
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to open supporting document', 'error');
    }
  };

  const handleApprove = async () => {
    if (!selectedRelieverId || !deploymentOrderFile) return;
    setActionLoadingId('approve');
    try {
      await leaveRequestsService.approveLeaveRequest(id, {
        relieverEmployeeId: selectedRelieverId,
        reviewNotes: approvalNotes,
        deploymentOrderFile,
      });
      showNotification('Leave request approved successfully.', 'success');
      resetReviewInputs();
      await loadLeaveRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to approve leave request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (noteAction !== 'reject') {
      setNoteAction('reject');
      setApprovalMode(false);
      setCancelNotes('');
      return;
    }

    setActionLoadingId('reject');
    try {
      await leaveRequestsService.rejectLeaveRequest(id, reviewNotes);
      showNotification('Leave request rejected successfully.', 'success');
      resetReviewInputs();
      await loadLeaveRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to reject leave request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async () => {
    if (noteAction !== 'cancel') {
      setNoteAction('cancel');
      setApprovalMode(false);
      setReviewNotes('');
      return;
    }

    setActionLoadingId('cancel');
    try {
      await leaveRequestsService.cancelLeaveRequest(id, cancelNotes);
      showNotification('Leave request cancelled.', 'success');
      resetReviewInputs();
      await loadLeaveRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to cancel leave request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const isApproving = actionLoadingId === 'approve';
  const isRejecting = actionLoadingId === 'reject';
  const isCancelling = actionLoadingId === 'cancel';

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
          <div className="hlr-topbar-actions">
            <button className="mobile-toggle" onClick={toggleSidebar} type="button"><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/leaves')} type="button">
              <FaArrowLeft /> Back to Leave Requests
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content hlr-review-page-wrapper">
        {loading && (
          <LeaveRequestDetailSkeleton />
        )}

        {!loading && error && (
          <div className="hlr-error-banner">
            <FaTimesCircle /> {error}
          </div>
        )}

        {!loading && leaveRequest && (
          <section className="hlr-review-panel">
            <div className="hlr-modal-header">
              <div className="hlr-header-text">
                <h2>Leave Request Review</h2>
                <p>{leaveRequest.empId}</p>
              </div>
              <span className={`hlr-badge ${leaveRequest.status}`}>
                {leaveRequest.statusLabel}
              </span>
            </div>

            <div className="hlr-modal-body">
              <div className="hlr-modal-emp-box">
                <EntityAvatar avatarUrl={leaveRequest.avatarUrl} initials={leaveRequest.initials} className="hlr-avatar" />
                <div className="hlr-modal-emp-info">
                  <h3>{leaveRequest.name}</h3>
                  <p>{leaveRequest.role}</p>
                  <span className="hlr-location">{leaveRequest.location}</span>
                </div>
              </div>

              <div className="hlr-modal-grid">
                <div className="hlr-modal-cell">
                  <label>Leave Type</label>
                  <p>{leaveRequest.type}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>Duration</label>
                  <p>{leaveRequest.duration}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>Start Date</label>
                  <p>{leaveRequest.startDate}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>End Date</label>
                  <p>{leaveRequest.endDate}</p>
                </div>
              </div>

              <div>
                <span className="hlr-modal-section-label">Reason for Leave</span>
                <div className="hlr-modal-reason">{leaveRequest.reason}</div>
              </div>

              <div>
                <span className="hlr-modal-section-label">Supporting Document</span>
                {leaveRequest.hasSupportingDocument ? (
                  <button className="hlr-document-link" type="button" onClick={handleOpenDocument}>
                    <FaPaperclip />
                    {leaveRequest.supportingDocumentOriginalName || 'Open supporting document'}
                    <FaExternalLinkAlt />
                  </button>
                ) : (
                  <div className="hlr-modal-reason">No supporting document attached.</div>
                )}
              </div>

              {leaveRequest.reviewedAt && (
                <div className="hlr-modal-grid">
                  <div className="hlr-modal-cell">
                    <label>Reviewed By</label>
                    <p>{leaveRequest.reviewedByName || 'N/A'}</p>
                  </div>
                  <div className="hlr-modal-cell">
                    <label>Reviewed At</label>
                    <p>{leaveRequest.reviewedAtLabel}</p>
                  </div>
                </div>
              )}

              {leaveRequest.status === 'rejected' && (
                <div>
                  <span className="hlr-modal-section-label">Rejection Notes</span>
                  <div className="hlr-modal-reason">
                    {leaveRequest.reviewNotes || 'No rejection notes provided.'}
                  </div>
                </div>
              )}

              {leaveRequest.status === 'cancelled' && (
                <div>
                  <span className="hlr-modal-section-label">Cancellation Notes</span>
                  <div className="hlr-modal-reason">
                    {leaveRequest.reviewNotes || 'No cancellation notes provided.'}
                  </div>
                </div>
              )}

              {leaveRequest.status === 'approved' && leaveRequest.relieverName && (
                <div>
                  <span className="hlr-modal-section-label">Assigned Reliever</span>
                  <div className="hlr-modal-reason">
                    {leaveRequest.relieverName}
                    {leaveRequest.relieverEmployeeNumber
                      ? ` (${leaveRequest.relieverEmployeeNumber})`
                      : ''}
                  </div>
                </div>
              )}

              {leaveRequest.status === 'pending' && (
                <>
                  {approvalMode && (
                    <div className="hlr-approval-box">
                      <div className="hlr-approval-heading">
                        <FaUserShield />
                        <div>
                          <p>Replacement Guard</p>
                          <span>Relievers are listed first, then floating guards, then guards on days off.</span>
                        </div>
                      </div>

                      {replacementLoading ? (
                        <ReplacementGuardSkeletonList />
                      ) : replacementGuards.length === 0 ? (
                        <div className="hlr-replacement-empty">
                          No replacement guards match this leave request and site location.
                        </div>
                      ) : (
                        <div className="hlr-replacement-list">
                          {replacementGuards.map((guard) => {
                            const isSelected = selectedRelieverId === guard.id;
                            return (
                              <button
                                key={guard.id}
                                type="button"
                                className={`hlr-replacement-card${isSelected ? ' selected' : ''}`}
                                onClick={() => setSelectedRelieverId(guard.id)}
                              >
                                <div className="hlr-replacement-avatar">
                                  {(guard.name || 'G').charAt(0).toUpperCase()}
                                </div>
                                <div className="hlr-replacement-info">
                                  <div className="hlr-replacement-row">
                                    <p>{guard.name}</p>
                                    <span className={`hlr-replacement-chip ${guard.availability_type}`}>
                                      {guard.availability_label}
                                    </span>
                                  </div>
                                  <span>{guard.employee_id_number} - {guard.position}</span>
                                </div>
                                <div className="hlr-replacement-distance">
                                  <FaMapMarkerAlt />
                                  {guard.distance_km == null ? 'No coords' : `${guard.distance_km} km`}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div>
                        <span className="hlr-modal-section-label">Temporary Deployment Order</span>
                        <label className={`hlr-upload-zone${deploymentOrderFile ? ' has-file' : ''}`}>
                          <input
                            type="file"
                            accept=".pdf,image/*"
                            onChange={(event) => setDeploymentOrderFile(event.target.files?.[0] || null)}
                          />
                          <FaFileUpload />
                          <span>{deploymentOrderFile?.name || 'Upload temporary deployment order'}</span>
                        </label>
                      </div>

                      <div>
                        <span className="hlr-modal-section-label">Approval Notes (Optional)</span>
                        <textarea
                          className="hlr-admin-notes"
                          placeholder="Add notes about this approval..."
                          value={approvalNotes}
                          onChange={(event) => setApprovalNotes(event.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {noteAction === 'reject' && (
                    <div>
                      <span className="hlr-modal-section-label">Rejection Notes (Optional)</span>
                      <textarea
                        className="hlr-admin-notes"
                        placeholder="Add notes about this rejection..."
                        value={reviewNotes}
                        onChange={(event) => setReviewNotes(event.target.value)}
                      />
                    </div>
                  )}

                  {noteAction === 'cancel' && (
                    <div>
                      <span className="hlr-modal-section-label">Cancellation Notes (Optional)</span>
                      <textarea
                        className="hlr-admin-notes"
                        placeholder="Add notes about this cancellation..."
                        value={cancelNotes}
                        onChange={(event) => setCancelNotes(event.target.value)}
                      />
                    </div>
                  )}

                  <div className="hlr-modal-actions">
                    {approvalMode ? (
                      <button
                        className="hlr-btn approve"
                        onClick={handleApprove}
                        disabled={isApproving || replacementLoading || !selectedRelieverId || !deploymentOrderFile}
                        type="button"
                      >
                        {isApproving ? (
                          <><FaSpinner className="hlr-spin" /> Approving...</>
                        ) : (
                          <><FaCheck /> Approve Leave</>
                        )}
                      </button>
                    ) : (
                      <button
                        className="hlr-btn approve"
                        onClick={openApprovalMode}
                        disabled={replacementLoading}
                        type="button"
                      >
                        {replacementLoading ? (
                          <><FaSpinner className="hlr-spin" /> Loading...</>
                        ) : (
                          <><FaCheck /> Approve Request</>
                        )}
                      </button>
                    )}
                    <button
                      className="hlr-btn reject"
                      onClick={handleReject}
                      disabled={isRejecting || isApproving}
                      type="button"
                    >
                      {isRejecting ? (
                        <><FaSpinner className="hlr-spin" /> Rejecting...</>
                      ) : noteAction === 'reject' ? (
                        <><FaTimes /> Confirm Rejection</>
                      ) : (
                        <><FaTimes /> Reject Request</>
                      )}
                    </button>
                    <button
                      className="hlr-btn cancel"
                      onClick={handleCancel}
                      disabled={isCancelling || isApproving || isRejecting}
                      type="button"
                    >
                      {isCancelling ? (
                        <><FaSpinner className="hlr-spin" /> Cancelling...</>
                      ) : noteAction === 'cancel' ? (
                        <><FaTimesCircle /> Confirm Cancellation</>
                      ) : (
                        <><FaTimesCircle /> Cancel Request</>
                      )}
                    </button>
                  </div>
                </>
              )}

            </div>
          </section>
        )}
      </div>
    </>
  );
}
