import { useEffect, useRef } from 'react';
import { getMapsLibrary, getMarkerLibrary } from '@utils/googleMaps';
import googlePlacesService from '@services/googlePlacesService';

function hasCoordinates(latitude, longitude) {
  return latitude != null && longitude != null && latitude !== '' && longitude !== '';
}

function toLatLngLiteral(latitude, longitude) {
  const position = { lat: Number(latitude), lng: Number(longitude) };
  return Number.isFinite(position.lat) && Number.isFinite(position.lng) ? position : null;
}

function readMapEventPosition(event, marker) {
  const position = event.latLng || marker.position;
  if (!position) return null;

  const latitude = typeof position.lat === 'function' ? position.lat() : position.lat;
  const longitude = typeof position.lng === 'function' ? position.lng() : position.lng;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

export default function SiteMap({ latitude, longitude, radiusMeters, draggable = false, onLocationChange }) {
  const mapRef = useRef(null);
  const dragRequestIdRef = useRef(0);
  const isComponentMountedRef = useRef(false);
  const onLocationChangeRef = useRef(onLocationChange);

  useEffect(() => {
    isComponentMountedRef.current = true;
    return () => {
      isComponentMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  useEffect(() => {
    if (!hasCoordinates(latitude, longitude) || !mapRef.current) return;

    let isMounted = true;

    async function initMap() {
      try {
        const position = toLatLngLiteral(latitude, longitude);
        if (!position) return;

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

        const marker = new AdvancedMarkerElement({
          map,
          position,
          title: 'Site Location',
          gmpDraggable: draggable,
        });

        if (draggable && typeof onLocationChangeRef.current === 'function') {
          marker.addListener('dragend', async (event) => {
            const nextPosition = readMapEventPosition(event, marker);
            if (!nextPosition) return;

            const { latitude: nextLatitude, longitude: nextLongitude } = nextPosition;

            const requestId = dragRequestIdRef.current + 1;
            dragRequestIdRef.current = requestId;

            onLocationChangeRef.current?.({
              latitude: nextLatitude,
              longitude: nextLongitude,
              formattedAddress: null,
            });

            try {
              const result = await googlePlacesService.reverseGeocode(nextLatitude, nextLongitude);
              if (!isComponentMountedRef.current || dragRequestIdRef.current !== requestId) {
                return;
              }

              onLocationChangeRef.current?.({
                latitude: nextLatitude,
                longitude: nextLongitude,
                formattedAddress: result.formattedAddress,
                raw: result.raw,
              });
            } catch (error) {
              console.error('Google reverse geocode failed:', error);
              if (isComponentMountedRef.current && dragRequestIdRef.current === requestId) {
                onLocationChangeRef.current?.({
                  latitude: nextLatitude,
                  longitude: nextLongitude,
                  formattedAddress: null,
                });
              }
            }
          });
        }

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
  }, [latitude, longitude, radiusMeters, draggable]);

  if (!hasCoordinates(latitude, longitude)) {
    return (
      <div style={{ width: '100%', height: '200px', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
        No Coordinates Available. Select a place.
      </div>
    );
  }

  return <div ref={mapRef} style={{ width: '100%', height: '200px', borderRadius: '0.5rem', marginBottom: '1rem', backgroundColor: '#e5e7eb' }} />;
}
