import { FaMapMarkerAlt } from 'react-icons/fa';
import { SkeletonBlock, SkeletonList } from '@components/ui/Skeleton';

export default function SiteLocations({ sites = [] }) {
  const hasSites = Array.isArray(sites) && sites.length > 0;

  return (
    <div className="cms-profile-sites-card">
      <div className="cms-profile-sites-card__header">
        <h3 className="cms-profile-sites-card__title">
          <FaMapMarkerAlt /> Site Locations
        </h3>
      </div>

      {hasSites ? (
        <div className="cms-profile-sites__list">
          {sites.map((site, index) => (
            <div key={site.id || `${site.site_name}-${index}`} className="cms-profile-sites__row">
              <div className="cms-profile-sites__row-left">
                <div className={`cms-profile-sites__avatar ${index % 2 === 0 ? 'cms-profile-sites__avatar--primary' : 'cms-profile-sites__avatar--blue'}`}>
                  {getSiteInitials(site.site_name, index)}
                </div>
                <div>
                  <p className="cms-profile-sites__name">{site.site_name || 'Unnamed Site'}</p>
                  <p className="cms-profile-sites__address">{site.site_address || 'No address provided'}</p>
                </div>
              </div>
              <div className="cms-profile-sites__row-right">
                <span className={`cms-profile-sites__status ${site.is_active ? 'cms-profile-sites__status--active' : 'cms-profile-sites__status--inactive'}`}>
                  {site.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="cms-profile-sites__empty">No site locations recorded.</div>
      )}
    </div>
  );
}

export function SiteLocationsSkeleton() {
  return (
    <div className="cms-profile-sites-card detail-skeleton">
      <div className="cms-profile-sites-card__header">
        <SkeletonBlock className="dsk-line md" style={{ height: '18px', width: '55%' }} />
      </div>
      <div className="cms-profile-sites__list">
        <SkeletonList count={3}>{(item) => (
          <div key={item} className="cms-profile-sites__row">
            <div className="cms-profile-sites__row-left" style={{ flex: 1 }}>
              <SkeletonBlock className="dsk-icon-wrap" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <SkeletonBlock className="dsk-line sm" style={{ width: '45%' }} />
                <SkeletonBlock className="dsk-line md" style={{ width: '80%' }} />
              </div>
            </div>
            <SkeletonBlock className="dsk-line sm" style={{ width: '58px', height: '22px', borderRadius: '4px' }} />
          </div>
        )}</SkeletonList>
      </div>
    </div>
  );
}

function getSiteInitials(siteName, index) {
  const words = String(siteName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return `S${index + 1}`;
  return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('');
}
