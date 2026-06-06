import CmsMobileSidebarToggle from '@components/cms/CmsMobileSidebarToggle';

/**
 * ServiceReviewsTopbar - sticky page header for the Service Reviews page.
 */
export default function ServiceReviewsTopbar() {
  return (
    <header className="dashboard-topbar sr-reviews-topbar">
      <div className="topbar-inner">
        <div className="cms-topbar-title-row">
          <CmsMobileSidebarToggle />
          <div>
            <h2>Service Reviews</h2>
            <p className="subtitle">Submit and manage your service reviews</p>
          </div>
        </div>
      </div>
    </header>
  );
}
