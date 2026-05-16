import { useState } from 'react';
import { 
  FaClock, FaPaperclip, FaArrowRight, FaCheckCircle, 
  FaTimesCircle, FaTimes, FaCheck, FaEdit, FaChevronLeft, FaChevronRight 
} from 'react-icons/fa';

const mockLeaves = [
  {
    id: 1,
    empId: 'PRISM-2024-002',
    name: 'Ronn Rosarito',
    initials: 'RR',
    role: 'Security Guard',
    location: 'FEU Institute of Tech • Building B',
    status: 'PENDING',
    statusIcon: <FaClock className="mr-1" />,
    statusMeta: 'Submitted 2 hours ago',
    type: 'Personal / Emergency',
    dateRange: 'Feb 15 - Feb 16, 2026',
    startDate: 'Feb 15, 2026',
    endDate: 'Feb 16, 2026',
    duration: '2 Days',
    assignedLocation: 'FEU Institute of Tech',
    reason: 'Family emergency - need to attend to urgent personal matter. Will provide documentation upon return.',
    attachments: '1 Attachment',
    borderColor: '#eab308' // yellow
  },
  {
    id: 2,
    empId: 'PRISM-2024-003',
    name: 'Quervie Manrique',
    initials: 'QM',
    role: 'Lady Guard',
    location: 'SM North Edsa • Entrance 1',
    status: 'PENDING',
    statusIcon: <FaClock className="mr-1" />,
    statusMeta: 'Submitted 5 hours ago',
    type: 'Sick Leave (SL)',
    dateRange: 'Feb 10 - Feb 12, 2026',
    startDate: 'Feb 10, 2026',
    endDate: 'Feb 12, 2026',
    duration: '3 Days',
    assignedLocation: 'SM North Edsa',
    reason: 'Medical checkup and minor procedure. Medical certificate attached.',
    attachments: 'Medical Certificate Attached',
    borderColor: '#eab308'
  },
  {
    id: 3,
    empId: 'PRISM-2024-001',
    name: 'Juan Cruz',
    initials: 'JC',
    role: 'Security Officer I',
    location: 'SM Mall of Asia • HQ',
    status: 'APPROVED',
    statusIcon: <FaCheckCircle className="mr-1" />,
    statusMeta: 'Approved by President',
    type: 'Vacation Leave (VL)',
    dateRange: 'Feb 20 - Feb 22, 2026',
    startDate: 'Feb 20, 2026',
    endDate: 'Feb 22, 2026',
    duration: '3 Days',
    assignedLocation: 'SM Mall of Asia',
    reason: 'Annual family vacation to the province.',
    attachments: 'None',
    borderColor: '#22c55e', // green
    opacity: 0.75
  },
  {
    id: 4,
    empId: 'PRISM-2024-006',
    name: 'Mario Dela Cruz',
    initials: 'MD',
    role: 'Security Guard',
    location: 'SM North Edsa • Basement',
    status: 'REJECTED',
    statusIcon: <FaTimesCircle className="mr-1" />,
    statusMeta: 'Insufficient leave credits',
    type: 'Vacation Leave (VL)',
    dateRange: 'Feb 18 - Feb 25, 2026',
    startDate: 'Feb 18, 2026',
    endDate: 'Feb 25, 2026',
    duration: '7 Days',
    assignedLocation: 'SM North Edsa',
    reason: 'Planned vacation.',
    attachments: 'None',
    borderColor: '#ef4444', // red
    opacity: 0.75
  }
];

export default function HrisLeaveRequestsList() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const openModal = (request) => {
    setSelectedRequest(request);
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedRequest(null);
  };

  return (
    <div className="hlr-list-container">
      {mockLeaves.map((leave) => (
        <div 
          key={leave.id} 
          className="hlr-card" 
          style={{ borderLeftColor: leave.borderColor, opacity: leave.opacity || 1 }}
          onClick={() => openModal(leave)}
        >
          <div className="hlr-card-body">
            <div className="hlr-card-header">
              <div className="hlr-employee-info">
                <div className="hlr-avatar">{leave.initials}</div>
                <div>
                  <h3 className="hlr-employee-name">{leave.name}</h3>
                  <p className="hlr-employee-meta">{leave.empId} • {leave.role}</p>
                </div>
              </div>
              <div className="hlr-card-status-group">
                <span className={`hlr-badge ${leave.status.toLowerCase()}`}>
                  {leave.status}
                </span>
                <p className="hlr-submitted-time">
                  {leave.statusIcon} {leave.statusMeta}
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

            {leave.status === 'PENDING' && (
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
              {leave.status === 'PENDING' && (
                <button className="hlr-review-btn">
                  Review Request <FaArrowRight style={{ marginLeft: '4px' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="hlr-pagination">
        <p className="hlr-pagination-text">Showing 1-4 of 45 requests</p>
        <div className="hlr-pagination-controls">
          <button className="hlr-page-btn" disabled><FaChevronLeft /> Previous</button>
          <button className="hlr-page-btn active">1</button>
          <button className="hlr-page-btn">2</button>
          <button className="hlr-page-btn">3</button>
          <button className="hlr-page-btn">Next <FaChevronRight /></button>
        </div>
      </div>

      {/* Review Modal */}
      {activeModal && selectedRequest && (
        <div className="hlr-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="hlr-modal-content">
            <div className="hlr-modal-header">
              <div className="hlr-header-text">
                <h2>Leave Request Review</h2>
                <p>{selectedRequest.empId}</p>
              </div>
              <button className="hlr-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="hlr-modal-body">
              {/* Employee Info */}
              <div className="hlr-modal-emp-box">
                <div className="hlr-avatar">{selectedRequest.initials}</div>
                <div className="hlr-modal-emp-info">
                  <h3>{selectedRequest.name}</h3>
                  <p>{selectedRequest.role}</p>
                  <span className="hlr-location">{selectedRequest.location}</span>
                </div>
              </div>

              {/* Leave Details Grid */}
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

              {/* Reason */}
              <div>
                <span className="hlr-modal-section-label">Reason for Leave</span>
                <div className="hlr-modal-reason">
                  {selectedRequest.reason}
                </div>
              </div>

              {/* Leave Balance */}
              <div className="hlr-balance-box">
                <div className="hlr-balance-title">Leave Balance</div>
                <div className="hlr-balance-grid">
                  <div className="hlr-balance-item">
                    <span className="hlr-balance-label">Vacation Leave</span>
                    <span className="hlr-balance-value">6 days</span>
                  </div>
                  <div className="hlr-balance-item">
                    <span className="hlr-balance-label">Sick Leave</span>
                    <span className="hlr-balance-value">5 days</span>
                  </div>
                  <div className="hlr-balance-item">
                    <span className="hlr-balance-label">Personal Leave</span>
                    <span className="hlr-balance-value">3 days</span>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <span className="hlr-modal-section-label">Admin Notes (Optional)</span>
                <textarea 
                  className="hlr-admin-notes"
                  placeholder="Add notes about this leave request..."
                />
              </div>

              {/* Actions */}
              <div className="hlr-modal-actions">
                <button className="hlr-btn approve" onClick={closeModal}>
                  <FaCheck /> Approve Request
                </button>
                <button className="hlr-btn reject" onClick={closeModal}>
                  <FaTimes /> Reject Request
                </button>
                <button className="hlr-btn revise" onClick={closeModal}>
                  <FaEdit /> Request Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
