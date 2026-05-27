import axios from 'axios';
import authService from '@/services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/incident-reports`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getIncidentReports(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getSites() {
  const { data } = await api.get('/sites');
  return data;
}

async function requestFullReport(id, requestNotes) {
  const { data } = await api.post(`/${id}/request-full-report`, { requestNotes });
  return data;
}

export default {
  getIncidentReports,
  getStats,
  getSites,
  requestFullReport,
};
