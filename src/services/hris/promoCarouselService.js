import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/promo-carousel'),
});

api.interceptors.request.use(async (config) => {
  const token = await authService.getValidToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || originalRequest?._retryAuth) {
      throw error;
    }

    originalRequest._retryAuth = true;
    const token = await authService.refreshStoredSession();
    if (!token) {
      throw error;
    }

    originalRequest.headers = originalRequest.headers || {};
    originalRequest.headers.Authorization = `Bearer ${token}`;
    return api(originalRequest);
  }
);

function multipartConfig() {
  return {
    transformRequest: [(payload, headers) => {
      delete headers['Content-Type'];
      delete headers['content-type'];
      return payload;
    }],
  };
}

async function listSlides() {
  const { data } = await api.get('/');
  return data?.data || [];
}

async function getSettings() {
  const { data } = await api.get('/settings');
  return data?.data || { use_default_hero: true };
}

async function updateSettings(payload) {
  const { data } = await api.patch('/settings', payload);
  return data?.data;
}

async function createSlide(payload) {
  const { data } = await api.post('/', payload, multipartConfig());
  return data?.data;
}

async function updateSlide(id, payload) {
  const { data } = await api.patch(`/${id}`, payload, multipartConfig());
  return data?.data;
}

async function reorderSlides(slideIds) {
  const { data } = await api.patch('/reorder', { slideIds });
  return data?.data || [];
}

async function deleteSlide(id) {
  const { data } = await api.delete(`/${id}`);
  return data?.data;
}

export default {
  createSlide,
  deleteSlide,
  getSettings,
  listSlides,
  reorderSlides,
  updateSettings,
  updateSlide,
};
