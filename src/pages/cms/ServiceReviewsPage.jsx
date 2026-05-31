import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import ServiceReviewsTopbar from '@cms-components/reviews/ServiceReviewsTopbar';
import SubmitReviewForm     from '@cms-components/reviews/SubmitReviewForm';
import PastReviews          from '@cms-components/reviews/PastReviews';
import ReviewSuccessModal   from '@cms-components/reviews/ReviewSuccessModal';
import Notification         from '@components/ui/Notification';
import useNotification      from '@hooks/useNotification';
import serviceReviewsService from '@/services/cms/serviceReviewsService';
import '@styles/cms/ServiceReviews.css';

export default function ServiceReviewsPage() {
  const location = useLocation();
  const prefill  = location.state || {};

  const [showSuccess, setShowSuccess] = useState(false);
  // Increment this to trigger a re-fetch in PastReviews after a new submission
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);
  const [monthlyStatus, setMonthlyStatus] = useState(null);
  const [monthlyLoading, setMonthlyLoading] = useState(true);
  const { notification, showNotification, closeNotification } = useNotification();

  const loadMonthlyStatus = useCallback(async () => {
    setMonthlyLoading(true);
    try {
      const status = await serviceReviewsService.getMonthlyStatus();
      setMonthlyStatus(status);
    } catch {
      setMonthlyStatus(null);
    } finally {
      setMonthlyLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMonthlyStatus();
  }, [loadMonthlyStatus]);

  const handleSubmitSuccess = async () => {
    await loadMonthlyStatus();
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
        <div className={`srv-monthly-panel ${monthlyStatus?.cleared ? 'cleared' : ''}`}>
          <div className="srv-monthly-panel-header">
            <div className="srv-monthly-panel-icon">
              {monthlyLoading ? <FaSpinner className="srv-spinner" /> : monthlyStatus?.cleared ? <FaCheckCircle /> : <FaExclamationTriangle />}
            </div>
            <div>
              <h3>Monthly Service Review</h3>
              <p>
                {monthlyLoading
                  ? 'Checking your monthly review status...'
                  : monthlyStatus?.required
                    ? monthlyStatus.cleared
                      ? `Cleared for ${monthlyStatus.periodLabel}.`
                      : `Required for ${monthlyStatus.periodLabel}. Submit once this month to clear the requirement.`
                    : 'No monthly review is required for your current account status.'}
              </p>
            </div>
            {!monthlyLoading && monthlyStatus?.required && (
              <span className={`srv-monthly-status ${monthlyStatus.cleared ? 'cleared' : 'due'}`}>
                {monthlyStatus.cleared ? 'Cleared' : 'Due'}
              </span>
            )}
          </div>

          {!monthlyLoading && monthlyStatus?.required && monthlyStatus.cleared && monthlyStatus.clearingReview && (
            <div className="srv-monthly-cleared-note">
              <FaClock />
              <span>
                Cleared by a {monthlyStatus.clearingReview.submissionTypeLabel?.toLowerCase() || 'service'} review submitted on {monthlyStatus.clearingReview.date}.
              </span>
            </div>
          )}

          {!monthlyLoading && monthlyStatus?.required && !monthlyStatus.cleared && (
            <SubmitReviewForm
              title="Monthly Service Review"
              subtitle={`Complete your required service review for ${monthlyStatus.periodLabel}.`}
              submitLabel="Submit Monthly Review"
              submissionType="monthly_required"
              forcedPeriod={monthlyStatus.currentPeriod}
              onSubmitSuccess={handleSubmitSuccess}
            />
          )}
        </div>

        <SubmitReviewForm onSubmitSuccess={handleSubmitSuccess} prefill={prefill} />
        <PastReviews refreshKey={reviewsRefreshKey} />
      </div>

      <ReviewSuccessModal
        isOpen={showSuccess}
        onClose={handleCloseSuccess}
      />
    </>
  );
}
