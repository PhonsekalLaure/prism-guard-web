import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBars,
  FaUserPlus,
  FaPaperPlane,
  FaEye,
  FaCheck,
  FaComments,
  FaTimes,
  FaExchangeAlt,
  FaExclamationTriangle,
} from 'react-icons/fa';
import DeployEmployeeDialog from '@hris-components/employees/DeployEmployeeDialog';
import GuardFulfillmentPicker from '@hris-components/service-requests/GuardFulfillmentPicker';
import ServiceRequestReplyBox from '@components/service-requests/ServiceRequestReplyBox';
import ServiceRequestThread from '@components/service-requests/ServiceRequestThread';
import ServiceRequestTypeDetails from '@components/service-requests/ServiceRequestTypeDetails';
import serviceRequestsService from '@services/hris/serviceRequestsService';
import employeeService from '@services/hris/employeeService';
import clientService from '@services/hris/clientService';
import {
  DEFAULT_DEPLOY_FORM,
  getSiteCoordinatesParams,
  isAfterDate,
  isEarlierDate,
} from '@utils/serviceRequestFulfillment';
import '../../styles/hris/HrisServiceRequests.css';

function timelineIcon(dotClass) {
  if (dotClass === 'blue') return <FaPaperPlane />;
  if (dotClass === 'yellow') return <FaEye />;
  return <FaCheck />;
}

export default function ServiceRequestDetailPage() {
  const { id }            = useParams();
  const navigate          = useNavigate();
  const { toggleSidebar } = useOutletContext();

  const [request,       setRequest]       = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error,         setError]         = useState(null);

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionError, setResolutionError] = useState(null);
  const [showResolvePanel, setShowResolvePanel] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [messageText,     setMessageText]     = useState('');
  const [messageError,    setMessageError]    = useState(null);

  const [showGuardPicker,    setShowGuardPicker]    = useState(false);
  const [fulfillmentMode,    setFulfillmentMode]    = useState(null);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [selectedEmployeeId,  setSelectedEmployeeId]  = useState('');
  const [sitesList,          setSitesList]          = useState([]);
  const [deployForm,         setDeployForm]         = useState(DEFAULT_DEPLOY_FORM);
  const [showDeployModal,    setShowDeployModal]    = useState(false);
  const [isDeploying,        setIsDeploying]        = useState(false);

  const fetchRequest = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const detail = await serviceRequestsService.getServiceRequestById(id);
      setRequest(detail);
      setResolutionNotes(detail?.resolution_notes || '');
      setShowResolvePanel(false);
      setConfirmingCancel(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load service request.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchRequest(); }, [fetchRequest]);

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
      setConfirmingCancel(false);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update service request.');
    } finally {
      setActionLoading(false);
    }
  }, [id, resolutionNotes]);

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

  const handleOpenAdditionalGuardFulfillment = useCallback(async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
      setFulfillmentMode('additional_guard');
      const sites = await clientService.getAllSitesList();
      const availableSites = (sites || []).filter((site) => (
        request?.site_id ? site.id === request.site_id : site.client_id === request?.client_id
      ));
      const targetSite = request?.site_id
        ? availableSites.find((site) => site.id === request.site_id)
        : null;
      const employees = await employeeService.getDeployableEmployees(getSiteCoordinatesParams(targetSite));
      setDeployableEmployees(employees || []);
      setSitesList(availableSites);
      setShowGuardPicker(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to prepare additional guard deployment.');
    } finally {
      setActionLoading(false);
    }
  }, [request]);

  const handleOpenReplacementFulfillment = useCallback(async () => {
    try {
      setActionLoading(true);
      setError(null);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
      setFulfillmentMode('guard_replacement');

      const replacementSiteId = request?.replacement_details?.site_id || request?.site_id;
      const sites = await clientService.getAllSitesList();
      const replacementSite = (sites || []).find((site) => site.id === replacementSiteId);
      const employees = await employeeService.getDeployableEmployees(getSiteCoordinatesParams(replacementSite));
      setDeployableEmployees((employees || []).filter((emp) => (
        emp.id !== request?.replacement_details?.original_employee_id
      )));
      setSitesList(replacementSite ? [replacementSite] : []);
      setShowGuardPicker(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to prepare guard replacement.');
    } finally {
      setActionLoading(false);
    }
  }, [request]);

  const selectedEmployee         = deployableEmployees.find((e) => e.id === selectedEmployeeId) || null;
  const selectedDeploymentSite   = sitesList.find((s) => s.id === deployForm.siteId);
  const selectedClientContractEndDate = selectedDeploymentSite?.client_contract_end_date || null;
  const selectedClientContractStartDate = selectedDeploymentSite?.client_contract_start_date || null;

  const handleContinueAdditionalGuardDeploy = useCallback(() => {
    if (!selectedEmployee) return;
    const lockedSiteId = fulfillmentMode === 'guard_replacement'
      ? request?.replacement_details?.site_id || request?.site_id || ''
      : request?.site_id || '';

    setDeployForm({
      ...DEFAULT_DEPLOY_FORM,
      siteId: lockedSiteId,
      baseSalary: selectedEmployee.base_salary || '',
    });
    setShowGuardPicker(false);
    setShowDeployModal(true);
  }, [selectedEmployee, request, fulfillmentMode]);

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
    if (selectedClientContractStartDate && deployForm.contractStartDate && deployForm.contractStartDate < selectedClientContractStartDate) { setError(`Deployment contract start date cannot be earlier than the client contract start date (${selectedClientContractStartDate}).`); return; }
    if (selectedClientContractEndDate && deployForm.contractStartDate && isAfterDate(deployForm.contractStartDate, selectedClientContractEndDate)) { setError(`Deployment contract start date cannot be later than the client contract end date (${selectedClientContractEndDate}).`); return; }
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

      if (fulfillmentMode === 'guard_replacement') {
        await serviceRequestsService.fulfillGuardReplacement(request.id, payload);
      } else {
        await serviceRequestsService.deployAdditionalGuard(request.id, payload);
      }
      await fetchRequest();
      setShowDeployModal(false);
      setSelectedEmployeeId('');
      setFulfillmentMode(null);
      setDeployForm(DEFAULT_DEPLOY_FORM);
    } catch (err) {
      setError(err?.response?.data?.error || (
        fulfillmentMode === 'guard_replacement'
          ? 'Failed to fulfill guard replacement.'
          : 'Failed to deploy additional guard.'
      ));
    } finally {
      setIsDeploying(false);
    }
  }, [request, selectedEmployee, deployForm, selectedClientContractStartDate, selectedClientContractEndDate, fetchRequest, fulfillmentMode]);

  const canMessage             = ['open', 'in_progress'].includes(request?.status);
  const messages               = request?.messages || [];
  const canFulfill             = request?.status === 'in_progress';
  const canFulfillAdditionalGuard = request?.ticket_type === 'additional_guard'
    && canFulfill
    && !request?.additional_guard_details?.is_fulfilled;
  const canFulfillGuardReplacement = request?.ticket_type === 'guard_replacement'
    && canFulfill
    && request?.replacement_details?.original_deployment_id
    && !request?.replacement_details?.replacement_deployment_id;

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
          <div className="sr-table-card sr-detail-page-card sr-detail-skeleton">
            {/* Shimmer gradient header */}
            <div className="sr-detail-skeleton__header">
              <div className="dsk-line" style={{ height: 16, width: '42%' }} />
              <div className="dsk-line" style={{ height: 11, width: '28%', marginTop: 6 }} />
            </div>
            <div className="sr-detail-skeleton__body">
              {/* Badges */}
              <div className="sr-detail-skeleton__badges">
                {[72, 72, 108].map((w, i) => (
                  <div key={i} className="dsk-btn" style={{ width: w, height: 24, borderRadius: 20 }} />
                ))}
              </div>
              {/* Client box */}
              <div className="sr-detail-skeleton__client">
                <div className="dsk-avatar" style={{ width: 46, height: 46 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div className="dsk-line lg" />
                  <div className="dsk-line md" />
                </div>
              </div>
              {/* Info grid */}
              <div className="dsk-grid cols-2">
                <div className="dsk-info-cell">
                  <div className="dsk-line sm" />
                  <div className="dsk-line md" />
                </div>
                <div className="dsk-info-cell">
                  <div className="dsk-line sm" />
                  <div className="dsk-line md" />
                </div>
              </div>
              {/* Description */}
              <div className="dsk-info-cell" style={{ minHeight: 80 }}>
                <div className="dsk-line sm" />
                <div className="dsk-line lg" />
                <div className="dsk-line md" />
              </div>
              {/* Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="sr-detail-skeleton__timeline-item">
                    <div className="dsk-btn" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div className="dsk-line md" />
                      <div className="dsk-line sm" />
                    </div>
                  </div>
                ))}
              </div>
              {/* Conversation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div className="dsk-line" style={{ height: 14, width: '35%' }} />
                <div className="dsk-info-cell" style={{ minHeight: 60 }}>
                  <div className="dsk-line md" />
                  <div className="dsk-line lg" />
                </div>
                <div className="dsk-info-cell" style={{ minHeight: 60 }}>
                  <div className="dsk-line sm" />
                  <div className="dsk-line md" />
                </div>
              </div>
              {/* Action buttons */}
              <div className="sr-detail-skeleton__actions">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="dsk-btn" style={{ flex: 1, height: 40, borderRadius: 8 }} />
                ))}
              </div>
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
                <p>{request.request_id} - {request.client}</p>
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

              <ServiceRequestTypeDetails request={request} includeFulfillmentRows />

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
                <ServiceRequestThread messages={messages} />
                {canMessage && (
                  <ServiceRequestReplyBox
                    label="Reply to client"
                    value={messageText}
                    onChange={setMessageText}
                    onSend={handleSendMessage}
                    loading={messageLoading}
                    error={messageError}
                    placeholder="Write a message to the client..."
                  />
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
                {canFulfillGuardReplacement && (
                  <button
                    className="sr-modal-btn blue"
                    disabled={actionLoading}
                    onClick={handleOpenReplacementFulfillment}
                  >
                    <FaExchangeAlt /> Fulfill Replacement
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
                {confirmingCancel ? (
                  <div className="sr-cancel-confirm sr-cancel-confirm--actions">
                    <p>
                      <FaExclamationTriangle /> Are you sure you want to cancel this request?
                    </p>
                    <div>
                      <button
                        type="button"
                        className="sr-modal-btn gray"
                        disabled={actionLoading}
                        onClick={() => setConfirmingCancel(false)}
                      >
                        Keep Request
                      </button>
                      <button
                        type="button"
                        className="sr-modal-btn red"
                        disabled={actionLoading}
                        onClick={() => handleStatusChange('cancelled')}
                      >
                        {actionLoading ? 'Cancelling...' : 'Cancel Request'}
                      </button>
                    </div>
                  </div>
                ) : request.modalActions?.includes('cancel') && (
                  <button
                    className="sr-modal-btn red"
                    disabled={actionLoading}
                    onClick={() => setConfirmingCancel(true)}
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

      {/* Additional guard employee picker overlay */}
      <GuardFulfillmentPicker
        isOpen={showGuardPicker}
        employees={deployableEmployees}
        selectedEmployeeId={selectedEmployeeId}
        loading={actionLoading}
        title={fulfillmentMode === 'guard_replacement' ? 'Select Replacement Guard' : 'Select Additional Guard'}
        subtitle={fulfillmentMode === 'guard_replacement' ? 'Choose the guard who will replace the current assignment' : 'Choose the guard to deploy for this request'}
        label={fulfillmentMode === 'guard_replacement' ? 'Replacement Guard' : 'Available Guard'}
        onSelect={setSelectedEmployeeId}
        onCancel={() => {
          setShowGuardPicker(false);
          setFulfillmentMode(null);
        }}
        onContinue={handleContinueAdditionalGuardDeploy}
      />

      {/* Additional guard deploy dialog */}
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
        clientContractStartDate={selectedClientContractStartDate}
        clientContractEndDate={selectedClientContractEndDate}
        title={fulfillmentMode === 'guard_replacement' ? 'Fulfill Guard Replacement' : undefined}
        submitLabel={fulfillmentMode === 'guard_replacement' ? 'Replace Guard' : 'Deploy Guard'}
        submittingLabel={fulfillmentMode === 'guard_replacement' ? 'Replacing...' : undefined}
        deployDisabled={!deployForm.deploymentOrderFile}
      />
    </>
  );
}
