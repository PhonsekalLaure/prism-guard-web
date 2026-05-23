import { useCallback, useEffect, useState } from 'react';
import HrisIncidentsTopbar from '@hris-components/incidents/HrisIncidentsTopbar';
import HrisIncidentsStatCards from '@hris-components/incidents/HrisIncidentsStatCards';
import HrisIncidentsFilterBar from '@hris-components/incidents/HrisIncidentsFilterBar';
import HrisIncidentsFeed from '@hris-components/incidents/HrisIncidentsFeed';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import incidentsService from '@services/hris/incidentsService';
import '../../styles/hris/HrisIncidents.css';

const PAGE_LIMIT = 8;
const INITIAL_FILTERS = { search: '', status: 'all', severity: 'all' };

export default function HrisIncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({});
  const [metadata, setMetadata] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadIncidents = useCallback(async (page = 1, nextFilters = {}) => {
    setLoading(true);
    try {
      const response = await incidentsService.getIncidents({
        page,
        limit: PAGE_LIMIT,
        ...nextFilters,
      });
      setIncidents(response.data || []);
      setMetadata(response.metadata || { page, limit: 8, total: 0, totalPages: 1 });
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load incident reports.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const response = await incidentsService.getStats();
      setStats(response || {});
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load incident stats.', 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    loadIncidents(1, INITIAL_FILTERS);
    loadStats();
  }, [loadIncidents, loadStats]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    loadIncidents(1, nextFilters);
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
      <HrisIncidentsTopbar />

      <div className="dashboard-content">
        <HrisIncidentsStatCards stats={stats} loading={statsLoading} />
        <HrisIncidentsFilterBar onFilterChange={handleFilterChange} />
        <HrisIncidentsFeed
          incidents={incidents}
          loading={loading}
          metadata={metadata}
          onPageChange={(page) => loadIncidents(page, filters)}
        />
      </div>
    </>
  );
}
