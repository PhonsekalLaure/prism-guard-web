import { useState, useEffect } from 'react';
import { FaPen, FaTag, FaMapMarkerAlt, FaCalendar, FaCommentAlt, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import StarRating from './StarRating';
import serviceReviewsService from '@/services/cms/serviceReviewsService';
import authService from '@/services/authService';

const CATEGORY_OPTIONS = [
  { value: '',                  label: 'Select a Category' },
  { value: 'guard-performance', label: 'Guard Performance' },
  { value: 'incident-response', label: 'Incident Response' },
  { value: 'communication',     label: 'Communication' },
  { value: 'overall-service',   label: 'Overall Service' },
];

const CATEGORY_RATINGS = [
  { key: 'guardQuality',   label: 'Guard Quality' },
  { key: 'punctuality',    label: 'Punctuality' },
  { key: 'communication',  label: 'Communication' },
  { key: 'responsiveness', label: 'Responsiveness' },
];

const defaultForm = {
  overallRating:  0,
  guardQuality:   0,
  punctuality:    0,
  communication:  0,
  responsiveness: 0,
  category:       '',
  siteId:         '',
  period:         '',
  reviewText:     '',
};

export default function SubmitReviewForm({ onSubmitSuccess }) {
  const [form, setForm]       = useState(defaultForm);
  const [sites, setSites]     = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]     = useState(null);

  // Derive company name from stored profile
  const profile     = authService.getProfile();
  const companyName = profile?.company || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Your Company';

  // Load client sites for dropdown
  useEffect(() => {
    serviceReviewsService.getSites()
      .then(setSites)
      .catch(() => setSites([]));
  }, []);

  const handleRating = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClear = () => {
    setForm(defaultForm);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side guard
    if (!form.overallRating) {
      setError('Please select an overall rating before submitting.');
      return;
    }
    if (form.reviewText.trim().length < 50) {
      setError('Your review must be at least 50 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await serviceReviewsService.createServiceReview({
        overallRating:  form.overallRating,
        guardQuality:   form.guardQuality   || null,
        punctuality:    form.punctuality    || null,
        communication:  form.communication  || null,
        responsiveness: form.responsiveness || null,
        category:       form.category,
        siteId:         form.siteId || null,
        period:         form.period || null,
        reviewText:     form.reviewText.trim(),
      });
      setForm(defaultForm);
      onSubmitSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
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

      {/* Error Banner */}
      {error && (
        <div className="srv-form-error" role="alert">
          {error}
        </div>
      )}

      {/* Body */}
      <form className="srv-form-body" onSubmit={handleSubmit}>

        {/* Guard pre-fill banner */}
        {guardPrefill && (
          <div className="srv-guard-banner">
            <div className="srv-guard-banner-icon">
              <FaShieldAlt />
            </div>
            <div className="srv-guard-banner-info">
              <p className="srv-guard-banner-label">Reviewing Guard</p>
              <p className="srv-guard-banner-name">{guardPrefill.guardName}</p>
              <p className="srv-guard-banner-meta">
                {[guardPrefill.guardEmployeeId, guardPrefill.siteName]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </div>
            <button
              type="button"
              className="srv-guard-banner-clear"
              onClick={() => setGuardPrefill(null)}
              title="Clear guard selection"
            >
              <FaTimes />
            </button>
          </div>
        )}

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
              name="siteId"
              value={form.siteId}
              onChange={handleChange}
              className="srv-select"
            >
              <option value="">All Sites</option>
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.site_name}
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
            placeholder={
              guardPrefill
                ? `Share your experience with ${guardPrefill.guardName}. How was their performance, punctuality, and professionalism?`
                : 'Share your experience with our security services. Be as specific as possible to help us improve...'
            }
            value={form.reviewText}
            onChange={handleChange}
            className="srv-textarea"
            required
            minLength={50}
          />
          <p className="srv-char-hint">
            Minimum 50 characters
            {form.reviewText.length > 0 && (
              <span style={{ marginLeft: '0.5rem', opacity: 0.7 }}>
                ({form.reviewText.length} / 50)
              </span>
            )}
          </p>
        </div>

        {/* Footer */}
        <div className="srv-form-footer">
          <div className="srv-submitting-as">
            <span>Submitting as:</span>
            <span>{companyName}</span>
          </div>
          <div className="srv-form-actions">
            <button
              type="button"
              className="srv-btn-clear"
              onClick={handleClear}
              disabled={submitting}
            >
              Clear
            </button>
            <button
              type="submit"
              className="srv-btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="srv-spinner" />
                  Submitting…
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  Submit Review
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}