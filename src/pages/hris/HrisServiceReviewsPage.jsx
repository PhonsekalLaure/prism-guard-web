import HrisServiceReviewsTopbar from '@hris-components/service-reviews/HrisServiceReviewsTopbar';
import HrisServiceReviewsStatCards from '@hris-components/service-reviews/HrisServiceReviewsStatCards';
import HrisServiceReviewsFilterBar from '@hris-components/service-reviews/HrisServiceReviewsFilterBar';
import HrisServiceReviewsList from '@hris-components/service-reviews/HrisServiceReviewsList';
import '../../styles/hris/HrisServiceReviews.css';

export default function HrisServiceReviewsPage() {
  return (
    <>
      <HrisServiceReviewsTopbar />

      <div className="dashboard-content">
        <HrisServiceReviewsStatCards />
        <HrisServiceReviewsFilterBar />
        <HrisServiceReviewsList />
      </div>
    </>
  );
}
