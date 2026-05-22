import axios from 'axios';
import authService from '@services/authService';
import { buildApiUrl } from '@services/apiConfig';

const api = axios.create({
  baseURL: buildApiUrl('/api/web/notifications'),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function getNotifications(params = {}) {
  const { data } = await api.get('/', { params });
  return {
    data: Array.isArray(data?.data) ? data.data : [],
    metadata: data?.metadata || {
      total: 0,
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10,
      totalPages: 0,
    },
  };
}

async function getStats() {
  const { data } = await api.get('/stats');
  return data || { total: 0, unread: 0, urgent: 0, by_type: {} };
}

async function markRead(id) {
  const { data } = await api.patch(`/${id}/read`);
  return data;
}

async function markAllRead() {
  const { data } = await api.patch('/read-all');
  return data;
}

async function dismiss(id) {
  const { data } = await api.patch(`/${id}/dismiss`);
  return data;
}

export default {
  dismiss,
  getNotifications,
  getStats,
  markAllRead,
  markRead,
};
