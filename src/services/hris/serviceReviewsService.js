import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/hris/service-reviews'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getServiceReviews(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getClients() {
  const { data } = await api.get('/clients');
  return data;
}

async function getMonthlyCompliance(params = {}) {
  const { data } = await api.get('/monthly-compliance', { params });
  return data;
}

async function publishServiceReview(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/publish`, { reviewNotes });
  return data;
}

async function rejectServiceReview(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/reject`, { reviewNotes });
  return data;
}

async function unpublishServiceReview(id, reviewNotes = '') {
  const { data } = await api.patch(`/${id}/unpublish`, { reviewNotes });
  return data;
}

export default {
  getClients,
  getMonthlyCompliance,
  getServiceReviews,
  publishServiceReview,
  rejectServiceReview,
  unpublishServiceReview,
};
