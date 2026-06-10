export function formatSiteLabel(site) {
  if (!site) return '';

  const baseLabel = `${site.clients?.company || 'Unknown Client'} - ${site.site_name}`;
  return site.distance_km != null
    ? `${baseLabel} (${site.distance_km.toFixed(2)} km)`
    : baseLabel;
}
