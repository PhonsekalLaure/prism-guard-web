import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaExclamationCircle,
  FaReceipt,
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
  const { notification, closeNotification } = useNotification();

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
              </div>

              <div className="ca-readonly-note">
                <FaReceipt />
                <span>Approval, rejection, release, and settlement actions are not enabled yet.</span>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
