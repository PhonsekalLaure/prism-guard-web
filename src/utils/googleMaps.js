import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let isInitialized = false;

const initializeLoader = () => {
  if (isInitialized) return;
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
  
  if (!apiKey) {
    throw new Error('Google Maps API Key is missing. Ensure VITE_GOOGLE_MAPS_API_KEY is set in .env');
  }

  setOptions({
    key: apiKey,
    version: 'weekly',
  });
  
  isInitialized = true;
};

export const getMapsLibrary = async () => {
  initializeLoader();
  return importLibrary('maps');
};

export const getMarkerLibrary = async () => {
  initializeLoader();
  return importLibrary('marker');
};
