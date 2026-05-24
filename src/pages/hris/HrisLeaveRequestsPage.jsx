import { useCallback, useEffect, useState } from 'react';
import HrisLeaveRequestsTopbar from '@hris-components/leave-requests/HrisLeaveRequestsTopbar';
import HrisLeaveRequestsStatCards from '@hris-components/leave-requests/HrisLeaveRequestsStatCards';
import HrisLeaveRequestsFilterBar from '@hris-components/leave-requests/HrisLeaveRequestsFilterBar';
import HrisLeaveRequestsList from '@hris-components/leave-requests/HrisLeaveRequestsList';
import leaveRequestsService from '@services/hris/leaveRequestsService';
import '../../styles/hris/HrisLeaveRequests.css';

const DEFAULT_FILTERS = {
  search: '',
  leaveType: 'all',
  status: 'all',
};
const PAGE_LIMIT = 8;

export default function HrisLeaveRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    pending: 0,
    approvedThisMonth: 0,
    rejected: 0,
  });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [replacementLoadingId, setReplacementLoadingId] = useState(null);
  const [replacementGuardsByRequest, setReplacementGuardsByRequest] = useState({});
  const [error, setError] = useState('');

  const loadLeaveRequests = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const [requestsResponse, statsResponse] = await Promise.all([
        leaveRequestsService.getLeaveRequests({
          page,
          limit: PAGE_LIMIT,
          search: filters.search || undefined,
          leaveType: filters.leaveType !== 'all' ? filters.leaveType : undefined,
          status: filters.status !== 'all' ? filters.status : undefined,
        }),
        leaveRequestsService.getStats(),
      ]);

      setRequests(requestsResponse.data || []);
      setMetadata(requestsResponse.metadata || {
        total: 0,
        page,
        limit: PAGE_LIMIT,
        totalPages: 0,
      });
      setStats(statsResponse);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadLeaveRequests(1);
  }, [filters, loadLeaveRequests]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleReject = async (request, reviewNotes) => {
    setActionLoadingId(`reject:${request.id}`);
    setError('');

    try {
      await leaveRequestsService.rejectLeaveRequest(request.id, reviewNotes);
      await loadLeaveRequests(metadata.page);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to reject leave request');
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleLoadReplacementGuards = async (request) => {
    if (replacementGuardsByRequest[request.id]) {
      return replacementGuardsByRequest[request.id];
    }

    setReplacementLoadingId(request.id);
    setError('');

    try {
      const guards = await leaveRequestsService.getReplacementGuards(request.id);
      setReplacementGuardsByRequest((prev) => ({ ...prev, [request.id]: guards }));
      return guards;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load replacement guards');
      return [];
    } finally {
      setReplacementLoadingId(null);
    }
  };

  const handleApprove = async (request, payload) => {
    setActionLoadingId(`approve:${request.id}`);
    setError('');

    try {
      await leaveRequestsService.approveLeaveRequest(request.id, payload);
      setReplacementGuardsByRequest((prev) => {
        const next = { ...prev };
        delete next[request.id];
        return next;
      });
      await loadLeaveRequests(metadata.page);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to approve leave request');
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCancel = async (request, reviewNotes = '') => {
    setActionLoadingId(`cancel:${request.id}`);
    setError('');

    try {
      await leaveRequestsService.cancelLeaveRequest(request.id, reviewNotes);
      await loadLeaveRequests(metadata.page);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to cancel leave request');
      return false;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleOpenDocument = async (request) => {
    setError('');
    try {
      await leaveRequestsService.openSupportingDocument(request.id);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to open supporting document');
    }
  };

  return (
    <>
      <HrisLeaveRequestsTopbar />

      <div className="dashboard-content">
        <HrisLeaveRequestsStatCards stats={stats} />
        <HrisLeaveRequestsFilterBar filters={filters} onChange={handleFilterChange} />
        {error && <div className="hlr-error-banner">{error}</div>}
        <HrisLeaveRequestsList
          requests={requests}
          metadata={metadata}
          loading={loading}
          actionLoadingId={actionLoadingId}
          replacementLoadingId={replacementLoadingId}
          replacementGuardsByRequest={replacementGuardsByRequest}
          onLoadReplacementGuards={handleLoadReplacementGuards}
          onApprove={handleApprove}
          onCancel={handleCancel}
          onOpenDocument={handleOpenDocument}
          onReject={handleReject}
          onPageChange={loadLeaveRequests}
        />
      </div>
    </>
  );
}
