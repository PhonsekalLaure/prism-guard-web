export const MAX_GEOFENCE_RADIUS_METERS = 500;
export const MIN_GEOFENCE_RADIUS_METERS = 20;
export const SITE_SEARCH_PLACEHOLDER = 'Search for a building, landmark, business, or address...';
export const SITE_SEARCH_HINT = 'Select a suggested place so coordinates are saved automatically for geofencing.';

export function clampGeofenceRadius(value) {
  if (value === '') return '';

  const radius = Number(value);
  if (!Number.isFinite(radius)) return value;
  if (radius > MAX_GEOFENCE_RADIUS_METERS) return String(MAX_GEOFENCE_RADIUS_METERS);
  return value;
}

export function applySiteLocationChange(updateField, { latitude, longitude, formattedAddress }) {
  if (formattedAddress) {
    updateField('siteAddress', formattedAddress);
  }
  updateField('latitude', latitude);
  updateField('longitude', longitude);
}
