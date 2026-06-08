import axios from 'axios';
import authService from './authService';
import { buildApiUrl } from './apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/integrations/google/places'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

async function autocompleteAddress(query, signal) {
  const { data } = await api.get('/autocomplete', {
    params: { q: query },
    signal,
  });

  return data.predictions || [];
}

async function getPlaceDetails(placeId, signal) {
  const { data } = await api.get('/details', {
    params: { placeId },
    signal,
  });

  return data;
}

async function reverseGeocode(latitude, longitude, signal) {
  const { data } = await api.get('/reverse-geocode', {
    params: { lat: latitude, lng: longitude },
    signal,
  });

  return data;
}

export default {
  autocompleteAddress,
  getPlaceDetails,
  reverseGeocode,
};
