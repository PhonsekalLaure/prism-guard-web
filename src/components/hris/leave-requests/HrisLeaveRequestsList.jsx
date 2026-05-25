import { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheck,
  FaClock,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
  FaPaperclip,
  FaSpinner,
  FaTimes,
  FaTimesCircle,
  FaUserShield,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';

const STATUS_ICONS = {
  pending: <FaClock className="mr-1" />,
  approved: <FaCheck className="mr-1" />,
  rejected: <FaTimesCircle className="mr-1" />,
};

function getStatusIcon(status) {
  return STATUS_ICONS[status] || <FaClock className="mr-1" />;
}

export default function HrisLeaveRequestsList({
  requests = [],
  metadata = {},
  loading = false,
  actionLoadingId = null,
  replacementLoadingId = null,
  replacementGuardsByRequest = {},
  onLoadReplacementGuards,
  onApprove,
  onCancel,
  onOpenDocument,
  onReject,
  onPageChange,
}) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [cancelNotes, setCancelNotes] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [approvalMode, setApprovalMode] = useState(false);
  const [selectedRelieverId, setSelectedRelieverId] = useState('');

  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find((request) => request.id === selectedRequest.id);
      if (updated) {
        setSelectedRequest(updated);
      }
    }
  }, [requests, selectedRequest]);

  const closeModal = () => {
    setSelectedRequest(null);
    setReviewNotes('');
    setCancelNotes('');
    setApprovalNotes('');
    setApprovalMode(false);
    setSelectedRelieverId('');
  };

  const openApprovalMode = async () => {
    if (!selectedRequest || !onLoadReplacementGuards) return;
    setApprovalMode(true);
    await onLoadReplacementGuards(selectedRequest);
  };

  const handleApprove = async () => {
    if (!selectedRequest || !onApprove || !selectedRelieverId) return;
    const approved = await onApprove(selectedRequest, {
      relieverEmployeeId: selectedRelieverId,
      reviewNotes: approvalNotes,
    });
    if (approved) {
      closeModal();
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !onReject) return;
    const rejected = await onReject(selectedRequest, reviewNotes);
    if (rejected) {
      closeModal();
    }
  };

  const handleCancel = async () => {
    if (!selectedRequest || !onCancel) return;
    const cancelled = await onCancel(selectedRequest, cancelNotes);
    if (cancelled) {
      closeModal();
    }
  };

  const currentPage = metadata.page || 1;
  const totalPages = metadata.totalPages || 0;
  const totalRequests = metadata.total || 0;
  const pageLimit = metadata.limit || 8;
  const start = totalRequests === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const end = Math.min(currentPage * pageLimit, totalRequests);
  const selectedReplacementGuards = selectedRequest
    ? replacementGuardsByRequest[selectedRequest.id] || []
    : [];
  const isLoadingReplacementGuards = selectedRequest?.id === replacementLoadingId;
  const isApproving = actionLoadingId === `approve:${selectedRequest?.id}`;
  const isRejecting = actionLoadingId === `reject:${selectedRequest?.id}`;
  const isCancelling = actionLoadingId === `cancel:${selectedRequest?.id}`;

  if (loading && requests.length === 0) {
    return (
      <div className="hlr-list-container">
        <div className="hlr-empty-state">Loading leave requests...</div>
      </div>
    );
  }

  return (
    <div className="hlr-list-container">
      {requests.length === 0 ? (
        <div className="hlr-empty-state">No leave requests found.</div>
      ) : (
        requests.map((leave) => (
          <div
            key={leave.id}
            className="hlr-card"
            style={{ borderLeftColor: leave.borderColor, opacity: leave.opacity || 1 }}
            onClick={() => setSelectedRequest(leave)}
          >
            <div className="hlr-card-body">
              <div className="hlr-card-header">
                <div className="hlr-employee-info">
                  <div className="hlr-avatar">{leave.initials}</div>
                  <div>
                    <h3 className="hlr-employee-name">{leave.name}</h3>
                    <p className="hlr-employee-meta">{leave.empId} - {leave.role}</p>
                  </div>
                </div>
                <div className="hlr-card-status-group">
                  <span className={`hlr-badge ${leave.status}`}>
                    {leave.statusLabel}
                  </span>
                  <p className="hlr-submitted-time">
                    {getStatusIcon(leave.status)} {leave.statusMeta}
                  </p>
                </div>
              </div>

              <div className="hlr-details-grid">
                <div className="hlr-detail-cell">
                  <span className="hlr-detail-label">Leave Type</span>
                  <span className="hlr-detail-value">{leave.type}</span>
                </div>
                <div className="hlr-detail-cell">
                  <span className="hlr-detail-label">Date Range</span>
                  <span className="hlr-detail-value">{leave.dateRange}</span>
                </div>
                <div className="hlr-detail-cell">
                  <span className="hlr-detail-label">Duration</span>
                  <span className="hlr-detail-value">{leave.duration}</span>
                </div>
                <div className="hlr-detail-cell">
                  <span className="hlr-detail-label">Assigned Location</span>
                  <span className="hlr-detail-value">{leave.assignedLocation}</span>
                </div>
              </div>

              {leave.status === 'pending' && (
                <div className="hlr-reason-box">
                  <p className="hlr-reason-label">Reason</p>
                  <p className="hlr-reason-text">{leave.reason}</p>
                </div>
              )}

              <div className="hlr-card-footer">
                <div className="hlr-attachment">
                  <FaPaperclip />
                  <span>{leave.attachments}</span>
                </div>
                <button
                  className="hlr-review-btn"
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedRequest(leave);
                  }}
                  type="button"
                >
                  View Request <FaArrowRight style={{ marginLeft: '4px' }} />
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {totalRequests > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={totalRequests}
          label="requests"
          disabled={loading}
        />
      )}

      {selectedRequest && (
        <div className="hlr-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="hlr-modal-content">
            <div className="hlr-modal-header">
              <div className="hlr-header-text">
                <h2>Leave Request Review</h2>
                <p>{selectedRequest.empId}</p>
              </div>
              <button className="hlr-close-btn" onClick={closeModal} type="button">
                <FaTimes />
              </button>
            </div>

            <div className="hlr-modal-body">
              <div className="hlr-modal-emp-box">
                <div className="hlr-avatar">{selectedRequest.initials}</div>
                <div className="hlr-modal-emp-info">
                  <h3>{selectedRequest.name}</h3>
                  <p>{selectedRequest.role}</p>
                  <span className="hlr-location">{selectedRequest.location}</span>
                </div>
              </div>

              <div className="hlr-modal-grid">
                <div className="hlr-modal-cell">
                  <label>Leave Type</label>
                  <p>{selectedRequest.type}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>Duration</label>
                  <p>{selectedRequest.duration}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>Start Date</label>
                  <p>{selectedRequest.startDate}</p>
                </div>
                <div className="hlr-modal-cell">
                  <label>End Date</label>
                  <p>{selectedRequest.endDate}</p>
                </div>
              </div>

              <div>
                <span className="hlr-modal-section-label">Reason for Leave</span>
                <div className="hlr-modal-reason">
                  {selectedRequest.reason}
                </div>
              </div>

              <div>
                <span className="hlr-modal-section-label">Supporting Document</span>
                {selectedRequest.supportingDocumentUrl ? (
                  <button
                    className="hlr-document-link"
                    type="button"
                    onClick={() => onOpenDocument?.(selectedRequest)}
                  >
                    <FaPaperclip />
                    {selectedRequest.supportingDocumentOriginalName || 'Open supporting document'}
                    <FaExternalLinkAlt />
                  </button>
                ) : (
                  <div className="hlr-modal-reason">No supporting document attached.</div>
                )}
              </div>

              {selectedRequest.status === 'rejected' && (
                <div>
                  <span className="hlr-modal-section-label">Rejection Notes</span>
                  <div className="hlr-modal-reason">
                    {selectedRequest.reviewNotes || 'No rejection notes provided.'}
                  </div>
                </div>
              )}

              {selectedRequest.status === 'cancelled' && (
                <div>
                  <span className="hlr-modal-section-label">Cancellation Notes</span>
                  <div className="hlr-modal-reason">
                    {selectedRequest.reviewNotes || 'No cancellation notes provided.'}
                  </div>
                </div>
              )}

              {selectedRequest.status === 'approved' && selectedRequest.relieverName && (
                <div>
                  <span className="hlr-modal-section-label">Assigned Reliever</span>
                  <div className="hlr-modal-reason">
                    {selectedRequest.relieverName}
                    {selectedRequest.relieverEmployeeNumber
                      ? ` (${selectedRequest.relieverEmployeeNumber})`
                      : ''}
                  </div>
                </div>
              )}

              {selectedRequest.status === 'pending' && (
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

                      {isLoadingReplacementGuards ? (
                        <div className="hlr-replacement-empty">
                          <FaSpinner className="hlr-spin" /> Loading replacement guards...
                        </div>
                      ) : selectedReplacementGuards.length === 0 ? (
                        <div className="hlr-replacement-empty">
                          No replacement guards match this leave request and site location.
                        </div>
                      ) : (
                        <div className="hlr-replacement-list">
                          {selectedReplacementGuards.map((guard) => {
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

                  {!approvalMode && (
                    <div className="hlr-review-note-grid">
                      <div>
                        <span className="hlr-modal-section-label">Rejection Notes (Optional)</span>
                        <textarea
                          className="hlr-admin-notes"
                          placeholder="Add notes about this rejection..."
                          value={reviewNotes}
                          onChange={(event) => setReviewNotes(event.target.value)}
                        />
                      </div>
                      <div>
                        <span className="hlr-modal-section-label">Cancellation Notes (Optional)</span>
                        <textarea
                          className="hlr-admin-notes"
                          placeholder="Add notes about this cancellation..."
                          value={cancelNotes}
                          onChange={(event) => setCancelNotes(event.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {approvalMode && selectedRequest.status === 'pending' && (
                    <div>
                      <span className="hlr-modal-section-label">Cancellation Notes (Optional)</span>
                      <textarea
                        className="hlr-admin-notes"
                        placeholder="Add notes if this request should be cancelled instead..."
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
                        disabled={isApproving || isLoadingReplacementGuards || !selectedRelieverId}
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
                        disabled={isLoadingReplacementGuards}
                        type="button"
                      >
                        {isLoadingReplacementGuards ? (
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
                      ) : (
                        <><FaTimesCircle /> Cancel Request</>
                      )}
                    </button>
                    <button className="hlr-btn neutral" onClick={closeModal} type="button">
                      Close
                    </button>
                  </div>
                </>
              )}

              {selectedRequest.status === 'approved' && (
                <div className="hlr-modal-actions">
                  <button
                    className="hlr-btn cancel"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    type="button"
                  >
                    {isCancelling ? (
                      <><FaSpinner className="hlr-spin" /> Cancelling...</>
                    ) : (
                      <><FaTimesCircle /> Cancel Approved Leave</>
                    )}
                  </button>
                  <button className="hlr-btn neutral" onClick={closeModal} type="button">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
