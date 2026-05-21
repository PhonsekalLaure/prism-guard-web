import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/hris/incidents`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getIncidents(params = {}) {
  const { data } = await api.get('/', { params });
  return data;
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data;
}

async function getIncidentById(id) {
  const { data } = await api.get(`/${id}`);
  return data;
}

async function updateReview(id, reviewStatus, reviewNotes) {
  const { data } = await api.patch(`/${id}/review`, { reviewStatus, reviewNotes });
  return data;
}

async function markResolved(id, reviewNotes) {
  const { data } = await api.patch(`/${id}/resolve`, { reviewNotes });
  return data;
}

async function generateInternalReport(id) {
  const { data } = await api.post(`/${id}/reports/internal`);
  return data;
}

async function sendInternalReportToPresident(id) {
  const { data } = await api.post(`/${id}/reports/internal/send-president`);
  return data;
}

async function getClientReportRequests(params = {}) {
  const { data } = await api.get('/client-requests', { params });
  return data;
}

async function updateClientReportRequest(id, status) {
  const { data } = await api.patch(`/client-requests/${id}`, { status });
  return data;
}

async function sendClientReport(id) {
  const { data } = await api.post(`/client-requests/${id}/send-report`);
  return data;
}

async function generateClientReport(id) {
  const { data } = await api.post(`/client-requests/${id}/generate-report`);
  return data;
}

export default {
  getIncidents,
  getIncidentById,
  getStats,
  updateReview,
  markResolved,
  generateInternalReport,
  sendInternalReportToPresident,
  getClientReportRequests,
  updateClientReportRequest,
  generateClientReport,
  sendClientReport,
};
