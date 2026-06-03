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
  status: 'all',
  clientId: 'all',
  category: 'all',
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
      showNotification('Service review marked as not published.', 'success');
      await loadReviews(metadata.page || 1);
      await loadClients();
      await loadMonthlyCompliance();
    } catch (err) {
      showNotification(err.response?.data?.error || err.message || 'Failed to update publishing decision', 'error');
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
        {monthlyCompliance && (() => {
          const total = monthlyCompliance.required;
          const submitted = monthlyCompliance.submitted;
          const missing = total - submitted;
          const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
          const CHIP_LIMIT = 5;
          const showChips = monthlyCompliance.clients.length <= CHIP_LIMIT;
          const visibleChips = monthlyCompliance.clients.slice(0, CHIP_LIMIT);
          const overflow = monthlyCompliance.clients.length - CHIP_LIMIT;
          return (
            <div className="sr-compliance-bar">
              <div className="sr-compliance-bar__meta">
                <span className="sr-compliance-bar__label">Monthly Compliance</span>
                <span className="sr-compliance-bar__sep" />
                <span className="sr-compliance-bar__period">{monthlyCompliance.periodLabel}</span>
              </div>
              <div className="sr-compliance-bar__track">
                <div
                  className="sr-compliance-bar__fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="sr-compliance-bar__pct">{pct}%</span>
              <span className="sr-compliance-bar__divider" />
              <div className="sr-compliance-bar__summary">
                <span className="sr-compliance-chip submitted">{submitted} submitted</span>
                {missing > 0 && (
                  <span className="sr-compliance-chip missing">{missing} missing</span>
                )}
              </div>
              {showChips && (
                <>
                  <span className="sr-compliance-bar__divider" />
                  <div className="sr-compliance-bar__chips">
                    {visibleChips.map((client) => (
                      <span
                        key={client.clientId}
                        className={`sr-compliance-chip sm ${client.submitted ? 'submitted' : 'missing'}`}
                        title={`${client.clientName}: ${client.submitted ? 'Submitted' : 'Missing'}`}
                      >
                        {client.clientName}
                      </span>
                    ))}
                    {overflow > 0 && (
                      <span className="sr-compliance-chip sm overflow">+{overflow} more</span>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })()}
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
