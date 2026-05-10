import { useState } from 'react';
import ServiceReviewsTopbar from '@cms-components/reviews/ServiceReviewsTopbar';
import SubmitReviewForm     from '@cms-components/reviews/SubmitReviewForm';
import PastReviews          from '@cms-components/reviews/PastReviews';
import ReviewSuccessModal   from '@cms-components/reviews/ReviewSuccessModal';
import Notification         from '@components/ui/Notification';
import useNotification      from '@hooks/useNotification';
import '@styles/cms/ServiceReviews.css';

export default function ServiceReviewsPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  // Increment this to trigger a re-fetch in PastReviews after a new submission
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
  const { notification, showNotification, closeNotification } = useNotification();

  const handleSubmitSuccess = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
    // Trigger PastReviews to reload so the new pending review appears
    setReviewsRefreshKey((k) => k + 1);
    showNotification(
      'Review submitted! It will be published after moderation.',
      'success',
    );
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

      <ServiceReviewsTopbar />

      <div className="cms-content">
        <SubmitReviewForm onSubmitSuccess={handleSubmitSuccess} />
        <PastReviews refreshKey={reviewsRefreshKey} />
      </div>

      <ReviewSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
      />
    </>
  );
}