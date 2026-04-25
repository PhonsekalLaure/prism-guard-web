import { useState } from 'react';
import {
  FaClock, FaStar, FaStarHalfAlt, FaRegStar, FaHourglassHalf,
  FaMapMarkerAlt, FaCalendar, FaEye, FaCheck, FaTimes,
  FaTimesCircle, FaCheckCircle, FaBuilding, FaInfoCircle
} from 'react-icons/fa';

const reviewsData = [
  {
    id: 1,
    clientInitials: 'FE',
    avatarBg: '#093269',
    clientName: 'FEU Institute of Technology',
    submittedBy: 'Engr. Maria Santos',
    role: 'Head, General Services',
    date: 'Feb 15, 2026',
    rating: 4.5,
    category: 'Overall Service',
    status: 'Pending',
    content: 'Overall very satisfied with the security services provided this quarter. The guards are professional and well-trained. Response time to our requests has been consistently fast. Looking forward to continued partnership.',
    site: 'All Sites',
    period: 'Q3 2025',
    delay: '0s',
    detailedRatings: {
      guardQuality: '5.0',
      punctuality: '4.0',
      communication: '4.5',
      responsiveness: '4.5'
    }
  },
  {
    id: 2,
    clientInitials: 'AC',
    avatarBg: '#2563eb',
    clientName: 'Ayala Corporation',
    submittedBy: 'Mr. Carlos Mendoza',
    role: 'Facilities Manager',
    date: 'Feb 14, 2026',
    rating: 4.0,
    category: 'Guard Performance',
    status: 'Pending',
    content: 'The security team at Makati Tower has been performing exceptionally well. They maintain discipline and are very courteous to visitors and employees alike. Minor improvement needed in shift handover documentation.',
    site: 'Makati Tower',
    period: 'Jan 2026',
    delay: '0.1s',
    detailedRatings: {
      guardQuality: '4.0',
      punctuality: '4.5',
      communication: '3.5',
      responsiveness: '4.0'
    }
  },
  {
    id: 3,
    clientInitials: 'SM',
    avatarBg: '#9333ea',
    clientName: 'SM Prime Holdings',
    submittedBy: 'Ms. Ana Villanueva',
    role: 'Operations Head',
    date: 'Feb 12, 2026',
    rating: 3.0,
    category: 'Incident Response',
    status: 'Pending',
    content: 'The response to the shoplifting incident at SM Megamall last week could have been faster. The security team took 15 minutes to respond after the alarm was triggered. However, once on scene, they handled the situation professionally.',
    site: 'SM Megamall',
    period: 'Feb 2026',
    delay: '0.2s',
    detailedRatings: {
      guardQuality: '3.5',
      punctuality: '3.0',
      communication: '3.0',
      responsiveness: '2.5'
    }
  }
];

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} style={{ color: '#e6b215' }} />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} style={{ color: '#e6b215' }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ color: '#d1d5db' }} />);
    }
  }
  return stars;
}

export default function HrisServiceReviewsList() {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const openModal = (modalName, review = null) => {
    if (review) setSelectedReview(review);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      <div className="sr-review-list">
        {reviewsData.map((review) => (
          <div key={review.id} className="sr-review-card" style={{ animationDelay: review.delay }}>
            <div className="sr-review-card-header">
              <div className="sr-review-card-client">
                <div className="sr-review-card-avatar" style={{ backgroundColor: review.avatarBg }}>
                  {review.clientInitials}
                </div>
                <div>
                  <h4 className="sr-review-card-client-name">{review.clientName}</h4>
                  <p className="sr-review-card-meta">
                    Submitted by: {review.submittedBy} • <FaClock style={{ display: 'inline', marginBottom: '2px', marginRight: '2px' }} /> {review.date}
                  </p>
                </div>
              </div>
              <div className="sr-review-card-rating">
                <div className="sr-review-card-stars">
                  {renderStars(review.rating)}
                </div>
                <p className="sr-review-card-score">{review.rating.toFixed(1)} / 5</p>
              </div>
            </div>
            
            <div className="sr-review-card-badges">
              <span className="sr-review-badge sr-review-badge-category">{review.category}</span>
              <span className="sr-review-badge sr-review-badge-status">
                <FaHourglassHalf style={{ marginRight: '4px' }} /> {review.status}
              </span>
            </div>
            
            <p className="sr-review-card-text">{review.content}</p>
            
            <div className="sr-review-card-footer">
              <div className="sr-review-card-info">
                <span><FaMapMarkerAlt /> {review.site}</span>
                <span><FaCalendar /> Service Period: {review.period}</span>
              </div>
              <div className="sr-review-card-actions">
                <button className="sr-review-btn sr-review-btn-view" onClick={() => openModal('detail', review)}>
                  <FaEye /> View
                </button>
                <button className="sr-review-btn sr-review-btn-publish" onClick={() => openModal('publish', review)}>
                  <FaCheck /> Publish
                </button>
                <button className="sr-review-btn sr-review-btn-reject" onClick={() => openModal('reject', review)}>
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sr-review-pagination">
        <p className="sr-review-pagination-text">Showing 3 of 3 pending reviews</p>
        <div className="sr-review-pagination-controls">
          <button className="sr-review-page-btn" disabled>&lt;</button>
          <button className="sr-review-page-btn active">1</button>
          <button className="sr-review-page-btn" disabled>&gt;</button>
        </div>
      </div>

      {/* Detail Modal */}
      {activeModal === 'detail' && selectedReview && (
        <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sr-review-modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="sr-review-modal-header">
              <div className="sr-review-header-text">
                <h2>Review Details</h2>
                <p>Full review information and client feedback</p>
              </div>
              <button className="sr-review-close-btn" onClick={closeModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="sr-review-modal-body">
              {/* Client Information */}
              <div className="sr-review-form-section">
                <h3 className="sr-review-section-title">
                  <FaBuilding className="sr-review-icon-primary" />
                  Client Information
                </h3>
                
                <div className="sr-review-form-grid">
                  <div className="sr-review-form-group sr-review-col-span-2" style={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                     <div className="sr-review-card-avatar" style={{ backgroundColor: selectedReview.avatarBg, width: '56px', height: '56px', fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', borderRadius: '50%', flexShrink: 0 }}>
                       {selectedReview.clientInitials}
                     </div>
                     <div style={{ flex: 1 }}>
                       <h4 style={{ margin: '0 0 0.2rem', fontSize: '1.1rem', fontWeight: 700, color: '#1a202c' }}>{selectedReview.clientName}</h4>
                       <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>{selectedReview.submittedBy} • {selectedReview.role}</p>
                     </div>
                     <span className="sr-review-badge sr-review-badge-status" style={{ alignSelf: 'flex-start' }}>
                       <FaHourglassHalf style={{ marginRight: '4px' }} /> {selectedReview.status}
                     </span>
                  </div>
                  
                  <div className="sr-review-form-group">
                    <label>Site</label>
                    <p className="sr-review-info-value">{selectedReview.site}</p>
                  </div>
                  <div className="sr-review-form-group">
                    <label>Service Period</label>
                    <p className="sr-review-info-value">{selectedReview.period}</p>
                  </div>
                  <div className="sr-review-form-group">
                    <label>Submitted On</label>
                    <p className="sr-review-info-value">{selectedReview.date}</p>
                  </div>
                  <div className="sr-review-form-group">
                    <label>Category</label>
                    <div className="sr-review-info-value" style={{ display: 'flex', alignItems: 'center', padding: '0.6rem 1rem' }}>
                      <span className="sr-review-badge sr-review-badge-category" style={{ margin: 0 }}>{selectedReview.category}</span>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="sr-review-divider" />
              
              {/* Ratings */}
              <div className="sr-review-form-section">
                <h3 className="sr-review-section-title">
                  <FaStar className="sr-review-icon-primary" />
                  Ratings & Performance
                </h3>
                
                <div className="sr-review-form-grid">
                  <div className="sr-review-form-group sr-review-col-span-2" style={{ padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1a202c' }}>Overall Rating</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {renderStars(selectedReview.rating)}
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e6b215', marginLeft: '4px' }}>{selectedReview.rating.toFixed(1)} / 5.0</span>
                      </div>
                    </div>
                    <div className="sr-review-form-grid">
                      <div className="sr-review-form-group">
                        <label>Guard Quality</label>
                        <p className="sr-review-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaStar style={{color: '#e6b215'}}/> {selectedReview.detailedRatings.guardQuality}</p>
                      </div>
                      <div className="sr-review-form-group">
                        <label>Punctuality</label>
                        <p className="sr-review-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaStar style={{color: '#e6b215'}}/> {selectedReview.detailedRatings.punctuality}</p>
                      </div>
                      <div className="sr-review-form-group">
                        <label>Communication</label>
                        <p className="sr-review-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaStar style={{color: '#e6b215'}}/> {selectedReview.detailedRatings.communication}</p>
                      </div>
                      <div className="sr-review-form-group">
                        <label>Responsiveness</label>
                        <p className="sr-review-info-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><FaStar style={{color: '#e6b215'}}/> {selectedReview.detailedRatings.responsiveness}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="sr-review-divider" />
              
              {/* Feedback Content */}
              <div className="sr-review-form-section">
                <h3 className="sr-review-section-title">
                  <FaInfoCircle className="sr-review-icon-primary" />
                  Client Feedback
                </h3>
                <div className="sr-review-form-group">
                  <textarea 
                    className="sr-review-textarea" 
                    readOnly 
                    value={selectedReview.content} 
                    rows={4}
                    style={{ background: '#f8fafc', cursor: 'default' }}
                  />
                </div>
              </div>
              
              <hr className="sr-review-divider" />

              <div className="sr-review-modal-actions">
                <button className="sr-review-btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button className="sr-review-btn-danger" onClick={() => openModal('reject', selectedReview)}>
                  <FaTimes /> Reject
                </button>
                <button className="sr-review-btn-success" onClick={() => openModal('publish', selectedReview)}>
                  <FaCheck /> Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {activeModal === 'publish' && (
        <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sr-review-modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="sr-review-action-modal-body">
              <div className="sr-review-action-modal-flex">
                <div className="sr-review-action-icon green">
                  <FaCheckCircle />
                </div>
                <div>
                  <h3 className="sr-review-action-title">Publish Review</h3>
                  <p className="sr-review-action-desc">Are you sure you want to publish this review? It will be visible to the client and in reports.</p>
                </div>
              </div>
              <div className="sr-review-modal-actions" style={{ paddingTop: '1.5rem' }}>
                <button className="sr-review-btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="sr-review-btn-success" onClick={() => openModal('successPublish')}>
                  <FaCheck /> Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {activeModal === 'reject' && (
        <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sr-review-modal-content medium" onClick={(e) => e.stopPropagation()}>
            <div className="sr-review-action-modal-body">
              <div className="sr-review-action-modal-flex">
                <div className="sr-review-action-icon red">
                  <FaTimesCircle />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 className="sr-review-action-title">Reject Review</h3>
                  <p className="sr-review-action-desc">Please provide a reason for rejecting this review.</p>
                  <textarea 
                    className="sr-review-textarea" 
                    rows={3} 
                    placeholder="Enter reason for rejection..."
                    style={{ marginTop: '0.75rem' }}
                  ></textarea>
                </div>
              </div>
              <div className="sr-review-modal-actions" style={{ paddingTop: '1.5rem' }}>
                <button className="sr-review-btn-secondary" onClick={closeModal}>Cancel</button>
                <button className="sr-review-btn-danger" onClick={() => openModal('successReject')}>
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Publish Modal */}
      {activeModal === 'successPublish' && (
        <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sr-review-modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="sr-review-success-modal">
              <div className="sr-review-success-icon green">
                <FaCheckCircle />
              </div>
              <h3 className="sr-review-success-title">Review Published!</h3>
              <p className="sr-review-success-desc">The review has been published and is now visible to the client.</p>
              <button className="sr-review-success-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Reject Modal */}
      {activeModal === 'successReject' && (
        <div className="sr-review-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="sr-review-modal-content small" onClick={(e) => e.stopPropagation()}>
            <div className="sr-review-success-modal">
              <div className="sr-review-success-icon red">
                <FaTimesCircle />
              </div>
              <h3 className="sr-review-success-title">Review Rejected</h3>
              <p className="sr-review-success-desc">The review has been rejected and the client will be notified.</p>
              <button className="sr-review-success-btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
