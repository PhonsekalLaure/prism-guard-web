import GoogleAddressAutofill from '@hris-components/employees/GoogleAddressAutofill';
import SiteMap from './SiteMap';
import {
  MAX_GEOFENCE_RADIUS_METERS,
  MIN_GEOFENCE_RADIUS_METERS,
  SITE_SEARCH_HINT,
  SITE_SEARCH_PLACEHOLDER,
  applySiteLocationChange,
  clampGeofenceRadius,
} from './siteLocationUtils';

export default function ClientSiteEditorDialog({
  isOpen,
  mode = 'create',
  form,
  isSaving = false,
  onFieldChange,
  onCancel,
  onSave,
}) {
  if (!isOpen) return null;

  const title = mode === 'edit' ? 'Edit Site' : 'Add Site';
  const saveLabel = isSaving ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Create Site';

  return (
    <div className="dlg-overlay" onClick={onCancel}>
      <div className="dlg-card dlg-card-wide" onClick={(e) => e.stopPropagation()}>
        <div className="dep-header">
          <div className="dep-header-text">
            <h3>{title}</h3>
            <p>Maintain the site address and geofence radius used by deployment flows.</p>
          </div>
        </div>

        <div className="dep-body">
          <div className="ae-form-grid">
            <div className="ae-form-group span-2">
              <label>Site Name</label>
              <input
                type="text"
                className="ae-input"
                value={form.siteName}
                onChange={(e) => onFieldChange('siteName', e.target.value)}
                placeholder="e.g. Main Lobby Post"
              />
            </div>

            <div className="ae-form-group span-2">
              <label>Site Address</label>
              <GoogleAddressAutofill
                value={form.siteAddress}
                onChange={(e) => {
                  onFieldChange('siteAddress', e.target.value);
                  onFieldChange('latitude', '');
                  onFieldChange('longitude', '');
                }}
                className="ae-input"
                placeholder={SITE_SEARCH_PLACEHOLDER}
                onPlaceSelected={({ formattedAddress, lat, lng }) => {
                  onFieldChange('siteAddress', formattedAddress);
                  onFieldChange('latitude', lat);
                  onFieldChange('longitude', lng);
                }}
              />
              <p className="ae-hint">{SITE_SEARCH_HINT}</p>
            </div>

            <div className="ae-form-group">
              <label>Geofence Radius (m)</label>
              <input
                type="number"
                className="ae-input"
                value={form.geofenceRadius}
                min={MIN_GEOFENCE_RADIUS_METERS}
                max={MAX_GEOFENCE_RADIUS_METERS}
                onChange={(e) => onFieldChange('geofenceRadius', clampGeofenceRadius(e.target.value))}
              />
              <p className="ae-hint">Minimum radius: {MIN_GEOFENCE_RADIUS_METERS}m.</p>
              <p className="ae-hint">Maximum radius: {MAX_GEOFENCE_RADIUS_METERS}m.</p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <SiteMap
              latitude={form.latitude}
              longitude={form.longitude}
              radiusMeters={form.geofenceRadius}
              draggable
              onLocationChange={(location) => applySiteLocationChange(onFieldChange, location)}
            />
          </div>
        </div>

        <div className="dlg-footer">
          <button type="button" className="dlg-btn dlg-btn-ghost" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button type="button" className="dlg-btn dlg-btn-deploy" onClick={onSave} disabled={isSaving}>
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
