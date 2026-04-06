import { useState } from 'react';
import { FaTimes, FaCamera, FaBuilding, FaMapMarkerAlt, FaSearch, FaInfoCircle, FaAddressCard, FaFileContract } from 'react-icons/fa';

export default function AddClientModal({ isOpen, onClose }) {
  const [logoPreview, setLogoPreview] = useState(null);

  if (!isOpen) return null;

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoPreview(event.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="ac-modal-overlay" onClick={onClose}>
      <div 
        className="ac-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ac-modal-header">
          <div className="ac-header-text">
            <h2>Add New Client</h2>
            <p>Register a new client and create a service contract</p>
          </div>
          <button type="button" onClick={onClose} className="ac-close-btn">
            <FaTimes />
          </button>
        </div>

        <form className="ac-modal-body" onSubmit={handleSubmit}>
          
          {/* Company Information */}
          <div className="ac-form-section">
            <h3 className="ac-section-title">
              <FaBuilding className="ac-icon-primary" />
              Company Information
            </h3>
            
            <div className="ac-form-grid">
              <div className="ac-logo-upload-group">
                <div className="ac-logo-preview">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" />
                  ) : (
                    <div className="ac-logo-placeholder">
                      <FaCamera />
                    </div>
                  )}
                </div>
                <div className="ac-logo-input">
                  <label>Company Logo / Profile Picture</label>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    className="ac-file-input"
                  />
                  <p className="ac-hint">Recommended: Square JPG/PNG, Max 5MB</p>
                </div>
              </div>
              
              <div className="ac-form-group ac-col-span-2">
                <label>Company Name *</label>
                <input type="text" className="ac-input" placeholder="Enter company name" required />
              </div>
              <div className="ac-form-group">
                <label>TIN Number *</label>
                <input type="text" className="ac-input" placeholder="123-456-789-000" required />
              </div>
              <div className="ac-form-group">
                <label>Business Registration</label>
                <input type="text" className="ac-input" placeholder="DTI/SEC Number" />
              </div>

              {/* Address Configuration */}
              <div className="ac-sub-card ac-col-span-2">
                <div className="ac-sub-card-header">
                  <p className="ac-sub-title">
                    <FaMapMarkerAlt /> Address Details
                  </p>
                  <span className="ac-badge-verified">Google Places Verified</span>
                </div>

                <div className="ac-form-grid ac-mb-3">
                  <div className="ac-form-group">
                    <label>Unit / Floor / Building Name</label>
                    <input type="text" className="ac-input" placeholder="e.g. Unit 101" />
                  </div>
                  <div className="ac-form-group">
                    <label>Search Location (Google Maps)</label>
                    <div className="ac-input-with-icon">
                      <input type="text" className="ac-input" placeholder="Search address..." />
                      <FaSearch className="ac-input-icon" />
                    </div>
                  </div>
                </div>

                {/* Auto-populated */}
                <div className="ac-auto-filled-grid">
                  {['City', 'Barangay', 'Province', 'Postal Code'].map(f => (
                    <div className="ac-auto-field" key={f}>
                      <label>{f}</label>
                      <input type="text" readOnly placeholder="Auto-filled" />
                    </div>
                  ))}
                </div>

                {/* Geofence */}
                <div className="ac-geofence-group">
                  <div className="ac-geofence-input">
                    <label>Geofence Radius (Meters) *</label>
                    <input type="number" defaultValue="50" min="10" className="ac-input ac-input-small" required />
                  </div>
                  <p className="ac-hint-italic">
                    <FaInfoCircle /> Defines the allowed GPS range for guard clock-ins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="ac-divider" />
          
          {/* Contact Information */}
          <div className="ac-form-section">
            <h3 className="ac-section-title">
              <FaAddressCard className="ac-icon-primary" />
              Contact Information
            </h3>
            <div className="ac-form-grid">
              <div className="ac-form-group ac-col-span-2">
                <label>Contact Person *</label>
                <div className="ac-multi-input-group">
                  <select className="ac-select ac-select-small">
                    <option value="">Prefix</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                  <input type="text" className="ac-input ac-flex-1" placeholder="First Name" required />
                  <input type="text" className="ac-input ac-flex-1" placeholder="Last Name" required />
                  <select className="ac-select ac-select-small">
                    <option value="">Suffix</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                  </select>
                </div>
              </div>
              <div className="ac-form-group">
                <label>Email Address *</label>
                <input type="email" className="ac-input" placeholder="contact@company.com" required />
              </div>
              <div className="ac-form-group">
                <label>Phone Number *</label>
                <input type="tel" className="ac-input" placeholder="+63 912 345 6789" required />
              </div>
            </div>
          </div>

          <hr className="ac-divider" />
          
          {/* Contract Details */}
          <div className="ac-form-section">
            <h3 className="ac-section-title">
              <FaFileContract className="ac-icon-primary" />
              Contract Details
            </h3>
            <div className="ac-form-grid">
              <div className="ac-form-group">
                <label>Contract Start Date *</label>
                <input type="date" className="ac-input" required />
              </div>
              <div className="ac-form-group">
                <label>Contract Duration *</label>
                <select className="ac-select" required>
                  <option value="">Select duration</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="5">5 Years</option>
                </select>
              </div>
              <div className="ac-form-group">
                <label>Monthly Service Fee *</label>
                <div className="ac-input-with-prefix">
                  <span className="ac-prefix">₱</span>
                  <input type="number" className="ac-input ac-pl-8" placeholder="0.00" required />
                </div>
              </div>
              <div className="ac-form-group">
                <label>Billing Cycle *</label>
                <select className="ac-select" required>
                  <option value="">Select billing cycle</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semi-annual">Semi-Annual</option>
                </select>
              </div>
              <div className="ac-form-group">
                <label>Payment Terms *</label>
                <select className="ac-select" required>
                  <option value="">Select payment terms</option>
                  <option value="net15">Net 15 Days</option>
                  <option value="net30">Net 30 Days</option>
                  <option value="net45">Net 45 Days</option>
                </select>
              </div>
              <div className="ac-form-group">
                <label>Number of Guards Required *</label>
                <input type="number" className="ac-input" placeholder="0" min="1" required />
              </div>
            </div>
          </div>

          <div className="ac-form-group mt-more">
            <label>Additional Notes</label>
            <textarea className="ac-input ac-textarea" rows="3" placeholder="Any special requirements or notes about this client..."></textarea>
          </div>

          <hr className="ac-divider" />

          {/* Action Buttons */}
          <div className="ac-modal-actions">
            <button type="submit" className="ac-btn-primary">
              <FaBuilding /> Create Client
            </button>
            <button type="button" onClick={onClose} className="ac-btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
