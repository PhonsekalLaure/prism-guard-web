import { useState } from 'react';
import { FaPen, FaTag, FaMapMarkerAlt, FaCalendar, FaCommentAlt, FaPaperPlane } from 'react-icons/fa';
import StarRating from './StarRating';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a Category' },
  { value: 'guard-performance', label: 'Guard Performance' },
  { value: 'incident-response', label: 'Incident Response' },
  { value: 'communication', label: 'Communication' },
  { value: 'overall-service', label: 'Overall Service' },
];

const SITE_OPTIONS = [
  { value: 'all', label: 'All Sites' },
  { value: 'main-gate', label: 'Main Gate' },
  { value: 'parking', label: 'Parking Area' },
  { value: 'back-gate', label: 'Back Gate' },
];

const CATEGORY_RATINGS = [
  { key: 'guardQuality', label: 'Guard Quality' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'communication', label: 'Communication' },
  { key: 'responsiveness', label: 'Responsiveness' },
];

const defaultForm = {
  overallRating: 0,
  guardQuality: 0,
  punctuality: 0,
  communication: 0,
  responsiveness: 0,
  category: '',
  site: 'all',
  period: '2026-02',
  reviewText: '',
};

export default function SubmitReviewForm({ onSubmitSuccess }) {
  const [form, setForm] = useState(defaultForm);

  const handleRating = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClear = () => setForm(defaultForm);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSuccess?.();
  };

  return (
    <div className="srv-form-panel">
      {/* Header */}
      <div className="srv-form-header">
        <h3>
          <FaPen />
          Submit a Review
        </h3>
        <p>Share your feedback on our security services</p>
      </div>

      {/* Body */}
      <form className="srv-form-body" onSubmit={handleSubmit}>
        {/* Overall Rating */}
        <div>
          <label className="srv-rating-label">
            Overall Rating <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <StarRating
            id="overallRating"
            size="lg"
            value={form.overallRating}
            onChange={(v) => handleRating('overallRating', v)}
            showLabel
          />
        </div>

        {/* Category Ratings */}
        <div className="srv-cat-grid">
          {CATEGORY_RATINGS.map(({ key, label }) => (
            <div key={key} className="srv-cat-item">
              <label>{label}</label>
              <StarRating
                id={key}
                size="sm"
                value={form[key]}
                onChange={(v) => handleRating(key, v)}
              />
            </div>
          ))}
        </div>

        {/* Dropdown + Period Fields */}
        <div className="srv-fields-grid">
          {/* Category */}
          <div className="srv-field">
            <label className="srv-field-label">
              <FaTag className="srv-field-label-icon" />
              Review Category <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="srv-select"
              required
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Site */}
          <div className="srv-field">
            <label className="srv-field-label">
              <FaMapMarkerAlt className="srv-field-label-icon" />
              Site / Location
            </label>
            <select
              name="site"
              value={form.site}
              onChange={handleChange}
              className="srv-select"
            >
              {SITE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div className="srv-field">
            <label className="srv-field-label">
              <FaCalendar className="srv-field-label-icon" />
              Service Period
            </label>
            <input
              type="month"
              name="period"
              value={form.period}
              onChange={handleChange}
              className="srv-input"
            />
          </div>
        </div>

        {/* Review Text */}
        <div className="srv-field">
          <label className="srv-field-label">
            <FaCommentAlt className="srv-field-label-icon" />
            Your Review <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            name="reviewText"
            rows={4}
            placeholder="Share your experience with our security services. Be as specific as possible to help us improve..."
            value={form.reviewText}
            onChange={handleChange}
            className="srv-textarea"
            required
          />
          <p className="srv-char-hint">Minimum 50 characters</p>
        </div>

        {/* Footer */}
        <div className="srv-form-footer">
          <div className="srv-submitting-as">
            <span>Submitting as:</span>
            <span>FEU Institute of Technology</span>
          </div>
          <div className="srv-form-actions">
            <button type="button" className="srv-btn-clear" onClick={handleClear}>
              Clear
            </button>
            <button type="submit" className="srv-btn-submit">
              <FaPaperPlane />
              Submit Review
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}