/**
 * ServiceReviewsTopbar — sticky page header for the Service Reviews page.
 * Follows the same pattern as other CMS topbars (no toggleSidebar needed
 * since CmsLayout already wires the sidebar).
 */
export default function ServiceReviewsTopbar() {
  return (
    <header className="dashboard-topbar sr-reviews-topbar">
      <div className="topbar-inner">
        <div>
          <h2>Service Reviews</h2>
          <p className="subtitle">Submit and manage your service reviews</p>
        </div>
      </div>
    </header>
  );
}