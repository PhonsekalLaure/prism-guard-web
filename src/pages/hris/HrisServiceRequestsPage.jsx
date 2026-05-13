import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HrisSRTopbar from '@hris-components/service-requests/HrisSRTopbar';
import HrisSRStatCards from '@hris-components/service-requests/HrisSRStatCards';
import HrisSRFilterBar from '@hris-components/service-requests/HrisSRFilterBar';
import HrisSRTable from '@hris-components/service-requests/HrisSRTable';
import serviceRequestsService from '@services/hris/serviceRequestsService';
import '../../styles/hris/HrisServiceRequests.css';

const DEFAULT_FILTERS = { clientId: 'all', status: 'all', type: 'all', urgency: 'all' };

export default function HrisServiceRequestsPage() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [stats,        setStats]        = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [clients,      setClients]      = useState([]);
  const [filters,      setFilters]      = useState(DEFAULT_FILTERS);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

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
      setLoadingStats(true);
      const result = await serviceRequestsService.getStats();
      setStats(result);
    } catch {
      setStats(null);
    } finally {
      setLoadingStats(false);
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

  return (
    <>
      <HrisSRTopbar />

      <div className="dashboard-content">
        <HrisSRStatCards stats={stats} loading={loadingStats} />
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
          onOpenDetail={(request) => navigate(`/service-requests/${request.id}`)}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
