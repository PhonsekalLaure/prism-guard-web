import GoogleAddressAutofill from '@hris-components/employees/GoogleAddressAutofill';

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
                placeholder="Search for a site address..."
                onPlaceSelected={({ formattedAddress, lat, lng }) => {
                  onFieldChange('siteAddress', formattedAddress);
                  onFieldChange('latitude', lat);
                  onFieldChange('longitude', lng);
                }}
              />
              <p className="ae-hint">Pick a suggested address so saved coordinates stay aligned with distance ranking and geofencing.</p>
            </div>

            <div className="ae-form-group">
              <label>Geofence Radius (m)</label>
              <input
                type="number"
                className="ae-input"
                value={form.geofenceRadius}
                min="1"
                onChange={(e) => onFieldChange('geofenceRadius', e.target.value)}
              />
            </div>
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
