import { useState, useEffect, useCallback } from 'react';
import { FaHistory, FaSpinner } from 'react-icons/fa';
import Pagination from '@components/ui/Pagination';
import EmptyState from '@components/ui/EmptyState';
import ReviewCard from './ReviewCard';
import serviceReviewsService from '@/services/cms/serviceReviewsService';

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'guard-performance', label: 'Guard Performance' },
  { value: 'incident-response', label: 'Incident Response' },
  { value: 'communication', label: 'Communication' },
  { value: 'overall-service', label: 'Overall Service' },
];

const SORT_OPTIONS = [
  { value: 'most_recent', label: 'Most Recent' },
  { value: 'highest_rated', label: 'Highest Rated' },
  { value: 'lowest_rated', label: 'Lowest Rated' },
];

const LIMIT = 6;

export default function PastReviews({ refreshKey }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('most_recent');

  const fetchReviews = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceReviewsService.getServiceReviews({
        page: p,
        limit: LIMIT,
        category: category !== 'all' ? category : undefined,
        sort,
      });
      setReviews(result.data || []);
      setTotal(result.metadata?.total || 0);
      setTotalPages(result.metadata?.totalPages || 1);
    } catch {
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category, sort, page]);

  useEffect(() => {
    fetchReviews(page);
  }, [fetchReviews, page, refreshKey]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setCategory('all');
    setSort('most_recent');
    setPage(1);
  };

  const start = total === 0 ? 0 : (page - 1) * LIMIT + 1;
  const end = Math.min(page * LIMIT, total);

  return (
    <div>
      <div className="srv-past-header">
        <h3 className="srv-past-title">
          <FaHistory /> Your Past Reviews
        </h3>
        <div className="srv-past-filters">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="srv-filter-select"
          >
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={handleSortChange}
            className="srv-filter-select"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="srv-reviews-loading">
          <FaSpinner className="srv-spinner" />
          <span>Loading reviews...</span>
        </div>
      )}

      {!loading && error && (
        <div className="srv-reviews-error">
          <p>{error}</p>
          <button className="srv-btn-clear" onClick={() => fetchReviews(page)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          title="No reviews found"
          description="We couldn't find any reviews matching your current filter criteria. Try adjusting your settings or submit your first review above."
          actionLabel="Reset All Filters"
          onAction={handleResetFilters}
          compact
        />
      )}

      {!loading && !error && reviews.length > 0 && (
        <div className="srv-reviews-list">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}

      {!loading && !error && total > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
          startIndex={start - 1}
          endIndex={end}
          totalItems={total}
          label={`review${total !== 1 ? 's' : ''}`}
        />
      )}
    </div>
  );
}
