import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import EmptyState from '@components/ui/EmptyState';
import Pagination from '@components/ui/Pagination';
import { IncidentCardSkeleton, SkeletonList } from '@components/ui/Skeleton';
import ServiceReviewActionModal from './ServiceReviewActionModal';
import ServiceReviewCard from './ServiceReviewCard';
import ServiceReviewDetailModal from './ServiceReviewDetailModal';

export default function HrisServiceReviewsList({
  reviews = [],
  metadata = {},
  loading = false,
  actionLoadingId = null,
  onPageChange,
  onPublish,
  onReject,
  onUnpublish,
  onResetFilters,
}) {
  const [activeModal, setActiveModal] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const currentPage = metadata.page || 1;
  const totalPages = metadata.totalPages || 0;
  const totalReviews = metadata.total || 0;
  const pageLimit = metadata.limit || 8;
  const start = totalReviews === 0 ? 0 : (currentPage - 1) * pageLimit + 1;
  const end = Math.min(currentPage * pageLimit, totalReviews);
  const isActionModal = activeModal === 'publish' || activeModal === 'reject' || activeModal === 'unpublish';

  const openModal = (modalName, review = selectedReview) => {
    if (review) setSelectedReview(review);
    setReviewNotes('');
    setActiveModal(modalName);
  };

  const closeModal = () => {
    if (actionLoadingId) return;
    setActiveModal(null);
    setReviewNotes('');
  };

  const handlePublish = async () => {
    if (!selectedReview) return;
    await onPublish?.(selectedReview.id, reviewNotes);
    setActiveModal(null);
    setReviewNotes('');
  };

  const handleReject = async () => {
    if (!selectedReview) return;
    await onReject?.(selectedReview.id, reviewNotes);
    setActiveModal(null);
    setReviewNotes('');
  };

  const handleUnpublish = async () => {
    if (!selectedReview) return;
    await onUnpublish?.(selectedReview.id, reviewNotes);
    setActiveModal(null);
    setReviewNotes('');
  };

  const confirmAction = {
    publish: handlePublish,
    reject: handleReject,
    unpublish: handleUnpublish,
  }[activeModal];

  if (loading && reviews.length === 0) {
    return (
      <div className="sr-review-list-container">
        <div className="sr-review-feed-header">
          <h3><FaStar /> Service Reviews</h3>
        </div>
        <div className="sr-review-list">
          <SkeletonList count={4}>{(index) => (
            <IncidentCardSkeleton key={index} detailColumns={3} showSummary delay={`${index * 0.07}s`} />
          )}</SkeletonList>
        </div>
      </div>
    );
  }

  return (
    <div className="sr-review-list-container">
      <div className="sr-review-feed-header">
        <h3><FaStar /> Service Reviews</h3>
        {totalReviews > 0 && (
          <span>{totalReviews} total</span>
        )}
      </div>

      <div className="sr-review-list">
        {reviews.length === 0 ? (
          <EmptyState
            title="No service reviews found"
            description="No service reviews match the current filters."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
            compact
          />
        ) : (
          reviews.map((review, index) => (
            <ServiceReviewCard
              key={review.id}
              review={review}
              index={index}
              onOpenModal={openModal}
            />
          ))
        )}
      </div>

      {totalReviews > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          startIndex={start - 1}
          endIndex={end}
          totalItems={totalReviews}
          label="reviews"
          disabled={loading}
        />
      )}

      {activeModal === 'detail' && (
        <ServiceReviewDetailModal
          review={selectedReview}
          onClose={closeModal}
          onOpenAction={openModal}
        />
      )}

      {isActionModal && (
        <ServiceReviewActionModal
          action={activeModal}
          review={selectedReview}
          reviewNotes={reviewNotes}
          actionLoadingId={actionLoadingId}
          onClose={closeModal}
          onNotesChange={setReviewNotes}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
}
