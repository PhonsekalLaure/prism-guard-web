import { useState, useEffect, useCallback } from 'react';
import ServiceRequestsTopbar from '@cms-components/service-requests/ServiceRequestsTopbar';
import ServiceRequestsStatCards from '@cms-components/service-requests/ServiceRequestsStatCards';
import ServiceRequestsFilterBar from '@cms-components/service-requests/ServiceRequestsFilterBar';
import ServiceRequestsTable from '@cms-components/service-requests/ServiceRequestsTable';
import NewRequestModal from '@cms-components/service-requests/NewRequestModal';
import RequestDetailModal from '@cms-components/service-requests/RequestDetailModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import serviceRequestsService from '@services/cms/serviceRequestsService';

const DEFAULT_FILTERS = { status: 'all', type: 'all', urgency: 'all' };

export default function ServiceRequestsPage() {
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // ── Tickets list state ────────────────────────────────────────────────────
  const [tickets, setTickets] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loadingTickets, setLoadingTickets] = useState(true);

  // ── Stats state ──────────────────────────────────────────────────────────
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  const { notification, showNotification, closeNotification } = useNotification();

  // ── Fetch tickets ─────────────────────────────────────────────────────────
  const fetchTickets = useCallback(async (page = 1, currentFilters = filters) => {
    try {
      setLoadingTickets(true);
      const result = await serviceRequestsService.getServiceRequests({
        page,
        limit: 8,
        ...currentFilters,
      });
      setTickets(result.data);
      setMetadata(result.metadata);
    } catch {
      // stay on current data, silently ignore
    } finally {
      setLoadingTickets(false);
    }
  }, [filters]);

  // ── Fetch stats ───────────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const result = await serviceRequestsService.getStats();
      setStats(result);
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchTickets(1, DEFAULT_FILTERS);
    fetchStats();
  }, []);

  // ── Filter change ─────────────────────────────────────────────────────────
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    fetchTickets(1, newFilters);
  }, []);

  // ── Page change ───────────────────────────────────────────────────────────
  const handlePageChange = useCallback((page) => {
    fetchTickets(page);
  }, [filters]);

  // ── After a new request is submitted ─────────────────────────────────────
  const handleNewRequestSuccess = useCallback(() => {
    setIsNewRequestOpen(false);
    showNotification('Service request submitted successfully!', 'success');
    fetchTickets(1, filters);
    fetchStats();
  }, [filters]);

  // ── After cancel ─────────────────────────────────────────────────────────
  const handleCancelSuccess = useCallback(() => {
    setSelectedRequest(null);
    showNotification('Service request cancelled.', 'success');
    fetchTickets(metadata.page, filters);
    fetchStats();
  }, [metadata.page, filters]);

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

      <ServiceRequestsTopbar onNewRequest={() => setIsNewRequestOpen(true)} />

      <div className="cms-content">
        <ServiceRequestsStatCards stats={stats} loading={loadingStats} />
        <ServiceRequestsFilterBar onFilterChange={handleFilterChange} />
        <ServiceRequestsTable
          tickets={tickets}
          metadata={metadata}
          loading={loadingTickets}
          onViewRequest={setSelectedRequest}
          onPageChange={handlePageChange}
        />
      </div>

      <NewRequestModal
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSuccess={handleNewRequestSuccess}
      />

      <RequestDetailModal
        isOpen={!!selectedRequest}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onCancelSuccess={handleCancelSuccess}
      />
    </>
  );
}