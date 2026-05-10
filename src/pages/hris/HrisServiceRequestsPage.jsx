import { useCallback, useEffect, useState } from 'react';
import HrisSRTopbar from '@hris-components/service-requests/HrisSRTopbar';
import HrisSRStatCards from '@hris-components/service-requests/HrisSRStatCards';
import HrisSRFilterBar from '@hris-components/service-requests/HrisSRFilterBar';
import HrisSRTable, { SRDetailModal } from '@hris-components/service-requests/HrisSRTable';
import DeployEmployeeDialog from '@hris-components/employees/DeployEmployeeDialog';
import serviceRequestsService from '@services/hris/serviceRequestsService';
import employeeService from '@services/hris/employeeService';
import clientService from '@services/hris/clientService';
import '../../styles/hris/HrisServiceRequests.css';

const DEFAULT_FILTERS = { clientId: 'all', status: 'all', type: 'all', urgency: 'all' };
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
      <div className="sr-modal-content" onClick={(event) => event.stopPropagation()}>
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
              onChange={(event) => onSelect(event.target.value)}
              disabled={loading}
            >
              <option value="">Select deployable guard...</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.employee_id_number}
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

export default function HrisServiceRequestsPage() {
  const [activeRequest, setActiveRequest] = useState(null);
  const [requests, setRequests] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [stats, setStats] = useState(null);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fulfillmentRequest, setFulfillmentRequest] = useState(null);
  const [showGuardPicker, setShowGuardPicker] = useState(false);
  const [deployableEmployees, setDeployableEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [sitesList, setSitesList] = useState([]);
  const [deployForm, setDeployForm] = useState(DEFAULT_DEPLOY_FORM);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const fetchRequests = useCallback(async (page = 1, currentFilters = DEFAULT_FILTERS) => {
    try {
      setLoading(true);
      setError(null);
      const result = await serviceRequestsService.getServiceRequests({
        page,
        limit: 8,
        ...currentFilters,
      });
      setRequests(result.data || []);
      setMetadata(result.metadata || { total: 0, page, limit: 8, totalPages: 1 });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load service requests.');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const result = await serviceRequestsService.getStats();
      setStats(result);
    } catch {
      setStats(null);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const result = await serviceRequestsService.getClients();
      setClients(result || []);
    } catch {
      setClients([]);
    }
  }, []);

  useEffect(() => {
    fetchRequests(1, DEFAULT_FILTERS);
    fetchStats();
    fetchClients();
  }, [fetchRequests, fetchStats, fetchClients]);

  const handleFilterChange = useCallback((nextFilters) => {
    setFilters(nextFilters);
    fetchRequests(1, nextFilters);
  }, [fetchRequests]);

  const handlePageChange = useCallback((page) => {
    fetchRequests(page, filters);
  }, [fetchRequests, filters]);

  const handleOpenDetail = useCallback(async (request) => {
    try {
      setDetailLoading(true);
      const detail = await serviceRequestsService.getServiceRequestById(request.id);
      setActiveRequest(detail);
    } catch {
      setActiveRequest(request);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handleStatusChange = useCallback(async (status, resolutionNotes) => {
    if (!activeRequest) return;
    try {
      setActionLoading(true);
      const updated = await serviceRequestsService.updateStatus(activeRequest.id, status, resolutionNotes);
      setActiveRequest(updated);
      await Promise.all([
        fetchRequests(metadata.page, filters),
        fetchStats(),
      ]);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update service request.');
    } finally {
      setActionLoading(false);
    }
  }, [activeRequest, fetchRequests, fetchStats, filters, metadata.page]);

  const refreshActiveRequest = useCallback(async () => {
    if (!activeRequest?.id) return null;
    const detail = await serviceRequestsService.getServiceRequestById(activeRequest.id);
    setActiveRequest(detail);
    return detail;
  }, [activeRequest?.id]);

  const handleSendMessage = useCallback(async (message) => {
    if (!activeRequest?.id) return;
    try {
      setMessageLoading(true);
      await serviceRequestsService.sendMessage(activeRequest.id, message);
      await Promise.all([
        refreshActiveRequest(),
        fetchRequests(metadata.page, filters),
        fetchStats(),
      ]);
    } finally {
      setMessageLoading(false);
    }
  }, [activeRequest?.id, refreshActiveRequest, fetchRequests, fetchStats, filters, metadata.page]);

  const handleOpenAdditionalGuardFulfillment = useCallback(async (request) => {
    try {
      setActionLoading(true);
      setError(null);
      setFulfillmentRequest(request);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
      const [employees, sites] = await Promise.all([
        employeeService.getDeployableEmployees(),
        clientService.getAllSitesList(),
      ]);
      setDeployableEmployees(employees || []);
      setSitesList((sites || []).filter((site) => (
        request.site_id ? site.id === request.site_id : site.client_id === request.client_id
      )));
      setShowGuardPicker(true);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to prepare additional guard deployment.');
    } finally {
      setActionLoading(false);
    }
  }, []);

  const selectedEmployee = deployableEmployees.find((employee) => employee.id === selectedEmployeeId) || null;
  const selectedDeploymentSite = sitesList.find((site) => site.id === deployForm.siteId);
  const selectedClientContractEndDate = selectedDeploymentSite?.client_contract_end_date || null;

  const handleContinueAdditionalGuardDeploy = useCallback(() => {
    if (!selectedEmployee) return;
    setDeployForm({
      ...DEFAULT_DEPLOY_FORM,
      siteId: fulfillmentRequest?.site_id || '',
      baseSalary: selectedEmployee.base_salary || '',
    });
    setShowGuardPicker(false);
    setShowDeployModal(true);
  }, [selectedEmployee, fulfillmentRequest?.site_id]);

  const toggleScheduleDay = useCallback((dayValue) => {
    setDeployForm((current) => ({
      ...current,
      daysOfWeek: current.daysOfWeek.includes(dayValue)
        ? current.daysOfWeek.filter((day) => day !== dayValue)
        : [...current.daysOfWeek, dayValue].sort((a, b) => a - b),
    }));
  }, []);

  const handleDeployAdditionalGuard = useCallback(async () => {
    if (!fulfillmentRequest || !selectedEmployee) return;
    if (!deployForm.siteId) { setError('Please select a client site.'); return; }
    if (!deployForm.baseSalary || Number(deployForm.baseSalary) <= 0) { setError('Please set the guard monthly base pay.'); return; }
    if (isEarlierDate(deployForm.contractStartDate, deployForm.contractEndDate)) { setError('Deployment contract end date cannot be earlier than deployment contract start date.'); return; }
    if (isAfterDate(deployForm.contractEndDate, selectedClientContractEndDate)) { setError(`Deployment contract end date cannot be later than the client contract end date (${selectedClientContractEndDate}).`); return; }
    if (deployForm.daysOfWeek.length === 0) { setError('Please select at least one schedule day.'); return; }
    if (!deployForm.shiftStart || !deployForm.shiftEnd) { setError('Please set both shift start and shift end time.'); return; }
    if (!deployForm.deploymentOrderFile) { setError('Please upload the deployment order document.'); return; }

    try {
      setIsDeploying(true);
      setError(null);
      const payload = new FormData();
      payload.append('employeeId', selectedEmployee.id);
      payload.append('siteId', deployForm.siteId);
      payload.append('baseSalary', deployForm.baseSalary);
      if (deployForm.contractStartDate) payload.append('contractStartDate', deployForm.contractStartDate);
      if (deployForm.contractEndDate) payload.append('contractEndDate', deployForm.contractEndDate);
      deployForm.daysOfWeek.forEach((day) => payload.append('daysOfWeek', String(day)));
      payload.append('shiftStart', deployForm.shiftStart);
      payload.append('shiftEnd', deployForm.shiftEnd);
      payload.append('document_deployment_order', deployForm.deploymentOrderFile);
      const result = await serviceRequestsService.deployAdditionalGuard(fulfillmentRequest.id, payload);
      setActiveRequest(result.request || await serviceRequestsService.getServiceRequestById(fulfillmentRequest.id));
      await Promise.all([
        fetchRequests(metadata.page, filters),
        fetchStats(),
      ]);
      setShowDeployModal(false);
      setFulfillmentRequest(null);
      setSelectedEmployeeId('');
      setDeployForm(DEFAULT_DEPLOY_FORM);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to deploy additional guard.');
    } finally {
      setIsDeploying(false);
    }
  }, [fulfillmentRequest, selectedEmployee, deployForm, selectedClientContractEndDate, fetchRequests, fetchStats, filters, metadata.page]);

  return (
    <>
      <HrisSRTopbar />

      <div className="dashboard-content">
        <HrisSRStatCards stats={stats} />
        <HrisSRFilterBar
          clients={clients}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        {error && (
          <div className="sr-error-banner">{error}</div>
        )}
        <HrisSRTable
          requests={requests}
          metadata={metadata}
          loading={loading}
          onOpenDetail={handleOpenDetail}
          onPageChange={handlePageChange}
        />
      </div>

      <SRDetailModal
        key={activeRequest ? `${activeRequest.id}-${activeRequest.status}-${activeRequest.resolution_notes || ''}` : 'empty'}
        request={activeRequest}
        loading={detailLoading}
        actionLoading={actionLoading}
        onClose={() => setActiveRequest(null)}
        onStatusChange={handleStatusChange}
        onSendMessage={handleSendMessage}
        messageLoading={messageLoading}
        onFulfillAdditionalGuard={handleOpenAdditionalGuardFulfillment}
      />

      <AdditionalGuardEmployeePicker
        isOpen={showGuardPicker}
        employees={deployableEmployees}
        selectedEmployeeId={selectedEmployeeId}
        loading={actionLoading}
        onSelect={setSelectedEmployeeId}
        onCancel={() => setShowGuardPicker(false)}
        onContinue={handleContinueAdditionalGuardDeploy}
      />

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
