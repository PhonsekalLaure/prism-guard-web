import { FaMapMarkerAlt } from 'react-icons/fa';
import FormField from './ClientFormField';
import GoogleAddressAutofill from '@hris-components/employees/GoogleAddressAutofill';

export default function Step4Sites({ data, onAddSite, onUpdateSite, onRemoveSite }) {
  return (
    <div className="ae-step-content">
      <h3 className="ae-step-heading">
        <FaMapMarkerAlt className="inline mr-2" /> Client Sites
      </h3>
      <p className="ae-hint" style={{ marginBottom: '0.9rem' }}>
        Add one or more deployment locations for this client. This step is optional.
      </p>

      <div className="ae-checklist" style={{ marginBottom: '0.9rem' }}>
        {data.sites.map((site, index) => (
          <div key={index} className="ae-check-item" style={{ display: 'block', cursor: 'default' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <strong>Site {index + 1}</strong>
              <button
                type="button"
                className="ae-btn ae-btn-secondary"
                style={{ flex: '0 0 auto', padding: '0.45rem 0.9rem', fontSize: '0.78rem' }}
                onClick={() => onRemoveSite(index)}
              >
                Remove
              </button>
            </div>

            <div className="ae-form-grid">
              <FormField
                label="Site Name"
                type="text"
                span2
                value={site.siteName}
                onChange={(e) => onUpdateSite(index, 'siteName', e.target.value)}
              />
              <FormField
                label="Site Address"
                span2
                customInput={(
                  <>
                    <GoogleAddressAutofill
                      value={site.siteAddress}
                      onChange={(e) => {
                        onUpdateSite(index, 'siteAddress', e.target.value);
                        onUpdateSite(index, 'latitude', '');
                        onUpdateSite(index, 'longitude', '');
                      }}
                      className="ae-input"
                      placeholder="Search for a site address..."
                      onPlaceSelected={({ formattedAddress, lat, lng }) => {
                        onUpdateSite(index, 'siteAddress', formattedAddress);
                        onUpdateSite(index, 'latitude', lat);
                        onUpdateSite(index, 'longitude', lng);
                      }}
                    />
                    <p className="ae-hint">Select a suggested address so coordinates are saved automatically for geofencing.</p>
                  </>
                )}
              />
              <FormField
                label="Geofence Radius (m)"
                type="number"
                value={site.geofenceRadius}
                onChange={(e) => onUpdateSite(index, 'geofenceRadius', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="ae-btn ae-btn-secondary" onClick={onAddSite}>
        + Add Site
      </button>
    </div>
  );
}
