import { FaMapMarkerAlt, FaPencilAlt, FaPlus, FaShieldAlt, FaUsers, FaUserShield } from 'react-icons/fa';

function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getGuardInitials(name) {
  if (!name || name === 'Unknown') return '??';
  return name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase();
}

export default function SitesTab({ client, onDeployGuard, onAddSite, onEditSite, onDeactivateSite, canManageSites = false }) {
  const sites = client.sites || [];
  const canDeployGuard = typeof onDeployGuard === 'function';

  return (
    <div className="vc-tab-content">
      <div className="vc-section">
        {/* Header row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
          <h3 className="vc-section-title" style={{ margin: 0 }}>
            <FaMapMarkerAlt className="vc-section-icon" /> Deployment Sites
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {canManageSites && (
              <button
                type="button"
                className="vc-sites-header-btn-add"
                onClick={() => onAddSite?.()}
              >
                <FaPlus style={{ fontSize: '0.7rem' }} />
                Add Site
              </button>
            )}
            {canDeployGuard && sites.some((site) => site.is_active) && (
              <button
                type="button"
                className="vc-sites-header-btn-deploy"
                onClick={() => onDeployGuard()}
              >
                <FaUserShield style={{ fontSize: '0.72rem' }} />
                Deploy Guard
              </button>
            )}
          </div>
        </div>

        {sites.length > 0 ? (
          <div className="vc-sites-grid">
            {sites.map((site, i) => {
              const activeGuardCount = site.active_guard_count ?? 0;
              const guards = site.deployed_guards || [];
              const canDeactivateSite = site.is_active && activeGuardCount === 0;

              return (
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
                    <span><FaUsers /> Active Guards: {activeGuardCount}</span>
                  </div>

                  {/* Deployed Guard Details */}
                  <div className="site-guards-section">
                    <p className="site-guards-label">
                      <FaShieldAlt /> Assigned Guards
                    </p>
                    {guards.length > 0 ? (
                      <div className="site-guard-list">
                        {guards.map((guard) => (
                          <div key={guard.deployment_id} className="site-guard-item">
                            <div className="site-guard-avatar">
                              {guard.avatar_url ? (
                                <img src={guard.avatar_url} alt={guard.name} />
                              ) : (
                                getGuardInitials(guard.name)
                              )}
                            </div>
                            <div className="site-guard-info">
                              <p className="site-guard-name">{guard.name}</p>
                              <p className="site-guard-meta">
                                <span>{guard.employee_id_number}</span>
                                <span>{guard.position}</span>
                                <span>Since {formatDate(guard.start_date)}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="site-guards-empty">No active guards assigned to this site.</p>
                    )}
                  </div>

                  {/* Per-site action buttons */}
                  <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {/* Deploy Guard Here */}
                    {site.is_active && canDeployGuard ? (
                      <button
                        type="button"
                        className="vc-site-btn vc-site-btn-primary"
                        onClick={() => onDeployGuard(site.id)}
                      >
                        <FaUserShield style={{ fontSize: '0.7rem' }} />
                        Deploy Guard Here
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="vc-site-btn vc-site-btn-ghost"
                        disabled
                      >
                        {site.is_active ? 'View Only' : 'Inactive Site'}
                      </button>
                    )}

                    {/* Edit & Deactivate — only for managers */}
                    {canManageSites && (
                      <>
                        <button
                          type="button"
                          className="vc-site-btn vc-site-btn-secondary"
                          onClick={() => site.is_active && onEditSite?.(site)}
                          disabled={!site.is_active}
                        >
                          <FaPencilAlt style={{ fontSize: '0.65rem' }} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className={`vc-site-btn ${canDeactivateSite ? 'vc-site-btn-danger' : 'vc-site-btn-ghost'}`}
                          onClick={() => canDeactivateSite && onDeactivateSite?.(site)}
                          disabled={!canDeactivateSite}
                          title={activeGuardCount > 0 ? 'Relieve or transfer active guards before deactivating this site.' : undefined}
                        >
                          {activeGuardCount > 0 ? 'Active Guards Assigned' : 'Deactivate'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
