import { FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

export default function SitesTab({ client, onDeployGuard }) {
  const sites = client.sites || [];

  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="vc-section-title !mb-0">
            <FaMapMarkerAlt className="vc-section-icon" /> Deployment Sites
          </h3>
          {sites.some((site) => site.is_active) && (
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-brand-blue text-white font-semibold"
              onClick={() => onDeployGuard()}
            >
              Deploy Guard
            </button>
          )}
        </div>

        {sites.length > 0 ? (
          <div className="vc-sites-grid">
            {sites.map((site, i) => (
              <div key={site.id || i} className={`vc-site-card ${site.is_active ? 'active' : 'inactive'}`}>
                <div className="vc-site-header">
                  <div>
                    <p className="vc-site-name">{site.site_name}</p>
                    <p className="vc-site-address">{site.site_address}</p>
                  </div>
                  <span className={`vc-site-badge ${site.is_active ? 'active' : 'inactive'}`}>
                    {site.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <div className="vc-site-meta">
                  <span><FaMapMarkerAlt /> Geofence: {site.geofence_radius_meters}m radius</span>
                  <span><FaUsers /> Active Guards: {site.active_guard_count ?? 0}</span>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-lg font-semibold ${site.is_active ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
                    onClick={() => site.is_active && onDeployGuard(site.id)}
                    disabled={!site.is_active}
                  >
                    {site.is_active ? 'Deploy Guard Here' : 'Inactive Site'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="vc-empty">
            <FaMapMarkerAlt className="vc-empty-icon" />
            <p className="vc-empty-text">No sites registered for this client.</p>
          </div>
        )}
      </div>
    </div>
  );
}
