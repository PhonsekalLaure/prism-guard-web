import { useCallback, useEffect, useState } from 'react';
import HrisLeaveRequestsTopbar from '@hris-components/leave-requests/HrisLeaveRequestsTopbar';
import HrisLeaveRequestsStatCards from '@hris-components/leave-requests/HrisLeaveRequestsStatCards';
import HrisLeaveRequestsFilterBar from '@hris-components/leave-requests/HrisLeaveRequestsFilterBar';
import HrisLeaveRequestsList from '@hris-components/leave-requests/HrisLeaveRequestsList';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
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
  const { notification, showNotification, closeNotification } = useNotification();

  const loadLeaveRequests = useCallback(async (page = 1) => {
    setLoading(true);

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
      showNotification(err.response?.data?.error || err.message || 'Failed to load leave requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    loadLeaveRequests(1);
  }, [filters, loadLeaveRequests]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}

      <HrisLeaveRequestsTopbar />

      <div className="dashboard-content">
        <HrisLeaveRequestsStatCards stats={stats} loading={loading} />
        <HrisLeaveRequestsFilterBar filters={filters} onChange={handleFilterChange} />
        <HrisLeaveRequestsList
          requests={requests}
          metadata={metadata}
          loading={loading}
          onPageChange={loadLeaveRequests}
        />
      </div>
    </>
  );
}
