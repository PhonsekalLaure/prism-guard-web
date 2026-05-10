import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { FaArrowLeft, FaBars, FaUserPlus, FaPaperPlane, FaEye, FaCheck, FaComments, FaTimes } from 'react-icons/fa';
import DeployEmployeeDialog from '@hris-components/employees/DeployEmployeeDialog';
import serviceRequestsService from '@services/hris/serviceRequestsService';
import employeeService from '@services/hris/employeeService';
import clientService from '@services/hris/clientService';
import '../../styles/hris/HrisServiceRequests.css';

const DEFAULT_DEPLOY_FORM = {
  siteId: '',
  baseSalary: '',
  contractStartDate: '',
  contractEndDate: '',
  daysOfWeek: [],
  shiftStart: '',
  shiftEnd: '',
  deploymentOrderFile: null,
};

function isEarlierDate(start, end) {
  return start && end && new Date(end) < new Date(start);
}

function isAfterDate(date, maxDate) {
  return date && maxDate && new Date(date) > new Date(maxDate);
}

function timelineIcon(dotClass) {
  if (dotClass === 'blue') return <FaPaperPlane />;
  if (dotClass === 'yellow') return <FaEye />;
  return <FaCheck />;
}

function ThreadMessage({ message }) {
  const roleClass = message.sender_role === 'admin' ? 'admin' : 'client';
  return (
    <div className={`sr-thread-msg ${roleClass}`}>
      <div className="sr-thread-msg-header">
        <div className="sr-thread-msg-avatar">{message.sender_initials}</div>
        <div>
          <p className="sr-thread-msg-name">
            {message.sender_name} <span className="sr-thread-msg-role">{message.sender_label}</span>
          </p>
          <p className="sr-thread-msg-time">{message.date}</p>
        </div>
      </div>
      <p className="sr-thread-msg-text">{message.message}</p>
    </div>
  );
}

function AdditionalGuardEmployeePicker({
  isOpen,
  employees,
  selectedEmployeeId,
  loading,
  onSelect,
  onCancel,
  onContinue,
}) {
  if (!isOpen) return null;
  return (
    <div className="sr-modal-overlay" onClick={onCancel}>
      <div className="sr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="sr-modal-header">
          <div>
            <h2>Select Additional Guard</h2>
            <p>Choose the guard to deploy for this request</p>
          </div>
        </div>
        <div className="sr-modal-body">
          <div className="sr-description-box">
            <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Available Guard</p>
            <select
              className="sr-filter-select"
              value={selectedEmployeeId}
              onChange={(e) => onSelect(e.target.value)}
              disabled={loading}
            >
              <option value="">Select deployable guard...</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} - {emp.employee_id_number}
                </option>
              ))}
            </select>
            {!loading && employees.length === 0 && (
              <p className="sr-description-text" style={{ marginTop: '0.75rem' }}>
                No deployable guards are currently available.
              </p>
            )}
          </div>
          <div className="sr-modal-actions">
            <button className="sr-modal-btn gray" onClick={onCancel} disabled={loading}>Cancel</button>
            <button className="sr-modal-btn blue" onClick={onContinue} disabled={loading || !selectedEmployeeId}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServiceRequestDetailPage() {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const { toggleSidebar } = useOutletContext();

  // ── Request state ────────────────────────────────────────────────────────
  const [request,       setRequest]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error,         setError]         = useState(null);

  // ── Resolution notes local state ─────────────────────────────────────────
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionError, setResolutionError] = useState(null);
  const [showResolvePanel, setShowResolvePanel] = useState(false);
  const [messageText,     setMessageText]     = useState('');
  const [messageError,    setMessageError]    = useState(null);

  // ── Additional guard fulfillment state ───────────────────────────────────
  const [showGuardPicker,    setShowGuardPicker]    = useState(false);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [selectedEmployeeId,  setSelectedEmployeeId]  = useState('');
  const [sitesList,          setSitesList]          = useState([]);
  const [deployForm,         setDeployForm]         = useState(DEFAULT_DEPLOY_FORM);
  const [showDeployModal,    setShowDeployModal]    = useState(false);
  const [isDeploying,        setIsDeploying]        = useState(false);

  // ── Fetch the request ────────────────────────────────────────────────────
  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const detail = await serviceRequestsService.getServiceRequestById(id);
      setRequest(detail);
      setResolutionNotes(detail?.resolution_notes || '');
      setShowResolvePanel(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load service request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRequest(); }, [fetchRequest]);

  // ── Status change ────────────────────────────────────────────────────────
  const handleStatusChange = useCallback(async (status) => {
    if (status === 'resolved' && !resolutionNotes.trim()) {
      setResolutionError('Resolution notes are required before resolving this request.');
      return;
    }
    setResolutionError(null);
    try {
      setActionLoading(true);
      const updated = await serviceRequestsService.updateStatus(
        id,
        status,
        status === 'resolved' ? resolutionNotes.trim() : undefined,
      );
      setRequest(updated);
      setResolutionNotes(updated?.resolution_notes || '');
      setShowResolvePanel(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update service request.');
    } finally {
      setActionLoading(false);
    }
  }, [id, resolutionNotes]);

  // ── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = useCallback(async () => {
    if (!messageText.trim()) {
      setMessageError('Message is required.');
      return;
    }
    try {
      setMessageError(null);
      setMessageLoading(true);
      await serviceRequestsService.sendMessage(id, messageText.trim());
      setMessageText('');
      await fetchRequest();
    } catch (err) {
      setMessageError(err?.response?.data?.error || 'Failed to send message.');
    } finally {
      setMessageLoading(false);
    }
  }, [id, messageText, fetchRequest]);

  // ── Additional guard fulfillment ─────────────────────────────────────────
  const handleOpenAdditionalGuardFulfillment = useCallback(async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
      const [employees, sites] = await Promise.all([
        employeeService.getDeployableEmployees(),
        clientService.getAllSitesList(),
      ]);
      setDeployableEmployees(employees || []);
      setSitesList((sites || []).filter((site) => (
        request?.site_id ? site.id === request.site_id : site.client_id === request?.client_id
      )));
      setShowGuardPicker(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to prepare additional guard deployment.');
    } finally {
      setActionLoading(false);
    }
  }, [request]);

  const selectedEmployee         = deployableEmployees.find((e) => e.id === selectedEmployeeId) || null;
  const selectedDeploymentSite   = sitesList.find((s) => s.id === deployForm.siteId);
  const selectedClientContractEndDate = selectedDeploymentSite?.client_contract_end_date || null;

  const handleContinueAdditionalGuardDeploy = useCallback(() => {
    if (!selectedEmployee) return;
    setDeployForm({
      ...DEFAULT_DEPLOY_FORM,
      siteId: request?.site_id || '',
      baseSalary: selectedEmployee.base_salary || '',
    });
    setShowGuardPicker(false);
    setShowDeployModal(true);
  }, [selectedEmployee, request]);

  const toggleScheduleDay = useCallback((dayValue) => {
    setDeployForm((cur) => ({
      ...cur,
      daysOfWeek: cur.daysOfWeek.includes(dayValue)
        ? cur.daysOfWeek.filter((d) => d !== dayValue)
        : [...cur.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  }, []);

  const handleDeployAdditionalGuard = useCallback(async () => {
    if (!request || !selectedEmployee) return;
    if (!deployForm.siteId)                                         { setError('Please select a client site.'); return; }
    if (!deployForm.baseSalary || Number(deployForm.baseSalary) <= 0) { setError('Please set the guard monthly base pay.'); return; }
    if (isEarlierDate(deployForm.contractStartDate, deployForm.contractEndDate)) { setError('Deployment contract end date cannot be earlier than deployment contract start date.'); return; }
    if (isAfterDate(deployForm.contractEndDate, selectedClientContractEndDate))  { setError(`Deployment contract end date cannot be later than the client contract end date (${selectedClientContractEndDate}).`); return; }
    if (deployForm.daysOfWeek.length === 0)                         { setError('Please select at least one schedule day.'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd)             { setError('Please set both shift start and shift end time.'); return; }
    if (!deployForm.deploymentOrderFile)                            { setError('Please upload the deployment order document.'); return; }

    try {
      setIsDeploying(true);
      setError(null);
      const payload = new FormData();
      payload.append('employeeId', selectedEmployee.id);
      payload.append('siteId', deployForm.siteId);
      payload.append('baseSalary', deployForm.baseSalary);
      if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
      if (deployForm.contractEndDate)   payload.append('contractEndDate',   deployForm.contractEndDate);
      deployForm.daysOfWeek.forEach((day) => payload.append('daysOfWeek', String(day)));
      payload.append('shiftStart', deployForm.shiftStart);
      payload.append('shiftEnd',   deployForm.shiftEnd);
      payload.append('document_deployment_order', deployForm.deploymentOrderFile);

      await serviceRequestsService.deployAdditionalGuard(request.id, payload);
      await fetchRequest();
      setShowDeployModal(false);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to deploy additional guard.');
    } finally {
      setIsDeploying(false);
    }
  }, [request, selectedEmployee, deployForm, selectedClientContractEndDate, fetchRequest]);

  // ── Derived values ───────────────────────────────────────────────────────
  const canMessage             = ['open', 'in_progress'].includes(request?.status);
  const messages               = request?.messages || [];
  const canFulfillAdditionalGuard = request?.ticket_type === 'additional_guard' && canMessage;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      {/* Topbar */}
      <header className="dashboard-topbar">
        <div className="topbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-toggle" onClick={toggleSidebar}><FaBars /></button>
            <button className="ep-back-btn" onClick={() => navigate('/service-request')}>
              <FaArrowLeft /> Back to Service Requests
            </button>
          </div>
        </div>
      </header>

      {/* Page body */}
      <div className="dashboard-content">
        {error && <div className="sr-error-banner">{error}</div>}

        {loading ? (
          <div className="sr-table-card sr-detail-page-card">
            <div className="sr-modal-body">
              <p className="sr-description-text">Loading service request...</p>
            </div>
          </div>
        ) : !request ? (
          <div className="sr-table-card sr-detail-page-card">
            <div className="sr-modal-body">
              <p className="sr-description-text">Service request not found.</p>
            </div>
          </div>
        ) : (
          <div className="sr-table-card sr-detail-page-card">
            {/* Header band */}
            <div className="sr-modal-header">
              <div>
                <h2>Service Request Details</h2>
                <p>{request.request_id} — {request.client}</p>
              </div>
            </div>

            <div className="sr-modal-body">
              {/* Badges */}
              <div className="sr-modal-badges">
                <span className={`sr-modal-badge ${request.statusClass || request.status}`}>{request.statusLabel}</span>
                <span className={`sr-modal-badge ${request.urgency}`}>{request.urgencyLabel}</span>
                <span className="sr-modal-badge type">{request.type}</span>
              </div>

              {/* Client info */}
              <div className="sr-client-box">
                <p className="sr-client-box-label">Client Information</p>
                <div className="sr-client-box-inner">
                  <div className="sr-client-box-avatar">{request.clientInitials}</div>
                  <div>
                    <p className="sr-client-box-name">{request.client}</p>
                    <p className="sr-client-box-sub">{request.site}</p>
                  </div>
                </div>
              </div>

              {/* Detail grid */}
              <div className="sr-detail-grid">
                <div className="sr-detail-cell">
                  <p className="sr-detail-label">Site / Location</p>
                  <p className="sr-detail-value">{request.site}</p>
                </div>
                <div className="sr-detail-cell">
                  <p className="sr-detail-label">Date Submitted</p>
                  <p className="sr-detail-value">{request.date}</p>
                </div>
              </div>

              {/* Description */}
              <div className="sr-description-box">
                <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Request Description</p>
                <p className="sr-description-text">{request.description || 'No description provided.'}</p>
              </div>

              {/* Existing resolution notes (read-only once resolved) */}
              {request.status === 'resolved' && request.resolution_notes && (
                <div className="sr-description-box">
                  <p className="sr-detail-label" style={{ marginBottom: '0.4rem' }}>Resolution Notes</p>
                  <p className="sr-description-text">{request.resolution_notes}</p>
                </div>
              )}

              {/* Timeline */}
              {request.timeline?.length > 0 && (
                <div>
                  <p className="sr-timeline-title">Request Timeline</p>
                  <div className="sr-timeline">
                    {request.timeline.map((item, i) => (
                      <div key={`${item.label}-${i}`} className={`sr-timeline-item${item.faded ? ' faded' : ''}`}>
                        <div className={`sr-timeline-dot ${item.dotClass}`}>
                          {timelineIcon(item.dotClass)}
                        </div>
                        <div>
                          <p className="sr-timeline-label">{item.label}</p>
                          {item.sub && <p className="sr-timeline-sub">{item.sub}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Conversation thread */}
              <div>
                <p className="sr-thread-title">
                  <FaComments /> Conversation
                </p>
                {messages.length > 0 ? (
                  <div className="sr-thread">
                    {messages.map((msg) => <ThreadMessage key={msg.id} message={msg} />)}
                  </div>
                ) : (
                  <p className="sr-description-text">No messages yet.</p>
                )}
                {canMessage && (
                  <div className="sr-reply-box">
                    <label className="sr-reply-label">Reply to client</label>
                    <textarea
                      className="sr-reply-textarea"
                      rows={3}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      disabled={messageLoading}
                      placeholder="Write a message to the client..."
                    />
                    {messageError && <p className="sr-field-error">{messageError}</p>}
                    <div className="sr-reply-actions">
                      <span />
                      <button
                        type="button"
                        className="sr-modal-btn blue"
                        disabled={messageLoading}
                        onClick={handleSendMessage}
                      >
                        <FaPaperPlane /> {messageLoading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {showResolvePanel && (
                <div className="sr-resolve-panel">
                  <div className="sr-resolve-panel-header">
                    <div>
                      <p className="sr-resolve-panel-title">Final Resolution Note</p>
                      <p className="sr-resolve-panel-subtitle">
                        This closes the ticket. Use the conversation reply above for messages that should not end the request.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="sr-resolve-panel-close"
                      onClick={() => {
                        setShowResolvePanel(false);
                        setResolutionError(null);
                      }}
                      disabled={actionLoading}
                      aria-label="Cancel resolution"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  <textarea
                    className="sr-reply-textarea"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows={4}
                    disabled={actionLoading}
                    placeholder="Write the final outcome the client will see after this request is resolved."
                  />
                  {resolutionError && <p className="sr-field-error">{resolutionError}</p>}
                  <div className="sr-resolve-panel-actions">
                    <button
                      type="button"
                      className="sr-modal-btn gray"
                      disabled={actionLoading}
                      onClick={() => {
                        setShowResolvePanel(false);
                        setResolutionError(null);
                      }}
                    >
                      Keep Open
                    </button>
                    <button
                      type="button"
                      className="sr-modal-btn green"
                      disabled={actionLoading}
                      onClick={() => handleStatusChange('resolved')}
                    >
                      Resolve Ticket
                    </button>
                  </div>
                </div>
              )}

              {/* Action row */}
              <div className="sr-modal-actions">
                {canFulfillAdditionalGuard && (
                  <button
                    className="sr-modal-btn blue"
                    disabled={actionLoading}
                    onClick={handleOpenAdditionalGuardFulfillment}
                  >
                    <FaUserPlus /> Deploy Additional Guard
                  </button>
                )}
                {request.modalActions?.includes('resolve') && (
                  <button
                    className="sr-modal-btn green"
                    disabled={actionLoading}
                    onClick={() => {
                      setShowResolvePanel(true);
                      setResolutionError(null);
                    }}
                  >
                    Mark Resolved
                  </button>
                )}
                {request.modalActions?.includes('progress') && (
                  <button
                    className="sr-modal-btn yellow"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('in_progress')}
                  >
                    Set In Progress
                  </button>
                )}
                {request.modalActions?.includes('cancel') && (
                  <button
                    className="sr-modal-btn red"
                    disabled={actionLoading}
                    onClick={() => handleStatusChange('cancelled')}
                  >
                    Cancel Request
                  </button>
                )}
                <button
                  className="sr-modal-btn gray"
                  disabled={actionLoading}
                  onClick={() => navigate('/service-request')}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Additional guard — employee picker overlay */}
      <AdditionalGuardEmployeePicker
        isOpen={showGuardPicker}
        employees={deployableEmployees}
        selectedEmployeeId={selectedEmployeeId}
        loading={actionLoading}
        onSelect={setSelectedEmployeeId}
        onCancel={() => setShowGuardPicker(false)}
        onContinue={handleContinueAdditionalGuardDeploy}
      />

      {/* Additional guard — deploy dialog */}
      <DeployEmployeeDialog
        isOpen={showDeployModal}
        employeeName={selectedEmployee?.name || 'Selected guard'}
        sitesList={sitesList}
        deployForm={deployForm}
        setDeployForm={setDeployForm}
        isDeploying={isDeploying}
        onCancel={() => setShowDeployModal(false)}
        onDeploy={handleDeployAdditionalGuard}
        toggleScheduleDay={toggleScheduleDay}
        clientContractEndDate={selectedClientContractEndDate}
      />
    </>
  );
}
