import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/applicants'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getApplicants(page = 1, limit = 6, filters = {}) {
  const { data } = await api.get('/', {
    params: {
      page,
      limit,
      ...filters,
    },
  });
  return data;
}

async function getApplicantStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function scheduleInterview(id, payload) {
  const { data } = await api.post(`/${id}/schedule-interview`, payload);
  return data;
}

async function rejectApplicant(id, payload) {
  const { data } = await api.post(`/${id}/reject`, payload);
  return data;
}

async function acceptApplicant(id, payload) {
  const { data } = await api.post(`/${id}/accept`, payload);
  return data;
}

export default {
  getApplicants,
  getApplicantStats,
  scheduleInterview,
  rejectApplicant,
  acceptApplicant,
};
