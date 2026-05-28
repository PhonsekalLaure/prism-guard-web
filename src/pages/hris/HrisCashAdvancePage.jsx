import { useCallback, useEffect, useState } from 'react';
import HrisCashAdvanceTopbar from '@hris-components/cash-advance/HrisCashAdvanceTopbar';
import HrisCashAdvanceStatCards from '@hris-components/cash-advance/HrisCashAdvanceStatCards';
import HrisCashAdvanceAlert from '@hris-components/cash-advance/HrisCashAdvanceAlert';
import HrisCashAdvanceFilterBar from '@hris-components/cash-advance/HrisCashAdvanceFilterBar';
import HrisCashAdvanceList from '@hris-components/cash-advance/HrisCashAdvanceList';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import cashAdvanceService from '@services/hris/cashAdvanceService';
import '../../styles/hris/HrisCashAdvance.css';

const PAGE_LIMIT = 8;
const DEFAULT_FILTERS = {
  search: '',
  reason: 'all',
  status: 'pending',
};

const DEFAULT_STATS = {
  totalDisbursed: 0,
  pending: 0,
  approved: 0,
  released: 0,
  rejected: 0,
  settled: 0,
};

export default function HrisCashAdvancePage() {
  const [requests, setRequests] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 0,
  });
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadCashAdvances = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const response = await cashAdvanceService.getCashAdvances({
        page,
        limit: PAGE_LIMIT,
        search: filters.search || undefined,
        reason: filters.reason !== 'all' ? filters.reason : undefined,
        status: filters.status !== 'all' ? filters.status : undefined,
      });

      setRequests(response.data || []);
      setMetadata(response.metadata || {
        total: 0,
        page,
        limit: PAGE_LIMIT,
        totalPages: 0,
      });
      setStats(response.stats || DEFAULT_STATS);
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to load cash advance requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  useEffect(() => {
    loadCashAdvances(1);
  }, [filters, loadCashAdvances]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
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

      <HrisCashAdvanceTopbar />

      <div className="dashboard-content">
        <HrisCashAdvanceStatCards data={stats} loading={loading} />
        <HrisCashAdvanceAlert />
        <HrisCashAdvanceFilterBar filters={filters} onChange={handleFilterChange} />
        <HrisCashAdvanceList
          requests={requests}
          metadata={metadata}
          stats={stats}
          loading={loading}
          statusFilter={filters.status}
          onStatusChange={(status) => handleFilterChange('status', status)}
          onPageChange={loadCashAdvances}
          onResetFilters={handleResetFilters}
        />
      </div>
    </>
  );
}
