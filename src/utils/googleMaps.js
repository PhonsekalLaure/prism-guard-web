import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

let isInitialized = false;

/**
 * Initializes the Google Maps loader with the API Key if not already done.
 */
const initializeLoader = () => {
  if (isInitialized) return;
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim();
  
  if (!apiKey) {
    console.error('Google Maps API Key is missing. Ensure VITE_GOOGLE_MAPS_API_KEY is set in .env');
    return;
  }

  setOptions({
    key: apiKey,
    version: 'weekly',
  });
  
  isInitialized = true;
};

/**
 * Robust way to get the Autocomplete class from the Places library.
 * Guarantees that setOptions has been called first.
 */
export const getAutocompleteLibrary = async () => {
  initializeLoader();
  return await importLibrary('places');
};
