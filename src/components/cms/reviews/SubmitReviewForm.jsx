import { useState, useEffect } from 'react';
import {
  FaPen, FaTag, FaMapMarkerAlt, FaCalendar, FaCommentAlt,
  FaPaperPlane, FaSpinner, FaShieldAlt, FaTimes,
} from 'react-icons/fa';
import StarRating from './StarRating';
import serviceReviewsService from '@/services/cms/serviceReviewsService';
import deployedGuardsService from '@/services/cms/deployedGuardsService';
import authService from '@/services/authService';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Select a Category' },
  { value: 'guard-performance', label: 'Guard Performance' },
  { value: 'incident-response', label: 'Incident Response' },
  { value: 'communication', label: 'Communication' },
  { value: 'overall-service', label: 'Overall Service' },
];

const CATEGORY_RATINGS = [
  { key: 'guardQuality', label: 'Guard Quality' },
  { key: 'punctuality', label: 'Punctuality' },
  { key: 'communication', label: 'Communication' },
  { key: 'responsiveness', label: 'Responsiveness' },
];

function getCurrentMonthValue() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(new Date());
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  return `${year}-${month}`;
}

const defaultForm = {
  overallRating: 0,
  guardQuality: 0,
  punctuality: 0,
  communication: 0,
  responsiveness: 0,
  category: '',
  siteId: '',
  reviewedEmployeeId: '',
  period: '',
  reviewText: '',
};

function isValidRating(value) {
  return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 5;
}

export default function SubmitReviewForm({
  onSubmitSuccess,
  prefill = {},
  title = 'Submit a Review',
  subtitle = 'Share your feedback on our security services',
  submitLabel = 'Submit Review',
  submissionType = 'ad_hoc',
  forcedPeriod = '',
}) {
  const [form, setForm] = useState(() => ({
    ...defaultForm,
    category: prefill.guardName ? 'guard-performance' : '',
    siteId: prefill.siteId || '',
    reviewedEmployeeId: prefill.guardId || '',
    period: forcedPeriod || '',
  }));
  const [guardPrefill, setGuardPrefill] = useState(
    prefill.guardName ? prefill : null,
  );
  const [sites, setSites] = useState([]);
  const [deployedGuards, setDeployedGuards] = useState([]);
  const [loadingGuards, setLoadingGuards] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const currentMonth = getCurrentMonthValue();

  const profile = authService.getProfile();
  const companyName = profile?.company
    || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()
    || 'Your Company';

  useEffect(() => {
    serviceReviewsService.getSites()
      .then(setSites)
      .catch(() => setSites([]));
  }, []);

  useEffect(() => {
    if (forcedPeriod) {
      setForm((prev) => ({ ...prev, period: forcedPeriod }));
    }
  }, [forcedPeriod]);

  useEffect(() => {
    if (form.category !== 'guard-performance') {
      setDeployedGuards([]);
      return;
    }

    let cancelled = false;
    setLoadingGuards(true);
    deployedGuardsService.getAllDeployedGuards(
      1,
      500,
      form.siteId
        ? { siteId: form.siteId, deploymentType: 'regular' }
        : { deploymentType: 'regular' },
    )
      .then((result) => {
        if (!cancelled) setDeployedGuards(result?.data || []);
      })
      .catch(() => {
        if (!cancelled) setDeployedGuards([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingGuards(false);
      });

    return () => {
      cancelled = true;
    };
  }, [form.category, form.siteId]);

  const handleRating = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const shouldClearGuard =
      (name === 'category' && value !== 'guard-performance')
      || name === 'siteId'
      || name === 'reviewedEmployeeId';

    if (shouldClearGuard) {
      setGuardPrefill(null);
    }

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === 'category' && value !== 'guard-performance') {
        next.reviewedEmployeeId = '';
      }

      if (name === 'siteId') {
        next.reviewedEmployeeId = '';
      }

      return next;
    });
  };

  const handleClear = () => {
    setForm({ ...defaultForm, period: forcedPeriod || '' });
    setGuardPrefill(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isValidRating(form.overallRating)) {
      setError('Please select an overall rating before submitting.');
      return;
    }

    const invalidCategoryRating = CATEGORY_RATINGS.find(({ key }) => (
      form[key] && !isValidRating(form[key])
    ));
    if (invalidCategoryRating) {
      setError(`${invalidCategoryRating.label} must be between 1 and 5 stars.`);
      return;
    }

    if (form.reviewText.trim().length < 50) {
      setError('Your review must be at least 50 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await serviceReviewsService.createServiceReview({
        overallRating: form.overallRating,
        guardQuality: form.guardQuality || null,
        punctuality: form.punctuality || null,
        communication: form.communication || null,
        responsiveness: form.responsiveness || null,
        category: form.category,
        siteId: form.siteId || null,
        reviewedEmployeeId: form.category === 'guard-performance'
          ? (form.reviewedEmployeeId || null)
          : null,
        period: form.period || null,
        submissionType,
        reviewText: form.reviewText.trim(),
      });
      setForm({ ...defaultForm, period: forcedPeriod || '' });
      setGuardPrefill(null);
      onSubmitSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="srv-form-panel">
      <div className="srv-form-header">
        <h3>
          <FaPen />
          {title}
        </h3>
        <p>{subtitle}</p>
      </div>

      {error && (
        <div className="srv-form-error" role="alert">
          {error}
        </div>
      )}

      <form className="srv-form-body" onSubmit={handleSubmit}>
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
                  .join(' - ')}
              </p>
            </div>
            <button
              type="button"
              className="srv-guard-banner-clear"
              onClick={() => {
                setGuardPrefill(null);
                setForm((prev) => ({ ...prev, reviewedEmployeeId: '' }));
              }}
              title="Clear guard selection"
            >
              <FaTimes />
            </button>
          </div>
        )}

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

        <div className="srv-fields-grid">
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

          {form.category === 'guard-performance' && (
            <div className="srv-field">
              <label className="srv-field-label">
                <FaShieldAlt className="srv-field-label-icon" />
                Reviewed Guard
              </label>
              <select
                name="reviewedEmployeeId"
                value={form.reviewedEmployeeId}
                onChange={handleChange}
                className="srv-select"
                disabled={loadingGuards}
              >
                <option value="">
                  {loadingGuards ? 'Loading deployed guards...' : 'No specific guard'}
                </option>
                {deployedGuards.map((guard) => (
                  <option key={guard.employee_id} value={guard.employee_id}>
                    {guard.name} - {guard.employee_id_number} - {guard.site_name}
                  </option>
                ))}
              </select>
              {!loadingGuards && deployedGuards.length === 0 && (
                <p className="srv-char-hint">No active deployed guards are available for the selected site.</p>
              )}
            </div>
          )}

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
              max={currentMonth}
              disabled={Boolean(forcedPeriod)}
            />
          </div>
        </div>

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
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
