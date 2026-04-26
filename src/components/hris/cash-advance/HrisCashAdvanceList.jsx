import { useState } from 'react';
import {
  FaClock, FaCheckCircle, FaHandHoldingUsd, FaTimesCircle,
  FaReceipt, FaTimes, FaCheck, FaExclamationCircle, FaPaperclip,
  FaArrowRight, FaChevronLeft, FaChevronRight, FaInfoCircle,
  FaChartLine, FaFileMedical, FaFileInvoice, FaEye
} from 'react-icons/fa';

const requests = [
  {
    id: 1,
    initials: 'RR',
    name: 'Ronn Rosarito',
    empId: 'PRISM-2024-002',
    role: 'Security Guard',
    location: 'FEU Institute of Tech',
    area: 'Building B',
    status: 'PENDING',
    submittedAt: 'Submitted 2 hours ago',
    reason: 'Medical Emergency',
    reasonTag: 'emergency',
    amountLabel: 'Amount Requested',
    amount: '₱5,000',
    amountColor: '',
    avgPay: '₱8,850/cutoff',
    balance: '₱0 (No debt)',
    balanceClass: 'green',
    details: 'Emergency medical expense for family member. Hospital admission required. Will provide medical certificate and hospital bill as proof.',
    attachments: '2 Attachments (Medical cert, Hospital bill)',
    requestId: 'CA-2026-0045',
    borderColor: '#eab308',
    showReviewBtn: true,
    financialAssessment: {
      avgNet: '₱8,850',
      outstanding: '₱0',
      maxAllowable: '₱7,080',
      verdict: 'ELIGIBLE',
    },
    attachmentFiles: [
      { name: 'medical-certificate.pdf', size: '245 KB', icon: 'medical' },
      { name: 'hospital-bill.jpg', size: '892 KB', icon: 'invoice' },
    ],
  },
  {
    id: 2,
    initials: 'JC',
    name: 'Juan Cruz',
    empId: 'PRISM-2024-001',
    role: 'Security Guard',
    location: 'SM Mall of Asia',
    area: 'Main Entrance',
    status: 'APPROVED',
    submittedAt: 'Approved by President',
    reason: 'MISCELLANEOUS',
    reasonTag: 'misc',
    amountLabel: 'Amount Approved',
    amount: '₱2,000',
    amountColor: 'blue',
    approvedBy: 'President',
    repayment: 'Full (Next cutoff)',
    approvedDate: 'Feb 08, 2026',
    balance: '₱0 (No debt)',
    balanceClass: 'green',
    attachments: 'None',
    requestId: 'CA-2026-0044',
    borderColor: '#3b82f6',
    showReleaseBtn: true,
    financialAssessment: {
      avgNet: '₱7,200',
      outstanding: '₱0',
      maxAllowable: '₱5,760',
      verdict: 'ELIGIBLE',
    },
    attachmentFiles: [],
  },
  {
    id: 3,
    initials: 'MD',
    name: 'Mario Dela Cruz',
    empId: 'PRISM-2024-006',
    role: 'Security Guard',
    location: 'SM North Edsa',
    area: 'Parking Level 2',
    status: 'REJECTED',
    submittedAt: 'Exceeds credit limit',
    reason: 'MISCELLANEOUS',
    reasonTag: 'misc',
    amountLabel: 'Amount Requested',
    amount: '₱8,000',
    amountColor: 'red',
    balance: '₱3,500 (Existing)',
    balanceClass: 'yellow',
    rejectionReason: 'Exceeds credit limit',
    rejectionNote: 'Request exceeds 80% of average net pay. Employee already has ₱3,500 outstanding balance. Maximum allowable advance: ₱2,000.',
    attachments: 'None',
    requestId: 'CA-2026-0043',
    borderColor: '#ef4444',
    opacity: 0.75,
    financialAssessment: null,
    attachmentFiles: [],
  },
];

const tabs = [
  { label: 'Pending', count: 8, icon: FaClock },
  { label: 'Approved', count: 5, icon: FaCheckCircle },
  { label: 'Released', count: 15, icon: FaHandHoldingUsd },
  { label: 'Rejected', count: 2, icon: FaTimesCircle },
  { label: 'Settled', count: 18, icon: FaReceipt },
];

function ReviewModal({ request, onClose }) {
  const [repayment, setRepayment] = useState('full');

  if (!request) return null;

  return (
    <div
      className="ca-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="ca-modal">
        {/* Gradient header */}
        <div className="ca-modal-header">
          <div>
            <h2>Cash Advance Request Review</h2>
            <p>Request ID: {request.requestId}</p>
          </div>
          <button className="ca-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="ca-modal-body">
          {/* Employee Info */}
          <div className="ca-modal-emp-box">
            <div className="ca-modal-emp-left">
              <div className="ca-modal-avatar">{request.initials}</div>
              <div className="ca-modal-emp-info">
                <h3>{request.name}</h3>
                <p>{request.role} • {request.empId}</p>
                <span>{request.location} — {request.area}</span>
              </div>
            </div>
            <span className={`ca-badge ${request.status.toLowerCase()}`}>
              {request.status}
            </span>
          </div>

          {/* Amount & Reason */}
          <div className="ca-modal-grid">
            <div className="ca-modal-cell">
              <label>{request.amountLabel}</label>
              <p>{request.amount}</p>
            </div>
            <div className="ca-modal-cell">
              <label>Reason</label>
              <p className="normal">{request.reason}</p>
            </div>
          </div>

          {/* Financial Assessment (only for non-rejected) */}
          {request.financialAssessment && (
            <div className="ca-assessment-box">
              <h4><FaChartLine style={{ color: '#093269' }} /> Financial Assessment</h4>
              <div className="ca-assessment-row">
                <span>Average Net Pay (Last 3 cutoffs)</span>
                <span>{request.financialAssessment.avgNet}</span>
              </div>
              <div className="ca-assessment-row">
                <span>Current Outstanding Balance</span>
                <span style={{ color: '#16a34a' }}>{request.financialAssessment.outstanding}</span>
              </div>
              <div className="ca-assessment-row">
                <span>Maximum Allowable Advance (80%)</span>
                <span>{request.financialAssessment.maxAllowable}</span>
              </div>
              <div className="ca-assessment-row total">
                <span style={{ fontWeight: 700, color: '#1f2937' }}>Credit Assessment</span>
                <span>{request.financialAssessment.verdict}</span>
              </div>
            </div>
          )}

          {/* Rejection note */}
          {request.rejectionNote && (
            <div className="ca-rejected-box">
              <p><FaExclamationCircle style={{ flexShrink: 0, marginTop: '2px' }} /> {request.rejectionNote}</p>
            </div>
          )}

          {/* Request details narrative */}
          {request.details && (
            <div>
              <span className="ca-modal-section-label">Request Details</span>
              <div className="ca-modal-narrative">{request.details}</div>
            </div>
          )}

          {/* Attachments */}
          {request.attachmentFiles && request.attachmentFiles.length > 0 && (
            <div>
              <span className="ca-modal-section-label">Attachments</span>
              {request.attachmentFiles.map((file, i) => (
                <div key={i} className="ca-modal-attachment">
                  <div className="ca-modal-attachment-left">
                    {file.icon === 'medical' ? <FaFileMedical /> : <FaFileInvoice />}
                    <div>
                      <p>{file.name}</p>
                      <span>{file.size}</span>
                    </div>
                  </div>
                  <button className="ca-view-file-btn"><FaEye /> View</button>
                </div>
              ))}
            </div>
          )}

          {/* Repayment plan (only for pending) */}
          {request.status === 'PENDING' && (
            <div>
              <span className="ca-modal-section-label">Repayment Plan</span>
              <div className="ca-repayment-grid">
                <label
                  className={`ca-repayment-option ${repayment === 'full' ? 'selected' : ''}`}
                  onClick={() => setRepayment('full')}
                >
                  <input type="radio" name="repayment" checked={repayment === 'full'} readOnly />
                  <div>
                    <p>Full Deduction</p>
                    <span>{request.amount} deducted next cutoff</span>
                  </div>
                </label>
                <label
                  className={`ca-repayment-option ${repayment === 'installment' ? 'selected' : ''}`}
                  onClick={() => setRepayment('installment')}
                >
                  <input type="radio" name="repayment" checked={repayment === 'installment'} readOnly />
                  <div>
                    <p>Installment</p>
                    <span>Split across 2 cutoffs</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <span className="ca-modal-section-label">Admin Notes (Optional)</span>
            <textarea
              className="ca-modal-textarea"
              rows={3}
              placeholder="Add any notes about this request..."
            />
          </div>

          {/* Action Buttons */}
          <div className="ca-modal-actions">
            {request.status === 'PENDING' && (
              <>
                <button className="ca-btn approve" onClick={onClose}>
                  <FaCheck /> Approve Request
                </button>
                <button className="ca-btn reject" onClick={onClose}>
                  <FaTimes /> Reject Request
                </button>
              </>
            )}
            {request.status === 'APPROVED' && (
              <button className="ca-btn approve" onClick={onClose}>
                <FaHandHoldingUsd /> Mark as Released
              </button>
            )}
            <button className="ca-btn secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HrisCashAdvanceList() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div>
      {/* Tabs */}
      <div className="ca-tabs-bar">
        {tabs.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <button
              key={i}
              className={`ca-tab-btn ${activeTab === i ? 'active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              <Icon /> {tab.label} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      <div className="ca-list">
        {requests.map((req) => (
          <div
            key={req.id}
            className="ca-card"
            style={{
              borderLeftColor: req.borderColor,
              opacity: req.opacity || 1,
              animationDelay: `${req.id * 0.05}s`,
            }}
            onClick={() => setSelectedRequest(req)}
          >
            {/* Card Header */}
            <div className="ca-card-header">
              <div className="ca-card-emp">
                <div className="ca-avatar">{req.initials}</div>
                <div>
                  <p className="ca-emp-name">
                    {req.name}
                    {req.reasonTag === 'emergency' && (
                      <span className="ca-reason-tag emergency">
                        <FaExclamationCircle style={{ marginRight: '3px' }} /> EMERGENCY
                      </span>
                    )}
                    {req.reasonTag === 'tuition' && (
                      <span className="ca-reason-tag tuition">TUITION</span>
                    )}
                  </p>
                  <p className="ca-emp-meta">{req.empId} • {req.role}</p>
                  <p className="ca-emp-location">{req.location}</p>
                </div>
              </div>

              <div className="ca-card-status">
                <span className={`ca-badge ${req.status.toLowerCase()}`}>
                  {req.status}
                </span>
                <p>
                  {req.status === 'PENDING' && <FaClock />}
                  {req.status === 'APPROVED' && <FaCheckCircle />}
                  {req.status === 'REJECTED' && <FaTimesCircle />}
                  {req.submittedAt}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="ca-card-info">
              <div>
                <p className="ca-info-label">{req.amountLabel}</p>
                <p className={`ca-info-value amount ${req.amountColor}`}>{req.amount}</p>
              </div>
              <div>
                <p className="ca-info-label">{req.approvedBy ? 'Approved By' : 'Reason'}</p>
                <p className="ca-info-value">{req.approvedBy || req.reason}</p>
              </div>
              <div>
                <p className="ca-info-label">{req.repayment ? 'Repayment' : (req.rejectionReason ? 'Rejection Reason' : 'Avg. Net Pay')}</p>
                <p className={`ca-info-value ${req.rejectionReason ? 'red' : ''}`}>
                  {req.repayment || req.rejectionReason || req.avgPay || '—'}
                </p>
              </div>
              <div>
                <p className="ca-info-label">{req.approvedDate ? 'Approved Date' : 'Current Balance'}</p>
                <p className={`ca-info-value ${req.balanceClass || ''}`}>
                  {req.approvedDate || req.balance}
                </p>
              </div>
            </div>

            {/* Details Box */}
            {req.details && (
              <div className="ca-details-box">
                <p className="label">Request Details</p>
                <p className="text">{req.details}</p>
              </div>
            )}

            {/* Approved ready-for-disbursement box */}
            {req.showReleaseBtn && (
              <div className="ca-approved-box">
                <p><FaInfoCircle /> Cash ready for disbursement</p>
                <button
                  className="ca-release-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaHandHoldingUsd /> Mark as Released
                </button>
              </div>
            )}

            {/* Rejected box */}
            {req.rejectionNote && (
              <div className="ca-rejected-box">
                <p>
                  <FaExclamationCircle style={{ flexShrink: 0, marginTop: '2px' }} />
                  {req.rejectionNote}
                </p>
              </div>
            )}

            {/* Card Footer */}
            {req.showReviewBtn && (
              <div className="ca-card-footer">
                <div className="ca-attachment">
                  <FaPaperclip /> <span>{req.attachments}</span>
                </div>
                <button
                  className="ca-review-btn"
                  onClick={(e) => { e.stopPropagation(); setSelectedRequest(req); }}
                >
                  Review Request <FaArrowRight />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="ca-pagination">
        <p className="ca-pagination-text">Showing 1-3 of 8 pending requests</p>
        <div className="ca-pagination-controls">
          <button className="ca-page-btn" disabled>
            <FaChevronLeft /> Previous
          </button>
          <button className="ca-page-btn active">1</button>
          <button className="ca-page-btn">2</button>
          <button className="ca-page-btn">
            Next <FaChevronRight />
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {selectedRequest && (
        <ReviewModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
}
