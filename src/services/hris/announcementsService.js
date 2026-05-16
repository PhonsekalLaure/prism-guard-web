import axios from 'axios';
import authService from '@services/authService';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_BASE}/api/web/hris/announcements`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getAnnouncements(params = {}) {
  const { data } = await api.get('/', { params });
  return data || { data: [], metadata: {} };
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data || {};
}

async function publishAnnouncement(payload) {
  const { data } = await api.post('/', payload);
  return data;
}

async function updateAnnouncement(id, payload) {
  const { data } = await api.patch(`/${id}`, payload);
  return data;
}

async function archiveAnnouncement(id) {
  const { data } = await api.patch(`/${id}/archive`);
  return data;
}

async function deleteAnnouncement(id) {
  const { data } = await api.delete(`/${id}`);
  return data;
}

export default {
  archiveAnnouncement,
  deleteAnnouncement,
  getAnnouncements,
  getStats,
  publishAnnouncement,
  updateAnnouncement,
};
