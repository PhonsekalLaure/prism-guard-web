import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IncidentReportsTopbar from '@cms-components/incident-reports/IncidentReportsTopbar';
import IncidentReportsStatCards from '@cms-components/incident-reports/IncidentReportsStatCards';
import IncidentReportsInfoBanner from '@cms-components/incident-reports/IncidentReportsInfoBanner';
import IncidentReportsFilterBar from '@cms-components/incident-reports/IncidentReportsFilterBar';
import IncidentReportsTable from '@cms-components/incident-reports/IncidentReportsTable';
import RequestReportModal from '@cms-components/incident-reports/RequestReportModal';
import IncidentDetailModal from '@cms-components/incident-reports/IncidentDetailModal';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import incidentReportsService from '@services/cms/incidentReportsService';
import '../../styles/cms/IncidentReports.css';

const PAGE_LIMIT = 8;
const INITIAL_FILTERS = { search: '', site: 'all', severity: 'all', date: '' };

export default function IncidentReportsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [viewedIncident, setViewedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({});
  const [sites, setSites] = useState([]);
  const [metadata, setMetadata] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');
  const { notification, showNotification, closeNotification } = useNotification();

  const loadReports = useCallback(async (page = 1, nextFilters = {}) => {
    setLoading(true);
    try {
      const response = await incidentReportsService.getIncidentReports({
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
      const response = await incidentReportsService.getStats();
      setStats(response || {});
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load incident stats.', 'error');
    } finally {
      setStatsLoading(false);
    }
  }, [showNotification]);

  const loadSites = useCallback(async () => {
    try {
      const response = await incidentReportsService.getSites();
      setSites(response || []);
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to load sites.', 'error');
    }
  }, [showNotification]);

  useEffect(() => {
    loadReports(1, INITIAL_FILTERS);
    loadStats();
    loadSites();
  }, [loadReports, loadSites, loadStats]);

  useEffect(() => {
    const incidentId = location.state?.openIncidentId;
    if (!incidentId || loading) return;

    const incident = incidents.find((item) => item.id === incidentId);
    if (incident) {
      setViewedIncident(incident);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [incidents, loading, location.pathname, location.state, navigate]);

  const handleFilterChange = (nextFilters) => {
    setFilters(nextFilters);
    loadReports(1, nextFilters);
  };

  const handleConfirm = async () => {
    if (!selectedIncident) return;
    setSubmitting(true);
    try {
      const result = await incidentReportsService.requestFullReport(
        selectedIncident.id,
        requestNotes.trim()
      );
      setSelectedIncident(null);
      setRequestNotes('');
      showNotification(result.duplicate
        ? 'A full report request is already active for this incident.'
        : 'Report request submitted for operations review.', 'success');
      await loadReports(metadata.page, filters);
      await loadStats();
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to submit report request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const closeRequestModal = () => {
    if (submitting) return;
    setSelectedIncident(null);
    setRequestNotes('');
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

      <IncidentReportsTopbar />

      <div className="cms-content">
        <IncidentReportsInfoBanner />
        <IncidentReportsStatCards stats={stats} loading={statsLoading} />
        <IncidentReportsFilterBar onFilterChange={handleFilterChange} sites={sites} />
        <IncidentReportsTable
          incidents={incidents}
          loading={loading}
          metadata={metadata}
          onPageChange={(page) => loadReports(page, filters)}
          onViewIncident={(inc) => setViewedIncident(inc)}
          onRequestReport={(inc) => setSelectedIncident(inc)}
        />
      </div>

      <RequestReportModal
        isOpen={!!selectedIncident}
        incident={selectedIncident}
        requestNotes={requestNotes}
        onRequestNotesChange={setRequestNotes}
        onClose={closeRequestModal}
        onConfirm={handleConfirm}
        submitting={submitting}
      />

      <IncidentDetailModal
        incident={viewedIncident}
        onClose={() => setViewedIncident(null)}
        onRequestReport={(incident) => {
          setViewedIncident(null);
          setSelectedIncident(incident);
        }}
      />
    </>
  );
}
