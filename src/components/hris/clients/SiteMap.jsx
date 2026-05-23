import { useEffect, useRef } from 'react';
import { getMapsLibrary, getMarkerLibrary } from '@utils/googleMaps';

export default function SiteMap({ latitude, longitude, radiusMeters }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (latitude == null || longitude == null || latitude === '' || longitude === '' || !mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const position = { lat: Number(latitude), lng: Number(longitude) };
        if (!Number.isFinite(position.lat) || !Number.isFinite(position.lng)) {
          return;
        }

        const { Map, Circle } = await getMapsLibrary();
        const { AdvancedMarkerElement } = await getMarkerLibrary();
        if (!isMounted || !mapRef.current) {
          return;
        }

        const map = new Map(mapRef.current, {
          center: position,
          zoom: 16,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          disableDefaultUI: true,
          zoomControl: true,
        });

        new AdvancedMarkerElement({
          map,
          position,
          title: 'Site Location',
        });

        if (radiusMeters) {
          new Circle({
            strokeColor: '#3b82f6',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#3b82f6',
            fillOpacity: 0.35,
            map,
            center: position,
            radius: Number(radiusMeters),
          });
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error);
      }
    }

    initMap();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude, radiusMeters]);

  if (latitude == null || longitude == null || latitude === '' || longitude === '') {
    return (
      <div style={{ width: '100%', height: '200px', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        No Coordinates Available. Select an address.
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: '#e5e7eb' }} />;
}
