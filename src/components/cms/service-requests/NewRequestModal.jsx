import { FaTimes, FaTag, FaMapMarkerAlt, FaFlag, FaCommentAlt, FaPaperclip, FaPaperPlane, FaSave, FaCloudUploadAlt } from 'react-icons/fa';

export default function NewRequestModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div
        className="sr-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sr-modal-header">
          <div>
            <h2>Submit New Service Request</h2>
            <p>Fill in request details below</p>
          </div>
          <button className="sr-modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">
          <form onSubmit={handleSubmit}>
            {/* Request Type */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaTag className="sr-form-icon" />
                Request Type
              </label>
              <select className="sr-input">
                <option value="">Select request type...</option>
                <option value="general">General Inquiry</option>
                <option value="replacement">Replacement of Guards</option>
                <option value="additional">Additional Guard</option>
                <option value="schedule">Schedule Change</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Site & Urgency */}
            <div className="sr-form-grid">
              <div className="sr-form-group">
                <label className="sr-form-label">
                  <FaMapMarkerAlt className="sr-form-icon" />
                  Site / Location
                </label>
                <select className="sr-input">
                  <option value="">Select site...</option>
                  <option value="main-gate">Main Gate</option>
                  <option value="parking">Parking Area</option>
                  <option value="back-gate">Back Gate</option>
                </select>
              </div>

              <div className="sr-form-group">
                <label className="sr-form-label">
                  <FaFlag className="sr-form-icon" />
                  Urgency
                </label>
                <select className="sr-input">
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* Request Details */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaCommentAlt className="sr-form-icon" />
                Request Details
              </label>
              <textarea
                rows="4"
                placeholder="Describe your request in detail..."
                className="sr-input sr-textarea"
              />
            </div>

            {/* Attachments */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaPaperclip className="sr-form-icon" />
                Attachments (Optional)
              </label>
              <div className="sr-upload-zone">
                <FaCloudUploadAlt className="sr-upload-icon" />
                <p className="sr-upload-text">
                  Drag &amp; drop files or <span className="sr-upload-link">browse</span>
                </p>
                <p className="sr-upload-hint">PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            {/* Actions */}
            <div className="sr-modal-actions">
              <button type="submit" className="sr-btn-submit">
                <FaPaperPlane /> Submit Request
              </button>
              <button type="button" className="sr-btn-draft">
                <FaSave /> Save as Draft
              </button>
              <button type="button" className="sr-btn-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}