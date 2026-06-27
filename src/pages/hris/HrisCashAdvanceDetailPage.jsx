import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaCheck,
  FaExclamationCircle,
  FaHandHoldingUsd,
  FaReceipt,
  FaSpinner,
  FaTimes,
  FaTimesCircle,
} from 'react-icons/fa';
import Notification from '@components/ui/Notification';
import EntityAvatar from '@components/ui/EntityAvatar';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';
import useNotification from '@hooks/useNotification';
import cashAdvanceService from '@services/hris/cashAdvanceService';
import '../../styles/hris/HrisCashAdvance.css';

function CashAdvanceDetailSkeleton() {
  return (
    <section className="ca-review-panel">
      <div className="ca-modal-header">
        <div className="ca-header-text" style={{ width: '100%' }}>
          <SkeletonBlock height="1rem" width={230} style={{ background: 'rgba(255,255,255,0.25)', marginBottom: '0.45rem' }} />
          <SkeletonBlock height="0.75rem" width={140} style={{ background: 'rgba(255,255,255,0.18)' }} />
        </div>
        <SkeletonBlock height={24} width={90} radius="999px" style={{ background: 'rgba(255,255,255,0.22)' }} />
      </div>

      <div className="ca-modal-body">
        <div className="ca-modal-emp-box">
          <div className="ca-modal-emp-left">
            <SkeletonBlock className="ca-modal-avatar" />
            <div>
              <SkeletonBlock height="0.95rem" width={180} style={{ marginBottom: '0.45rem' }} />
              <SkeletonBlock height="0.75rem" width={240} />
            </div>
          </div>
        </div>

        <div className="ca-modal-grid">
          <SkeletonList count={4}>{(index) => (
            <div className="ca-modal-cell" key={index}>
              <SkeletonBlock height="0.65rem" width="44%" style={{ marginBottom: '0.45rem' }} />
              <SkeletonBlock height="1rem" width="72%" />
            </div>
          )}</SkeletonList>
        </div>

        {[160, 130].map((width, index) => (
          <div key={index}>
            <SkeletonBlock height="0.75rem" width={width} style={{ marginBottom: '0.6rem' }} />
            <SkeletonBlock height={index === 0 ? 88 : 72} radius={10} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HrisCashAdvanceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleSidebar } = useOutletContext() || {};
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [amountApproved, setAmountApproved] = useState('');
  const [deductionPerPaycheck, setDeductionPerPaycheck] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [noteAction, setNoteAction] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadRequest = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await cashAdvanceService.getCashAdvanceById(id);
      setRequest(data);
    } catch (err) {
      setRequest(null);
      setError(err.response?.data?.error || err.message || 'Failed to load cash advance request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRequest();
  }, [loadRequest]);

  useEffect(() => {
    if (!request) return;
    setAmountApproved(request.amountApproved > 0 ? String(request.amountApproved) : String(request.amountRequested || ''));
    setDeductionPerPaycheck(request.deductionPerPaycheck > 0 ? String(request.deductionPerPaycheck) : '');
    setReviewNotes('');
    setReleaseNotes('');
    setNoteAction(null);
  }, [request]);

  const resetActionState = () => {
    setReviewNotes('');
    setReleaseNotes('');
    setNoteAction(null);
  };

  const handleApprove = async () => {
    if (noteAction !== 'approve') {
      setNoteAction('approve');
      setReviewNotes('');
      return;
    }

    setActionLoadingId('approve');
    try {
      await cashAdvanceService.approveCashAdvance(id, {
        amountApproved: Number(amountApproved),
        deductionPerPaycheck: Number(deductionPerPaycheck),
        reviewNotes,
      });
      showNotification('Cash advance request approved.', 'success');
      resetActionState();
      await loadRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to approve cash advance request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async () => {
    if (noteAction !== 'reject') {
      setNoteAction('reject');
      setReviewNotes('');
      return;
    }

    setActionLoadingId('reject');
    try {
      await cashAdvanceService.rejectCashAdvance(id, reviewNotes);
      showNotification('Cash advance request rejected.', 'success');
      resetActionState();
      await loadRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to reject cash advance request', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRelease = async () => {
    setActionLoadingId('release');
    try {
      await cashAdvanceService.releaseCashAdvance(id, releaseNotes);
      showNotification('Cash advance marked as released.', 'success');
      resetActionState();
      await loadRequest();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to release cash advance', 'error');
    } finally {
      setActionLoadingId(null);
    }
  };


  const approvedAmountValue = Number(amountApproved);
  const deductionValue = Number(deductionPerPaycheck);
  const canApprove = request?.status === 'pending'
    && Number.isFinite(approvedAmountValue)
    && approvedAmountValue > 0
    && approvedAmountValue <= Number(request.amountRequested || 0)
    && Number.isFinite(deductionValue)
    && deductionValue > 0
    && deductionValue <= approvedAmountValue
    && !actionLoadingId;
  const isApproving = actionLoadingId === 'approve';
  const isRejecting = actionLoadingId === 'reject';
  const isReleasing = actionLoadingId === 'release';

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
          <div className="ca-topbar-actions">
            <button className="mobile-toggle" onClick={toggleSidebar} type="button"><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/cash-advance')} type="button">
              <FaArrowLeft /> Back to Cash Advance
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content ca-review-page-wrapper">
        {loading && <CashAdvanceDetailSkeleton />}

        {!loading && error && (
          <div className="ca-error-banner">
            <FaTimesCircle /> {error}
          </div>
        )}

        {!loading && request && (
          <section className="ca-review-panel">
            <div className="ca-modal-header">
              <div className="ca-header-text">
                <h2>Cash Advance Request</h2>
                <p>{request.requestId}</p>
              </div>
              <span className={`ca-badge ${request.status}`}>{request.statusLabel}</span>
            </div>

            <div className="ca-modal-body">
              <div className="ca-modal-emp-box">
                <div className="ca-modal-emp-left">
                  <EntityAvatar
                    avatarUrl={request.avatarUrl}
                    initials={request.initials}
                    className="ca-modal-avatar"
                  />
                  <div className="ca-modal-emp-info">
                    <h3>{request.name}</h3>
                    <p>{request.role} - {request.empId}</p>
                    <span>{request.location}</span>
                  </div>
                </div>
              </div>

              <div className="ca-modal-grid">
                <div className="ca-modal-cell">
                  <label>Amount Requested</label>
                  <p>{request.amountRequestedLabel}</p>
                </div>
                <div className="ca-modal-cell">
                  <label>Amount Approved</label>
                  <p>{request.amountApprovedLabel || 'Not approved yet'}</p>
                </div>
                <div className="ca-modal-cell">
                  <label>Deduction Per Paycheck</label>
                  <p className="normal">{request.deductionPerPaycheckLabel}</p>
                </div>
                <div className="ca-modal-cell">
                  <label>Remaining Balance</label>
                  <p className="normal">{request.remainingBalanceLabel}</p>
                </div>
              </div>

              <div>
                <span className="ca-modal-section-label">Reason</span>
                <div className="ca-modal-narrative">{request.reason}</div>
              </div>

              <div className="ca-assessment-box">
                <h4><FaExclamationCircle style={{ color: '#093269' }} /> Review Status</h4>
                <div className="ca-assessment-row">
                  <span>Current status</span>
                  <span>{request.statusLabel}</span>
                </div>
                <div className="ca-assessment-row">
                  <span>Submitted</span>
                  <span>{request.submittedAtLabel || '-'}</span>
                </div>
                <div className="ca-assessment-row">
                  <span>Reviewed by</span>
                  <span>{request.reviewedByName || 'Not reviewed yet'}</span>
                </div>
                {request.reviewedAtLabel && (
                  <div className="ca-assessment-row">
                    <span>Reviewed at</span>
                    <span>{request.reviewedAtLabel}</span>
                  </div>
                )}
                {request.releasedAtLabel && (
                  <div className="ca-assessment-row">
                    <span>Released by</span>
                    <span>{request.releasedByName || 'N/A'} - {request.releasedAtLabel}</span>
                  </div>
                )}
                {request.settledAtLabel && (
                  <div className="ca-assessment-row">
                    <span>Settled by</span>
                    <span>{request.settledByName || 'N/A'} - {request.settledAtLabel}</span>
                  </div>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="ca-action-panel">
                  <div className="ca-action-grid">
                    <label className="ca-action-field">
                      <span>Approved Amount</span>
                      <input
                        type="number"
                        min="1"
                        max={request.amountRequested || undefined}
                        step="0.01"
                        value={amountApproved}
                        onChange={(event) => setAmountApproved(event.target.value)}
                      />
                    </label>
                    <label className="ca-action-field">
                      <span>Deduction Per Paycheck</span>
                      <input
                        type="number"
                        min="1"
                        max={amountApproved || undefined}
                        step="0.01"
                        value={deductionPerPaycheck}
                        onChange={(event) => setDeductionPerPaycheck(event.target.value)}
                      />
                    </label>
                  </div>

                  {['approve', 'reject'].includes(noteAction) && (
                    <label className="ca-action-field">
                      <span>{noteAction === 'reject' ? 'Rejection Notes (Optional)' : 'Approval Notes (Optional)'}</span>
                      <textarea
                        className="ca-modal-textarea"
                        rows={4}
                        value={reviewNotes}
                        onChange={(event) => setReviewNotes(event.target.value)}
                        placeholder={noteAction === 'reject' ? 'Add notes about this rejection...' : 'Add notes about this approval...'}
                      />
                    </label>
                  )}

                  <div className="ca-modal-actions">
                    <button
                      className="ca-btn approve"
                      onClick={handleApprove}
                      disabled={!canApprove}
                      type="button"
                    >
                      {isApproving
                        ? <><FaSpinner className="ca-spin" /> Approving...</>
                        : noteAction === 'approve'
                          ? <><FaCheck /> Confirm Approval</>
                          : <><FaCheck /> Approve Request</>}
                    </button>
                    <button
                      className="ca-btn reject"
                      onClick={handleReject}
                      disabled={isRejecting || isApproving}
                      type="button"
                    >
                      {isRejecting
                        ? <><FaSpinner className="ca-spin" /> Rejecting...</>
                        : noteAction === 'reject'
                          ? <><FaTimes /> Confirm Rejection</>
                          : <><FaTimes /> Reject Request</>}
                    </button>
                  </div>
                </div>
              )}

              {request.status === 'approved' && (
                <div className="ca-action-panel">
                  <label className="ca-action-field">
                    <span>Release Notes (Optional)</span>
                    <textarea
                      className="ca-modal-textarea"
                      rows={4}
                      value={releaseNotes}
                      onChange={(event) => setReleaseNotes(event.target.value)}
                      placeholder="Add notes about this release..."
                    />
                  </label>
                  <div className="ca-modal-actions">
                    <button
                      className="ca-btn approve"
                      onClick={handleRelease}
                      disabled={isReleasing}
                      type="button"
                    >
                      {isReleasing ? <><FaSpinner className="ca-spin" /> Releasing...</> : <><FaHandHoldingUsd /> Mark Released</>}
                    </button>
                  </div>
                </div>
              )}

              {request.status === 'released' && (
                <div className="ca-approved-box">
                  <p>
                    <FaHandHoldingUsd />
                    This cash advance will be deducted automatically through payroll. It will be marked settled once the remaining balance is fully recovered.
                  </p>
                </div>
              )}

              {['rejected', 'settled'].includes(request.status) && (
                <div className={request.status === 'rejected' ? 'ca-rejected-box' : 'ca-approved-box'}>
                  <p>
                    <FaReceipt />
                    {request.status === 'rejected'
                      ? (request.reviewNotes || 'This request was rejected.')
                      : (request.settlementNotes || 'This request has been settled.')}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
