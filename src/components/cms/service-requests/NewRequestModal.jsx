import { useState, useEffect } from 'react';
import {
  FaTimes, FaTag, FaMapMarkerAlt, FaFlag, FaCommentAlt, FaPaperPlane,
  FaHashtag, FaExchangeAlt, FaClipboardList, FaShieldAlt,
} from 'react-icons/fa';
import serviceRequestsService from '@services/cms/serviceRequestsService';
import deployedGuardsService from '@services/cms/deployedGuardsService';
import { CLIENT_CREATABLE_SERVICE_REQUEST_TYPES } from '@/constants/serviceRequests';

const DEFAULT_FORM = {
  ticketType: '',
  siteId: '',
  priority: 'normal',
  additionalGuardCount: 1,
  replacementDeploymentId: '',
  description: '',
};

export default function NewRequestModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [sites, setSites] = useState([]);
  const [deployedGuards, setDeployedGuards] = useState([]);
  const [loadingDeployedGuards, setLoadingDeployedGuards] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load sites once on open
  useEffect(() => {
    if (!isOpen) return;
    setForm(DEFAULT_FORM);
    setError(null);
    serviceRequestsService.getSites()
      .then(setSites)
      .catch((err) => {
        setSites([]);
        setError(err?.response?.data?.error || 'Failed to load active sites.');
      });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || form.ticketType !== 'guard_replacement') {
      setDeployedGuards([]);
      return;
    }

    let cancelled = false;
    setLoadingDeployedGuards(true);
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
      .catch((err) => {
        if (!cancelled) setDeployedGuards([]);
        if (!cancelled) {
          setError(err?.response?.data?.error || 'Failed to load deployed guards for replacement.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDeployedGuards(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, form.ticketType, form.siteId]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'siteId') next.replacementDeploymentId = '';
      return next;
    });
  };

  const handleTypeChange = (e) => {
    const ticketType = e.target.value;
    setForm((prev) => ({
      ...prev,
      ticketType,
      additionalGuardCount: ticketType === 'additional_guard' ? prev.additionalGuardCount || 1 : 1,
      replacementDeploymentId: ticketType === 'guard_replacement' ? prev.replacementDeploymentId : '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitDisabled) return;

    if (!form.ticketType) { setError('Please select a request type.'); return; }
    if (form.ticketType === 'additional_guard') {
      const count = Number(form.additionalGuardCount);
      if (!Number.isInteger(count) || count < 1) { setError('Please enter the number of guards needed.'); return; }
    }
    if (form.ticketType === 'guard_replacement' && !form.replacementDeploymentId) {
      setError('Please select the guard to replace.');
      return;
    }
    if (!form.description.trim()) { setError('Please provide request details.'); return; }

    try {
      setSubmitting(true);
      setError(null);
      await serviceRequestsService.createServiceRequest({
        ticketType:  form.ticketType,
        siteId:      form.siteId || null,
        priority:    form.priority,
        additionalGuardCount: Number(form.additionalGuardCount),
        replacementDeploymentId: form.replacementDeploymentId || null,
        description: form.description.trim(),
      });
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const replacementGuardOptions = deployedGuards;
  const hasTypeSpecificFields = form.ticketType === 'additional_guard' || form.ticketType === 'guard_replacement';
  const additionalGuardCount = Number(form.additionalGuardCount);
  const hasValidAdditionalGuardCount =
    form.ticketType !== 'additional_guard'
    || (Number.isInteger(additionalGuardCount) && additionalGuardCount >= 1);
  const hasReplacementGuard =
    form.ticketType !== 'guard_replacement'
    || Boolean(form.replacementDeploymentId);
  const isSubmitDisabled =
    submitting
    || !form.ticketType
    || !hasValidAdditionalGuardCount
    || !hasReplacementGuard
    || !form.description.trim();

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div className="sr-modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sr-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', flexShrink: 0,
            }}>
              <FaShieldAlt />
            </div>
            <div>
              <h2>Submit New Service Request</h2>
              <p>Fill in the details below to submit your request</p>
            </div>
          </div>
          <button className="sr-modal-close" onClick={onClose} disabled={submitting} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">
          {error && (
            <div className="sr-inline-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* ── Request type ── */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaTag className="sr-form-icon" />
                Request Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="sr-input"
                value={form.ticketType}
                onChange={handleTypeChange}
                disabled={submitting}
              >
                <option value="">Select request type...</option>
                {CLIENT_CREATABLE_SERVICE_REQUEST_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* ── Site & Urgency ── */}
            <div className="sr-form-grid">
              <div className="sr-form-group">
                <label className="sr-form-label">
                  <FaMapMarkerAlt className="sr-form-icon" />
                  Site / Location
                </label>
                <select
                  className="sr-input"
                  value={form.siteId}
                  onChange={handleChange('siteId')}
                  disabled={submitting}
                >
                  <option value="">All Sites / Not site-specific</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>{s.site_name}</option>
                  ))}
                </select>
              </div>

              <div className="sr-form-group">
                <label className="sr-form-label">
                  <FaFlag className="sr-form-icon" />
                  Urgency
                </label>
                <select
                  className="sr-input"
                  value={form.priority}
                  onChange={handleChange('priority')}
                  disabled={submitting}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
            </div>

            {/* ── Type-specific fields ── */}
            {hasTypeSpecificFields && (
              <div className="sr-type-fields-box">
                <p className="sr-type-fields-label">
                  <FaClipboardList />
                  {form.ticketType === 'additional_guard' ? 'Guard Request Details' : 'Replacement Details'}
                </p>

                {form.ticketType === 'additional_guard' && (
                  <div className="sr-form-group">
                    <label className="sr-form-label">
                      <FaHashtag className="sr-form-icon" />
                      Number of Guards Needed <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="sr-input"
                      value={form.additionalGuardCount}
                      onChange={handleChange('additionalGuardCount')}
                      disabled={submitting}
                    />
                  </div>
                )}

                {form.ticketType === 'guard_replacement' && (
                  <div className="sr-form-group">
                    <label className="sr-form-label">
                      <FaExchangeAlt className="sr-form-icon" />
                      Guard to Replace <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      className="sr-input"
                      value={form.replacementDeploymentId}
                      onChange={handleChange('replacementDeploymentId')}
                      disabled={submitting || loadingDeployedGuards}
                    >
                      <option value="">
                        {loadingDeployedGuards ? 'Loading deployed guards...' : 'Select deployed guard...'}
                      </option>
                      {replacementGuardOptions.map((guard) => (
                        <option key={guard.id} value={guard.id}>
                          {guard.name} - {guard.employee_id_number} - {guard.site_name}
                        </option>
                      ))}
                    </select>
                    {!loadingDeployedGuards && replacementGuardOptions.length === 0 && (
                      <p className="sr-form-help">No active deployed guards are available for replacement.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Description ── */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaCommentAlt className="sr-form-icon" />
                Request Details <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows="4"
                placeholder="Describe your request in detail — include any relevant information that will help us process it quickly."
                className="sr-input sr-textarea"
                value={form.description}
                onChange={handleChange('description')}
                disabled={submitting}
              />
            </div>

            {/* ── Actions ── */}
            <div className="sr-modal-actions">
              <button
                type="submit"
                className="sr-btn-submit"
                disabled={isSubmitDisabled}
              >
                <FaPaperPlane /> {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
              <button
                type="button"
                className="sr-btn-cancel"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
