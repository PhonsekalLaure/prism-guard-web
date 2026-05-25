import { useNavigate } from 'react-router-dom';
import {
  FaArrowRight,
  FaCheck,
  FaClock,
  FaClipboardList,
  FaPaperclip,
  FaTimesCircle,
} from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import LeaveRequestAvatar from './LeaveRequestAvatar';

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
  onPageChange,
}) {
  const navigate = useNavigate();
  const currentPage = metadata.page || 1;
  const totalPages = metadata.totalPages || 0;
  const totalRequests = metadata.total || 0;
  const pageLimit = metadata.limit || 8;
  const start = totalRequests === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const end = Math.min(currentPage * pageLimit, totalRequests);

  const openRequest = (leave) => {
    navigate(`/leaves/${leave.id}`);
  };

  if (loading && requests.length === 0) {
    return (
      <div className="hlr-list-container">
        <div className="hlr-feed-header">
          <h3><FaClipboardList /> Leave Requests</h3>
        </div>
        <div className="hlr-feed-body">
          <div className="hlr-empty-state">Loading leave requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hlr-list-container">
      <div className="hlr-feed-header">
        <h3><FaClipboardList /> Leave Requests</h3>
        {totalRequests > 0 && (
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            {totalRequests} total
          </span>
        )}
      </div>

      <div className="hlr-feed-body">
        {requests.length === 0 ? (
          <div className="hlr-empty-state">No leave requests found.</div>
        ) : (
          requests.map((leave) => (
            <div
              key={leave.id}
              className="hlr-card"
              style={{ borderLeftColor: leave.borderColor, opacity: leave.opacity || 1 }}
              onClick={() => openRequest(leave)}
            >
              <div className="hlr-card-body">
                <div className="hlr-card-header">
                  <div className="hlr-employee-info">
                    <LeaveRequestAvatar avatarUrl={leave.avatarUrl} initials={leave.initials} />
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
                      openRequest(leave);
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
      </div>

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
    </div>
  );
}
