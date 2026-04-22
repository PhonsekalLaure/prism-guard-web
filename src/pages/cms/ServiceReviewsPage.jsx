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
  const { notification, showNotification, closeNotification } = useNotification();

  const handleSubmitSuccess = () => {
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
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
        <PastReviews />
      </div>

      <ReviewSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
      />
    </>
  );
}