import { useState, useEffect } from 'react';
import { FaTimes, FaTag, FaMapMarkerAlt, FaFlag, FaCommentAlt, FaPaperPlane, FaSave } from 'react-icons/fa';
import serviceRequestsService from '@services/serviceRequestsService';

const TICKET_TYPES = [
  { value: 'additional_guard',   label: 'Additional Guard' },
  { value: 'guard_replacement',  label: 'Guard Replacement' },
  { value: 'schedule_change',    label: 'Schedule Change' },
  { value: 'general_inquiry',    label: 'General Inquiry' },
  { value: 'operations',         label: 'Operations' },
  { value: 'billing',            label: 'Billing' },
  { value: 'incident_followup',  label: 'Incident Followup' },
  { value: 'contract_closeout',  label: 'Contract Closeout' },
  { value: 'client_request',     label: 'Client Request' },
];

const DEFAULT_FORM = {
  ticketType: '',
  siteId: '',
  priority: 'normal',
  description: '',
};

export default function NewRequestModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [sites, setSites] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load sites once on open
  useEffect(() => {
    if (!isOpen) return;
    setForm(DEFAULT_FORM);
    setError(null);
    serviceRequestsService.getSites()
      .then(setSites)
      .catch(() => setSites([]));
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.ticketType) { setError('Please select a request type.'); return; }
    if (!form.description.trim()) { setError('Please provide request details.'); return; }

    try {
      setSubmitting(true);
      setError(null);
      await serviceRequestsService.createServiceRequest({
        ticketType:  form.ticketType,
        siteId:      form.siteId || null,
        priority:    form.priority,
        description: form.description.trim(),
      });
      onSuccess?.();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    // Draft = submit with status hint; for now same as submit — UI affordance only
    await handleSubmit({ preventDefault: () => {} });
  };

  return (
    <div className="sr-modal-overlay" onClick={onClose}>
      <div className="sr-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sr-modal-header">
          <div>
            <h2>Submit New Service Request</h2>
            <p>Fill in request details below</p>
          </div>
          <button className="sr-modal-close" onClick={onClose} disabled={submitting}>
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="sr-modal-body">
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.7rem 1rem', color: '#dc2626', fontSize: '0.82rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Request Type */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaTag className="sr-form-icon" />
                Request Type <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <select
                className="sr-input"
                value={form.ticketType}
                onChange={handleChange('ticketType')}
                disabled={submitting}
              >
                <option value="">Select request type...</option>
                {TICKET_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Site & Urgency */}
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

            {/* Request Details */}
            <div className="sr-form-group">
              <label className="sr-form-label">
                <FaCommentAlt className="sr-form-icon" />
                Request Details <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows="4"
                placeholder="Describe your request in detail..."
                className="sr-input sr-textarea"
                value={form.description}
                onChange={handleChange('description')}
                disabled={submitting}
              />
            </div>

            {/* Actions */}
            <div className="sr-modal-actions">
              <button
                type="submit"
                className="sr-btn-submit"
                disabled={submitting}
              >
                <FaPaperPlane /> {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
              <button
                type="button"
                className="sr-btn-draft"
                disabled={submitting}
                onClick={handleSaveDraft}
              >
                <FaSave /> Save as Draft
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