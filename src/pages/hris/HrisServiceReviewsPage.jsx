import { useCallback, useEffect, useState } from 'react';
import HrisServiceReviewsTopbar from '@hris-components/service-reviews/HrisServiceReviewsTopbar';
import HrisServiceReviewsStatCards from '@hris-components/service-reviews/HrisServiceReviewsStatCards';
import HrisServiceReviewsFilterBar from '@hris-components/service-reviews/HrisServiceReviewsFilterBar';
import HrisServiceReviewsList from '@hris-components/service-reviews/HrisServiceReviewsList';
import Notification from '@components/ui/Notification';
import useNotification from '@hooks/useNotification';
import serviceReviewsService from '@services/hris/serviceReviewsService';
import '../../styles/hris/HrisServiceReviews.css';

const PAGE_LIMIT = 8;
const DEFAULT_FILTERS = {
  status: 'pending',
  clientId: 'all',
  category: 'all',
  submissionType: 'all',
  sort: 'most_recent',
};

const DEFAULT_STATS = {
  total: 0,
  pending: 0,
  published: 0,
  rejected: 0,
  avgRating: 0,
  monthlyRequired: 0,
  monthlySubmitted: 0,
  monthlyMissing: 0,
};

export default function HrisServiceReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [metadata, setMetadata] = useState({
    total: 0,
    page: 1,
    limit: PAGE_LIMIT,
    totalPages: 0,
  });
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [monthlyCompliance, setMonthlyCompliance] = useState(null);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadReviews = useCallback(async (page = 1) => {
    setLoading(true);

    try {
      const response = await serviceReviewsService.getServiceReviews({
        page,
        limit: PAGE_LIMIT,
        status: filters.status !== 'all' ? filters.status : undefined,
        clientId: filters.clientId !== 'all' ? filters.clientId : undefined,
        category: filters.category !== 'all' ? filters.category : undefined,
        submissionType: filters.submissionType !== 'all' ? filters.submissionType : undefined,
        sort: filters.sort,
      });

      setReviews(response.data || []);
      setMetadata(response.metadata || {
        total: 0,
        page,
        limit: PAGE_LIMIT,
        totalPages: 0,
      });
      setStats(response.stats || DEFAULT_STATS);
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to load service reviews', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, showNotification]);

  const loadClients = useCallback(async () => {
    try {
      const data = await serviceReviewsService.getClients();
      setClients(data || []);
    } catch {
      setClients([]);
    }
  }, []);

  const loadMonthlyCompliance = useCallback(async () => {
    try {
      const data = await serviceReviewsService.getMonthlyCompliance();
      setMonthlyCompliance(data);
    } catch {
      setMonthlyCompliance(null);
    }
  }, []);

  useEffect(() => {
    loadClients();
    loadMonthlyCompliance();
  }, [loadClients, loadMonthlyCompliance]);

  useEffect(() => {
    loadReviews(1);
  }, [filters, loadReviews]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePublish = async (id, reviewNotes = '') => {
    setActionLoadingId(id);
    try {
      await serviceReviewsService.publishServiceReview(id, reviewNotes);
      showNotification('Service review published.', 'success');
      await loadReviews(metadata.page || 1);
      await loadClients();
      await loadMonthlyCompliance();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to publish service review', 'error');
      throw err;
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id, reviewNotes = '') => {
    setActionLoadingId(id);
    try {
      await serviceReviewsService.rejectServiceReview(id, reviewNotes);
      showNotification('Service review rejected.', 'success');
      await loadReviews(metadata.page || 1);
      await loadClients();
      await loadMonthlyCompliance();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to reject service review', 'error');
      throw err;
    } finally {
      setActionLoadingId(null);
    }
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

      <HrisServiceReviewsTopbar />

      <div className="dashboard-content">
        <HrisServiceReviewsStatCards stats={stats} loading={loading} />
        <HrisServiceReviewsFilterBar filters={filters} clients={clients} onChange={handleFilterChange} />
        {monthlyCompliance && (
          <div className="sr-review-compliance-panel">
            <div className="sr-review-compliance-header">
              <div>
                <h3>Monthly Compliance</h3>
                <p>{monthlyCompliance.periodLabel} service review submission status</p>
              </div>
              <span>{monthlyCompliance.submitted} of {monthlyCompliance.required} submitted</span>
            </div>
            <div className="sr-review-compliance-list">
              {monthlyCompliance.clients.slice(0, 6).map((client) => (
                <div key={client.clientId} className="sr-review-compliance-item">
                  <span className="sr-review-compliance-name">{client.clientName}</span>
                  <span className={`sr-review-compliance-status ${client.submitted ? 'submitted' : 'missing'}`}>
                    {client.submitted ? 'Submitted' : 'Missing'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <HrisServiceReviewsList
          reviews={reviews}
          metadata={metadata}
          loading={loading}
          actionLoadingId={actionLoadingId}
          onPageChange={loadReviews}
          onPublish={handlePublish}
          onReject={handleReject}
          onResetFilters={handleResetFilters}
        />
      </div>
    </>
  );
}
